/*
 * Persistent Cannon.js + Three.js dice interaction layer.
 * The canvas is transparent and renders only dice plus realtime shadows.
 * Each owner has six reusable dice records; rolling never creates a stack.
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
    function ensureContext() {
      if (!context) {
        var AudioContextClass = global.AudioContext || global.webkitAudioContext;
        if (!AudioContextClass) return null;
        context = new AudioContextClass();
      }
      if (context.state === 'suspended') context.resume();
      return context;
    }
    function play(intensity) {
      if (global.__diceAudioMuted) return;
      var audioContext = ensureContext();
      if (!audioContext) return;
      var force = clamp(intensity, .08, 1);
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
      source.connect(filter).connect(gain).connect(audioContext.destination);
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
      oscillator.connect(toneGain).connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + .17);
    }
    return play;
  }

  // A throttled, low-volume noise bed makes fast rolls and tabletop sliding
  // audible without spawning one continuous Web Audio source per die.
  function makeRollingAudio() {
    var context = null;
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
    function play(intensity) {
      if (global.__diceAudioMuted) return;
      var audioContext = ensureContext();
      if (!audioContext) return;
      var now = audioContext.currentTime;
      if (now < nextAllowedTime) return;
      nextAllowedTime = now + .055 + Math.random() * .045;
      var force = clamp(intensity, .04, 1);
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
      source.connect(filter).connect(gain).connect(audioContext.destination);
      source.start(now);
      source.stop(now + duration + .01);
    }
    return play;
  }

  var playImpact = makeImpactAudio();
  var playRolling = makeRollingAudio();

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

  function createDieMesh(record) {
    var group = new THREE_REF.Group();
    if (!woodTexture) woodTexture = createWoodTexture();
    var cube = new THREE_REF.Mesh(
      createRoundedDieGeometry(),
      new THREE_REF.MeshStandardMaterial({ color: 0xc68a4b, map: woodTexture, roughness: .82, metalness: 0, emissive: 0x000000, emissiveIntensity: 0 })
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
    scene.add(group);
    return group;
  }

  function applySkin(skin, owner) {
    if (!skin || !THREE_REF) return;
    var targetOwner = owner || 'player';
    activePlayerSkin = targetOwner === 'player' ? skin : activePlayerSkin;
    ensureRecords(targetOwner).forEach(function (record) {
      if (!record.mesh || !record.cube) return;
      var cubeMaterial = record.cube.material;
      if (!cubeMaterial) return;
      cubeMaterial.roughness = Number.isFinite(Number(skin.roughness)) ? Number(skin.roughness) : .82;
      cubeMaterial.metalness = Number.isFinite(Number(skin.metalness)) ? Number(skin.metalness) : 0;
      if (skin.id === 'default' && woodTexture) {
        cubeMaterial.map = woodTexture;
        cubeMaterial.color.set(skin.bodyColor || 0xc68a4b);
      }
      else if (skin.id === 'tavern-oak-brass') {
        if (!diceSkinTextures[skin.id]) diceSkinTextures[skin.id] = createTavernOakTexture();
        cubeMaterial.map = diceSkinTextures[skin.id];
        cubeMaterial.color.set(cubeMaterial.map ? 0xffffff : (skin.bodyColor || 0x2b1b12));
      } else if (skin.id !== 'default') {
        cubeMaterial.map = null;
        cubeMaterial.color.set(skin.bodyColor || 0xc68a4b);
      }
      cubeMaterial.needsUpdate = true;
      record.mesh.traverse(function (child) {
        if (!child.userData || !child.userData.isDiePip || !child.material) return;
        child.material.color.set(skin.pipColor || 0x422512);
        child.material.roughness = .78;
        child.material.metalness = skin.id === 'tavern-oak-brass' ? .34 : 0;
        child.material.needsUpdate = true;
      });
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
      for (var index = 0; index < 6; index += 1) {
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
          pendingLocked: null
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
    var col = record.index % 3;
    var row = Math.floor(record.index / 3);
    var x = (col - 1) * 1.15;
    var z = record.owner === 'player' ? .72 + row * .48 : -.72 - row * .48;
    return new THREE_REF.Vector3(x, .43, z);
  }

  function setHover(record, active) {
    if (!record || !record.cube) return;
    var material = record.cube.material;
    if (active && !record.locked && record.owner === 'player') {
      material.emissive.set(0xc99745);
      material.emissiveIntensity = .42;
    } else if (record.locked) {
      material.emissive.set(0x5b83a5);
      material.emissiveIntensity = .24;
    } else {
      material.emissive.set(0x000000);
      material.emissiveIntensity = 0;
    }
    record.hovered = active;
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
    var fan = (record.index - 2.5) / 5;
    // All dice leave one tight cup zone, then spread with a shared forward
    // impulse. This reads as one throw instead of six independent drops.
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
    var requestedCount = clamp(Math.floor(Number(count) || 6), 0, 6);
    var indices = Array.isArray(options.indices)
      ? options.indices.map(function (index) { return Number(index); }).filter(function (index) { return index >= 0 && index < 6; })
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
