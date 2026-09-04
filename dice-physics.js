/*
 * Persistent Cannon.js + Three.js dice interaction layer.
 * The canvas is transparent and renders only dice plus realtime shadows.
 * Each owner has seven reusable dice records; rolling never creates a stack.
 */
(function createDicePhysics3D(global) {
  'use strict';

  var canvas = document.getElementById('dice-physics-canvas');
  var wrap = document.getElementById('three-board-wrap');
  var THREE_REF = global.THREE;
  var CANNON_REF = global.CANNON;
  var scene;
  var camera;
  var renderer;
  var world;
  var groundMaterial;
  var dieMaterial;
  var shadowFloor;
  var woodTexture;
  // Shared rounded-corner geometry for all visible dice.  The Cannon body
  // intentionally remains a box (see createBodyForRecord) so collision and
  // precomputed face results stay exactly as before.
  var roundedDieGeometry;
  var rollingDice = [];
  var diceByOwner = { player: [], opponent: [] };
  var initialized = false;
  var diceSkinTextures = {};
  var mythicPipGeometries = {};
  var lastTime = 0;
  var shakeAmount = 0;
  var completionHandler = function () {};
  var completionPending = false;
  var selectionHandler = function () {};
  var dragHandler = function () {};
  var frameInset = 8;
  var boardWidth = 10;
  var boardDepth = 5.8;
  var lastMeasuredAspect = 0;
  var baseCameraPosition;
  var hoveredRecord = null;
  var pointerState = null;
  var activePlayerSkin = null;
  var DICE_COUNT = 7;
  var raycaster;
  var pointer;
  // Keep the natural physical settle, then use a short correction window for
  // the precomputed face result instead of snapping on the final frame.
  var REST_SPEED_LIMIT = .11;
  var REST_ANGULAR_SPEED_LIMIT = .12;
  var REST_HOLD_TIME = .2;
  var SETTLE_CORRECTION_DURATION = .16;
  var LANDING_PREP_HEIGHT = .85;

  var facePips = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  var faceNormals = {
    1: [0, 1, 0],
    2: [0, 0, 1],
    3: [1, 0, 0],
    4: [-1, 0, 0],
    5: [0, 0, -1],
    6: [0, -1, 0]
  };

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function seededRandom(seed) {
    var value = seed >>> 0;
    return function () {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function createCanvasTexture(canvas, repeat, colorTexture) {
    if (!canvas || !THREE_REF || typeof THREE_REF.CanvasTexture !== 'function') return null;
    var texture = new THREE_REF.CanvasTexture(canvas);
    texture.wrapS = THREE_REF.RepeatWrapping;
    texture.wrapT = THREE_REF.RepeatWrapping;
    texture.repeat.set(repeat || 1, repeat || 1);
    if (renderer && renderer.capabilities && renderer.capabilities.getMaxAnisotropy) texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    if (colorTexture && 'encoding' in texture && THREE_REF.sRGBEncoding) texture.encoding = THREE_REF.sRGBEncoding;
    return texture;
  }

  function createTextureSet(size, repeat, painter) {
    if (!global.document || !THREE_REF || typeof THREE_REF.CanvasTexture !== 'function') return null;
    var names = ['map', 'bumpMap', 'roughnessMap', 'metalnessMap'];
    var canvases = {};
    var contexts = {};
    for (var index = 0; index < names.length; index += 1) {
      var name = names[index];
      var canvas = global.document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      canvases[name] = canvas;
      contexts[name] = canvas.getContext('2d');
      if (!contexts[name]) return null;
    }
    painter(contexts, size);
    return {
      map: createCanvasTexture(canvases.map, repeat, true),
      bumpMap: createCanvasTexture(canvases.bumpMap, repeat, false),
      roughnessMap: createCanvasTexture(canvases.roughnessMap, repeat, false),
      metalnessMap: createCanvasTexture(canvases.metalnessMap, repeat, false)
    };
  }

  function fillTexture(context, color, size) {
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);
  }

  function createBloodOakTexture() {
    return createTextureSet(512, 1.08, function (contexts, size) {
      var random = seededRandom(0xb100d);
      var base = contexts.map.createLinearGradient(0, 0, size, size);
      base.addColorStop(0, '#6d241b');
      base.addColorStop(.4, '#3c100c');
      base.addColorStop(1, '#190806');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#808080', size);
      fillTexture(contexts.roughnessMap, '#b5b5b5', size);
      fillTexture(contexts.metalnessMap, '#000000', size);

      for (var line = 0; line < 118; line += 1) {
        var origin = random() * size;
        var tilt = (random() - .5) * .11;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var x = -20; x <= size + 20; x += 8) {
          var y = origin + Math.sin(x * (.016 + random() * .009) + line * 1.31) * (4 + random() * 10) + x * tilt;
          if (x === -20) {
            contexts.map.moveTo(x, y);
            contexts.bumpMap.moveTo(x, y);
            contexts.roughnessMap.moveTo(x, y);
          } else {
            contexts.map.lineTo(x, y);
            contexts.bumpMap.lineTo(x, y);
            contexts.roughnessMap.lineTo(x, y);
          }
        }
        contexts.map.strokeStyle = line % 8 === 0 ? 'rgba(205, 92, 61, .2)' : 'rgba(15, 3, 3, .3)';
        contexts.map.lineWidth = line % 8 === 0 ? 2.4 : .9;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = line % 8 === 0 ? '#bcbcbc' : '#666666';
        contexts.bumpMap.lineWidth = line % 8 === 0 ? 3 : 1.2;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = line % 8 === 0 ? '#8f8f8f' : '#c9c9c9';
        contexts.roughnessMap.lineWidth = line % 8 === 0 ? 2 : 1;
        contexts.roughnessMap.stroke();
      }

      for (var knot = 0; knot < 10; knot += 1) {
        var knotX = 30 + random() * (size - 60);
        var knotY = 30 + random() * (size - 60);
        var radiusX = 10 + random() * 24;
        var radiusY = 4 + random() * 10;
        contexts.map.beginPath();
        contexts.map.ellipse(knotX, knotY, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
        contexts.map.strokeStyle = 'rgba(12, 3, 2, .46)';
        contexts.map.lineWidth = 2;
        contexts.map.stroke();
        contexts.bumpMap.beginPath();
        contexts.bumpMap.ellipse(knotX, knotY, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
        contexts.bumpMap.strokeStyle = '#5d5d5d';
        contexts.bumpMap.lineWidth = 2.5;
        contexts.bumpMap.stroke();
      }

      for (var scar = 0; scar < 38; scar += 1) {
        var scarX = random() * size;
        var scarY = random() * size;
        contexts.map.beginPath();
        contexts.map.moveTo(scarX, scarY);
        contexts.map.lineTo(scarX + 8 + random() * 34, scarY + (random() - .5) * 8);
        contexts.map.strokeStyle = 'rgba(236, 136, 88, .16)';
        contexts.map.lineWidth = .8 + random() * 1.2;
        contexts.map.stroke();
      }
    });
  }

  function createPlumwoodLacquerTexture() {
    return createTextureSet(512, 1.06, function (contexts, size) {
      var random = seededRandom(0x51a7e);
      var base = contexts.map.createLinearGradient(0, 0, size, size);
      base.addColorStop(0, '#6a3745');
      base.addColorStop(.38, '#3d1e2b');
      base.addColorStop(1, '#160c14');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#808080', size);
      fillTexture(contexts.roughnessMap, '#8e8e8e', size);
      fillTexture(contexts.metalnessMap, '#070707', size);

      // Broad shellac pools create the soft, rounded reflection of a polished
      // purple hardwood without introducing a square face grid.
      for (var pool = 0; pool < 16; pool += 1) {
        var poolX = random() * size;
        var poolY = random() * size;
        var poolRadius = 32 + random() * 84;
        var poolGradient = contexts.map.createRadialGradient(poolX, poolY, 4, poolX, poolY, poolRadius);
        poolGradient.addColorStop(0, random() > .42 ? 'rgba(214, 131, 145, .15)' : 'rgba(18, 5, 15, .2)');
        poolGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        contexts.map.fillStyle = poolGradient;
        contexts.map.beginPath();
        contexts.map.ellipse(poolX, poolY, poolRadius, poolRadius * (.28 + random() * .34), random() * Math.PI, 0, Math.PI * 2);
        contexts.map.fill();
      }

      // Localized flowing grain replaces the previous full-width strokes.
      // Full-width lines were correct for wood planks, but on a six-face UV
      // layout they aligned into a checker/grid pattern. Short overlapping
      // arcs keep the wood character while remaining organic at every seam.
      for (var grain = 0; grain < 88; grain += 1) {
        var grainX = random() * size;
        var grainY = random() * size;
        var grainAngle = (random() - .5) * Math.PI;
        var grainLength = 34 + random() * 126;
        var grainBend = (random() - .5) * .018;
        var grainPoints = [];
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var step = 0; step < 6; step += 1) {
          var distance = step / 5 * grainLength;
          var bend = Math.sin(step * .9 + grain) * grainBend * distance * distance;
          var localX = grainX + Math.cos(grainAngle) * distance - Math.sin(grainAngle) * bend;
          var localY = grainY + Math.sin(grainAngle) * distance + Math.cos(grainAngle) * bend;
          grainPoints.push([localX, localY]);
          if (step === 0) {
            contexts.map.moveTo(localX, localY);
            contexts.bumpMap.moveTo(localX, localY);
            contexts.roughnessMap.moveTo(localX, localY);
          } else {
            contexts.map.lineTo(localX, localY);
            contexts.bumpMap.lineTo(localX, localY);
            contexts.roughnessMap.lineTo(localX, localY);
          }
        }
        var mainGrain = grain % 8 === 0;
        var startPoint = grainPoints[0];
        var endPoint = grainPoints[grainPoints.length - 1];
        var tangentX = endPoint[0] - startPoint[0];
        var tangentY = endPoint[1] - startPoint[1];
        var tangentLength = Math.max(1, Math.sqrt(tangentX * tangentX + tangentY * tangentY));
        var normalX = -tangentY / tangentLength;
        var normalY = tangentX / tangentLength;
        var undercutOffset = mainGrain ? 2.1 : 1.15;
        var undercutPoints = grainPoints.map(function (point) {
          return [point[0] + normalX * undercutOffset, point[1] + normalY * undercutOffset];
        });
        var drawPath = function (context, points) {
          context.beginPath();
          points.forEach(function (point, pointIndex) {
            if (pointIndex === 0) context.moveTo(point[0], point[1]);
            else context.lineTo(point[0], point[1]);
          });
        };
        contexts.map.lineCap = 'round';
        contexts.map.lineJoin = 'round';
        drawPath(contexts.map, undercutPoints);
        contexts.map.strokeStyle = mainGrain ? 'rgba(18, 4, 13, .34)' : 'rgba(24, 7, 18, .22)';
        contexts.map.lineWidth = mainGrain ? 3.4 : 1.35;
        contexts.map.stroke();
        drawPath(contexts.map, grainPoints);
        contexts.map.strokeStyle = mainGrain ? 'rgba(226, 129, 146, .25)' : 'rgba(205, 105, 125, .16)';
        contexts.map.lineWidth = mainGrain ? 1.65 : .72;
        contexts.map.stroke();
        contexts.bumpMap.lineCap = 'round';
        contexts.bumpMap.lineJoin = 'round';
        // The undercut is deliberately offset from the ridge. This asymmetric
        // pair gives the candle light a real raised-wood edge instead of a
        // printed stripe, matching the relief read of the scarlet-oak skin.
        drawPath(contexts.bumpMap, undercutPoints);
        contexts.bumpMap.strokeStyle = mainGrain ? '#414141' : '#555555';
        contexts.bumpMap.lineWidth = mainGrain ? 3.8 : 1.55;
        contexts.bumpMap.stroke();
        contexts.bumpMap.beginPath();
        grainPoints.forEach(function (point, pointIndex) {
          if (pointIndex === 0) contexts.bumpMap.moveTo(point[0], point[1]);
          else contexts.bumpMap.lineTo(point[0], point[1]);
        });
        contexts.bumpMap.strokeStyle = mainGrain ? '#d7d7d7' : '#b0b0b0';
        contexts.bumpMap.lineWidth = mainGrain ? 2.35 : 1.05;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = mainGrain ? '#858585' : '#a2a2a2';
        contexts.roughnessMap.lineWidth = mainGrain ? 1.7 : .8;
        contexts.roughnessMap.stroke();
      }

      // Small isolated shellac glints add polish without creating a repeated
      // horizontal/vertical band that can be mistaken for a grid.
      for (var sheen = 0; sheen < 13; sheen += 1) {
        var sheenX = 26 + random() * (size - 52);
        var sheenY = 26 + random() * (size - 52);
        var sheenRadius = 14 + random() * 34;
        var sheenGradient = contexts.map.createRadialGradient(sheenX, sheenY, 1, sheenX, sheenY, sheenRadius);
        sheenGradient.addColorStop(0, 'rgba(244, 178, 188, .12)');
        sheenGradient.addColorStop(1, 'rgba(244, 178, 188, 0)');
        contexts.map.fillStyle = sheenGradient;
        contexts.map.beginPath();
        contexts.map.ellipse(sheenX, sheenY, sheenRadius * 1.5, sheenRadius * .42, random() * Math.PI, 0, Math.PI * 2);
        contexts.map.fill();
      }

      // Occasional knots and worn lacquer scars keep the surface from looking
      // like a perfectly generated gradient.
      for (var knot = 0; knot < 9; knot += 1) {
        var knotX = 28 + random() * (size - 56);
        var knotY = 28 + random() * (size - 56);
        var radiusX = 9 + random() * 24;
        var radiusY = 4 + random() * 10;
        contexts.map.beginPath();
        contexts.map.ellipse(knotX, knotY, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
        contexts.map.strokeStyle = 'rgba(12, 3, 10, .52)';
        contexts.map.lineWidth = 1.6 + random() * 1.4;
        contexts.map.stroke();
        contexts.bumpMap.beginPath();
        contexts.bumpMap.ellipse(knotX, knotY, radiusX, radiusY, random() * Math.PI, 0, Math.PI * 2);
        contexts.bumpMap.strokeStyle = '#575757';
        contexts.bumpMap.lineWidth = 2.4;
        contexts.bumpMap.stroke();
      }
      for (var scar = 0; scar < 34; scar += 1) {
        var scarX = random() * size;
        var scarY = random() * size;
        contexts.map.beginPath();
        contexts.map.moveTo(scarX, scarY);
        contexts.map.quadraticCurveTo(scarX + 12, scarY + (random() - .5) * 10, scarX + 26 + random() * 30, scarY + (random() - .5) * 18);
        contexts.map.strokeStyle = random() > .5 ? 'rgba(226, 129, 145, .16)' : 'rgba(9, 2, 8, .24)';
        contexts.map.lineWidth = .7 + random() * 1.1;
        contexts.map.stroke();
      }
    });
  }

  function createGildedFeastTexture() {
    return createTextureSet(512, 1.04, function (contexts, size) {
      var random = seededRandom(0xfeed5);
      var base = contexts.map.createLinearGradient(0, 0, size, size);
      base.addColorStop(0, '#d7aa48');
      base.addColorStop(.38, '#936b22');
      base.addColorStop(1, '#4b310e');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#808080', size);
      fillTexture(contexts.roughnessMap, '#858585', size);
      fillTexture(contexts.metalnessMap, '#222222', size);

      var spacing = 64;
      for (var row = -1; row < size / spacing + 2; row += 1) {
        for (var column = -1; column < size / spacing + 2; column += 1) {
          var centerX = column * spacing + (row % 2 ? spacing / 2 : 0);
          var centerY = row * spacing;
          contexts.map.beginPath();
          contexts.map.moveTo(centerX, centerY - 24);
          contexts.map.lineTo(centerX + 24, centerY);
          contexts.map.lineTo(centerX, centerY + 24);
          contexts.map.lineTo(centerX - 24, centerY);
          contexts.map.closePath();
          contexts.map.strokeStyle = 'rgba(244, 213, 119, .48)';
          contexts.map.lineWidth = 3;
          contexts.map.stroke();
          contexts.bumpMap.beginPath();
          contexts.bumpMap.moveTo(centerX, centerY - 24);
          contexts.bumpMap.lineTo(centerX + 24, centerY);
          contexts.bumpMap.lineTo(centerX, centerY + 24);
          contexts.bumpMap.lineTo(centerX - 24, centerY);
          contexts.bumpMap.closePath();
          contexts.bumpMap.strokeStyle = '#c2c2c2';
          contexts.bumpMap.lineWidth = 4;
          contexts.bumpMap.stroke();
          contexts.roughnessMap.beginPath();
          contexts.roughnessMap.moveTo(centerX, centerY - 24);
          contexts.roughnessMap.lineTo(centerX + 24, centerY);
          contexts.roughnessMap.lineTo(centerX, centerY + 24);
          contexts.roughnessMap.lineTo(centerX - 24, centerY);
          contexts.roughnessMap.closePath();
          contexts.roughnessMap.strokeStyle = '#626262';
          contexts.roughnessMap.lineWidth = 2;
          contexts.roughnessMap.stroke();
        }
      }

      for (var fleck = 0; fleck < 90; fleck += 1) {
        var fleckX = random() * size;
        var fleckY = random() * size;
        var radius = .8 + random() * 2.8;
        contexts.map.beginPath();
        contexts.map.arc(fleckX, fleckY, radius, 0, Math.PI * 2);
        contexts.map.fillStyle = random() > .5 ? 'rgba(255, 229, 143, .34)' : 'rgba(48, 28, 5, .28)';
        contexts.map.fill();
      }
    });
  }

  function createBlueEnamelGiltTexture() {
    return createTextureSet(512, 1.02, function (contexts, size) {
      var random = seededRandom(0xb1e17);
      var base = contexts.map.createLinearGradient(0, 0, size, size);
      base.addColorStop(0, '#345d8d');
      base.addColorStop(.34, '#1f3b63');
      base.addColorStop(.72, '#142844');
      base.addColorStop(1, '#0a1425');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#808080', size);
      fillTexture(contexts.roughnessMap, '#6f6f6f', size);
      fillTexture(contexts.metalnessMap, '#090909', size);

      // A faint lacquer grain sits beneath the ornament, so the blue reads as
      // hand-polished enamel over a worked dice body rather than flat plastic.
      for (var grain = 0; grain < 92; grain += 1) {
        var grainY = random() * size;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var grainX = -12; grainX <= size + 12; grainX += 10) {
          var y = grainY + Math.sin(grainX * (.021 + random() * .008) + grain * 1.41) * (1.5 + random() * 4.5) + grainX * (random() - .5) * .012;
          if (grainX === -12) {
            contexts.map.moveTo(grainX, y);
            contexts.bumpMap.moveTo(grainX, y);
            contexts.roughnessMap.moveTo(grainX, y);
          } else {
            contexts.map.lineTo(grainX, y);
            contexts.bumpMap.lineTo(grainX, y);
            contexts.roughnessMap.lineTo(grainX, y);
          }
        }
        contexts.map.strokeStyle = grain % 7 === 0 ? 'rgba(115, 163, 210, .13)' : 'rgba(5, 13, 28, .18)';
        contexts.map.lineWidth = grain % 7 === 0 ? 1.8 : .75;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = grain % 7 === 0 ? '#969696' : '#626262';
        contexts.bumpMap.lineWidth = grain % 7 === 0 ? 2.2 : 1;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = grain % 7 === 0 ? '#7e7e7e' : '#888888';
        contexts.roughnessMap.lineWidth = grain % 7 === 0 ? 1.5 : .8;
        contexts.roughnessMap.stroke();
      }

      // Repeating diamond medallions and curled stems provide the gilded
      // medieval ornament. The same paths are painted into the metalness and
      // bump maps, giving the gold lines both reflection and shallow relief.
      var spacing = 96;
      for (var row = -1; row < size / spacing + 2; row += 1) {
        for (var column = -1; column < size / spacing + 2; column += 1) {
          var centerX = column * spacing + (row % 2 ? spacing / 2 : 0);
          var centerY = row * spacing;
          var radius = 27;
          var drawDiamond = function (context, strokeStyle, lineWidth) {
            context.beginPath();
            context.moveTo(centerX, centerY - radius);
            context.lineTo(centerX + radius, centerY);
            context.lineTo(centerX, centerY + radius);
            context.lineTo(centerX - radius, centerY);
            context.closePath();
            context.strokeStyle = strokeStyle;
            context.lineWidth = lineWidth;
            context.stroke();
          };
          drawDiamond(contexts.map, 'rgba(221, 176, 77, .54)', 2.4);
          drawDiamond(contexts.bumpMap, '#c5c5c5', 4.2);
          drawDiamond(contexts.roughnessMap, '#777777', 2.2);
          drawDiamond(contexts.metalnessMap, '#d8d8d8', 3.5);

          contexts.map.beginPath();
          contexts.map.arc(centerX - 10, centerY, 7, .35, Math.PI * 1.65);
          contexts.map.arc(centerX + 10, centerY, 7, Math.PI * 1.35, Math.PI * .65, true);
          contexts.map.strokeStyle = 'rgba(244, 203, 102, .48)';
          contexts.map.lineWidth = 1.9;
          contexts.map.stroke();
          contexts.bumpMap.beginPath();
          contexts.bumpMap.arc(centerX - 10, centerY, 7, .35, Math.PI * 1.65);
          contexts.bumpMap.arc(centerX + 10, centerY, 7, Math.PI * 1.35, Math.PI * .65, true);
          contexts.bumpMap.strokeStyle = '#b9b9b9';
          contexts.bumpMap.lineWidth = 3;
          contexts.bumpMap.stroke();
          contexts.roughnessMap.beginPath();
          contexts.roughnessMap.arc(centerX - 10, centerY, 7, .35, Math.PI * 1.65);
          contexts.roughnessMap.arc(centerX + 10, centerY, 7, Math.PI * 1.35, Math.PI * .65, true);
          contexts.roughnessMap.strokeStyle = '#686868';
          contexts.roughnessMap.lineWidth = 1.6;
          contexts.roughnessMap.stroke();
          contexts.metalnessMap.beginPath();
          contexts.metalnessMap.arc(centerX - 10, centerY, 7, .35, Math.PI * 1.65);
          contexts.metalnessMap.arc(centerX + 10, centerY, 7, Math.PI * 1.35, Math.PI * .65, true);
          contexts.metalnessMap.strokeStyle = '#d4d4d4';
          contexts.metalnessMap.lineWidth = 2.8;
          contexts.metalnessMap.stroke();
        }
      }

      for (var fleck = 0; fleck < 110; fleck += 1) {
        var fleckX = random() * size;
        var fleckY = random() * size;
        var fleckRadius = .6 + random() * 2.2;
        contexts.map.beginPath();
        contexts.map.arc(fleckX, fleckY, fleckRadius, 0, Math.PI * 2);
        contexts.map.fillStyle = random() > .42 ? 'rgba(117, 166, 214, .16)' : 'rgba(4, 10, 21, .2)';
        contexts.map.fill();
      }
    });
  }

  function createCeladonGlazeTexture() {
    return createTextureSet(1024, 1.03, function (contexts, size) {
      var random = seededRandom(0xce1ad0);
      var base = contexts.map.createLinearGradient(0, 0, size, size);
      // Keep the glaze saturated under the tavern's strong candle and fill
      // lights. The previous pale top stop clipped to near-white and read as
      // painted plastic instead of translucent celadon.
      base.addColorStop(0, '#6f9c91');
      base.addColorStop(.28, '#5b8980');
      base.addColorStop(.65, '#416e69');
      base.addColorStop(1, '#223f43');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#858585', size);
      fillTexture(contexts.roughnessMap, '#5f5f5f', size);
      fillTexture(contexts.metalnessMap, '#080808', size);

      // Kiln-fired glaze has broad translucent pooling and subtle color drift,
      // not the regular grain used by the wood-based skins.
      // 密度和不透明度都比初版调低了一截——原来这层跟后面的裂纹叠在一起，
      // 整张贴图看起来太"花"，会跟点数抢视觉焦点。
      for (var pool = 0; pool < 12; pool += 1) {
        var poolX = random() * size;
        var poolY = random() * size;
        var poolRadius = 28 + random() * 86;
        var poolGradient = contexts.map.createRadialGradient(poolX, poolY, 2, poolX, poolY, poolRadius);
        poolGradient.addColorStop(0, random() > .5 ? 'rgba(191, 225, 209, .08)' : 'rgba(21, 55, 58, .12)');
        poolGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        contexts.map.fillStyle = poolGradient;
        contexts.map.beginPath();
        contexts.map.ellipse(poolX, poolY, poolRadius, poolRadius * (.42 + random() * .3), random() * Math.PI, 0, Math.PI * 2);
        contexts.map.fill();
      }

      // Mid-scale kiln flow: irregular bands bridge the large glaze pools and
      // the fine crackle. This is the celadon equivalent of the red-oak grain
      // layer: broad enough to read as material, but soft enough to stay glazed
      // instead of looking like painted stripes.
      for (var flow = 0; flow < 24; flow += 1) {
        var flowOrigin = random() * size;
        var flowTilt = (random() - .5) * .09;
        var flowAmplitude = 13 + random() * 34;
        var flowFrequency = .009 + random() * .007;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var flowX = -30; flowX <= size + 30; flowX += 16) {
          var flowY = flowOrigin + Math.sin(flowX * flowFrequency + flow * 1.17) * flowAmplitude + flowX * flowTilt;
          if (flowX === -30) {
            contexts.map.moveTo(flowX, flowY);
            contexts.bumpMap.moveTo(flowX, flowY);
            contexts.roughnessMap.moveTo(flowX, flowY);
          } else {
            contexts.map.lineTo(flowX, flowY);
            contexts.bumpMap.lineTo(flowX, flowY);
            contexts.roughnessMap.lineTo(flowX, flowY);
          }
        }
        var isLightFlow = flow % 6 === 0;
        contexts.map.strokeStyle = isLightFlow ? 'rgba(188, 224, 207, .13)' : 'rgba(18, 53, 56, .085)';
        contexts.map.lineWidth = isLightFlow ? 5 + random() * 3 : 2 + random() * 2;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = isLightFlow ? '#a9a9a9' : '#696969';
        contexts.bumpMap.lineWidth = isLightFlow ? 3.8 : 1.8;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = isLightFlow ? '#777777' : '#858585';
        contexts.roughnessMap.lineWidth = isLightFlow ? 2.6 : 1.2;
        contexts.roughnessMap.stroke();
      }

      // A handful of longer mineral veins give each face a kiln-fired
      // irregularity, equivalent to the red-oak scars but softer and more
      // translucent in colour.
      for (var vein = 0; vein < 10; vein += 1) {
        var veinX = random() * size;
        var veinY = random() * size;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        contexts.map.moveTo(veinX, veinY);
        contexts.bumpMap.moveTo(veinX, veinY);
        contexts.roughnessMap.moveTo(veinX, veinY);
        for (var veinStep = 0; veinStep < 5; veinStep += 1) {
          veinX += 26 + random() * 72;
          veinY += (random() - .5) * 42;
          contexts.map.lineTo(veinX, veinY);
          contexts.bumpMap.lineTo(veinX, veinY);
          contexts.roughnessMap.lineTo(veinX, veinY);
        }
        contexts.map.strokeStyle = vein % 3 === 0 ? 'rgba(221, 241, 225, .16)' : 'rgba(25, 67, 67, .13)';
        contexts.map.lineWidth = vein % 3 === 0 ? 2.3 : 1.4;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = vein % 3 === 0 ? '#b7b7b7' : '#5f5f5f';
        contexts.bumpMap.lineWidth = vein % 3 === 0 ? 2.8 : 1.7;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = vein % 3 === 0 ? '#858585' : '#909090';
        contexts.roughnessMap.lineWidth = vein % 3 === 0 ? 2 : 1.2;
        contexts.roughnessMap.stroke();
      }

      // Fine crackle lines are painted into colour, bump and roughness maps so
      // the broken-glaze pattern catches the tavern light without becoming a
      // flat decorative decal.
      // 数量和不透明度都往下压——原版这层跟点数的深浅太接近，六颗骰子摆在一起
      // 容易第一眼分不清"这是裂纹"还是"这是点数"。
      for (var crack = 0; crack < 92; crack += 1) {
        var x = random() * size;
        var y = random() * size;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        contexts.map.moveTo(x, y);
        contexts.bumpMap.moveTo(x, y);
        contexts.roughnessMap.moveTo(x, y);
        var segments = 2 + Math.floor(random() * 4);
        for (var segment = 0; segment < segments; segment += 1) {
          x += (random() - .5) * (22 + random() * 38);
          y += (random() - .5) * (22 + random() * 38);
          contexts.map.lineTo(x, y);
          contexts.bumpMap.lineTo(x, y);
          contexts.roughnessMap.lineTo(x, y);
        }
        contexts.map.strokeStyle = crack % 5 === 0 ? 'rgba(231, 244, 231, .36)' : 'rgba(36, 73, 76, .2)';
        contexts.map.lineWidth = crack % 5 === 0 ? 1.1 : .6;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = crack % 5 === 0 ? '#bdbdbd' : '#626262';
        contexts.bumpMap.lineWidth = crack % 5 === 0 ? 2.1 : 1.1;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = crack % 5 === 0 ? '#777777' : '#888888';
        contexts.roughnessMap.lineWidth = crack % 5 === 0 ? 1.8 : .9;
        contexts.roughnessMap.stroke();
      }

      // A broad, layered ceramic trim replaces the metal hoops used by the
      // other premium skins. The lotus/scroll motifs are repeated along the
      // band, then repeated in the bump and roughness maps to create actual
      // kiln relief rather than a flat line decal.
      function drawLotusScroll(context, centerX, centerY, rotation, strokeStyle, lineWidth, fillStyle, shadowStyle) {
        function drawMotif(offsetX, offsetY, strokeOverride, fillOverride) {
          context.save();
          context.translate(offsetX, offsetY);
          context.lineJoin = 'round';
          context.lineCap = 'round';
          context.strokeStyle = strokeOverride || strokeStyle;
          context.fillStyle = fillOverride || fillStyle || 'transparent';
          context.lineWidth = lineWidth;

          // A filled three-petal crown reads at thumbnail size; the old
          // outline-only version collapsed into a few disconnected strokes.
          context.beginPath();
          context.moveTo(0, 19);
          context.bezierCurveTo(-15, 15, -19, 2, -11, -9);
          context.bezierCurveTo(-5, -5, -2, 0, 0, 8);
          context.bezierCurveTo(2, 0, 5, -5, 11, -9);
          context.bezierCurveTo(19, 2, 15, 15, 0, 19);
          context.closePath();
          if (fillStyle) context.fill();
          context.stroke();

          context.beginPath();
          context.moveTo(-7, 12);
          context.bezierCurveTo(-31, 17, -35, -2, -21, -19);
          context.bezierCurveTo(-20, -7, -14, 1, -7, 5);
          context.stroke();
          context.beginPath();
          context.moveTo(7, 12);
          context.bezierCurveTo(31, 17, 35, -2, 21, -19);
          context.bezierCurveTo(20, -7, 14, 1, 7, 5);
          context.stroke();
          context.beginPath();
          context.arc(0, 14, 3.8, 0, Math.PI * 2);
          if (fillStyle) context.fill();
          context.stroke();
          context.restore();
        }

        context.save();
        context.translate(centerX, centerY);
        context.rotate(rotation);
        // Offset the dark pass by a few pixels to create a carved undercut.
        if (shadowStyle) {
          drawMotif(3, 3, shadowStyle, shadowStyle);
        }
        drawMotif(0, 0);
        context.restore();
      }
      function drawCeramicTrim(context, options) {
        // Keep the guard band broad enough to survive the UV scale on the
        // rounded dice. It is a ceramic architectural band, not a hairline.
        var outer = 20;
        var band = 72;
        var inner = outer + band;
        var spacing = 168;
        context.save();
        context.fillStyle = options.fill;
        context.fillRect(outer, outer, size - outer * 2, band);
        context.fillRect(outer, size - outer - band, size - outer * 2, band);
        context.fillRect(outer, outer + band, band, size - (outer + band) * 2);
        context.fillRect(size - outer - band, outer + band, band, size - (outer + band) * 2);
        // The inset line separates the raised guard from the glazed field.
        context.strokeStyle = options.inset || options.shadow;
        context.lineWidth = options.insetWidth || 13;
        context.strokeRect(outer + 15, outer + 15, size - (outer + 15) * 2, size - (outer + 15) * 2);
        context.strokeStyle = options.shadow;
        context.lineWidth = options.shadowWidth;
        context.strokeRect(outer, outer, size - outer * 2, size - outer * 2);
        context.strokeRect(inner, inner, size - inner * 2, size - inner * 2);
        context.strokeStyle = options.highlight;
        context.lineWidth = options.highlightWidth;
        context.strokeRect(outer + 5, outer + 5, size - (outer + 5) * 2, size - (outer + 5) * 2);
        context.strokeRect(inner - 5, inner - 5, size - (inner - 5) * 2, size - (inner - 5) * 2);
        for (var topX = inner + 74; topX < size - inner - 74; topX += spacing) {
          drawLotusScroll(context, topX, outer + band / 2, 0, options.motif, options.motifWidth, options.motifFill, options.motifShadow);
          drawLotusScroll(context, topX, size - outer - band / 2, Math.PI, options.motif, options.motifWidth, options.motifFill, options.motifShadow);
        }
        for (var sideY = inner + 74; sideY < size - inner - 74; sideY += spacing) {
          drawLotusScroll(context, outer + band / 2, sideY, -Math.PI / 2, options.motif, options.motifWidth, options.motifFill, options.motifShadow);
          drawLotusScroll(context, size - outer - band / 2, sideY, Math.PI / 2, options.motif, options.motifWidth, options.motifFill, options.motifShadow);
        }
        // Small raised beads sit between the larger motifs, like hand-tooled
        // ceramic studs. They also keep the band visually continuous when a
        // face is viewed at a steep angle.
        context.fillStyle = options.bead || options.motif;
        for (var bead = inner + 24; bead < size - inner - 24; bead += 56) {
          context.beginPath();
          context.arc(bead, outer + band / 2, 5.5, 0, Math.PI * 2);
          context.arc(bead, size - outer - band / 2, 5.5, 0, Math.PI * 2);
          context.arc(outer + band / 2, bead, 5.5, 0, Math.PI * 2);
          context.arc(size - outer - band / 2, bead, 5.5, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
      drawCeramicTrim(contexts.map, { fill: 'rgba(134, 178, 159, .24)', inset: 'rgba(25, 65, 64, .82)', shadow: 'rgba(16, 49, 52, .86)', highlight: 'rgba(180, 216, 196, .7)', motif: 'rgba(184, 219, 198, .8)', motifFill: 'rgba(130, 180, 157, .42)', motifShadow: 'rgba(14, 49, 49, .88)', bead: 'rgba(190, 224, 201, .62)', insetWidth: 10, shadowWidth: 9, highlightWidth: 5, motifWidth: 4.2 });
      drawCeramicTrim(contexts.bumpMap, { fill: '#9b9b9b', inset: '#5a5a5a', shadow: '#515151', highlight: '#e1e1e1', motif: '#e7e7e7', motifFill: '#bdbdbd', motifShadow: '#4b4b4b', bead: '#d8d8d8', insetWidth: 17, shadowWidth: 16, highlightWidth: 8, motifWidth: 9 });
      drawCeramicTrim(contexts.roughnessMap, { fill: '#696969', inset: '#818181', shadow: '#747474', highlight: '#9c9c9c', motif: '#a7a7a7', motifFill: '#858585', motifShadow: '#656565', bead: '#9b9b9b', insetWidth: 12, shadowWidth: 10, highlightWidth: 6, motifWidth: 5.6 });

      // Pale mineral flecks and dark kiln pinholes keep the surface organic at
      // close range and break up the uniformity of the blue-green glaze.
      for (var fleck = 0; fleck < 130; fleck += 1) {
        var fleckX = random() * size;
        var fleckY = random() * size;
        var fleckRadius = .45 + random() * 2.2;
        contexts.map.beginPath();
        contexts.map.arc(fleckX, fleckY, fleckRadius, 0, Math.PI * 2);
        contexts.map.fillStyle = random() > .46 ? 'rgba(224, 242, 229, .2)' : 'rgba(20, 49, 53, .2)';
        contexts.map.fill();
      }
    });
  }

  function createAmberGlazeTexture() {
    return createTextureSet(1024, 1.01, function (contexts, size) {
      var random = seededRandom(0xa11be7);
      var base = contexts.map.createLinearGradient(0, 0, size, size * 1.08);
      base.addColorStop(0, '#e0a24a');
      base.addColorStop(.26, '#c57a32');
      base.addColorStop(.62, '#9a4d25');
      base.addColorStop(1, '#67301d');
      contexts.map.fillStyle = base;
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#747474', size);
      fillTexture(contexts.roughnessMap, '#606060', size);
      fillTexture(contexts.metalnessMap, '#0a0a0a', size);

      // Natural amber has broad cloudy zones rather than regular stripes.
      for (var cloud = 0; cloud < 24; cloud += 1) {
        var cloudX = random() * size;
        var cloudY = random() * size;
        var cloudRadius = 48 + random() * 160;
        var cloudGradient = contexts.map.createRadialGradient(cloudX, cloudY, 4, cloudX, cloudY, cloudRadius);
        if (cloud % 3 === 0) {
          cloudGradient.addColorStop(0, 'rgba(255, 224, 135, .22)');
          cloudGradient.addColorStop(.6, 'rgba(239, 165, 70, .08)');
        } else {
          cloudGradient.addColorStop(0, 'rgba(89, 34, 20, .17)');
          cloudGradient.addColorStop(.65, 'rgba(117, 47, 21, .08)');
        }
        cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        contexts.map.fillStyle = cloudGradient;
        contexts.map.beginPath();
        contexts.map.ellipse(cloudX, cloudY, cloudRadius, cloudRadius * (.34 + random() * .44), random() * Math.PI, 0, Math.PI * 2);
        contexts.map.fill();

        var bumpGradient = contexts.bumpMap.createRadialGradient(cloudX, cloudY, 2, cloudX, cloudY, cloudRadius);
        bumpGradient.addColorStop(0, cloud % 3 === 0 ? '#999999' : '#686868');
        bumpGradient.addColorStop(1, '#777777');
        contexts.bumpMap.fillStyle = bumpGradient;
        contexts.bumpMap.beginPath();
        contexts.bumpMap.ellipse(cloudX, cloudY, cloudRadius, cloudRadius * (.34 + random() * .44), random() * Math.PI, 0, Math.PI * 2);
        contexts.bumpMap.fill();
      }

      // Resin flow is soft and broken, never a repeated wood-grain pattern.
      for (var flow = 0; flow < 34; flow += 1) {
        var flowOrigin = random() * size;
        var flowTilt = (random() - .5) * .12;
        var flowAmplitude = 16 + random() * 46;
        var flowFrequency = .006 + random() * .008;
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var flowX = -40; flowX <= size + 40; flowX += 18) {
          var flowY = flowOrigin + Math.sin(flowX * flowFrequency + flow * 1.53) * flowAmplitude + flowX * flowTilt;
          if (flowX === -40) {
            contexts.map.moveTo(flowX, flowY);
            contexts.bumpMap.moveTo(flowX, flowY);
            contexts.roughnessMap.moveTo(flowX, flowY);
          } else {
            contexts.map.lineTo(flowX, flowY);
            contexts.bumpMap.lineTo(flowX, flowY);
            contexts.roughnessMap.lineTo(flowX, flowY);
          }
        }
        var paleFlow = flow % 7 === 0;
        contexts.map.strokeStyle = paleFlow ? 'rgba(255, 223, 142, .13)' : 'rgba(80, 29, 17, .09)';
        contexts.map.lineWidth = paleFlow ? 7 + random() * 4 : 2 + random() * 3;
        contexts.map.stroke();
        contexts.bumpMap.strokeStyle = paleFlow ? '#999999' : '#666666';
        contexts.bumpMap.lineWidth = paleFlow ? 3.4 : 1.5;
        contexts.bumpMap.stroke();
        contexts.roughnessMap.strokeStyle = paleFlow ? '#6d6d6d' : '#858585';
        contexts.roughnessMap.lineWidth = paleFlow ? 2.4 : 1.1;
        contexts.roughnessMap.stroke();
      }

      // Dark, irregular inclusions imitate botanical/mineral fragments trapped
      // inside amber. Each silhouette is deliberately different.
      for (var inclusion = 0; inclusion < 26; inclusion += 1) {
        var inclusionX = 24 + random() * (size - 48);
        var inclusionY = 24 + random() * (size - 48);
        var inclusionRadius = 5 + random() * 24;
        var points = 5 + Math.floor(random() * 5);
        contexts.map.beginPath();
        contexts.bumpMap.beginPath();
        contexts.roughnessMap.beginPath();
        for (var point = 0; point < points; point += 1) {
          var angle = point / points * Math.PI * 2;
          var radius = inclusionRadius * (.42 + random() * .72);
          var pointX = inclusionX + Math.cos(angle) * radius * (1.2 + random() * .7);
          var pointY = inclusionY + Math.sin(angle) * radius * (.36 + random() * .74);
          if (point === 0) {
            contexts.map.moveTo(pointX, pointY);
            contexts.bumpMap.moveTo(pointX, pointY);
            contexts.roughnessMap.moveTo(pointX, pointY);
          } else {
            contexts.map.lineTo(pointX, pointY);
            contexts.bumpMap.lineTo(pointX, pointY);
            contexts.roughnessMap.lineTo(pointX, pointY);
          }
        }
        contexts.map.closePath();
        contexts.bumpMap.closePath();
        contexts.roughnessMap.closePath();
        contexts.map.fillStyle = inclusion % 4 === 0 ? 'rgba(48, 24, 17, .34)' : 'rgba(71, 29, 18, .22)';
        contexts.map.fill();
        contexts.bumpMap.fillStyle = inclusion % 4 === 0 ? '#626262' : '#6f6f6f';
        contexts.bumpMap.fill();
        contexts.roughnessMap.fillStyle = '#747474';
        contexts.roughnessMap.fill();
        if (inclusion % 3 === 0) {
          contexts.map.strokeStyle = 'rgba(255, 213, 124, .2)';
          contexts.map.lineWidth = 1.4;
          contexts.map.stroke();
        }
      }

      // Sparse bubbles are tiny and translucent, not white polka dots.
      for (var bubble = 0; bubble < 84; bubble += 1) {
        var bubbleX = random() * size;
        var bubbleY = random() * size;
        var bubbleRadius = .8 + random() * 4.2;
        contexts.map.beginPath();
        contexts.map.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
        contexts.map.strokeStyle = bubble % 3 === 0 ? 'rgba(255, 235, 170, .2)' : 'rgba(92, 38, 20, .16)';
        contexts.map.lineWidth = .8 + random() * .8;
        contexts.map.stroke();
        contexts.bumpMap.beginPath();
        contexts.bumpMap.arc(bubbleX, bubbleY, bubbleRadius, 0, Math.PI * 2);
        contexts.bumpMap.strokeStyle = '#8f8f8f';
        contexts.bumpMap.lineWidth = 1.1;
        contexts.bumpMap.stroke();
      }

      // A soft oxidised rim makes the polished amber feel solid at the edges.
      var rim = contexts.map.createRadialGradient(size * .5, size * .48, size * .16, size * .5, size * .48, size * .75);
      rim.addColorStop(0, 'rgba(255, 218, 133, 0)');
      rim.addColorStop(.72, 'rgba(97, 37, 20, .04)');
      rim.addColorStop(1, 'rgba(44, 17, 12, .26)');
      contexts.map.fillStyle = rim;
      contexts.map.fillRect(0, 0, size, size);
      var bumpRim = contexts.bumpMap.createRadialGradient(size * .5, size * .48, size * .2, size * .5, size * .48, size * .76);
      bumpRim.addColorStop(0, '#858585');
      bumpRim.addColorStop(1, '#696969');
      contexts.bumpMap.fillStyle = bumpRim;
      contexts.bumpMap.fillRect(0, 0, size, size);
    });
  }

  function createMythicCrimsonSealTexture() {
    // Layered cinnabar lacquer over dark hardwood: the broad colour pools keep
    // the red body from reading as a flat gradient, while paired grain strokes
    // provide the small raised-and-undercut read of hand-finished lacquer.
    return createTextureSet(1024, 1.03, function (contexts, size) {
      var random = seededRandom(0xc11a55e);
      // Keep the body visually unified at table distance. The old high-contrast
      // diagonal gradient read as four dark/light blocks once the UVs wrapped
      // over the rounded die faces, so colour variation now comes from subtle
      // lacquer pools and real lighting instead of hard tonal quadrants.
      contexts.map.fillStyle = '#76252c';
      contexts.map.fillRect(0, 0, size, size);
      fillTexture(contexts.bumpMap, '#777777', size);
      fillTexture(contexts.roughnessMap, '#909090', size);
      fillTexture(contexts.metalnessMap, '#111111', size);

      // Low-contrast lacquer pools add depth without producing a visible block
      // or stripe on any one of the six UV islands.
      for (var pool = 0; pool < 12; pool += 1) {
        var poolX = random() * size;
        var poolY = random() * size;
        var poolRadius = 44 + random() * 126;
        var poolGradient = contexts.map.createRadialGradient(poolX, poolY, 4, poolX, poolY, poolRadius);
        if (pool % 3 === 0) {
          poolGradient.addColorStop(0, 'rgba(226, 112, 98, .075)');
          poolGradient.addColorStop(.58, 'rgba(176, 54, 56, .03)');
        } else {
          poolGradient.addColorStop(0, 'rgba(29, 3, 12, .075)');
          poolGradient.addColorStop(.64, 'rgba(83, 12, 24, .03)');
        }
        poolGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        contexts.map.fillStyle = poolGradient;
        contexts.map.beginPath();
        contexts.map.ellipse(poolX, poolY, poolRadius, poolRadius * (.24 + random() * .42), random() * Math.PI, 0, Math.PI * 2);
        contexts.map.fill();
      }

      // Pressed seal motifs sit beneath the lacquer. They are intentionally
      // sparse and low contrast: visible when the candle skims the face, never
      // strong enough to compete with the six raised symbol pips.
      for (var seal = 0; seal < 8; seal += 1) {
        var sealX = 86 + random() * (size - 172);
        var sealY = 86 + random() * (size - 172);
        var sealRadius = 42 + random() * 46;
        var sealRotation = random() * Math.PI;
        var drawSeal = function (context, strokeStyle, lineWidth, scale, offsetX, offsetY) {
          context.save();
          context.translate(sealX + (offsetX || 0), sealY + (offsetY || 0));
          context.rotate(sealRotation);
          context.scale(scale || 1, scale || 1);
          context.beginPath();
          context.arc(0, 0, sealRadius, 0, Math.PI * 2);
          context.arc(0, 0, sealRadius * .76, 0, Math.PI * 2);
          context.strokeStyle = strokeStyle;
          context.lineWidth = lineWidth;
          context.stroke();
          for (var petal = 0; petal < 4; petal += 1) {
            var petalAngle = petal * Math.PI / 2;
            context.save();
            context.rotate(petalAngle);
            context.beginPath();
            context.moveTo(0, -sealRadius * .2);
            context.quadraticCurveTo(sealRadius * .18, -sealRadius * .42, sealRadius * .34, -sealRadius * .2);
            context.quadraticCurveTo(sealRadius * .18, -.02, 0, -sealRadius * .2);
            context.stroke();
            context.restore();
          }
          context.restore();
        };
        drawSeal(contexts.map, 'rgba(39, 5, 14, .075)', 5.2, 1, 2.2, 2.2);
        drawSeal(contexts.map, 'rgba(225, 111, 97, .045)', 2.2, 1, 0, 0);
        drawSeal(contexts.bumpMap, '#5f5f5f', 4.2, 1, 2.2, 2.2);
        drawSeal(contexts.bumpMap, '#a0a0a0', 2.1, 1, 0, 0);
        drawSeal(contexts.roughnessMap, '#858585', 2.4, 1, 0, 0);
      }

      // The red lacquer is translucent enough for the wood structure to read
      // through it. Use long, irregular fibers plus a second micro-grain pass;
      // the paired dark/light strokes are also painted into the bump map so the
      // grain catches a grazing candle highlight instead of remaining a flat
      // colour decal.
      var drawPath = function (context, path) {
        context.beginPath();
        path.forEach(function (point, pointIndex) {
          if (pointIndex === 0) context.moveTo(point[0], point[1]); else context.lineTo(point[0], point[1]);
        });
        context.lineCap = 'round';
        context.lineJoin = 'round';
      };
      var makeFiberPath = function (originX, originY, length, phase, frequency, amplitude, tilt, steps) {
        var points = [];
        for (var step = 0; step <= steps; step += 1) {
          var ratio = step / steps;
          var distance = ratio * length;
          var wave = Math.sin(distance * frequency + phase) * amplitude;
          wave += Math.sin(distance * frequency * 2.37 + phase * .61) * amplitude * .32;
          points.push([originX + distance, originY + wave + distance * tilt]);
        }
        return points;
      };
      var strokeFiber = function (points, undercut, mapShadow, mapRidge, bumpShadow, bumpRidge, roughness, widths) {
        drawPath(contexts.map, undercut);
        contexts.map.strokeStyle = mapShadow;
        contexts.map.lineWidth = widths.shadow;
        contexts.map.stroke();
        drawPath(contexts.map, points);
        contexts.map.strokeStyle = mapRidge;
        contexts.map.lineWidth = widths.ridge;
        contexts.map.stroke();

        drawPath(contexts.bumpMap, undercut);
        contexts.bumpMap.strokeStyle = bumpShadow;
        contexts.bumpMap.lineWidth = widths.bumpShadow;
        contexts.bumpMap.stroke();
        drawPath(contexts.bumpMap, points);
        contexts.bumpMap.strokeStyle = bumpRidge;
        contexts.bumpMap.lineWidth = widths.bumpRidge;
        contexts.bumpMap.stroke();

        drawPath(contexts.roughnessMap, points);
        contexts.roughnessMap.strokeStyle = roughness;
        contexts.roughnessMap.lineWidth = widths.roughness;
        contexts.roughnessMap.stroke();
      };

      // Premium mahogany and rosewood do not read as evenly spaced stripes:
      // their figure flows in broad ribbons, gathers around a few "eyes", and
      // occasionally breaks into darker spider-web streaks. Paint that figure
      // as smooth Bezier bands first, then layer the finer fibers below.
      var strokeRibbon = function (context, spec, offsetX, offsetY, strokeStyle, lineWidth) {
        context.beginPath();
        context.moveTo(spec.startX + offsetX, spec.startY + offsetY);
        context.bezierCurveTo(
          spec.control1X + offsetX, spec.control1Y + offsetY,
          spec.control2X + offsetX, spec.control2Y + offsetY,
          spec.endX + offsetX, spec.endY + offsetY
        );
        context.strokeStyle = strokeStyle;
        context.lineWidth = lineWidth;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
      };
      var figureEyes = [];
      for (var eye = 0; eye < 4; eye += 1) {
        figureEyes.push({
          x: 120 + random() * (size - 240),
          y: 150 + random() * (size - 300),
          spread: 120 + random() * 170
        });
      }
      for (var ribbon = 0; ribbon < 26; ribbon += 1) {
        var eyeCenter = figureEyes[ribbon % figureEyes.length];
        var ribbonStartX = -120;
        var ribbonStartY = eyeCenter.y + (random() - .5) * eyeCenter.spread * 2.8;
        var ribbonEndX = size + 120;
        var ribbonEndY = ribbonStartY + (random() - .5) * size * .28;
        var bend = (random() - .5) * size * .42;
        var ribbonSpec = {
          startX: ribbonStartX,
          startY: ribbonStartY,
          control1X: size * .2,
          control1Y: ribbonStartY + bend,
          control2X: size * .62,
          control2Y: eyeCenter.y - bend * .72 + (random() - .5) * 80,
          endX: ribbonEndX,
          endY: ribbonEndY
        };
        strokeRibbon(contexts.map, ribbonSpec, 5.2, 5.8, 'rgba(26, 4, 11, .28)', 9 + random() * 8);
        strokeRibbon(contexts.map, ribbonSpec, 0, 0, ribbon % 5 === 0 ? 'rgba(224, 122, 94, .18)' : 'rgba(193, 77, 73, .12)', 3.5 + random() * 3.5);
        strokeRibbon(contexts.bumpMap, ribbonSpec, 4.3, 4.8, '#4d4d4d', 7 + random() * 5);
        strokeRibbon(contexts.bumpMap, ribbonSpec, 0, 0, '#b9b9b9', 3.4 + random() * 2.3);
        strokeRibbon(contexts.roughnessMap, ribbonSpec, 0, 0, ribbon % 4 === 0 ? '#777777' : '#909090', 3 + random() * 2);
      }

      // Broad growth bands establish the direction and depth of the wood.
      for (var broad = 0; broad < 34; broad += 1) {
        var broadOriginX = -140 + random() * (size + 160);
        var broadOriginY = random() * size;
        var broadLength = 420 + random() * 700;
        var broadPhase = random() * Math.PI * 2;
        var broadFrequency = .006 + random() * .005;
        var broadAmplitude = 10 + random() * 22;
        var broadTilt = (random() - .5) * .055;
        var broadPoints = makeFiberPath(broadOriginX, broadOriginY, broadLength, broadPhase, broadFrequency, broadAmplitude, broadTilt, 24);
        var broadUndercut = broadPoints.map(function (point) { return [point[0] + 4.2, point[1] + 4.8]; });
        strokeFiber(broadPoints, broadUndercut, 'rgba(22, 3, 10, .33)', 'rgba(220, 104, 90, .19)', '#4a4a4a', '#c1c1c1', '#7d7d7d', { shadow: 6.4, ridge: 2.5, bumpShadow: 5.1, bumpRidge: 3.1, roughness: 2.8 });
      }

      // Fine fibers break up the broad bands and make the surface feel like
      // lacquered timber rather than a single procedural stripe.
      for (var fine = 0; fine < 176; fine += 1) {
        var fineOriginX = -60 + random() * (size + 80);
        var fineOriginY = random() * size;
        var fineLength = 84 + random() * 340;
        var finePoints = makeFiberPath(fineOriginX, fineOriginY, fineLength, random() * Math.PI * 2, .012 + random() * .011, 2.5 + random() * 8.5, (random() - .5) * .11, 12);
        var fineUndercut = finePoints.map(function (point) { return [point[0] + 1.8, point[1] + 2.2]; });
        strokeFiber(finePoints, fineUndercut, 'rgba(25, 3, 11, .25)', 'rgba(209, 84, 81, .15)', '#585858', '#b2b2b2', '#949494', { shadow: 1.9, ridge: .75, bumpShadow: 1.8, bumpRidge: 1.1, roughness: .95 });
      }

      // Small irregular knots anchor the grain and give the red lacquer a
      // believable timber structure at close range.
      for (var knot = 0; knot < 11; knot += 1) {
        var knotX = 46 + random() * (size - 92);
        var knotY = 46 + random() * (size - 92);
        var knotRadiusX = 18 + random() * 38;
        var knotRadiusY = 7 + random() * 17;
        var knotRotation = random() * Math.PI;
        for (var ring = 0; ring < 4; ring += 1) {
          var ringScale = 1 + ring * .32;
          contexts.map.beginPath();
          contexts.map.ellipse(knotX + 2.4, knotY + 2.8, knotRadiusX * ringScale, knotRadiusY * ringScale, knotRotation, 0, Math.PI * 2);
          contexts.map.strokeStyle = ring === 0 ? 'rgba(23, 3, 10, .34)' : 'rgba(30, 4, 13, .2)';
          contexts.map.lineWidth = ring === 0 ? 3.8 : 1.5;
          contexts.map.stroke();
          contexts.map.beginPath();
          contexts.map.ellipse(knotX, knotY, knotRadiusX * ringScale, knotRadiusY * ringScale, knotRotation, 0, Math.PI * 2);
          contexts.map.strokeStyle = ring === 0 ? 'rgba(224, 102, 91, .24)' : 'rgba(199, 74, 74, .13)';
          contexts.map.lineWidth = ring === 0 ? 1.8 : 1;
          contexts.map.stroke();

          contexts.bumpMap.beginPath();
          contexts.bumpMap.ellipse(knotX + 2.2, knotY + 2.5, knotRadiusX * ringScale, knotRadiusY * ringScale, knotRotation, 0, Math.PI * 2);
          contexts.bumpMap.strokeStyle = ring === 0 ? '#4b4b4b' : '#686868';
          contexts.bumpMap.lineWidth = ring === 0 ? 4.2 : 1.9;
          contexts.bumpMap.stroke();
          contexts.bumpMap.beginPath();
          contexts.bumpMap.ellipse(knotX, knotY, knotRadiusX * ringScale, knotRadiusY * ringScale, knotRotation, 0, Math.PI * 2);
          contexts.bumpMap.strokeStyle = ring === 0 ? '#c5c5c5' : '#9f9f9f';
          contexts.bumpMap.lineWidth = ring === 0 ? 2.1 : 1.15;
          contexts.bumpMap.stroke();

          contexts.roughnessMap.beginPath();
          contexts.roughnessMap.ellipse(knotX, knotY, knotRadiusX * ringScale, knotRadiusY * ringScale, knotRotation, 0, Math.PI * 2);
          contexts.roughnessMap.strokeStyle = ring === 0 ? '#7d7d7d' : '#9d9d9d';
          contexts.roughnessMap.lineWidth = ring === 0 ? 2 : 1;
          contexts.roughnessMap.stroke();
        }
        for (var branch = 0; branch < 5; branch += 1) {
          var branchAngle = knotRotation + (branch - 2) * .26;
          var branchLength = 32 + random() * 86;
          var branchStartX = knotX + Math.cos(branchAngle) * knotRadiusX * .55;
          var branchStartY = knotY + Math.sin(branchAngle) * knotRadiusY * .55;
          var branchPoints = makeFiberPath(branchStartX, branchStartY, branchLength, random() * Math.PI * 2, .02, 2 + random() * 4, Math.sin(branchAngle) * .03, 8);
          var branchUndercut = branchPoints.map(function (point) { return [point[0] + 1.7, point[1] + 2]; });
          strokeFiber(branchPoints, branchUndercut, 'rgba(24, 3, 10, .28)', 'rgba(212, 86, 82, .15)', '#555555', '#b4b4b4', '#8f8f8f', { shadow: 2.2, ridge: .9, bumpShadow: 1.8, bumpRidge: 1.2, roughness: 1 });
        }
      }

      // Hand-worn lacquer scratches and tiny mineral flecks break up perfect
      // procedural regularity without becoming a repeated grid.
      for (var scratch = 0; scratch < 64; scratch += 1) {
        var scratchX = random() * size;
        var scratchY = random() * size;
        contexts.map.beginPath();
        contexts.map.moveTo(scratchX, scratchY);
        contexts.map.quadraticCurveTo(scratchX + 18 + random() * 36, scratchY + (random() - .5) * 12, scratchX + 46 + random() * 58, scratchY + (random() - .5) * 18);
        contexts.map.strokeStyle = scratch % 3 === 0 ? 'rgba(235, 143, 117, .12)' : 'rgba(25, 3, 12, .2)';
        contexts.map.lineWidth = .65 + random() * 1.2;
        contexts.map.stroke();
      }
      for (var fleck = 0; fleck < 96; fleck += 1) {
        var fleckX = random() * size;
        var fleckY = random() * size;
        var radius = .5 + random() * 2.4;
        contexts.map.beginPath();
        contexts.map.arc(fleckX, fleckY, radius, 0, Math.PI * 2);
        contexts.map.fillStyle = fleck % 4 === 0 ? 'rgba(242, 157, 124, .1)' : 'rgba(19, 2, 10, .16)';
        contexts.map.fill();
      }

      var rim = contexts.map.createRadialGradient(size * .5, size * .48, size * .14, size * .5, size * .48, size * .76);
      rim.addColorStop(0, 'rgba(255, 163, 132, 0)');
      rim.addColorStop(.7, 'rgba(89, 12, 24, .02)');
      rim.addColorStop(1, 'rgba(20, 2, 9, .18)');
      contexts.map.fillStyle = rim;
      contexts.map.fillRect(0, 0, size, size);
      var bumpRim = contexts.bumpMap.createRadialGradient(size * .5, size * .48, size * .16, size * .5, size * .48, size * .78);
      bumpRim.addColorStop(0, '#858585');
      bumpRim.addColorStop(1, '#666666');
      contexts.bumpMap.fillStyle = bumpRim;
      contexts.bumpMap.fillRect(0, 0, size, size);
    });
  }

  function getSkinTextureSet(skin) {
    if (!skin || !skin.id) return null;
    if (diceSkinTextures[skin.id]) return diceSkinTextures[skin.id];
    var textureSet = null;
    if (skin.id === 'tavern-oak-brass') textureSet = { map: createTavernOakTexture() };
    if (skin.textureProfile === 'blood-oak') textureSet = createBloodOakTexture();
    if (skin.textureProfile === 'gilded-feast') textureSet = createGildedFeastTexture();
    if (skin.textureProfile === 'blue-enamel-gilt') textureSet = createBlueEnamelGiltTexture();
    if (skin.textureProfile === 'plumwood-lacquer') textureSet = createPlumwoodLacquerTexture();
    if (skin.textureProfile === 'celadon-glaze') textureSet = createCeladonGlazeTexture();
    if (skin.textureProfile === 'amber-glaze-mineral') textureSet = createAmberGlazeTexture();
    if (skin.textureProfile === 'mythic-crimson-seal') textureSet = createMythicCrimsonSealTexture();
    diceSkinTextures[skin.id] = textureSet;
    return textureSet;
  }

  // Cannon.js 0.6.x exposes impulse helpers but not applyTorque on Body.
  // Keep the torque impulse when the helper exists, and fall back to the
  // body's accumulated torque vector for older builds.
  function applyTorqueSafe(body, torque) {
    if (!body || !torque) return;
    if (typeof body.applyTorque === 'function') {
      body.applyTorque(torque);
      return;
    }
    if (!body.torque) return;
    body.torque.x += torque.x;
    body.torque.y += torque.y;
    body.torque.z += torque.z;
  }

  function createWoodTexture() {
    if (!global.document || !THREE_REF || typeof THREE_REF.CanvasTexture !== 'function') return null;
    var textureCanvas = global.document.createElement('canvas');
    textureCanvas.width = 256;
    textureCanvas.height = 256;
    var context = textureCanvas.getContext('2d');
    if (!context) return null;

    var base = context.createLinearGradient(0, 0, 256, 256);
    base.addColorStop(0, '#d7a55f');
    base.addColorStop(.45, '#b97a3e');
    base.addColorStop(1, '#875329');
    context.fillStyle = base;
    context.fillRect(0, 0, 256, 256);

    // Fine irregular grain keeps the material from reading as a flat plastic tile.
    for (var line = 0; line < 58; line += 1) {
      var origin = Math.random() * 256;
      context.beginPath();
      for (var x = -8; x <= 264; x += 8) {
        var y = origin + Math.sin(x * (.035 + Math.random() * .018) + line * 1.7) * (2 + Math.random() * 4) + x * (Math.random() - .5) * .018;
        if (x === -8) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.strokeStyle = line % 5 === 0 ? 'rgba(73, 35, 14, .22)' : 'rgba(91, 46, 19, .13)';
      context.lineWidth = line % 5 === 0 ? 1.7 : .8;
      context.stroke();
    }
    for (var knot = 0; knot < 4; knot += 1) {
      var knotX = 28 + Math.random() * 200;
      var knotY = 20 + Math.random() * 216;
      context.beginPath();
      context.ellipse(knotX, knotY, 5 + Math.random() * 8, 2 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      context.strokeStyle = 'rgba(61, 29, 12, .24)';
      context.lineWidth = 1.2;
      context.stroke();
    }
    var texture = new THREE_REF.CanvasTexture(textureCanvas);
    texture.wrapS = THREE_REF.RepeatWrapping;
    texture.wrapT = THREE_REF.RepeatWrapping;
    texture.repeat.set(1.1, 1.1);
    if ('encoding' in texture && THREE_REF.sRGBEncoding) texture.encoding = THREE_REF.sRGBEncoding;
    return texture;
  }

  function createTavernOakTexture() {
    if (!global.document || !THREE_REF || typeof THREE_REF.CanvasTexture !== 'function') return null;
    var textureCanvas = global.document.createElement('canvas');
    textureCanvas.width = 512;
    textureCanvas.height = 512;
    var context = textureCanvas.getContext('2d');
    if (!context) return null;

    var base = context.createLinearGradient(0, 0, 512, 512);
    base.addColorStop(0, '#4a2b19');
    base.addColorStop(.42, '#2e1a10');
    base.addColorStop(1, '#160d08');
    context.fillStyle = base;
    context.fillRect(0, 0, 512, 512);

    // The first skin is intentionally generated locally so it does not depend
    // on an external image: irregular dark-oak grain, small knots and worn
    // warm highlights make the material read as carved wood instead of plastic.
    for (var line = 0; line < 96; line += 1) {
      var origin = Math.random() * 512;
      var tilt = (Math.random() - .5) * .12;
      context.beginPath();
      for (var x = -20; x <= 532; x += 8) {
        var y = origin + Math.sin(x * (.018 + Math.random() * .008) + line * 1.37) * (3 + Math.random() * 8) + x * tilt;
        if (x === -20) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.strokeStyle = line % 7 === 0 ? 'rgba(184, 119, 60, .19)' : 'rgba(9, 5, 3, .24)';
      context.lineWidth = line % 7 === 0 ? 2.2 : .9;
      context.stroke();
    }

    for (var knot = 0; knot < 8; knot += 1) {
      var knotX = 35 + Math.random() * 442;
      var knotY = 28 + Math.random() * 456;
      var radiusX = 8 + Math.random() * 18;
      var radiusY = 3 + Math.random() * 8;
      for (var ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.ellipse(knotX, knotY, radiusX + ring * 5, radiusY + ring * 2, Math.random() * Math.PI, 0, Math.PI * 2);
        context.strokeStyle = ring === 0 ? 'rgba(8, 4, 2, .42)' : 'rgba(142, 85, 40, .18)';
        context.lineWidth = ring === 0 ? 2 : 1;
        context.stroke();
      }
    }

    for (var wear = 0; wear < 34; wear += 1) {
      var startX = Math.random() * 512;
      var startY = Math.random() * 512;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(startX + 7 + Math.random() * 24, startY + (Math.random() - .5) * 5);
      context.strokeStyle = 'rgba(225, 164, 91, .13)';
      context.lineWidth = .7 + Math.random() * .8;
      context.stroke();
    }

    var texture = new THREE_REF.CanvasTexture(textureCanvas);
    texture.wrapS = THREE_REF.RepeatWrapping;
    texture.wrapT = THREE_REF.RepeatWrapping;
    texture.repeat.set(1.15, 1.15);
    if ('encoding' in texture && THREE_REF.sRGBEncoding) texture.encoding = THREE_REF.sRGBEncoding;
    return texture;
  }

  function measureBoard() {
    var width = Math.max(1, (wrap ? wrap.clientWidth : 1) - frameInset * 2);
    var height = Math.max(1, (wrap ? wrap.clientHeight : 1) - frameInset * 2);
    var aspect = width / height;
    boardDepth = clamp(boardWidth / Math.max(.78, aspect * .96), 5.2, 11.5);
    lastMeasuredAspect = aspect;
  }

  function makeImpactAudio() {
    var context = null;
    var output = null;
    function ensureContext() {
      if (!context) {
        var AudioContextClass = global.AudioContext || global.webkitAudioContext;
        if (!AudioContextClass) return null;
        context = new AudioContextClass();
      }
      if (context.state === 'suspended') context.resume();
      return context;
    }
    function ensureOutput(audioContext) {
      if (output) return output;
      var bus = audioContext.createGain(); bus.gain.value = .94;
      if (audioContext.createDynamicsCompressor) {
        var compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -18;
        compressor.knee.value = 16;
        compressor.ratio.value = 3;
        compressor.attack.value = .003;
        compressor.release.value = .2;
        bus.connect(compressor).connect(audioContext.destination);
      } else bus.connect(audioContext.destination);
      output = bus;
      return output;
    }
    function play(intensity) {
      if (global.__diceAudioMuted) return;
      var audioContext = ensureContext();
      if (!audioContext) return;
      var baseForce = clamp(intensity, .08, 1);
      var stakeIntensity = clamp(Number(global.__diceAudioIntensity) || .9, .82, 1.3);
      var force = clamp(baseForce * stakeIntensity, .08, 1.2);
      var now = audioContext.currentTime;
      var buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * .13), audioContext.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      var source = audioContext.createBufferSource();
      source.buffer = buffer;
      var filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520 + force * 720;
      var gain = audioContext.createGain();
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.linearRampToValueAtTime(.08 + force * .2, now + .006);
      gain.gain.exponentialRampToValueAtTime(.0001, now + .15);
      source.connect(filter).connect(gain).connect(ensureOutput(audioContext));
      source.start(now);
      source.stop(now + .17);
      var oscillator = audioContext.createOscillator();
      var toneGain = audioContext.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(108 + Math.random() * 36, now);
      oscillator.frequency.exponentialRampToValueAtTime(58, now + .14);
      toneGain.gain.setValueAtTime(.0001, now);
      toneGain.gain.linearRampToValueAtTime(.04 + force * .08, now + .004);
      toneGain.gain.exponentialRampToValueAtTime(.0001, now + .15);
      oscillator.connect(toneGain).connect(ensureOutput(audioContext));
      oscillator.start(now);
      oscillator.stop(now + .17);
    }
    return play;
  }

  // A throttled, low-volume noise bed makes fast rolls and tabletop sliding
  // audible without spawning one continuous Web Audio source per die.
  function makeRollingAudio() {
    var context = null;
    var output = null;
    var nextAllowedTime = 0;
    function ensureContext() {
      if (!context) {
        var AudioContextClass = global.AudioContext || global.webkitAudioContext;
        if (!AudioContextClass) return null;
        context = new AudioContextClass();
      }
      if (context.state === 'suspended') context.resume();
      return context;
    }
    function ensureOutput(audioContext) {
      if (output) return output;
      var bus = audioContext.createGain(); bus.gain.value = .88;
      if (audioContext.createDynamicsCompressor) {
        var compressor = audioContext.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 14;
        compressor.ratio.value = 2.5;
        compressor.attack.value = .004;
        compressor.release.value = .18;
        bus.connect(compressor).connect(audioContext.destination);
      } else bus.connect(audioContext.destination);
      output = bus;
      return output;
    }
    function play(intensity) {
      if (global.__diceAudioMuted) return;
      var audioContext = ensureContext();
      if (!audioContext) return;
      var now = audioContext.currentTime;
      if (now < nextAllowedTime) return;
      nextAllowedTime = now + .055 + Math.random() * .045;
      var stakeIntensity = clamp(Number(global.__diceAudioIntensity) || .9, .82, 1.3);
      var force = clamp(intensity * stakeIntensity, .04, 1.2);
      var duration = .045 + force * .035;
      var buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * duration), audioContext.sampleRate);
      var data = buffer.getChannelData(0);
      for (var index = 0; index < data.length; index += 1) {
        var envelope = 1 - index / data.length;
        data[index] = (Math.random() * 2 - 1) * envelope;
      }
      var source = audioContext.createBufferSource();
      source.buffer = buffer;
      var filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 760 + force * 1150;
      var gain = audioContext.createGain();
      gain.gain.setValueAtTime(.0001, now);
      gain.gain.linearRampToValueAtTime(.008 + force * .035, now + .005);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      source.connect(filter).connect(gain).connect(ensureOutput(audioContext));
      source.start(now);
      source.stop(now + duration + .01);
    }
    return play;
  }

  var playImpact = makeImpactAudio();
  var playRolling = makeRollingAudio();

  function mythicPolygonShape(sides, outerRadius, innerRadius, rotation) {
    var shape = new THREE_REF.Shape();
    var points = innerRadius ? sides * 2 : sides;
    for (var index = 0; index < points; index += 1) {
      var radius = innerRadius && index % 2 ? innerRadius : outerRadius;
      var angle = (index / points) * Math.PI * 2 + (rotation || 0);
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      if (index === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }

  function mythicCircleShape(centerX, centerY, radius) {
    var shape = new THREE_REF.Shape();
    shape.absarc(centerX, centerY, radius, 0, Math.PI * 2, false);
    return shape;
  }

  function mythicRingShape(centerX, centerY, outerRadius, innerRadius) {
    var shape = new THREE_REF.Shape();
    shape.absarc(centerX, centerY, outerRadius, 0, Math.PI * 2, false);
    var hole = new THREE_REF.Path();
    hole.absarc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    return shape;
  }

  function createMythicPipGeometry(value) {
    if (!THREE_REF || !THREE_REF.ShapeGeometry) return null;
    if (mythicPipGeometries[value]) return mythicPipGeometries[value];
    var shapes;
    if (value === 1) {
      // A single wax-seal diamond.
      shapes = [mythicPolygonShape(4, .06, 0, Math.PI / 4)];
    } else if (value === 2) {
      // Two linked iron rings.
      shapes = [mythicRingShape(-.026, 0, .024, .012), mythicRingShape(.026, 0, .024, .012)];
    } else if (value === 3) {
      // A small three-leaf scroll mark.
      shapes = [
        mythicCircleShape(0, .026, .021),
        mythicCircleShape(-.026, -.018, .021),
        mythicCircleShape(.026, -.018, .021)
      ];
    } else if (value === 4) {
      // Four-petal tavern rosette.
      shapes = [mythicPolygonShape(8, .057, .027, Math.PI / 8)];
    } else if (value === 5) {
      // Five-point spur flower.
      shapes = [mythicPolygonShape(10, .06, .026, -Math.PI / 2)];
    } else {
      // Six-rayed kingdom wheel.
      shapes = [mythicPolygonShape(12, .06, .032, -Math.PI / 2)];
    }
    var geometry;
    if (THREE_REF.ExtrudeGeometry) {
      geometry = new THREE_REF.ExtrudeGeometry(shapes, {
        depth: .006,
        steps: 1,
        bevelEnabled: true,
        bevelSegments: 1,
        bevelSize: .0012,
        bevelThickness: .0012,
        curveSegments: 6
      });
      geometry.translate(0, 0, -.003);
    } else {
      geometry = new THREE_REF.ShapeGeometry(shapes);
    }
    geometry.computeVertexNormals();
    mythicPipGeometries[value] = geometry;
    return geometry;
  }

  function addFacePips(group, axis, sign, value) {
    facePips[value].forEach(function (position) {
      var row = Math.floor(position / 3);
      var column = position % 3;
      var u = (column - 1) * .2;
      var v = (1 - row) * .2;
      // Keep pips as true planes instead of rounded beads.  A circle mesh with
      // double-sided shading reads like a painted or shallowly carved mark and
      // avoids the raised specular highlight that made the old spheres look
      // glued onto the die face.
      var pip = new THREE_REF.Mesh(
        new THREE_REF.CircleGeometry(.066, 20),
        new THREE_REF.MeshStandardMaterial({ color: 0x422512, roughness: .98, metalness: 0, side: THREE_REF.DoubleSide })
      );
      pip.userData.isDiePip = true;
      pip.userData.diePipValue = value;
      pip.userData.diePipPosition = position;
      pip.userData.defaultGeometry = pip.geometry;
      // CircleGeometry's normal points along +Z. Rotate it onto each face and
      // flip for the negative side so lighting remains consistent.
      if (axis === 'y') { pip.position.set(u, sign * .391, v); pip.rotation.x = sign > 0 ? -Math.PI / 2 : Math.PI / 2; }
      if (axis === 'z') { pip.position.set(u, v, sign * .391); pip.rotation.y = sign > 0 ? 0 : Math.PI; }
      if (axis === 'x') { pip.position.set(sign * .391, v, u); pip.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2; }
      // A planar inlay should not cast a separate blob shadow.
      pip.castShadow = false;
      pip.receiveShadow = false;
      group.add(pip);
    });
  }

  function createRoundedDieGeometry() {
    if (roundedDieGeometry || !THREE_REF) return roundedDieGeometry;

    // A hand-built rounded rectangle keeps the silhouette soft even when the
    // camera is close, while ExtrudeGeometry's bevel softens the front/back
    // rims as well.  The resulting .78 cube matches the previous BoxGeometry
    // dimensions, so pip offsets and the physical body need no adjustment.
    var size = .78;
    // ExtrudeGeometry grows the silhouette by bevelSize / bevelThickness.
    // Start slightly smaller so the final rounded mesh remains the same .78
    // dimensions as the Cannon collision box.
    var bevelSize = .045;
    var bevelThickness = .045;
    var half = size / 2 - bevelSize;
    var radius = .10;
    var shape = new THREE_REF.Shape();
    shape.moveTo(-half + radius, -half);
    shape.lineTo(half - radius, -half);
    shape.quadraticCurveTo(half, -half, half, -half + radius);
    shape.lineTo(half, half - radius);
    shape.quadraticCurveTo(half, half, half - radius, half);
    shape.lineTo(-half + radius, half);
    shape.quadraticCurveTo(-half, half, -half, half - radius);
    shape.lineTo(-half, -half + radius);
    shape.quadraticCurveTo(-half, -half, -half + radius, -half);

    roundedDieGeometry = new THREE_REF.ExtrudeGeometry(shape, {
      depth: size - bevelThickness * 2,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: bevelSize,
      bevelThickness: bevelThickness,
      curveSegments: 8
    });
    // ExtrudeGeometry starts at z=0 (and bevels extend by bevelThickness on
    // either end); center the complete depth around the die origin so the
    // existing face normals, pips and target quaternions remain aligned.
    roundedDieGeometry.translate(0, 0, -(size - bevelThickness * 2) / 2);
    roundedDieGeometry.computeVertexNormals();
    return roundedDieGeometry;
  }

  function addEdgeRails(group, material, thickness, offset, span) {
    var signs = [-1, 1];
    signs.forEach(function (ySign) {
      signs.forEach(function (zSign) {
        var xRail = new THREE_REF.Mesh(new THREE_REF.BoxGeometry(span, thickness, thickness), material);
        xRail.position.set(0, ySign * offset, zSign * offset);
        group.add(xRail);
        var yRail = new THREE_REF.Mesh(new THREE_REF.BoxGeometry(thickness, span, thickness), material);
        yRail.position.set(ySign * offset, 0, zSign * offset);
        group.add(yRail);
        var zRail = new THREE_REF.Mesh(new THREE_REF.BoxGeometry(thickness, thickness, span), material);
        zRail.position.set(ySign * offset, zSign * offset, 0);
        group.add(zRail);
      });
    });
  }

  function addCornerRivets(group, material, radius) {
    var geometry = new THREE_REF.SphereGeometry(radius, 8, 6);
    [-1, 1].forEach(function (xSign) {
      [-1, 1].forEach(function (ySign) {
        [-1, 1].forEach(function (zSign) {
          var rivet = new THREE_REF.Mesh(geometry, material);
          rivet.position.set(xSign * .368, ySign * .368, zSign * .368);
          group.add(rivet);
        });
      });
    });
  }

  var carvedPetalGeometry;
  function createCarvedPetalGeometry() {
    if (carvedPetalGeometry || !THREE_REF) return carvedPetalGeometry;
    var shape = new THREE_REF.Shape();
    var points = 16;
    for (var point = 0; point <= points; point += 1) {
      var angle = point / points * Math.PI * 2 - Math.PI / 2;
      // The relief is deliberately larger than a pip so it reads as a
      // hand-carved ceramic ornament instead of a random speck at table view.
      var radius = point % 2 === 0 ? .055 : .031;
      var x = Math.cos(angle) * radius;
      var y = Math.sin(angle) * radius;
      if (point === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
    }
    carvedPetalGeometry = new THREE_REF.ExtrudeGeometry(shape, {
      depth: .008,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: .002,
      bevelThickness: .002,
      curveSegments: 4
    });
    carvedPetalGeometry.translate(0, 0, -.004);
    return carvedPetalGeometry;
  }

  function addCeladonEdgeRelief(group, material) {
    if (!group || !material || !THREE_REF) return;
    // Two non-metallic ceramic passes make a raised guard: a darker glazed
    // undercut, then a narrow pale ridge catching the candle light. This is
    // geometry in addition to the Canvas texture, so the edge remains legible
    // when a face is viewed obliquely or the texture is minified.
    var undercut = material.clone();
    undercut.color.set('#315f5b');
    undercut.roughness = .42;
    undercut.metalness = .015;
    addEdgeRails(group, undercut, .052, .362, .67);

    var ridge = material.clone();
    ridge.color.set('#83a99c');
    ridge.roughness = .26;
    ridge.metalness = .01;
    addEdgeRails(group, ridge, .014, .386, .61);

    // Place larger lotus seals directly on the four raised borders of each
    // face. The Canvas scrollwork remains the fine engraving; these shallow
    // seals are the readable, physical landmark that survives minification.
    var sourceGeometry = createCarvedPetalGeometry();
    if (!sourceGeometry) return;
    var shadow = material.clone();
    shadow.color.set('#315f5b');
    shadow.roughness = .44;
    shadow.metalness = .01;
    var highlight = material.clone();
    highlight.color.set('#a7c8b8');
    highlight.roughness = .24;
    highlight.metalness = .01;
    var faceDefs = [
      { axis: 'y', sign: 1, rotation: [-Math.PI / 2, 0, 0] },
      { axis: 'y', sign: -1, rotation: [Math.PI / 2, 0, 0] },
      { axis: 'z', sign: 1, rotation: [0, 0, 0] },
      { axis: 'z', sign: -1, rotation: [0, Math.PI, 0] },
      { axis: 'x', sign: 1, rotation: [0, Math.PI / 2, 0] },
      { axis: 'x', sign: -1, rotation: [0, -Math.PI / 2, 0] }
    ];
    var edgeMarks = [[0, -.352], [0, .352], [-.352, 0], [.352, 0]];
    faceDefs.forEach(function (face) {
      edgeMarks.forEach(function (mark) {
        function place(targetMaterial, outward) {
          var petal = new THREE_REF.Mesh(sourceGeometry.clone(), targetMaterial);
          var u = mark[0];
          var v = mark[1];
          if (face.axis === 'y') petal.position.set(u, face.sign * (.389 + outward), v);
          if (face.axis === 'z') petal.position.set(u, v, face.sign * (.389 + outward));
          if (face.axis === 'x') petal.position.set(face.sign * (.389 + outward), v, u);
          petal.rotation.set(face.rotation[0], face.rotation[1], face.rotation[2]);
          group.add(petal);
        }
        place(shadow, 0);
        place(highlight, .006);
      });
    });
  }

  function addCeladonFaceRelief(group, material) {
    var sourceGeometry = createCarvedPetalGeometry();
    if (!sourceGeometry) return;
    var centers = [-.29, .29];
    var faces = [
      { axis: 'y', sign: 1, rotation: [-Math.PI / 2, 0, 0] },
      { axis: 'y', sign: -1, rotation: [Math.PI / 2, 0, 0] },
      { axis: 'z', sign: 1, rotation: [0, 0, 0] },
      { axis: 'z', sign: -1, rotation: [0, Math.PI, 0] },
      { axis: 'x', sign: 1, rotation: [0, Math.PI / 2, 0] },
      { axis: 'x', sign: -1, rotation: [0, -Math.PI / 2, 0] }
    ];
    faces.forEach(function (face) {
      centers.forEach(function (first) {
        centers.forEach(function (second) {
          var petal = new THREE_REF.Mesh(sourceGeometry.clone(), material);
          if (face.axis === 'y') petal.position.set(first, face.sign * .378, second);
          if (face.axis === 'z') petal.position.set(first, second, face.sign * .378);
          if (face.axis === 'x') petal.position.set(face.sign * .378, second, first);
          petal.rotation.set(face.rotation[0], face.rotation[1], face.rotation[2]);
          group.add(petal);
        });
      });
    });
  }

  var vineLeafGeometry;
  function createVineLeafGeometry() {
    if (vineLeafGeometry || !THREE_REF) return vineLeafGeometry;
    var shape = new THREE_REF.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(.025, .021, .052, 0);
    shape.quadraticCurveTo(.025, -.021, 0, 0);
    vineLeafGeometry = new THREE_REF.ExtrudeGeometry(shape, {
      depth: .008,
      steps: 1,
      bevelEnabled: true,
      bevelSegments: 1,
      bevelSize: .002,
      bevelThickness: .002,
      curveSegments: 4
    });
    vineLeafGeometry.translate(0, 0, -.004);
    return vineLeafGeometry;
  }

  function addOpenVineRelief(group, material) {
    if (!group || !material || !THREE_REF || typeof THREE_REF.TubeGeometry !== 'function') return;
    var shadow = material.clone();
    shadow.color.set('#514b43');
    shadow.roughness = .44;
    shadow.metalness = .54;
    var highlight = material.clone();
    highlight.color.set('#c2b8a5');
    highlight.roughness = .24;
    highlight.metalness = .7;
    var leafGeometry = createVineLeafGeometry();
    var faces = [
      { axis: 'y', sign: 1 }, { axis: 'y', sign: -1 },
      { axis: 'z', sign: 1 }, { axis: 'z', sign: -1 },
      { axis: 'x', sign: 1 }, { axis: 'x', sign: -1 }
    ];
    var motifs = [
      { cornerX: -1, cornerY: -1, mirror: 1 },
      { cornerX: 1, cornerY: 1, mirror: -1 }
    ];

    function facePoint(face, u, v, outward) {
      var normal = .392 + outward;
      if (face.axis === 'y') return new THREE_REF.Vector3(u, face.sign * normal, v);
      if (face.axis === 'z') return new THREE_REF.Vector3(u, v, face.sign * normal);
      return new THREE_REF.Vector3(face.sign * normal, v, u);
    }
    function addTube(face, points, targetMaterial) {
      var curve = new THREE_REF.CatmullRomCurve3(points);
      var geometry = new THREE_REF.TubeGeometry(curve, 18, .007, 5, false);
      group.add(new THREE_REF.Mesh(geometry, targetMaterial));
    }
    function addLeaf(face, u, v, rotation, targetMaterial, outward) {
      if (!leafGeometry) return;
      var leaf = new THREE_REF.Mesh(leafGeometry.clone(), targetMaterial);
      var point = facePoint(face, u, v, outward);
      leaf.position.copy(point);
      if (face.axis === 'y') leaf.rotation.set(face.sign > 0 ? -Math.PI / 2 : Math.PI / 2, 0, rotation);
      if (face.axis === 'z') leaf.rotation.set(0, face.sign > 0 ? 0 : Math.PI, rotation);
      if (face.axis === 'x') leaf.rotation.set(0, face.sign > 0 ? Math.PI / 2 : -Math.PI / 2, rotation);
      group.add(leaf);
    }

    faces.forEach(function (face) {
      motifs.forEach(function (motif) {
        var sx = motif.cornerX;
        var sy = motif.cornerY;
        var u0 = sx * .335;
        var v0 = sy * .335;
        var points2d = [
          [u0, v0],
          [sx * .285, sy * .285],
          [sx * .255, sy * .215],
          [sx * .19, sy * .16],
          [sx * .115, sy * .12]
        ];
        var shadowPoints = points2d.map(function (point) { return facePoint(face, point[0], point[1], 0); });
        var highlightPoints = points2d.map(function (point) { return facePoint(face, point[0], point[1], .006); });
        addTube(face, shadowPoints, shadow);
        addTube(face, highlightPoints, highlight);
        addLeaf(face, sx * .265, sy * .23, motif.mirror * .55, shadow, 0);
        addLeaf(face, sx * .265, sy * .23, motif.mirror * .55, highlight, .006);
        addLeaf(face, sx * .185, sy * .15, motif.mirror * -.8, shadow, 0);
        addLeaf(face, sx * .185, sy * .15, motif.mirror * -.8, highlight, .006);
      });
    });
  }

  function addCrimsonCopperSealRelief(group, material) {
    if (!group || !material || !THREE_REF) return;
    // The mythic skin no longer reuses the straight rail + round rivet recipe
    // from the other premium skins. It uses an inset copper channel, short
    // edge clasps and faceted seal plates so the border reads as a piece of
    // hand-fitted heraldic hardware rather than a generic metal hoop.
    var undercut = material.clone();
    undercut.color.set('#321017');
    undercut.roughness = .5;
    undercut.metalness = .48;
    addEdgeRails(group, undercut, .024, .365, .67);

    var channel = material.clone();
    channel.color.set('#5e2828');
    channel.roughness = .36;
    channel.metalness = .7;
    addEdgeRails(group, channel, .012, .379, .64);

    var ridge = material.clone();
    ridge.color.set('#ae5c49');
    ridge.roughness = .26;
    ridge.metalness = .84;
    addEdgeRails(group, ridge, .006, .392, .54);

    function orientAlongAxis(object, axis) {
      if (axis === 'x') object.rotation.z = Math.PI / 2;
      if (axis === 'z') object.rotation.x = Math.PI / 2;
    }
    function edgePosition(axis, firstSign, secondSign, offset) {
      if (axis === 'x') return new THREE_REF.Vector3(0, firstSign * offset, secondSign * offset);
      if (axis === 'y') return new THREE_REF.Vector3(firstSign * offset, 0, secondSign * offset);
      return new THREE_REF.Vector3(firstSign * offset, secondSign * offset, 0);
    }

    var claspShadow = material.clone();
    claspShadow.color.set('#351217');
    claspShadow.roughness = .48;
    claspShadow.metalness = .52;
    var claspMetal = material.clone();
    claspMetal.color.set('#c27458');
    claspMetal.roughness = .23;
    claspMetal.metalness = .9;
    var claspInset = material.clone();
    claspInset.color.set('#582124');
    claspInset.roughness = .38;
    claspInset.metalness = .68;

    // Twelve short octagonal clasps interrupt the continuous lines. Each is
    // made from a dark undercut, a copper cap and a recessed centre so the
    // light breaks across the border in three distinct planes.
    ['x', 'y', 'z'].forEach(function (axis) {
      [-1, 1].forEach(function (firstSign) {
        [-1, 1].forEach(function (secondSign) {
          var claspCenter = edgePosition(axis, firstSign, secondSign, .379);
          var shadow = new THREE_REF.Mesh(new THREE_REF.CylinderGeometry(.034, .034, .034, 8), claspShadow);
          orientAlongAxis(shadow, axis);
          shadow.position.copy(claspCenter);
          group.add(shadow);

          var cap = new THREE_REF.Mesh(new THREE_REF.CylinderGeometry(.028, .028, .04, 8), claspMetal);
          orientAlongAxis(cap, axis);
          cap.position.copy(claspCenter);
          group.add(cap);

          var inset = new THREE_REF.Mesh(new THREE_REF.CylinderGeometry(.014, .014, .042, 8), claspInset);
          orientAlongAxis(inset, axis);
          inset.position.copy(claspCenter);
          group.add(inset);

          var ring = new THREE_REF.Mesh(new THREE_REF.TorusGeometry(.022, .0038, 6, 8), claspMetal);
          orientAlongAxis(ring, axis);
          ring.position.copy(claspCenter);
          group.add(ring);
        });
      });
    });

    // Faceted corner plates replace the old spherical rivets. The dark plate
    // sits under the copper plate by a few thousandths, creating a carved
    // shadow edge while keeping the silhouette compact.
    var cornerShadow = material.clone();
    cornerShadow.color.set('#321017');
    cornerShadow.roughness = .5;
    cornerShadow.metalness = .48;
    var cornerMetal = material.clone();
    cornerMetal.color.set('#a95645');
    cornerMetal.roughness = .27;
    cornerMetal.metalness = .82;
    [-1, 1].forEach(function (xSign) {
      [-1, 1].forEach(function (ySign) {
        [-1, 1].forEach(function (zSign) {
          var position = new THREE_REF.Vector3(xSign * .372, ySign * .372, zSign * .372);
          var shadowPlate = new THREE_REF.Mesh(new THREE_REF.OctahedronGeometry(.037, 0), cornerShadow);
          shadowPlate.position.copy(position);
          shadowPlate.scale.set(1.08, 1.08, 1.08);
          group.add(shadowPlate);
          var plate = new THREE_REF.Mesh(new THREE_REF.OctahedronGeometry(.027, 0), cornerMetal);
          plate.position.copy(position);
          group.add(plate);
        });
      });
    });
  }

  function createSkinDetailGroup(skin, record) {
    if (!skin || !skin.detailStyle || !THREE_REF) return null;
    var group = new THREE_REF.Group();
    var material = new THREE_REF.MeshStandardMaterial({
      color: skin.detailColor || '#77736d',
      roughness: Number.isFinite(Number(skin.detailRoughness)) ? Number(skin.detailRoughness) : .4,
      metalness: Number.isFinite(Number(skin.detailMetalness)) ? Number(skin.detailMetalness) : .75
    });
    group.name = 'die-skin-details-' + skin.id;
    if (skin.detailStyle === 'iron-edge') {
      addEdgeRails(group, material, .027, .36, .64);
      addCornerRivets(group, material, .034);
    }
    if (skin.detailStyle === 'gold-edge') {
      addEdgeRails(group, material, .019, .368, .63);
      addCornerRivets(group, material, .026);
    }
    if (skin.detailStyle === 'gilt-filigree') {
      addEdgeRails(group, material, .014, .369, .62);
      addCornerRivets(group, material, .022);
    }
    if (skin.detailStyle === 'pewter-edge') {
      addEdgeRails(group, material, .012, .369, .62);
      addCornerRivets(group, material, .02);
    }
    if (skin.detailStyle === 'carved-celadon') {
      addCeladonEdgeRelief(group, material);
      addCeladonFaceRelief(group, material);
    }
    if (skin.detailStyle === 'pewter-vine-open') addOpenVineRelief(group, material);
    if (skin.detailStyle === 'bronze-corner-rivets') {
      // Amber is a smooth mineral body, so use sparse hand-set corner pins
      // instead of a continuous hoop or geometric border.
      addCornerRivets(group, material, .03);
    }
    if (skin.detailStyle === 'crimson-copper-seal') addCrimsonCopperSealRelief(group, material);
    group.traverse(function (child) {
      child.userData.dieRecord = record;
      child.userData.isDieDetail = true;
      child.castShadow = true;
      child.receiveShadow = true;
    });
    return group;
  }

  function disposeSkinDetailGroup(group) {
    if (!group) return;
    var geometries = [];
    var materials = [];
    group.traverse(function (child) {
      if (child.geometry && geometries.indexOf(child.geometry) < 0) geometries.push(child.geometry);
      if (child.material && materials.indexOf(child.material) < 0) materials.push(child.material);
    });
    geometries.forEach(function (geometry) { geometry.dispose(); });
    materials.forEach(function (material) { material.dispose(); });
  }

  function createDieMesh(record) {
    var group = new THREE_REF.Group();
    if (!woodTexture) woodTexture = createWoodTexture();
    var DieMaterial = THREE_REF.MeshPhysicalMaterial || THREE_REF.MeshStandardMaterial;
    var cube = new THREE_REF.Mesh(
      createRoundedDieGeometry(),
      new DieMaterial({ color: 0xc68a4b, map: woodTexture, roughness: .82, metalness: 0, clearcoat: 0, clearcoatRoughness: .28, reflectivity: .28, emissive: 0x000000, emissiveIntensity: 0 })
    );
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.userData.dieRecord = record;
    group.add(cube);
    addFacePips(group, 'y', 1, 1);
    addFacePips(group, 'y', -1, 6);
    addFacePips(group, 'z', 1, 2);
    addFacePips(group, 'z', -1, 5);
    addFacePips(group, 'x', 1, 3);
    addFacePips(group, 'x', -1, 4);
    group.traverse(function (child) {
      child.userData.dieRecord = record;
      child.castShadow = true;
    });
    group.renderOrder = 2;
    group.visible = false;
    record.mesh = group;
    record.cube = cube;
    record.baseColor = cube.material.color.clone();
    record.detailGroup = null;
    scene.add(group);
    return group;
  }

  function applySkin(skin, owner) {
    if (!skin || !THREE_REF) return;
    var targetOwner = owner || 'player';
    activePlayerSkin = targetOwner === 'player' ? skin : activePlayerSkin;
    ensureRecords(targetOwner).forEach(function (record) {
      if (!record.mesh || !record.cube) return;
      if (record.detailGroup) {
        record.mesh.remove(record.detailGroup);
        disposeSkinDetailGroup(record.detailGroup);
        record.detailGroup = null;
      }
      var cubeMaterial = record.cube.material;
      if (!cubeMaterial) return;
      var textureSet = skin.id === 'default' ? { map: woodTexture } : getSkinTextureSet(skin);
      cubeMaterial.roughness = Number.isFinite(Number(skin.roughness)) ? Number(skin.roughness) : .82;
      cubeMaterial.metalness = Number.isFinite(Number(skin.metalness)) ? Number(skin.metalness) : 0;
      cubeMaterial.map = textureSet?.map || null;
      cubeMaterial.bumpMap = textureSet?.bumpMap || null;
      cubeMaterial.bumpScale = textureSet?.bumpMap ? (Number.isFinite(Number(skin.bumpScale)) ? Number(skin.bumpScale) : skin.id === 'gilded-feast' ? .045 : .055) : 0;
      cubeMaterial.roughnessMap = textureSet?.roughnessMap || null;
      cubeMaterial.metalnessMap = textureSet?.metalnessMap || null;
      if ('clearcoat' in cubeMaterial) {
        cubeMaterial.clearcoat = skin.textureProfile === 'celadon-glaze' ? .34 : skin.textureProfile === 'amber-glaze-mineral' ? .38 : skin.textureProfile === 'mythic-crimson-seal' ? .3 : 0;
        cubeMaterial.clearcoatRoughness = skin.textureProfile === 'celadon-glaze' ? .24 : skin.textureProfile === 'amber-glaze-mineral' ? .2 : skin.textureProfile === 'mythic-crimson-seal' ? .2 : .28;
        cubeMaterial.reflectivity = skin.textureProfile === 'celadon-glaze' ? .3 : skin.textureProfile === 'amber-glaze-mineral' ? .36 : skin.textureProfile === 'mythic-crimson-seal' ? .3 : .28;
      }
      if (skin.id === 'default' && woodTexture) {
        cubeMaterial.color.set(skin.bodyColor || 0xc68a4b);
      } else if (cubeMaterial.map && skin.textureProfile === 'celadon-glaze') {
        // Tint the Canvas map slightly instead of multiplying it by pure
        // white; this preserves the deep jade body under the candle's hot
        // specular highlight.
        cubeMaterial.color.set('#a6c5b6');
      } else cubeMaterial.color.set(cubeMaterial.map ? 0xffffff : (skin.bodyColor || 0xc68a4b));
      record.baseColor = cubeMaterial.color.clone();
      cubeMaterial.needsUpdate = true;
      record.mesh.traverse(function (child) {
        if (!child.userData || !child.userData.isDiePip || !child.material) return;
        var useMythicSymbols = skin.pipStyle === 'mythic-symbols';
        var targetGeometry = useMythicSymbols
          ? createMythicPipGeometry(child.userData.diePipValue)
          : child.userData.defaultGeometry;
        if (targetGeometry && child.geometry !== targetGeometry) child.geometry = targetGeometry;
        child.material.color.set(skin.pipColor || 0x422512);
        child.material.roughness = Number.isFinite(Number(skin.pipRoughness)) ? Number(skin.pipRoughness) : .78;
        child.material.metalness = Number.isFinite(Number(skin.pipMetalness)) ? Number(skin.pipMetalness) : 0;
        if ('emissive' in child.material) {
          child.material.emissive.set(useMythicSymbols ? '#2b080f' : '#000000');
          child.material.emissiveIntensity = useMythicSymbols ? .08 : 0;
        }
        child.material.needsUpdate = true;
      });
      record.detailGroup = createSkinDetailGroup(skin, record);
      if (record.detailGroup) record.mesh.add(record.detailGroup);
      applyDieVisualState(record, global.performance ? global.performance.now() : Date.now());
    });
  }

  function createShadowFloor() {
    if (!scene || !THREE_REF) return;
    if (shadowFloor) {
      scene.remove(shadowFloor);
      shadowFloor.geometry.dispose();
      shadowFloor.material.dispose();
    }
    shadowFloor = new THREE_REF.Mesh(
      new THREE_REF.PlaneGeometry(boardWidth, boardDepth),
      new THREE_REF.ShadowMaterial({ color: 0x000000, opacity: 0.4, transparent: true })
    );
    shadowFloor.name = 'realtime-contact-shadow-floor';
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = .002;
    shadowFloor.receiveShadow = true;
    shadowFloor.renderOrder = 0;
    scene.add(shadowFloor);
  }

  function createWorld() {
    world = new CANNON_REF.World();
    world.gravity.set(0, -25, 0);
    world.broadphase = new CANNON_REF.NaiveBroadphase();
    world.solver.iterations = 12;
    world.allowSleep = true;
    groundMaterial = new CANNON_REF.Material('invisible-tabletop');
    dieMaterial = new CANNON_REF.Material('bone-die');
    world.addContactMaterial(new CANNON_REF.ContactMaterial(groundMaterial, dieMaterial, { friction: .5, restitution: .3 }));
    world.addContactMaterial(new CANNON_REF.ContactMaterial(dieMaterial, dieMaterial, { friction: .5, restitution: .3 }));

    var halfWidth = boardWidth / 2;
    var halfDepth = boardDepth / 2;
    var ground = new CANNON_REF.Body({ mass: 0, material: groundMaterial });
    ground.addShape(new CANNON_REF.Box(new CANNON_REF.Vec3(halfWidth, .08, halfDepth)));
    ground.position.set(0, -.08, 0);
    world.addBody(ground);

    var wallThickness = .14;
    // Invisible walls extend above the highest throw arc so a strong bounce
    // cannot clear the board and leave the visible table.
    var wallHeight = 3.5;
    var walls = [
      { position: [halfWidth + wallThickness, wallHeight, 0], size: [wallThickness, wallHeight, halfDepth + wallThickness] },
      { position: [-halfWidth - wallThickness, wallHeight, 0], size: [wallThickness, wallHeight, halfDepth + wallThickness] },
      { position: [0, wallHeight, halfDepth + wallThickness], size: [halfWidth + wallThickness, wallHeight, wallThickness] },
      { position: [0, wallHeight, -halfDepth - wallThickness], size: [halfWidth + wallThickness, wallHeight, wallThickness] }
    ];
    walls.forEach(function (wall) {
      var body = new CANNON_REF.Body({ mass: 0, material: groundMaterial });
      body.addShape(new CANNON_REF.Box(new CANNON_REF.Vec3(wall.size[0], wall.size[1], wall.size[2])));
      body.position.set(wall.position[0], wall.position[1], wall.position[2]);
      world.addBody(body);
    });
  }

  function getRecord(owner, index) {
    var list = diceByOwner[owner] || diceByOwner.player;
    return list[index] || null;
  }

  function ensureRecords(owner) {
    var list = diceByOwner[owner];
    if (!list.length) {
      for (var index = 0; index < DICE_COUNT; index += 1) {
        var record = {
          id: owner + '-' + index,
          owner: owner,
          index: index,
          value: 1,
          targetValue: 1,
          yaw: 0,
          body: null,
          mesh: null,
          cube: null,
          locked: false,
          rolling: false,
          visible: false,
          settleTime: 0,
          finalized: false,
          settleCorrection: null,
          landingQuaternion: null,
          landingPrepared: false,
          bounceCount: 0,
          tween: null,
          pendingLocked: null,
          hovered: false,
          selectionPulseStart: 0,
          baseColor: null
        };
        createDieMesh(record);
        list.push(record);
      }
    }
    return list;
  }

  function removeBody(record) {
    if (record.body && world) world.removeBody(record.body);
    record.body = null;
    var activeIndex = rollingDice.indexOf(record);
    if (activeIndex >= 0) rollingDice.splice(activeIndex, 1);
    record.rolling = false;
  }

  function clearRecord(record, hide) {
    removeBody(record);
    record.locked = false;
    record.tween = null;
    record.pendingLocked = null;
    record.selectionPulseStart = 0;
    record.settleTime = 0;
    record.finalized = false;
    record.settleCorrection = null;
    record.landingQuaternion = null;
    record.landingPrepared = false;
    record.bounceCount = 0;
    setHover(record, false);
    if (hide && record.mesh) {
      record.mesh.visible = false;
      record.visible = false;
    }
  }

  function clearOwner(owner, hide) {
    ensureRecords(owner).forEach(function (record) { clearRecord(record, hide !== false); });
  }

  function getRestPosition(record) {
    // Seven dice sit in a compact 4+3 arrangement so the extra heat-die slot
    // remains readable without squeezing the board edges.
    var isTopRow = record.index < 4;
    var col = isTopRow ? record.index : record.index - 4;
    var row = isTopRow ? 0 : 1;
    var rowCenter = isTopRow ? 1.5 : 1;
    var x = (col - rowCenter) * .94;
    var z = record.owner === 'player' ? .72 + row * .5 : -.72 - row * .5;
    return new THREE_REF.Vector3(x, .43, z);
  }

  function setHover(record, active) {
    if (!record || !record.cube) return;
    record.hovered = active;
    applyDieVisualState(record, global.performance ? global.performance.now() : Date.now());
  }

  function applyDieVisualState(record, now) {
    if (!record || !record.cube || !record.mesh) return;
    var material = record.cube.material;
    if (!record.baseColor) record.baseColor = material.color.clone();
    var baseColor = record.baseColor;
    var isPlayerDie = record.owner === 'player';
    var isVisibleRestingDie = record.mesh.visible && record.visible && !record.rolling;
    var dimFactor = isPlayerDie && isVisibleRestingDie && !record.locked && !record.hovered ? .7 : 1;
    material.color.copy(baseColor);
    if (dimFactor !== 1) material.color.multiplyScalar(dimFactor);
    if (record.locked) {
      var pulseElapsed = record.selectionPulseStart ? Math.max(0, now - record.selectionPulseStart) : 0;
      var pulse = .5 + .5 * Math.sin(pulseElapsed / 150 * Math.PI * 2);
      material.emissive.set(0xd39b42);
      material.emissiveIntensity = .27 + pulse * .22;
    } else if (record.hovered && isPlayerDie) {
      material.emissive.set(0xc99745);
      material.emissiveIntensity = .48;
    } else {
      material.emissive.set(0x000000);
      material.emissiveIntensity = 0;
    }
  }

  function findHitRecord(event) {
    if (!renderer || !camera || !raycaster) return null;
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    var objects = [];
    ensureRecords('player').forEach(function (record) {
      if (record.mesh && record.mesh.visible && !record.rolling) objects.push(record.mesh);
    });
    var intersections = raycaster.intersectObjects(objects, true);
    for (var index = 0; index < intersections.length; index += 1) {
      var node = intersections[index].object;
      while (node && !node.userData.dieRecord) node = node.parent;
      if (node && node.userData.dieRecord && node.userData.dieRecord.owner === 'player') return node.userData.dieRecord;
    }
    return null;
  }

  function handlePointerMove(event) {
    if (event.cancelable) event.preventDefault();
    var record = findHitRecord(event);
    if (record !== hoveredRecord) {
      setHover(hoveredRecord, false);
      hoveredRecord = record;
      setHover(hoveredRecord, true);
    }
    canvas.style.cursor = record ? 'pointer' : (pointerState ? 'grabbing' : 'default');
    if (pointerState) {
      var dx = event.clientX - pointerState.x;
      var dy = event.clientY - pointerState.y;
      if (Math.hypot(dx, dy) > 6) pointerState.dragged = true;
    }
  }

  function handlePointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (event.cancelable) event.preventDefault();
    var record = findHitRecord(event);
    pointerState = { x: event.clientX, y: event.clientY, record: record, dragged: false };
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = record ? 'grabbing' : 'grabbing';
  }

  function handlePointerUp(event) {
    if (event.cancelable) event.preventDefault();
    if (!pointerState) return;
    var start = pointerState;
    pointerState = null;
    var dx = event.clientX - start.x;
    var dy = event.clientY - start.y;
    if (start.dragged || Math.hypot(dx, dy) > 6) {
      canvas.style.cursor = 'default';
      dragHandler(clamp(dx / 90, -1.4, 1.4), clamp(dy / 90, -1.4, 1.4));
      return;
    }
    if (start.record && !start.record.rolling) {
      if (start.record.locked) unlockRecord(start.record, true);
      else lockRecord(start.record, true);
    }
    handlePointerMove(event);
  }

  function handlePointerCancel(event) {
    if (event && event.cancelable) event.preventDefault();
    pointerState = null;
    canvas.style.cursor = 'default';
  }

  function lockRecord(record, notify) {
    if (!record || (notify && record.owner !== 'player') || record.locked || record.rolling || !record.mesh.visible) return false;
    if (notify && selectionHandler(record.id, record.value) === false) return false;
    removeBody(record);
    record.locked = true;
    record.finalized = true;
    record.selectionPulseStart = global.performance ? global.performance.now() : Date.now();
    // Keep a scored die visible while the current turn is still unresolved so
    // the player can inspect the held selection. resetOwner() clears it when
    // the score is actually banked or the turn ends.
    record.tween = null;
    setHover(record, false);
    return true;
  }

  function unlockRecord(record, notify) {
    if (!record || (notify && record.owner !== 'player') || !record.locked) return false;
    if (notify && selectionHandler(record.id, record.value) === false) return false;
    record.locked = false;
    record.finalized = false;
    record.selectionPulseStart = 0;
    // Programmatic/UI unlocks restore the die at its previous table position.
    record.tween = null;
    record.mesh.visible = true;
    record.visible = true;
    record.mesh.scale.setScalar(1);
    setHover(record, false);
    return true;
  }

  function setLocked(ownerOrId, indexOrLocked, lockedOrValue, value) {
    var owner = ownerOrId;
    var index = indexOrLocked;
    var locked = lockedOrValue;
    var dieValue = value;
    if (typeof ownerOrId === 'string' && ownerOrId.indexOf('-') > 0 && typeof indexOrLocked === 'boolean') {
      var parts = ownerOrId.split('-');
      owner = parts[0];
      index = Number(parts[1]);
      locked = indexOrLocked;
      dieValue = lockedOrValue;
    }
    var record = getRecord(owner, Number(index));
    if (!record || (!record.rolling && record.locked === Boolean(locked))) return;
    if (dieValue >= 1 && dieValue <= 6) record.value = dieValue;
    if (record.rolling) {
      record.pendingLocked = Boolean(locked);
      return;
    }
    if (locked) lockRecord(record, false); else unlockRecord(record, false);
  }

  function targetQuaternion(value, yaw) {
    var up = new THREE_REF.Vector3(0, 1, 0);
    var normal = faceNormals[value] || faceNormals[1];
    var base = new THREE_REF.Quaternion().setFromUnitVectors(new THREE_REF.Vector3(normal[0], normal[1], normal[2]), up);
    var rotation = new THREE_REF.Quaternion().setFromAxisAngle(up, yaw);
    return rotation.multiply(base);
  }

  // Preserve a natural-looking final twist by choosing the yaw closest to the
  // physical resting orientation. The precomputed face still wins; only the
  // free rotation around that face is optimized to avoid a visible spin.
  function closestTargetQuaternion(record) {
    var current = record && record.mesh ? record.mesh.quaternion : null;
    if (!current) return targetQuaternion(record.targetValue, record.yaw);
    var best = null;
    var bestDot = -1;
    for (var step = 0; step < 24; step += 1) {
      var candidate = targetQuaternion(record.targetValue, (step / 24) * Math.PI * 2 - Math.PI);
      var dot = Math.abs(current.dot(candidate));
      if (dot > bestDot) {
        bestDot = dot;
        best = candidate;
      }
    }
    return best || targetQuaternion(record.targetValue, record.yaw);
  }

  function activateBody(record, targetValue, impulse) {
    removeBody(record);
    var normalizedTarget = Math.floor(Number(targetValue));
    if (normalizedTarget < 1 || normalizedTarget > 6) normalizedTarget = 1;
    var body = new CANNON_REF.Body({ mass: .92, material: dieMaterial });
    body.addShape(new CANNON_REF.Box(new CANNON_REF.Vec3(.39, .39, .39)));
    body.allowSleep = true;
    body.sleepSpeedLimit = REST_SPEED_LIMIT;
    body.sleepTimeLimit = REST_HOLD_TIME;
    var xLimit = Math.max(.6, boardWidth / 2 - .72);
    var zLimit = Math.max(.6, boardDepth / 2 - .72);
    var throwSide = record.owner === 'player' ? 1 : -1;
    var throwOriginZ = throwSide * Math.min(1.35, Math.max(.72, zLimit * .56));
    var fan = (record.index - (DICE_COUNT - 1) / 2) / (DICE_COUNT - 1);
    // All dice leave one tight cup zone, then spread with a shared forward
    // impulse. This reads as one throw instead of seven independent drops.
    body.position.set(
      fan * .34 + randomBetween(-.16, .16),
      randomBetween(2.45, 2.95) + record.index * .03,
      throwOriginZ + randomBetween(-.2, .2)
    );
    body.quaternion.setFromEuler(randomBetween(-Math.PI, Math.PI), randomBetween(-Math.PI, Math.PI), randomBetween(-Math.PI, Math.PI));
    body.velocity.set(fan * .35 + randomBetween(-.25, .25), randomBetween(.18, .8), -throwSide * randomBetween(.55, .95));
    body.angularVelocity.set(randomBetween(-10, 10), randomBetween(-11, 11), randomBetween(-10, 10));
    applyTorqueSafe(body, new CANNON_REF.Vec3(randomBetween(-2.2, 2.2), randomBetween(-2.2, 2.2), randomBetween(-2.2, 2.2)));
    var direction = impulse || {};
    body.applyImpulse(new CANNON_REF.Vec3(
      fan * .38 + randomBetween(-.35, .35) + clamp(Number(direction.x) || 0, -1.4, 1.4) * .75,
      randomBetween(1.65, 2.8) + Math.abs(clamp(Number(direction.y) || 0, -1.4, 1.4)) * .5,
      -throwSide * (randomBetween(1.05, 1.65) + Math.abs(fan) * .15) - clamp(Number(direction.y) || 0, -1.4, 1.4) * .7
    ), body.position);
    body.addEventListener('collide', function (event) {
      var impact = 0;
      try { impact = Math.abs(event.contact.getImpactVelocityAlongNormal()); } catch (error) { impact = body.velocity.length(); }
      if (impact > .45) {
        playImpact(clamp(impact / 8, .08, 1));
        shakeAmount = Math.max(shakeAmount, clamp(impact / 18, .04, .2));
      }
      // 只在真正碰到桌面/骰子之后才计一次弹跳——这是判断"是否已经有过一次真实的
      // 带旋转落地"的依据，见下面 beginSettleCorrection 的触发条件。
      record.bounceCount += 1;
    });
    record.body = body;
    record.targetValue = normalizedTarget;
    record.value = normalizedTarget;
    record.yaw = randomBetween(-Math.PI, Math.PI);
    record.settleTime = 0;
    record.finalized = false;
    record.settleCorrection = null;
    record.landingQuaternion = null;
    record.landingPrepared = false;
    record.bounceCount = 0;
    record.rolling = true;
    record.locked = false;
    record.tween = null;
    record.mesh.visible = true;
    record.visible = true;
    record.mesh.scale.setScalar(1);
    world.addBody(body);
    rollingDice.push(record);
  }

  function beginSettleCorrection(record) {
    if (!record || !record.body || !record.mesh || record.settleCorrection) return;
    var target = closestTargetQuaternion(record);
    // Keep this exact orientation for the rest of the landing. The body may
    // continue moving linearly, but collision impulses must not rotate it back
    // onto a different visible face after the precomputed result is shown.
    record.landingQuaternion = target.clone();
    record.settleCorrection = {
      elapsed: 0,
      duration: SETTLE_CORRECTION_DURATION,
      from: record.mesh.quaternion.clone(),
      to: target
    };
    // Alignment starts while the die is still descending, not after it has
    // already landed. Preserve the linear throw so the final contact remains
    // physical; only reduce residual spin while the target face is approached.
    record.body.angularVelocity.x *= .22;
    record.body.angularVelocity.y *= .22;
    record.body.angularVelocity.z *= .22;
    if (record.body.angularFactor && typeof record.body.angularFactor.set === 'function') {
      record.body.angularFactor.set(0, 0, 0);
    }
    record.settleTime = 0;
  }

  function enforceLandingOrientation(record) {
    if (!record || !record.body || !record.landingQuaternion) return;
    var quaternion = record.landingQuaternion;
    record.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    record.body.angularVelocity.set(0, 0, 0);
    if (record.body.torque && typeof record.body.torque.set === 'function') record.body.torque.set(0, 0, 0);
    if (record.mesh) record.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }

  function finalizeRecord(record) {
    // 正常路径下 landingQuaternion 早就该有值了（beginSettleCorrection 会设置它）。
    // 如果两个都是空的——比如骰子叠在另一颗上面提前静止，从没跌破摆正高度——
    // 绝不能就地拿物理引擎自己停下的朝向收场，那朝向跟 targetValue 没有任何关系，
    // 显示的点数会和游戏逻辑算的分数对不上。这里现算一次最接近的目标朝向兜底。
    var quaternion = record.landingQuaternion || (record.settleCorrection ? record.settleCorrection.to : closestTargetQuaternion(record));
    if (record.body) {
      record.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      record.body.velocity.set(0, 0, 0);
      record.body.angularVelocity.set(0, 0, 0);
      record.body.sleep();
      record.mesh.position.set(record.body.position.x, record.body.position.y, record.body.position.z);
    }
    record.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    record.value = record.targetValue;
    record.finalized = true;
    record.rolling = false;
    record.settleCorrection = null;
    record.landingQuaternion = null;
    if (record.body && world) world.removeBody(record.body);
    record.body = null;
    var activeIndex = rollingDice.indexOf(record);
    if (activeIndex >= 0) rollingDice.splice(activeIndex, 1);
    if (record.pendingLocked !== null) {
      var pendingLocked = record.pendingLocked;
      record.pendingLocked = null;
      if (pendingLocked) lockRecord(record, false); else unlockRecord(record, false);
    }
  }

  function updateSettleCorrection(record, delta) {
    if (!record || !record.settleCorrection || !record.mesh) return false;
    var correction = record.settleCorrection;
    correction.elapsed += delta;
    var progress = clamp(correction.elapsed / correction.duration, 0, 1);
    // Ease out so the last few degrees settle into the wood instead of
    // stopping abruptly at the end of the interpolation.
    var eased = 1 - Math.pow(1 - progress, 3);
    record.mesh.quaternion.slerpQuaternions(correction.from, correction.to, eased);
    if (record.body) {
      record.body.quaternion.set(record.mesh.quaternion.x, record.mesh.quaternion.y, record.mesh.quaternion.z, record.mesh.quaternion.w);
      record.mesh.position.set(record.body.position.x, record.body.position.y, record.body.position.z);
    }
    if (progress >= 1) {
      // The face is now already in its final orientation. Keep simulating the
      // last few centimetres and only finalize once the body naturally rests.
      record.landingPrepared = true;
      record.settleCorrection = null;
    }
    return true;
  }

  function updateTweens(now) {
    Object.keys(diceByOwner).forEach(function (owner) {
      ensureRecords(owner).forEach(function (record) {
        if (!record.tween || !record.mesh) return;
        var progress = clamp((now - record.tween.start) / record.tween.duration, 0, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        record.mesh.position.lerpVectors(record.tween.from, record.tween.to, eased);
        if (progress >= 1) {
          record.mesh.position.copy(record.tween.to);
          record.tween = null;
        }
      });
    });
  }

  function dispatchCompletion() {
    if (rollingDice.length || !completionPending) return;
    var completed = completionHandler;
    completionPending = false;
    completionHandler = function () {};
    global.setTimeout(function () { completed(); }, 0);
  }

  function containBody(record) {
    if (!record || !record.body) return;
    var body = record.body;
    var xLimit = Math.max(.6, boardWidth / 2 - .72);
    var zLimit = Math.max(.6, boardDepth / 2 - .72);
    var margin = .34;
    if (body.position.x > xLimit + margin) {
      body.position.x = xLimit;
      body.velocity.x = -Math.abs(body.velocity.x) * .18;
    } else if (body.position.x < -xLimit - margin) {
      body.position.x = -xLimit;
      body.velocity.x = Math.abs(body.velocity.x) * .18;
    }
    if (body.position.z > zLimit + margin) {
      body.position.z = zLimit;
      body.velocity.z = -Math.abs(body.velocity.z) * .18;
    } else if (body.position.z < -zLimit - margin) {
      body.position.z = -zLimit;
      body.velocity.z = Math.abs(body.velocity.z) * .18;
    }
    // Cannon's floor remains the authority for normal landings; this only
    // catches a rare high-energy tunnelling frame below the tabletop.
    if (body.position.y < .31) {
      body.position.y = .43;
      if (body.velocity.y < 0) body.velocity.y = Math.abs(body.velocity.y) * .12;
    }
  }

  function updateDice(delta) {
    if (!rollingDice.length) {
      dispatchCompletion();
      return;
    }
    world.step(1 / 60, delta, 3);
    var rollingEnergy = 0;
    rollingDice.slice().forEach(function (record) {
      if (!record.body) return;
      containBody(record);
      if (updateSettleCorrection(record, delta)) return;
      record.mesh.position.set(record.body.position.x, record.body.position.y, record.body.position.z);
      if (record.landingPrepared && record.landingQuaternion) {
        enforceLandingOrientation(record);
      } else {
        record.mesh.quaternion.set(record.body.quaternion.x, record.body.quaternion.y, record.body.quaternion.z, record.body.quaternion.w);
      }
      var speed = record.body.velocity.length();
      var angularSpeed = record.body.angularVelocity.length();
      rollingEnergy = Math.max(rollingEnergy, clamp(speed / 3.1 + angularSpeed / 18, 0, 1));
      if (speed < REST_SPEED_LIMIT && angularSpeed < REST_ANGULAR_SPEED_LIMIT) record.settleTime += delta; else record.settleTime = 0;
      var descendingToTable = record.bounceCount >= 1 && record.body.position.y < LANDING_PREP_HEIGHT && record.body.velocity.y < 0;
      if (!record.finalized && !record.landingPrepared && !record.settleCorrection && descendingToTable) beginSettleCorrection(record);
      // 保险丝：正常情况下修正会在"至少真实弹过一次"之后的下降途中触发；但万一这颗骰子
      // 全程没有收到过 collide 回调（比如被 containBody 的越界安全网直接拽回桌面这种
      // 极端情况），不能任由它带着物理"随便停在哪就是哪"的朝向直接结算——那样画面显示
      // 的点数会和游戏逻辑里的 targetValue 对不上，比少弹一次动画更严重。快要真正停稳
      // （settleTime 已经过半）却还没做过修正时，强制补上一次，哪怕这时候已经没什么
      // "线性抛投"可保留了，也好过直接呈现一个随机朝向。
      if (!record.finalized && !record.landingPrepared && !record.settleCorrection && record.settleTime > REST_HOLD_TIME * .6) beginSettleCorrection(record);
      if (!record.finalized && !record.settleCorrection && record.settleTime > REST_HOLD_TIME) finalizeRecord(record);
    });
    if (rollingEnergy > .045) playRolling(rollingEnergy);
    dispatchCompletion();
  }

  function renderFrame(time) {
    global.requestAnimationFrame(renderFrame);
    if (!renderer) return;
    var delta = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1 / 60;
    lastTime = time;
    updateDice(delta);
    updateTweens(time);
    Object.keys(diceByOwner).forEach(function (owner) {
      ensureRecords(owner).forEach(function (record) { applyDieVisualState(record, time); });
    });
    if (shakeAmount > .002) {
      shakeAmount *= .88;
      camera.position.set(
        baseCameraPosition.x + randomBetween(-shakeAmount, shakeAmount) * .08,
        baseCameraPosition.y + randomBetween(-shakeAmount, shakeAmount) * .06,
        baseCameraPosition.z + randomBetween(-shakeAmount, shakeAmount) * .08
      );
    } else {
      shakeAmount = 0;
      camera.position.copy(baseCameraPosition);
    }
    camera.lookAt(0, .12, 0);
    renderer.render(scene, camera);
  }

  function resize() {
    if (!renderer || !camera || !wrap) return;
    var width = Math.max(1, wrap.clientWidth);
    var height = Math.max(1, wrap.clientHeight);
    var aspect = width / height;
    if (!rollingDice.length && Math.abs(aspect - lastMeasuredAspect) > .01) {
      measureBoard();
      createWorld();
      createShadowFloor();
      Object.keys(diceByOwner).forEach(function (owner) {
        ensureRecords(owner).forEach(function (record) {
          if (record.mesh && record.visible && !record.locked) record.mesh.position.copy(getRestPosition(record));
        });
      });
    }
    renderer.setSize(width, height, false);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  function pulse(kind) {
    var amount = kind === 'farkle' ? .9 : kind === 'bank' ? .55 : .7;
    shakeAmount = Math.max(shakeAmount, amount);
  }

  function bindPointerEvents() {
    if (!canvas) return;
    canvas.draggable = false;
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerCancel);
    canvas.addEventListener('click', function (event) { if (event.cancelable) event.preventDefault(); });
    canvas.addEventListener('dblclick', function (event) { if (event.cancelable) event.preventDefault(); });
    canvas.addEventListener('pointerleave', function () {
      if (!pointerState) {
        setHover(hoveredRecord, false);
        hoveredRecord = null;
        canvas.style.cursor = 'default';
      }
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;
    if (!canvas || !wrap || !THREE_REF || !CANNON_REF) {
      if (canvas) canvas.style.display = 'none';
      return;
    }
    scene = new THREE_REF.Scene();
    raycaster = new THREE_REF.Raycaster();
    pointer = new THREE_REF.Vector2();
    camera = new THREE_REF.PerspectiveCamera(48, 1, .1, 100);
    camera.position.set(0, 12.5, 5.3);
    baseCameraPosition = camera.position.clone();
    renderer = new THREE_REF.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(global.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE_REF.PCFSoftShadowMap;
    renderer.outputEncoding = THREE_REF.sRGBEncoding;

    var ambient = new THREE_REF.AmbientLight(0x65513c, 1.45);
    scene.add(ambient);
    var candle = new THREE_REF.PointLight(0xffb45d, 2.2, 16, 2);
    candle.position.set(2.6, 5.4, 2.1);
    candle.castShadow = true;
    candle.shadow.mapSize.set(1024, 1024);
    scene.add(candle);
    var fill = new THREE_REF.DirectionalLight(0xffd7a0, 1.15);
    fill.position.set(-4, 7, 3);
    fill.castShadow = true;
    fill.shadow.mapSize.set(1024, 1024);
    scene.add(fill);

    ensureRecords('player');
    ensureRecords('opponent');
    measureBoard();
    createWorld();
    createShadowFloor();
    bindPointerEvents();
    resize();
    global.addEventListener('resize', resize);
    if (global.ResizeObserver) new global.ResizeObserver(resize).observe(wrap);
    renderFrame(0);
  }

  function rollDice(count, targetValues, callback, options) {
    options = options || {};
    if (!initialized) init();
    if (!world || !renderer) return [];
    var owner = options.owner || 'player';
    ensureRecords(owner);
    if (options.replace) clearOwner(owner, true);
    // Once a new throw begins, previously held dice leave the active board.
    // They stay visible only during the selection/decision period before it.
    if (!options.keepLockedVisible) {
      ensureRecords(owner).forEach(function (record) {
        if (record.locked && record.mesh) {
          record.mesh.visible = false;
          record.visible = false;
        }
      });
    }
    var requestedCount = clamp(Math.floor(Number(count) || DICE_COUNT), 0, DICE_COUNT);
    var indices = Array.isArray(options.indices)
      ? options.indices.map(function (index) { return Number(index); }).filter(function (index) { return index >= 0 && index < DICE_COUNT; })
      : ensureRecords(owner).filter(function (record) { return !record.locked; }).map(function (record) { return record.index; }).slice(0, requestedCount);
    var targets = Array.from({ length: indices.length }, function (_, position) {
      var supplied = targetValues && Number(targetValues[position]);
      return supplied >= 1 && supplied <= 6 ? supplied : 1 + Math.floor(Math.random() * 6);
    });
    if (typeof callback === 'function') {
      completionHandler = callback;
      completionPending = true;
    }
    indices.forEach(function (index, position) {
      var record = getRecord(owner, index);
      if (!record || record.locked) return;
      activateBody(record, targets[position], options.impulse);
    });
    shakeAmount = Math.max(shakeAmount, .08);
    return targets;
  }

  function resetOwner(owner) {
    if (!initialized || !scene || !THREE_REF || !CANNON_REF) return;
    var targetOwner = owner || 'player';
    ensureRecords(targetOwner).forEach(function (record) { clearRecord(record, true); });
    if (hoveredRecord && hoveredRecord.owner === targetOwner) {
      hoveredRecord = null;
      if (canvas) canvas.style.cursor = 'default';
    }
  }

  global.DicePhysics3D = {
    init: init,
    rollDice: rollDice,
    pulse: pulse,
    applySkin: applySkin,
    setLocked: setLocked,
    resetOwner: resetOwner,
    onDiceSelected: function (callback) {
      selectionHandler = typeof callback === 'function' ? callback : function () {};
    },
    onDragRoll: function (callback) {
      dragHandler = typeof callback === 'function' ? callback : function () {};
    },
    onRollComplete: function (callback) {
      completionHandler = typeof callback === 'function' ? callback : function () {};
    },
    resize: resize
  };
}(window));
