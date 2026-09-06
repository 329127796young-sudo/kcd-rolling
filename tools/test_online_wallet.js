const assert = require('node:assert/strict');

const url = process.env.WHT_WS_URL || 'ws://127.0.0.1:4173/ws';
const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function connect(playerId, name) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const messages = [];
    const timer = setTimeout(() => reject(new Error(`${playerId} connection timeout`)), 3000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({ type: 'hello', playerId, name, loadout: Array(7).fill('ordinary') })));
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      messages.push(message);
      if (message.type === 'hello:ok') {
        clearTimeout(timer);
        resolve({ socket, messages, profile: message.profile });
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
  const host = await connect(`wallet-host-${suffix}`, '钱包测试房主');
  const guest = await connect(`wallet-guest-${suffix}`, '钱包测试牌友');
  host.socket.send(JSON.stringify({ type: 'room:create', matchType: 'practice', name: '钱包测试房主' }));
  const created = await waitFor(host, 'room:created');
  guest.socket.send(JSON.stringify({ type: 'room:join', roomId: created.room.roomId, name: '钱包测试牌友' }));
  await waitFor(guest, 'room:joined');
  host.socket.send(JSON.stringify({ type: 'room:ready', ready: true }));
  guest.socket.send(JSON.stringify({ type: 'room:ready', ready: true }));
  const bothReady = (message) => message.room?.players?.every((player) => player?.ready);
  await waitFor(host, 'room:state', bothReady);
  await waitFor(guest, 'room:state', bothReady);
  host.socket.send(JSON.stringify({ type: 'match:start' }));
  await waitFor(host, 'match:start');
  await waitFor(guest, 'match:start');

  // 直接投降结束一局，验证服务器结算只发放一次且由胜者收到 +5。
  host.socket.send(JSON.stringify({ type: 'game:action', action: { kind: 'forfeit' } }));
  const hostWallet = await waitFor(host, 'wallet:update');
  const guestWallet = await waitFor(guest, 'wallet:update');
  assert.equal(hostWallet.amount, 0);
  assert.equal(guestWallet.amount, 5);
  assert.equal(guestWallet.profile.groschen, guest.profile.groschen + 5);
  assert.equal(guestWallet.profile.lastSettlement.type, 'online-practice');

  host.socket.close();
  guest.socket.close();
  const reconnected = await connect(`wallet-guest-${suffix}`, '钱包测试牌友');
  assert.equal(reconnected.profile.groschen, guestWallet.profile.groschen);
  assert.equal(reconnected.profile.lastSettlement.matchId, guestWallet.profile.lastSettlement.matchId);
  reconnected.socket.close();
  console.log(`PASS online wallet settlement ${created.room.roomId}`);
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
