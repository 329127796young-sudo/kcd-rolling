const assert = require('node:assert/strict');

const url = process.env.WHT_WS_URL || 'ws://127.0.0.1:4173/ws';
const playerId = `shared-profile-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function connect(snapshot = {}) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);
    const messages = [];
    const timer = setTimeout(() => reject(new Error('connection timeout')), 3000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      type: 'hello', playerId, name: '共享资料测试', loadout: Array(7).fill('ordinary'), profileSnapshot: snapshot
    })));
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
    const timer = setTimeout(() => reject(new Error(`waiting for ${type} timed out`)), timeout);
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
  const first = await connect({
    wallet: { groschen: 250, lifetimeEarned: 200, lifetimeSpent: 50 },
    collection: { purchasedCards: [], unlockedCards: [], unlockedMedals: [], equippedCard: null, equippedMedals: [] },
    diceSkinCollection: { ownedSkins: ['default'], purchasedSkins: [], equippedSkin: 'default' }
  });
  assert.equal(first.profile.groschen, 250);
  first.socket.send(JSON.stringify({ type: 'profile:purchase', itemType: 'card', itemId: 'card-landscape-01.png' }));
  const purchased = await waitFor(first, 'wallet:update', (message) => message.reason === 'purchase');
  assert.equal(purchased.amount, -60);
  assert.equal(purchased.profile.groschen, 190);
  assert.ok(purchased.profile.collection.purchasedCards.includes('card-landscape-01.png'));

  first.socket.send(JSON.stringify({
    type: 'profile:equip',
    collection: { equippedCard: 'card-landscape-01.png', equippedMedals: [] },
    diceSkinCollection: { equippedSkin: 'default' }
  }));
  const equipped = await waitFor(first, 'profile:state', (message) => message.reason === 'equip');
  assert.equal(equipped.profile.collection.equippedCard, 'card-landscape-01.png');
  first.socket.close();

  const second = await connect();
  assert.equal(second.profile.groschen, 190);
  assert.equal(second.profile.collection.equippedCard, 'card-landscape-01.png');
  second.socket.send(JSON.stringify({
    type: 'profile:sync',
    snapshot: {
      syncReason: 'local-change',
      wallet: { groschen: 215, lifetimeEarned: 200, lifetimeSpent: 85 },
      collection: second.profile.collection,
      diceSkinCollection: second.profile.diceSkinCollection
    }
  }));
  const synced = await waitFor(second, 'profile:state', (message) => message.reason === 'local-change');
  assert.equal(synced.profile.groschen, 215);
  second.socket.close();
  console.log(`PASS shared profile wallet + collection ${playerId}`);
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
