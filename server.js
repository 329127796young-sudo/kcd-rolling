/*
 * Wallhole Tavern local multiplayer server.
 *
 * This is intentionally dependency-free so the prototype can be tested with
 * the Node runtime already available on the machine. It serves the static game
 * and exposes a small WebSocket lobby at /ws. The shared rules module owns
 * server-side dice, scoring, turns and multiplier validation while the browser
 * remains responsible for rendering the existing 3D dice animation.
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const rules = require('./shared/game-rules.js');

const ROOT = __dirname;
const hasPlatformPort = Number.isFinite(Number(process.env.PORT));
const PORT = Number(process.env.PORT || process.env.WHT_PORT) || 4173;
const HOST = String(process.env.WHT_HOST || (hasPlatformPort ? '0.0.0.0' : '127.0.0.1'));
const ROOM_TTL_MS = 30 * 60 * 1000;
const DISCONNECTED_GRACE_MS = 2 * 60 * 1000;
const MAX_WS_MESSAGE_BYTES = 1024 * 1024;
const configuredDataDir = String(process.env.WHT_DATA_DIR || '').trim();
const SERVER_DATA_DIR = path.resolve(configuredDataDir || path.join(ROOT, 'server-data'));
const PLAYERS_FILE = path.join(SERVER_DATA_DIR, 'players.json');
const ONLINE_PRACTICE_REWARD = 5;
const MAX_AVATAR_DATA_LENGTH = 420000;
const ALLOWED_ORIGINS = String(process.env.WHT_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const NAME_CARD_PRICES = Object.freeze({
  'card-landscape-01.png': 60,
  'card-landscape-02.png': 75,
  'card-landscape-03.png': 90,
  'card-landscape-04.png': 105,
  'card-landscape-05.png': 120,
  'card-landscape-06.png': 150,
  'card-landscape-07.png': 180,
  'card-landscape-08.png': 225,
  'C1.jpg': 500,
  'C2.jpg': 650,
  'C3.jpg': 800,
  'C4.jpg': 950,
  'C5.jpg': 1100,
  'C6.jpg': 1250
});
const DICE_SKIN_PRICES = Object.freeze({
  'tavern-oak-brass': 120,
  'blood-oak-iron': 260,
  'plumwood-vine': 560
});

const rooms = new Map();
const clients = new Set();

function json(value) {
  return JSON.stringify(value);
}

function safeName(value) {
  const name = String(value || '').trim().replace(/\s+/g, ' ').slice(0, 18);
  return name || '旅人';
}

function safePlayerId(value) {
  const id = String(value || '').trim().replace(/[^a-zA-Z0-9:_-]/g, '').slice(0, 64);
  return id || createId('guest-');
}

function safeAvatar(value) {
  if (typeof value !== 'string' || value.length === 0 || value.length > MAX_AVATAR_DATA_LENGTH) return null;
  if (!/^data:image\/(?:png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/i.test(value)) return null;
  return value;
}

function createDefaultProfile(playerId, name) {
  const now = new Date().toISOString();
  return {
    playerId,
    name: safeName(name),
    avatar: null,
    groschen: 100,
    lifetimeEarned: 0,
    lifetimeSpent: 0,
    collection: {
      unlockedCards: [],
      unlockedMedals: [],
      purchasedCards: [],
      equippedCard: null,
      equippedMedals: []
    },
    diceSkinCollection: {
      ownedSkins: ['default'],
      purchasedSkins: [],
      equippedSkin: 'default'
    },
    lastSettlement: null,
    migratedAt: null,
    createdAt: now,
    updatedAt: now
  };
}

function normalizeProfile(playerId, value, fallbackName = '旅人') {
  const source = value && typeof value === 'object' ? value : {};
  const base = createDefaultProfile(playerId, source.name || fallbackName);
  const collection = source.collection && typeof source.collection === 'object' ? source.collection : {};
  const diceSkinCollection = source.diceSkinCollection && typeof source.diceSkinCollection === 'object' ? source.diceSkinCollection : {};
  return {
    ...base,
    ...source,
    playerId,
    name: safeName(source.name || fallbackName),
    avatar: safeAvatar(source.avatar),
    groschen: Number.isFinite(Number(source.groschen)) ? Math.max(0, Math.floor(Number(source.groschen))) : base.groschen,
    lifetimeEarned: Number.isFinite(Number(source.lifetimeEarned)) ? Math.max(0, Math.floor(Number(source.lifetimeEarned))) : base.lifetimeEarned,
    lifetimeSpent: Number.isFinite(Number(source.lifetimeSpent)) ? Math.max(0, Math.floor(Number(source.lifetimeSpent))) : base.lifetimeSpent,
    collection: {
      ...base.collection,
      ...collection,
      unlockedCards: Array.isArray(collection.unlockedCards) ? collection.unlockedCards.slice(0, 200) : [],
      unlockedMedals: Array.isArray(collection.unlockedMedals) ? collection.unlockedMedals.slice(0, 200) : [],
      purchasedCards: Array.isArray(collection.purchasedCards) ? collection.purchasedCards.slice(0, 200) : [],
      equippedCard: typeof collection.equippedCard === 'string' ? collection.equippedCard : null,
      equippedMedals: Array.isArray(collection.equippedMedals) ? collection.equippedMedals.slice(0, 3) : []
    },
    diceSkinCollection: {
      ownedSkins: Array.from(new Set(['default', ...(Array.isArray(diceSkinCollection.ownedSkins) ? diceSkinCollection.ownedSkins : [])])).slice(0, 100),
      purchasedSkins: Array.from(new Set(Array.isArray(diceSkinCollection.purchasedSkins) ? diceSkinCollection.purchasedSkins : [])).slice(0, 100),
      equippedSkin: typeof diceSkinCollection.equippedSkin === 'string' ? diceSkinCollection.equippedSkin : 'default'
    },
    createdAt: typeof source.createdAt === 'string' ? source.createdAt : base.createdAt,
    updatedAt: typeof source.updatedAt === 'string' ? source.updatedAt : base.updatedAt,
    migratedAt: typeof source.migratedAt === 'string' ? source.migratedAt : null
  };
}

function loadPlayerStore() {
  fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
  try {
    const parsed = JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf8'));
    const source = parsed?.players && typeof parsed.players === 'object' ? parsed.players : parsed;
    const players = {};
    if (source && typeof source === 'object') {
      Object.entries(source).forEach(([rawId, value]) => {
        const playerId = safePlayerId(rawId);
        players[playerId] = normalizeProfile(playerId, value);
      });
    }
    return { version: 1, players };
  } catch {
    return { version: 1, players: {} };
  }
}

const playerStore = loadPlayerStore();

function savePlayerStore() {
  fs.mkdirSync(SERVER_DATA_DIR, { recursive: true });
  fs.writeFileSync(PLAYERS_FILE, `${JSON.stringify(playerStore, null, 2)}\n`, 'utf8');
}

function getOrCreateProfile(playerId, name) {
  const safeId = safePlayerId(playerId);
  const existing = playerStore.players[safeId];
  const profile = normalizeProfile(safeId, existing, name);
  const nextName = safeName(name || profile.name);
  const changed = !existing || existing.name !== nextName || JSON.stringify(existing) !== JSON.stringify(profile);
  profile.name = nextName;
  profile.updatedAt = new Date().toISOString();
  playerStore.players[safeId] = profile;
  if (changed) savePlayerStore();
  return profile;
}

function publicProfile(profile) {
  if (!profile) return null;
  return JSON.parse(JSON.stringify(normalizeProfile(profile.playerId, profile)));
}

// Only equipped cosmetic data is exposed to the other seat. Wallet balances,
// ownership lists and settlement history remain private to the profile owner.
function publicPlayerProfile(profile) {
  if (!profile) return null;
  const normalized = normalizeProfile(profile.playerId || '', profile, profile.name || '旅人');
  return {
    name: normalized.name,
    avatar: normalized.avatar || null,
    collection: {
      equippedCard: normalized.collection.equippedCard || null,
      equippedMedals: normalized.collection.equippedMedals.slice(0, 3)
    },
    diceSkinCollection: {
      equippedSkin: normalized.diceSkinCollection.equippedSkin || 'default'
    }
  };
}

function settleRoom(room) {
  if (room.settled || !room.matchState || room.matchState.phase !== 'finished') return null;
  const winnerSeat = Number(room.matchState.winnerSeat);
  if (!Number.isInteger(winnerSeat) || winnerSeat < 0) return null;
  const now = new Date().toISOString();
  const isPractice = room.matchType === 'practice';
  const reward = isPractice ? ONLINE_PRACTICE_REWARD : 0;
  const updates = {};
  room.players.filter(Boolean).forEach((player) => {
    const profile = getOrCreateProfile(player.playerId, player.name);
    const amount = player.seat === winnerSeat ? reward : 0;
    if (amount > 0) {
      profile.groschen += amount;
      profile.lifetimeEarned += amount;
    }
    profile.lastSettlement = {
      at: now,
      type: isPractice ? 'online-practice' : 'online-stake-record',
      roomId: room.id,
      matchId: room.matchId,
      winnerSeat,
      amount,
      tableMultiplier: Number(room.matchState.multiplier) || 1
    };
    profile.updatedAt = now;
    playerStore.players[player.playerId] = profile;
    updates[player.playerId] = { profile: publicProfile(profile), amount };
  });
  savePlayerStore();
  room.settled = true;
  return {
    winnerSeat,
    matchType: room.matchType,
    reward,
    currency: '格罗申',
    balanceChanged: isPractice,
    message: isPractice ? `联机练习桌胜者 +${reward} 格罗申` : '正式联机赌局已记录，当前版本暂不改动余额',
    updates
  };
}

function notifySettlement(room, settlement) {
  if (!settlement) return;
  room.players.filter(Boolean).forEach((player) => {
    const own = settlement.updates[player.playerId];
    if (!own) return;
    send(player.ws, 'wallet:update', {
      roomId: room.id,
      matchId: room.matchId,
      profile: own.profile,
      amount: own.amount,
      winnerSeat: settlement.winnerSeat,
      matchType: settlement.matchType,
      message: settlement.message
    });
  });
}

function stringList(value, max = 200) {
  return Array.from(new Set(Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : [])).slice(0, max);
}

function normalizeClientSnapshot(snapshot = {}) {
  const wallet = snapshot.wallet && typeof snapshot.wallet === 'object' ? snapshot.wallet : {};
  const collection = snapshot.collection && typeof snapshot.collection === 'object' ? snapshot.collection : {};
  const diceSkinCollection = snapshot.diceSkinCollection && typeof snapshot.diceSkinCollection === 'object' ? snapshot.diceSkinCollection : {};
  return {
    name: safeName(snapshot.name),
    hasAvatar: Object.prototype.hasOwnProperty.call(snapshot, 'avatar'),
    avatar: safeAvatar(snapshot.avatar),
    wallet: {
      groschen: Number.isFinite(Number(wallet.groschen)) ? Math.max(0, Math.floor(Number(wallet.groschen))) : null,
      lifetimeEarned: Number.isFinite(Number(wallet.lifetimeEarned)) ? Math.max(0, Math.floor(Number(wallet.lifetimeEarned))) : null,
      lifetimeSpent: Number.isFinite(Number(wallet.lifetimeSpent)) ? Math.max(0, Math.floor(Number(wallet.lifetimeSpent))) : null
    },
    collection: {
      unlockedCards: stringList(collection.unlockedCards),
      unlockedMedals: stringList(collection.unlockedMedals),
      purchasedCards: stringList(collection.purchasedCards),
      equippedCard: typeof collection.equippedCard === 'string' ? collection.equippedCard : null,
      equippedMedals: stringList(collection.equippedMedals, 3)
    },
    diceSkinCollection: {
      ownedSkins: stringList(diceSkinCollection.ownedSkins, 100),
      purchasedSkins: stringList(diceSkinCollection.purchasedSkins, 100),
      equippedSkin: typeof diceSkinCollection.equippedSkin === 'string' ? diceSkinCollection.equippedSkin : 'default'
    }
  };
}

function syncRoomPlayerProfile(client) {
  const room = client?.roomId ? rooms.get(client.roomId) : null;
  if (!room || !client.profile) return;
  const seat = findSeatForPlayer(room, client.playerId);
  const player = seat >= 0 ? room.players[seat] : null;
  if (!player) return;
  player.name = client.profile.name;
  player.profile = client.profile;
  if (room.matchState?.players?.[seat]) {
    room.matchState.players[seat].name = client.profile.name;
    room.matchState.players[seat].profile = publicPlayerProfile(client.profile);
  }
  room.stateVersion += 1;
  if (room.matchState) room.matchState.stateVersion = room.stateVersion;
  broadcastRoom(room, 'room:state', { room: publicRoom(room) });
}

function isPristineProfile(profile) {
  return !profile.migratedAt
    && profile.groschen === 100
    && profile.lifetimeEarned === 0
    && profile.lifetimeSpent === 0
    && !profile.lastSettlement
    && profile.collection.unlockedCards.length === 0
    && profile.collection.unlockedMedals.length === 0
    && profile.collection.purchasedCards.length === 0
    && profile.diceSkinCollection.purchasedSkins.length === 0;
}

function syncProfileFromClient(client, snapshot) {
  const profile = getOrCreateProfile(client.playerId, client.name);
  const local = normalizeClientSnapshot(snapshot);
  const now = new Date().toISOString();
  const allowLocalSync = String(snapshot?.syncReason || '') === 'local-change';
  if (isPristineProfile(profile) || allowLocalSync) {
    if (local.wallet.groschen !== null) profile.groschen = local.wallet.groschen;
    if (local.wallet.lifetimeEarned !== null) profile.lifetimeEarned = local.wallet.lifetimeEarned;
    if (local.wallet.lifetimeSpent !== null) profile.lifetimeSpent = local.wallet.lifetimeSpent;
    profile.collection = normalizeProfile(profile.playerId, { collection: local.collection }).collection;
    profile.diceSkinCollection = normalizeProfile(profile.playerId, { diceSkinCollection: local.diceSkinCollection }).diceSkinCollection;
  }
  if (local.hasAvatar) profile.avatar = local.avatar;
  profile.name = local.name || profile.name;
  profile.migratedAt = profile.migratedAt || now;
  profile.updatedAt = now;
  playerStore.players[profile.playerId] = profile;
  client.profile = profile;
  syncRoomPlayerProfile(client);
  savePlayerStore();
  send(client, 'profile:state', { profile: publicProfile(profile), migrated: true, reason: String(snapshot?.syncReason || 'hello') });
}

function profilePurchase(client, message) {
  const profile = getOrCreateProfile(client.playerId, client.name);
  const itemType = String(message.itemType || '');
  const itemId = String(message.itemId || '').trim();
  const price = itemType === 'card' ? NAME_CARD_PRICES[itemId] : itemType === 'dice-skin' ? DICE_SKIN_PRICES[itemId] : null;
  if (!price) return send(client, 'error', { code: 'STORE_ITEM_INVALID', message: '该商品不可购买。' });
  const owned = itemType === 'card'
    ? profile.collection.purchasedCards.includes(itemId)
    : profile.diceSkinCollection.ownedSkins.includes(itemId);
  if (owned) return send(client, 'error', { code: 'STORE_ITEM_OWNED', message: '你已经拥有这件商品。' });
  if (profile.groschen < price) return send(client, 'error', { code: 'INSUFFICIENT_FUNDS', message: `余额不足，还需要 ${price - profile.groschen} 格罗申。` });
  profile.groschen -= price;
  profile.lifetimeSpent += price;
  if (itemType === 'card') profile.collection.purchasedCards.push(itemId);
  else {
    profile.diceSkinCollection.purchasedSkins.push(itemId);
    profile.diceSkinCollection.ownedSkins.push(itemId);
  }
  profile.updatedAt = new Date().toISOString();
  playerStore.players[profile.playerId] = profile;
  client.profile = profile;
  syncRoomPlayerProfile(client);
  savePlayerStore();
  send(client, 'wallet:update', { profile: publicProfile(profile), amount: -price, reason: 'purchase', itemType, itemId, price });
}

function profileEquip(client, message) {
  const profile = getOrCreateProfile(client.playerId, client.name);
  const incomingCollection = message.collection && typeof message.collection === 'object' ? message.collection : {};
  const incomingSkins = message.diceSkinCollection && typeof message.diceSkinCollection === 'object' ? message.diceSkinCollection : {};
  if (typeof incomingCollection.equippedCard === 'string' && (profile.collection.purchasedCards.includes(incomingCollection.equippedCard) || profile.collection.unlockedCards.includes(incomingCollection.equippedCard))) {
    profile.collection.equippedCard = incomingCollection.equippedCard;
  } else if (incomingCollection.equippedCard === null) profile.collection.equippedCard = null;
  const medals = stringList(incomingCollection.equippedMedals, 3).filter((id) => profile.collection.unlockedMedals.includes(id));
  profile.collection.equippedMedals = medals;
  if (typeof incomingSkins.equippedSkin === 'string' && profile.diceSkinCollection.ownedSkins.includes(incomingSkins.equippedSkin)) {
    profile.diceSkinCollection.equippedSkin = incomingSkins.equippedSkin;
  }
  profile.updatedAt = new Date().toISOString();
  playerStore.players[profile.playerId] = profile;
  client.profile = profile;
  syncRoomPlayerProfile(client);
  savePlayerStore();
  send(client, 'profile:state', { profile: publicProfile(profile), reason: 'equip' });
}

function createId(prefix = '') {
  return `${prefix}${crypto.randomBytes(8).toString('hex')}`;
}

function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = Array.from({ length: 6 }, () => alphabet[crypto.randomInt(0, alphabet.length)]).join('');
  } while (rooms.has(code));
  return code;
}

function roomSummary(room) {
  return {
    roomId: room.id,
    hostName: room.players[0]?.name || '旅人',
    playerCount: room.players.filter(Boolean).length,
    maxPlayers: 2,
    status: room.phase,
    matchType: room.matchType,
    createdAt: room.createdAt
  };
}

function publicPlayer(player) {
  if (!player) return null;
  const profile = player.profile || playerStore.players[player.playerId] || null;
  return { playerId: player.playerId, name: player.name, seat: player.seat, ready: player.ready, connected: Boolean(player.ws), profile: publicPlayerProfile(profile) };
}

function publicRoom(room) {
  return {
    roomId: room.id,
    matchId: room.matchId,
    phase: room.phase,
    matchType: room.matchType,
    hostId: room.hostId,
    stateVersion: room.stateVersion,
    sequence: room.sequence,
    settled: Boolean(room.settled),
    players: room.players.map(publicPlayer),
    matchState: room.matchState ? rules.publicMatchState(room.matchState) : null
  };
}

function send(client, type, payload = {}) {
  if (!client || client.closed) return;
  client.send({ type, ...payload });
}

function broadcastRoom(room, type, payload = {}) {
  room.players.filter(Boolean).forEach((player) => send(player.ws, type, payload));
}

function broadcastLobby() {
  const payload = { rooms: Array.from(rooms.values()).map(roomSummary).sort((a, b) => b.createdAt - a.createdAt) };
  clients.forEach((client) => send(client, 'lobby:rooms', payload));
}

function sendRoomState(client, room) {
  send(client, 'room:state', { room: publicRoom(room) });
}

function touchRoom(room) {
  room.lastActiveAt = Date.now();
  if (room.cleanupTimer) clearTimeout(room.cleanupTimer);
  room.cleanupTimer = setTimeout(() => {
    if (Date.now() - room.lastActiveAt >= ROOM_TTL_MS) {
      rooms.delete(room.id);
      broadcastLobby();
    }
  }, ROOM_TTL_MS + 50);
}

function createRoom(client, message) {
  const room = {
    id: createRoomCode(),
    matchId: null,
    phase: 'waiting',
    matchType: message.matchType === 'stake' ? 'stake' : 'practice',
    hostId: client.playerId,
    players: [null, null],
    stateVersion: 1,
    sequence: 0,
    matchState: null,
    settled: false,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    cleanupTimer: null
  };
  const player = attachPlayer(room, client, 0, message.name);
  rooms.set(room.id, room);
  client.roomId = room.id;
  touchRoom(room);
  send(client, 'room:created', { room: publicRoom(room), seat: player.seat });
  broadcastRoom(room, 'room:state', { room: publicRoom(room) });
  broadcastLobby();
}

function attachPlayer(room, client, seat, name) {
  const profile = getOrCreateProfile(client.playerId, name || client.name);
  const player = {
    playerId: client.playerId,
    name: profile.name,
    seat,
    ready: false,
    loadout: rules.normalizeLoadout(client.loadout),
    profile,
    ws: client,
    disconnectedAt: null
  };
  room.players[seat] = player;
  client.roomId = room.id;
  client.seat = seat;
  client.name = player.name;
  client.profile = profile;
  return player;
}

function findSeatForPlayer(room, playerId) {
  return room.players.findIndex((player) => player?.playerId === playerId);
}

function joinRoom(client, message) {
  const id = String(message.roomId || '').trim().toUpperCase();
  const room = rooms.get(id);
  if (!room) return send(client, 'error', { code: 'ROOM_NOT_FOUND', message: '牌桌不存在或已过期。' });

  const existingSeat = findSeatForPlayer(room, client.playerId);
  if (existingSeat >= 0) {
    const player = room.players[existingSeat];
    player.ws = client;
    player.disconnectedAt = null;
    client.roomId = room.id;
    client.seat = existingSeat;
    client.name = player.name;
    player.profile = client.profile;
    player.name = client.profile?.name || player.name;
    // A reconnect can happen after the match has already started. Refresh the
    // authoritative match seat as well, otherwise the opponent may keep the
    // stale profile that was captured at match start.
    syncRoomPlayerProfile(client);
    send(client, 'room:joined', { room: publicRoom(room), seat: existingSeat, reconnected: true });
    sendRoomState(client, room);
    broadcastRoom(room, 'room:state', { room: publicRoom(room) });
    touchRoom(room);
    return;
  }

  if (room.phase !== 'waiting') return send(client, 'error', { code: 'ROOM_STARTED', message: '这张牌桌已经开始对局。' });

  const seat = room.players.findIndex((player) => !player);
  if (seat < 0) return send(client, 'error', { code: 'ROOM_FULL', message: '这张牌桌已经坐满。' });
  const player = attachPlayer(room, client, seat, message.name);
  send(client, 'room:joined', { room: publicRoom(room), seat: player.seat, reconnected: false });
  broadcastRoom(room, 'room:state', { room: publicRoom(room) });
  broadcastLobby();
  touchRoom(room);
}

function leaveRoom(client, { destroy = false } = {}) {
  const room = client.roomId ? rooms.get(client.roomId) : null;
  if (!room) return;
  const seat = findSeatForPlayer(room, client.playerId);
  if (seat >= 0) room.players[seat] = null;
  client.roomId = null;
  client.seat = null;
  if (destroy || room.players.every((player) => !player)) {
    rooms.delete(room.id);
  } else if (room.hostId === client.playerId) {
    const nextHost = room.players.find(Boolean);
    if (nextHost) room.hostId = nextHost.playerId;
  }
  broadcastRoom(room, 'room:state', { room: publicRoom(room) });
  broadcastLobby();
  touchRoom(room);
}

function disconnectClient(client) {
  clients.delete(client);
  const room = client.roomId ? rooms.get(client.roomId) : null;
  if (!room) return;
  const seat = findSeatForPlayer(room, client.playerId);
  if (seat < 0) return;
  const player = room.players[seat];
  if (!player) return;
  player.ws = null;
  player.disconnectedAt = Date.now();
  broadcastRoom(room, 'room:state', { room: publicRoom(room) });
  broadcastLobby();
  setTimeout(() => {
    const current = rooms.get(room.id)?.players[seat];
    if (current && !current.ws && current.disconnectedAt && Date.now() - current.disconnectedAt >= DISCONNECTED_GRACE_MS) {
      room.players[seat] = null;
      if (room.hostId === current.playerId) {
        const nextHost = room.players.find(Boolean);
        if (nextHost) room.hostId = nextHost.playerId;
      }
      broadcastRoom(room, 'room:state', { room: publicRoom(room) });
      broadcastLobby();
      touchRoom(room);
    }
  }, DISCONNECTED_GRACE_MS + 50);
  touchRoom(room);
}

function handleMessage(client, message) {
  const type = String(message?.type || '');
  if (type === 'hello') {
    client.playerId = safePlayerId(message.playerId || createId('guest-'));
    client.name = safeName(message.name);
    client.loadout = rules.normalizeLoadout(message.loadout);
    client.profile = getOrCreateProfile(client.playerId, client.name);
    syncProfileFromClient(client, message.profileSnapshot || {});
    send(client, 'hello:ok', { playerId: client.playerId, profile: publicProfile(client.profile), serverTime: Date.now() });
    send(client, 'lobby:rooms', { rooms: Array.from(rooms.values()).map(roomSummary) });
    return;
  }
  if (!client.playerId) return send(client, 'error', { code: 'NOT_IDENTIFIED', message: '请先建立玩家身份。' });
  if (type === 'lobby:list') return send(client, 'lobby:rooms', { rooms: Array.from(rooms.values()).map(roomSummary) });
  if (type === 'room:create') return createRoom(client, message);
  if (type === 'room:join') return joinRoom(client, message);
  if (type === 'room:leave') return leaveRoom(client);
  if (type === 'profile:sync') return syncProfileFromClient(client, message.snapshot || {});
  if (type === 'profile:purchase') return profilePurchase(client, message);
  if (type === 'profile:equip') return profileEquip(client, message);

  const room = client.roomId ? rooms.get(client.roomId) : null;
  if (!room) return send(client, 'error', { code: 'NOT_IN_ROOM', message: '你还没有加入牌桌。' });
  const seat = findSeatForPlayer(room, client.playerId);
  const player = seat >= 0 ? room.players[seat] : null;
  if (!player) return send(client, 'error', { code: 'SEAT_NOT_FOUND', message: '座位已失效，请重新加入。' });
  touchRoom(room);

  if (type === 'room:ready') {
    player.ready = Boolean(message.ready);
    room.stateVersion += 1;
    broadcastRoom(room, 'room:state', { room: publicRoom(room) });
    return;
  }

  if (type === 'match:start') {
    if (client.playerId !== room.hostId) return send(client, 'error', { code: 'HOST_ONLY', message: '只有房主可以开始对局。' });
    if (room.players.some((item) => !item) || room.players.some((item) => !item.ready)) return send(client, 'error', { code: 'NOT_READY', message: '需要两位玩家都准备。' });
    room.phase = 'playing';
    room.matchId = createId('match-');
    room.sequence = 0;
    room.settled = false;
    room.matchState = rules.createMatchState(room.players.map((item) => ({
      playerId: item.playerId,
      name: item.name,
      seat: item.seat,
      loadout: item.loadout,
      profile: publicPlayerProfile(item.profile || playerStore.players[item.playerId])
    })), room.matchType);
    room.stateVersion += 1;
    broadcastRoom(room, 'match:start', { room: publicRoom(room), matchId: room.matchId, state: rules.publicMatchState(room.matchState), serverTime: Date.now() });
    broadcastRoom(room, 'room:state', { room: publicRoom(room) });
    broadcastLobby();
    return;
  }

  if (type === 'game:action') {
    if (room.phase !== 'playing') return send(client, 'error', { code: 'MATCH_NOT_STARTED', message: '对局尚未开始。' });
    if (!room.matchState) return send(client, 'error', { code: 'MATCH_STATE_MISSING', message: '牌局状态尚未初始化。' });
    const actionId = String(message.actionId || createId('action-')).slice(0, 80);
    const random = () => crypto.randomInt(0, 0x100000000) / 0x100000000;
    const result = rules.applyAction(room.matchState, player.seat, message.action || {}, random);
    if (result.error) return send(client, 'error', { code: 'INVALID_ACTION', message: result.error });
    room.sequence += 1;
    room.matchState.sequence = room.sequence;
    room.stateVersion += 1;
    room.matchState.stateVersion = room.stateVersion;
    let settlement = null;
    if (room.matchState.phase === 'finished') {
      room.phase = 'finished';
      settlement = settleRoom(room);
    }
    broadcastRoom(room, 'game:event', {
      roomId: room.id,
      matchId: room.matchId,
      actor: player.playerId,
      seat: player.seat,
      actionId,
      sequence: room.sequence,
      stateVersion: room.stateVersion,
      action: message.action || null,
      event: result,
      settlement: settlement ? { winnerSeat: settlement.winnerSeat, matchType: settlement.matchType, reward: settlement.reward, currency: settlement.currency, balanceChanged: settlement.balanceChanged, message: settlement.message } : null,
      state: rules.publicMatchState(room.matchState),
      serverTime: Date.now()
    });
    if (settlement) {
      broadcastRoom(room, 'match:end', { room: publicRoom(room), matchId: room.matchId, state: rules.publicMatchState(room.matchState), winnerSeat: room.matchState.winnerSeat, settlement: { winnerSeat: settlement.winnerSeat, matchType: settlement.matchType, reward: settlement.reward, currency: settlement.currency, balanceChanged: settlement.balanceChanged, message: settlement.message }, serverTime: Date.now() });
      notifySettlement(room, settlement);
      broadcastLobby();
    }
    return;
  }

  if (type === 'ping') return send(client, 'pong', { serverTime: Date.now() });
  send(client, 'error', { code: 'UNKNOWN_MESSAGE', message: `未知消息：${type}` });
}

function encodeFrame(text) {
  const payload = Buffer.from(text);
  const header = [];
  header.push(0x81);
  if (payload.length < 126) header.push(payload.length);
  else if (payload.length < 65536) header.push(126, (payload.length >> 8) & 255, payload.length & 255);
  else {
    header.push(127);
    const length = BigInt(payload.length);
    for (let shift = 56n; shift >= 0n; shift -= 8n) header.push(Number((length >> shift) & 255n));
  }
  return Buffer.concat([Buffer.from(header), payload]);
}

function handleTextMessage(client, payload) {
  try {
    handleMessage(client, JSON.parse(payload.toString('utf8')));
  } catch (error) {
    send(client, 'error', { code: 'BAD_MESSAGE', message: error.message || '消息格式错误。' });
  }
}

function decodeFrames(client, data) {
  client.buffer = Buffer.concat([client.buffer, data]);
  while (client.buffer.length >= 2) {
    const first = client.buffer[0];
    const second = client.buffer[1];
    const fin = Boolean(first & 0x80);
    const opcode = first & 0x0f;
    const masked = Boolean(second & 0x80);
    let length = second & 0x7f;
    let offset = 2;
    if (length === 126) {
      if (client.buffer.length < 4) return;
      length = client.buffer.readUInt16BE(2);
      offset = 4;
    } else if (length === 127) {
      if (client.buffer.length < 10) return;
      const value = client.buffer.readBigUInt64BE(2);
      if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Frame too large');
      length = Number(value);
      offset = 10;
    }
    const maskOffset = masked ? 4 : 0;
    const frameEnd = offset + maskOffset + length;
    if (client.buffer.length < frameEnd) return;
    let payload = client.buffer.subarray(offset + maskOffset, frameEnd);
    if (masked) {
      const mask = client.buffer.subarray(offset, offset + 4);
      payload = Buffer.from(payload);
      for (let index = 0; index < payload.length; index += 1) payload[index] ^= mask[index % 4];
    }
    client.buffer = client.buffer.subarray(frameEnd);
    if (opcode === 0x8) {
      client.close();
      return;
    }
    if (opcode === 0x9) {
      client.socket.write(Buffer.from([0x8a, payload.length]));
      continue;
    }
    if (opcode === 0xA) continue;

    // Browsers are allowed to fragment a large WebSocket message. This is
    // common when the hello payload contains a custom avatar. The previous
    // parser attempted JSON.parse on the first ~4 KB fragment, producing the
    // misleading "Unterminated string ... position 4096" error. Reassemble
    // continuation frames before parsing the JSON message.
    if (opcode === 0x1) {
      if (client.fragmentedOpcode !== null) {
        client.close();
        return;
      }
      if (fin) {
        handleTextMessage(client, payload);
      } else {
        client.fragmentedOpcode = opcode;
        client.fragmentedPayloads = [payload];
        client.fragmentedLength = payload.length;
      }
      continue;
    }
    if (opcode === 0x0) {
      if (client.fragmentedOpcode === null) {
        client.close();
        return;
      }
      client.fragmentedPayloads.push(payload);
      client.fragmentedLength += payload.length;
      if (client.fragmentedLength > MAX_WS_MESSAGE_BYTES) {
        client.close();
        return;
      }
      if (fin) {
        const message = Buffer.concat(client.fragmentedPayloads, client.fragmentedLength);
        const messageOpcode = client.fragmentedOpcode;
        client.fragmentedOpcode = null;
        client.fragmentedPayloads = [];
        client.fragmentedLength = 0;
        if (messageOpcode === 0x1) handleTextMessage(client, message);
      }
      continue;
    }
    // Unsupported data opcodes are ignored after consuming the complete frame.
  }
}

function attachWebSocket(socket) {
  const client = {
    socket,
    buffer: Buffer.alloc(0),
    fragmentedOpcode: null,
    fragmentedPayloads: [],
    fragmentedLength: 0,
    closed: false,
    playerId: null,
    name: '旅人',
    roomId: null,
    seat: null,
    send(payload) {
      if (this.closed) return;
      this.socket.write(encodeFrame(json(payload)));
    },
    close() {
      if (this.closed) return;
      this.closed = true;
      try { this.socket.end(); } catch { /* noop */ }
      disconnectClient(this);
    }
  };
  clients.add(client);
  socket.on('data', (data) => {
    try { decodeFrames(client, data); } catch { client.close(); }
  });
  socket.on('error', () => client.close());
  socket.on('close', () => client.close());
  return client;
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
  }[ext] || 'application/octet-stream';
}

