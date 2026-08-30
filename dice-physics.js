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
  var rollingDice = [];
  var diceByOwner = { player: [], opponent: [] };
  var initialized = false;
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
  var raycaster;
  var pointer;

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

  var playImpact = makeImpactAudio();

  function addFacePips(group, axis, sign, value) {
    facePips[value].forEach(function (position) {
      var row = Math.floor(position / 3);
      var column = position % 3;
      var u = (column - 1) * .2;
      var v = (1 - row) * .2;
      var pip = new THREE_REF.Mesh(
        new THREE_REF.SphereGeometry(.074, 12, 8),
        new THREE_REF.MeshStandardMaterial({ color: 0x422512, roughness: .88, metalness: 0 })
      );
      // Flatten the dark insert into the face so the point reads as a carved hole.
      if (axis === 'y') { pip.position.set(u, sign * .391, v); pip.scale.set(1, .28, 1); }
      if (axis === 'z') { pip.position.set(u, v, sign * .391); pip.scale.set(1, 1, .28); }
      if (axis === 'x') { pip.position.set(sign * .391, v, u); pip.scale.set(.28, 1, 1); }
      pip.castShadow = true;
      pip.receiveShadow = true;
      group.add(pip);
    });
  }

  function createDieMesh(record) {
    var group = new THREE_REF.Group();
    if (!woodTexture) woodTexture = createWoodTexture();
    var cube = new THREE_REF.Mesh(
      new THREE_REF.BoxGeometry(.78, .78, .78),
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
    var wallHeight = 2.6;
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
    var record = findHitRecord(event);
    pointerState = { x: event.clientX, y: event.clientY, record: record, dragged: false };
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    canvas.style.cursor = record ? 'grabbing' : 'grabbing';
  }

  function handlePointerUp(event) {
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

  function handlePointerCancel() {
    pointerState = null;
    canvas.style.cursor = 'default';
  }

  function lockRecord(record, notify) {
    if (!record || record.owner !== 'player' || record.locked || record.rolling || !record.mesh.visible) return false;
    if (notify && selectionHandler(record.id, record.value) === false) return false;
    removeBody(record);
    record.locked = true;
    record.finalized = true;
    // Keep the die visible after selection; it is tucked away when the next roll starts.
    record.tween = null;
    setHover(record, false);
    return true;
  }

  function unlockRecord(record, notify) {
    if (!record || record.owner !== 'player' || !record.locked) return false;
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

  function activateBody(record, targetValue, impulse) {
    removeBody(record);
    var body = new CANNON_REF.Body({ mass: .92, material: dieMaterial });
    body.addShape(new CANNON_REF.Box(new CANNON_REF.Vec3(.39, .39, .39)));
    body.allowSleep = true;
    body.sleepSpeedLimit = .13;
    body.sleepTimeLimit = .18;
    var xLimit = Math.max(.6, boardWidth / 2 - .72);
    var zLimit = Math.max(.6, boardDepth / 2 - .72);
    body.position.set(randomBetween(-xLimit, xLimit), randomBetween(2.8, 4.1) + record.index * .08, randomBetween(-zLimit, zLimit));
    body.quaternion.setFromEuler(randomBetween(-Math.PI, Math.PI), randomBetween(-Math.PI, Math.PI), randomBetween(-Math.PI, Math.PI));
    body.velocity.set(randomBetween(-1.3, 1.3), randomBetween(.4, 2.2), randomBetween(-1.3, 1.3));
    body.angularVelocity.set(randomBetween(-14, 14), randomBetween(-15, 15), randomBetween(-14, 14));
    applyTorqueSafe(body, new CANNON_REF.Vec3(randomBetween(-3.2, 3.2), randomBetween(-3.2, 3.2), randomBetween(-3.2, 3.2)));
    var direction = impulse || {};
    body.applyImpulse(new CANNON_REF.Vec3(
      randomBetween(-1.7, 1.7) + clamp(Number(direction.x) || 0, -1.4, 1.4) * 1.15,
      randomBetween(1.8, 3.8) + Math.abs(clamp(Number(direction.y) || 0, -1.4, 1.4)) * .65,
      randomBetween(-1.7, 1.7) - clamp(Number(direction.y) || 0, -1.4, 1.4) * 1.15
    ), body.position);
    body.addEventListener('collide', function (event) {
      var impact = 0;
      try { impact = Math.abs(event.contact.getImpactVelocityAlongNormal()); } catch (error) { impact = body.velocity.length(); }
      if (impact > .45) {
        playImpact(clamp(impact / 8, .08, 1));
        shakeAmount = Math.max(shakeAmount, clamp(impact / 18, .04, .2));
      }
    });
    record.body = body;
    record.targetValue = targetValue;
    record.value = targetValue;
    record.yaw = randomBetween(-Math.PI, Math.PI);
    record.settleTime = 0;
    record.finalized = false;
    record.rolling = true;
    record.locked = false;
    record.tween = null;
    record.mesh.visible = true;
    record.visible = true;
    record.mesh.scale.setScalar(1);
    world.addBody(body);
    rollingDice.push(record);
  }

  function finalizeRecord(record) {
    var quaternion = targetQuaternion(record.targetValue, record.yaw);
    record.body.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    record.body.velocity.set(0, 0, 0);
    record.body.angularVelocity.set(0, 0, 0);
    record.body.sleep();
    record.mesh.position.set(record.body.position.x, record.body.position.y, record.body.position.z);
    record.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
    record.value = record.targetValue;
    record.finalized = true;
    record.rolling = false;
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

  function updateDice(delta) {
    if (!rollingDice.length) {
      dispatchCompletion();
      return;
    }
    world.step(1 / 60, delta, 3);
    rollingDice.slice().forEach(function (record) {
      if (!record.body) return;
      record.mesh.position.set(record.body.position.x, record.body.position.y, record.body.position.z);
      record.mesh.quaternion.set(record.body.quaternion.x, record.body.quaternion.y, record.body.quaternion.z, record.body.quaternion.w);
      var speed = record.body.velocity.length();
      var angularSpeed = record.body.angularVelocity.length();
      if (speed < .16 && angularSpeed < .16) record.settleTime += delta; else record.settleTime = 0;
      if (!record.finalized && record.settleTime > .2) finalizeRecord(record);
    });
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
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerCancel);
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
    candle.shadow.mapSize.set(512, 512);
    scene.add(candle);
    var fill = new THREE_REF.DirectionalLight(0xffd7a0, 1.15);
    fill.position.set(-4, 7, 3);
    fill.castShadow = true;
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
    // Once the player commits to another roll, tuck kept dice away while the
    // remaining dice are active. Their state stays locked for scoring/physics.
    ensureRecords(owner).forEach(function (record) {
      if (record.locked && record.mesh) {
        record.mesh.visible = false;
        record.visible = false;
      }
    });
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
