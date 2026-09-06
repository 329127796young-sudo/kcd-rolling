const assert = require('node:assert/strict');

const url = process.env.WHT_WS_URL || 'ws://127.0.0.1:4173/ws';

function connect(playerId, name, loadout = Array(7).fill('ordinary')) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const messages = [];
    const timer = setTimeout(() => reject(new Error(`${playerId} connection timeout`)), 3000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ type: 'hello', playerId, name, loadout })));
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      messages.push(message);
      if (message.type === 'hello:ok') {
        clearTimeout(timer);
        resolve({ socket, messages });
      }
    });
    socket.addEventListener('error', reject);
  });
}

function waitFor(client, type, predicate = () => true, timeout = 3000) {
  const existing = client.messages.find((message) => message.type === type && predicate(message));
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`waiting for ${type} timed out; received=${client.messages.map((message) => message.type).join(',')}`)), timeout);
    const handler = (event) => {
      const message = JSON.parse(event.data);
      client.messages.push(message);
      if (message.type === type && predicate(message)) {
        clearTimeout(timer);
        client.socket.removeEventListener('message', handler);
        resolve(message);
      }
    };
    client.socket.addEventListener('message', handler);
  });
}

(async () => {
  const host = await connect('test-host', '测试房主', Array(7).fill('loaded'));
  const guest = await connect('test-guest', '测试牌友', Array(7).fill('loaded'));
  host.socket.send(JSON.stringify({ type: 'room:create', matchType: 'practice', name: '测试房主' }));
  const created = await waitFor(host, 'room:created');
  assert.match(created.room.roomId, /^[A-Z0-9]{6}$/);
  guest.socket.send(JSON.stringify({ type: 'room:join', roomId: created.room.roomId, name: '测试牌友' }));
  await waitFor(guest, 'room:joined');
  host.socket.send(JSON.stringify({ type: 'room:ready', ready: true }));
  guest.socket.send(JSON.stringify({ type: 'room:ready', ready: true }));
  const bothReady = (message) => message.room?.players?.every((player) => player?.ready);
  await waitFor(host, 'room:state', bothReady);
  await waitFor(guest, 'room:state', bothReady);
  host.socket.send(JSON.stringify({ type: 'match:start' }));
  const started = await waitFor(guest, 'match:start');
  assert.equal(started.room.players.length, 2);
  host.socket.send(JSON.stringify({ type: 'game:action', action: { kind: 'roll', values: [1, 5, 2] } }));
  const event = await waitFor(guest, 'game:event');
  assert.equal(event.action.kind, 'roll');
  assert.ok(event.event.type === 'roll' || event.event.type === 'farkle');
  assert.equal(event.state.players[0].dice.length, 7);
  assert.equal(event.state.players[0].dice.every((value) => value >= 0 && value <= 6), true);
  assert.equal(event.state.stateVersion, event.stateVersion);
  if (event.event.type === 'roll') {
    const scoringIndices = event.event.values.map((value, index) => (value === 1 || value === 5 ? index : null)).filter((index) => index !== null);
    host.socket.send(JSON.stringify({ type: 'game:action', action: { kind: 'lock-many', indices: scoringIndices } }));
    const locked = await waitFor(guest, 'game:event', (message) => message.event?.type === 'lock');
    if (scoringIndices.length) {
      assert.ok(locked.event.turnScore > 0);
      host.socket.send(JSON.stringify({ type: 'game:action', action: { kind: 'bank' } }));
      const banked = await waitFor(guest, 'game:event', (message) => message.event?.type === 'bank');
      assert.ok(banked.event.banked > 0);
      assert.equal(banked.state.turnSeat, 1);
    }
  }
  host.socket.close();
  guest.socket.close();
  console.log(`PASS local multiplayer room ${created.room.roomId}`);
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