function serveStatic(request, response) {
  const requestPath = decodeURIComponent(String(request.url || '/').split('?')[0]);
  if (requestPath === '/healthz') {
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(json({ ok: true, service: 'wallhole-tavern', uptime: Math.round(process.uptime()), rooms: rooms.size, timestamp: Date.now() }));
    return;
  }
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.resolve(ROOT, relative);
  const rootPrefix = `${path.resolve(ROOT)}${path.sep}`;
  if (filePath !== path.resolve(ROOT) && !filePath.startsWith(rootPrefix)) {
    response.writeHead(403); response.end('Forbidden'); return;
  }
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) { response.writeHead(404); response.end('Not found'); return; }
    response.writeHead(200, { 'Content-Type': contentType(filePath), 'Cache-Control': 'no-cache' });
    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer(serveStatic);
server.on('upgrade', (request, socket) => {
  if (request.url !== '/ws') { socket.destroy(); return; }
  const origin = String(request.headers.origin || '').trim();
  if (ALLOWED_ORIGINS.length && origin && !ALLOWED_ORIGINS.includes(origin)) {
    socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');
    socket.destroy();
    return;
  }
  const key = request.headers['sec-websocket-key'];
  if (!key) { socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`).digest('base64');
  socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
  attachWebSocket(socket);
});

server.listen(PORT, HOST, () => {
  const displayHost = HOST === '0.0.0.0' || HOST === '::' ? '0.0.0.0' : HOST;
  const protocolHost = displayHost === '0.0.0.0' ? '127.0.0.1' : displayHost;
  console.log(`[wallhole] server ready: http://${protocolHost}:${PORT}/`);
  console.log(`[wallhole] websocket endpoint: ws://${protocolHost}:${PORT}/ws`);
  console.log(`[wallhole] data directory: ${SERVER_DATA_DIR}`);
  if (ALLOWED_ORIGINS.length) console.log(`[wallhole] allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

function shutdown() {
  clients.forEach((client) => client.close());
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
