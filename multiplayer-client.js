/* Wallhole Tavern local multiplayer lobby client. */
(function () {
  'use strict';

  const PLAYER_KEY = 'wallhole-online-player-v1';
  const LAST_ROOM_KEY = 'wallhole-online-room-v1';

  function readPlayerId() {
    try {
      const stored = window.localStorage.getItem(PLAYER_KEY);
      if (stored) return stored;
      const generated = `guest-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(PLAYER_KEY, generated);
      return generated;
    } catch {
      return `guest-${Math.random().toString(36).slice(2)}`;
    }
  }

  function getPlayerName() {
    return String(document.querySelector('#profile-name')?.textContent || '旅人').trim() || '旅人';
  }

  function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'text') element.textContent = value;
      else if (key === 'className') element.className = value;
      else if (key === 'html') element.innerHTML = value;
      else element.setAttribute(key, value);
    });
    children.forEach((child) => element.append(child));
    return element;
  }

  class MultiplayerClient {
    constructor() {
      this.socket = null;
      this.rooms = [];
      this.room = null;
      this.seat = null;
      this.playerId = null;
      this.profile = null;
      this.connected = false;
      this.pendingOpen = false;
      this.buildUi();
      window.addEventListener('beforeunload', () => this.disconnect());
    }

    buildUi() {
      if (document.querySelector('#online-lobby-backdrop')) return;
      const backdrop = createElement('div', { id: 'online-lobby-backdrop', className: 'online-lobby-backdrop hidden' });
      const modal = createElement('section', { className: 'online-lobby-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'online-lobby-title' });
      const header = createElement('div', { className: 'online-lobby-header' }, [
        createElement('div', { html: '<span class="kicker">LOCAL NETWORK LOBBY</span><h2 id="online-lobby-title">联机大厅</h2><p id="online-lobby-subtitle">连接本地牌桌服务器，先建立房间再开始对局。</p>' }),
        createElement('button', { id: 'online-lobby-close', className: 'hub-modal-close', type: 'button', 'aria-label': '关闭联机大厅', text: '×' })
      ]);
      const status = createElement('div', { id: 'online-lobby-status', className: 'online-lobby-status' }, [
        createElement('span', { className: 'online-status-dot' }),
        createElement('b', { id: 'online-status-label', text: '尚未连接' }),
        createElement('small', { id: 'online-status-detail', text: '启动本地服务器后自动连接' })
      ]);
      const body = createElement('div', { className: 'online-lobby-body' });
      const createPanel = createElement('div', { className: 'online-lobby-panel online-create-panel' }, [
        createElement('div', { html: '<span class="kicker">CREATE TABLE</span><h3>创建牌桌</h3><p>创建后把六位房间码发给牌友。</p>' }),
        createElement('label', { className: 'online-field' }, [createElement('span', { text: '牌桌类型' }), createElement('select', { id: 'online-match-type' }, [
          createElement('option', { value: 'practice', text: '免费练习桌' }),
          createElement('option', { value: 'stake', text: '正式赌局（虚拟格罗申）' })
        ])]),
        createElement('button', { id: 'online-create-room', className: 'hub-primary-button', type: 'button', text: '创建牌桌' })
      ]);
      const joinPanel = createElement('div', { className: 'online-lobby-panel online-join-panel' }, [
        createElement('div', { html: '<span class="kicker">JOIN TABLE</span><h3>加入牌桌</h3><p>输入房主提供的房间码。</p>' }),
        createElement('div', { className: 'online-join-row' }, [
          createElement('input', { id: 'online-room-code', maxlength: '6', placeholder: '例如 ABC123', autocomplete: 'off', 'aria-label': '房间码' }),
          createElement('button', { id: 'online-join-room', className: 'table-info-button', type: 'button', text: '加入' })
        ])
      ]);
      const roomsPanel = createElement('div', { className: 'online-lobby-panel online-rooms-panel' }, [
        createElement('div', { className: 'online-panel-heading' }, [createElement('div', { html: '<span class="kicker">OPEN TABLES</span><h3>开放牌桌</h3>' }), createElement('button', { id: 'online-refresh-rooms', className: 'tiny-button', type: 'button', text: '刷新' })]),
        createElement('div', { id: 'online-room-list', className: 'online-room-list' })
      ]);
      body.append(createPanel, joinPanel, roomsPanel);
      const current = createElement('div', { id: 'online-current-room', className: 'online-current-room hidden' });
      const footer = createElement('div', { className: 'online-lobby-footer' }, [
        createElement('span', { id: 'online-lobby-hint', text: '联机房间仅用于测试，不会影响本地练习存档。' }),
        createElement('div', { className: 'online-footer-actions' }, [
          createElement('button', { id: 'online-leave-room', className: 'table-info-button hidden', type: 'button', text: '离开牌桌' }),
          createElement('button', { id: 'online-ready-room', className: 'table-info-button hidden', type: 'button', text: '准备' }),
          createElement('button', { id: 'online-start-match', className: 'hub-primary-button hidden', type: 'button', text: '开始对局' })
        ])
      ]);
      modal.append(header, status, body, current, footer);
      backdrop.append(modal);
      document.body.append(backdrop);
      this.backdrop = backdrop;
      this.statusDot = backdrop.querySelector('.online-status-dot');
      this.statusLabel = backdrop.querySelector('#online-status-label');
      this.statusDetail = backdrop.querySelector('#online-status-detail');
      this.roomList = backdrop.querySelector('#online-room-list');
      this.currentRoom = backdrop.querySelector('#online-current-room');
      this.hint = backdrop.querySelector('#online-lobby-hint');
      this.closeButton = backdrop.querySelector('#online-lobby-close');
      this.createButton = backdrop.querySelector('#online-create-room');
      this.joinButton = backdrop.querySelector('#online-join-room');
      this.refreshButton = backdrop.querySelector('#online-refresh-rooms');
      this.leaveButton = backdrop.querySelector('#online-leave-room');
      this.readyButton = backdrop.querySelector('#online-ready-room');
      this.startButton = backdrop.querySelector('#online-start-match');
      this.roomCodeInput = backdrop.querySelector('#online-room-code');
      this.matchType = backdrop.querySelector('#online-match-type');
      this.closeButton.addEventListener('click', () => this.closeLobby());
      backdrop.addEventListener('click', (event) => { if (event.target === backdrop) this.closeLobby(); });
      this.createButton.addEventListener('click', () => this.createRoom());
      this.joinButton.addEventListener('click', () => this.joinRoom(this.roomCodeInput.value));
      this.refreshButton.addEventListener('click', () => this.requestRooms());
      this.leaveButton.addEventListener('click', () => this.leaveRoom());
      this.readyButton.addEventListener('click', () => this.toggleReady());
      this.startButton.addEventListener('click', () => this.startMatch());
      this.roomCodeInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') this.joinRoom(this.roomCodeInput.value); });
    }

    openLobby() {
      this.backdrop.classList.remove('hidden');
      document.body.classList.add('hub-modal-open');
      this.pendingOpen = true;
      this.connect();
      this.render();
      return true;
    }

    closeLobby() {
      this.backdrop.classList.add('hidden');
      document.body.classList.remove('hub-modal-open');
      this.pendingOpen = false;
    }

    connect() {
      if (this.connected || this.socket?.readyState === WebSocket.CONNECTING) return;
      if (!/^https?:$/.test(window.location.protocol)) {
        this.setStatus('无法连接', '请通过 node server.js 启动页面，不要直接双击 index.html。', 'error');
        return;
      }
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      try {
        this.socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
      } catch (error) {
        this.setStatus('连接失败', error.message || 'WebSocket 初始化失败。', 'error');
        return;
      }
      this.setStatus('正在连接', '正在连接本地牌桌服务器……', 'pending');
      this.socket.addEventListener('open', () => {
        this.connected = true;
        this.setStatus('已连接', '本地牌桌服务器在线', 'ok');
        this.playerId = readPlayerId();
        this.send('hello', {
          playerId: this.playerId,
          name: getPlayerName(),
          loadout: window.WallholeGame?.getLoadout?.() || window.WallholeRules?.DEFAULT_LOADOUT,
          profileSnapshot: window.WallholeGame?.getProfileSnapshot?.() || null
        });
        this.requestRooms();
      });
      this.socket.addEventListener('message', (event) => {
        try { this.handleMessage(JSON.parse(event.data)); } catch { this.setStatus('消息错误', '服务器返回了无法解析的消息。', 'error'); }
      });
      this.socket.addEventListener('close', () => {
        this.connected = false;
        this.setStatus('已断开', '本地服务器已停止或网络已断开。', 'error');
        this.render();
      });
      this.socket.addEventListener('error', () => this.setStatus('连接失败', '请确认 node server.js 正在运行。', 'error'));
    }

    disconnect() {
      try { this.socket?.close(); } catch { /* noop */ }
      this.socket = null;
      this.connected = false;
    }

    send(type, payload = {}) {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        this.setStatus('尚未连接', '请先启动本地服务器。', 'error');
        return false;
      }
      this.socket.send(JSON.stringify({ type, ...payload }));
      return true;
    }

    syncProfile(snapshot) { return this.send('profile:sync', { snapshot }); }

    purchaseProfileItem(itemType, itemId) {
      return this.send('profile:purchase', { itemType, itemId });
    }

    equipProfile(collection, diceSkinCollection) {
      return this.send('profile:equip', { collection, diceSkinCollection });
    }

    requestRooms() { this.send('lobby:list'); }

    createRoom() {
      this.send('room:create', { matchType: this.matchType.value, name: getPlayerName() });
    }

    joinRoom(roomId) {
      const code = String(roomId || '').trim().toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(code)) { this.hint.textContent = '请输入 6 位房间码。'; this.roomCodeInput.focus(); return; }
      this.send('room:join', { roomId: code, name: getPlayerName() });
    }

    leaveRoom() {
      this.send('room:leave');
      this.room = null;
      this.seat = null;
      try { window.localStorage.removeItem(LAST_ROOM_KEY); } catch { /* noop */ }
      this.render();
    }

    toggleReady() {
      if (!this.room || this.seat === null) return;
      const player = this.room.players?.[this.seat];
      this.send('room:ready', { ready: !player?.ready });
    }

    startMatch() { this.send('match:start'); }

    sendGameAction(action) {
      if (!this.room || this.room.phase !== 'playing') return false;
      return this.send('game:action', { actionId: `action-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, action });
    }

    setStatus(label, detail, tone) {
      if (this.statusLabel) this.statusLabel.textContent = label;
      if (this.statusDetail) this.statusDetail.textContent = detail;
      this.statusDot?.classList.toggle('is-ok', tone === 'ok');
      this.statusDot?.classList.toggle('is-error', tone === 'error');
      this.statusDot?.classList.toggle('is-pending', tone === 'pending');
    }

    handleMessage(message) {
      if (message.type === 'hello:ok') {
        this.playerId = message.playerId || this.playerId || readPlayerId();
        if (message.profile) {
          this.profile = message.profile;
          document.dispatchEvent(new CustomEvent('wht:online-profile', { detail: { profile: message.profile, source: 'hello' } }));
        }
        return;
      }
      if (message.type === 'profile:state') {
        this.profile = message.profile || null;
        document.dispatchEvent(new CustomEvent('wht:online-profile', { detail: { profile: this.profile, source: 'profile' } }));
        return;
      }
      if (message.type === 'wallet:update') {
        this.profile = message.profile || this.profile;
        document.dispatchEvent(new CustomEvent('wht:online-profile', { detail: { profile: this.profile, settlement: message, source: 'settlement' } }));
        return;
      }
      if (message.type === 'lobby:rooms') {
        this.rooms = Array.isArray(message.rooms) ? message.rooms : [];
        this.render();
        return;
      }
      if (message.type === 'room:created' || message.type === 'room:joined') {
        this.room = message.room;
        this.seat = message.seat;
        try { window.localStorage.setItem(LAST_ROOM_KEY, this.room.roomId); } catch { /* noop */ }
        this.hint.textContent = message.reconnected ? '已恢复原座位，等待牌友重新连接。' : '房间已建立，把房间码发给牌友。';
        this.render();
        if (message.reconnected && message.room?.phase === 'playing' && message.room?.matchState) {
          document.dispatchEvent(new CustomEvent('wht:online-match-start', { detail: { room: message.room, matchId: message.room.matchId, state: message.room.matchState, seat: this.seat, reconnected: true } }));
        }
        return;
      }
      if (message.type === 'room:state') {
        this.room = message.room;
        if (this.seat === null) this.seat = this.room.players.findIndex((player) => player?.playerId === readPlayerId());
        this.render();
        return;
      }
      if (message.type === 'match:start') {
        this.room = message.room;
        this.hint.textContent = `对局 ${message.matchId} 已开始。骰子与回合由服务器裁定。`;
        this.render();
        document.dispatchEvent(new CustomEvent('wht:online-match-start', { detail: { ...message, seat: this.seat } }));
        return;
      }
      if (message.type === 'game:event') {
        if (this.room) this.room.matchState = message.state || this.room.matchState;
        document.dispatchEvent(new CustomEvent('wht:online-game-event', { detail: message }));
        return;
      }
      if (message.type === 'match:end') {
        if (message.room) this.room = message.room;
        else if (this.room) this.room.matchState = message.state || this.room.matchState;
        document.dispatchEvent(new CustomEvent('wht:online-match-end', { detail: message }));
        return;
      }
      if (message.type === 'error') {
        this.hint.textContent = message.message || '联机请求失败。';
        this.setStatus('请求失败', message.message || '联机请求失败。', 'error');
        document.dispatchEvent(new CustomEvent('wht:online-error', { detail: message }));
        return;
      }
    }

    render() {
      if (!this.roomList) return;
      if (!this.rooms.length) this.roomList.innerHTML = '<div class="online-empty-state">暂时没有开放牌桌，创建一张试试。</div>';
      else this.roomList.innerHTML = this.rooms.map((room) => `<button type="button" class="online-room-row" data-room-id="${room.roomId}"><span><b>${room.roomId}</b><small>${room.hostName} · ${room.matchType === 'stake' ? '正式赌局' : '练习桌'}</small></span><i>${room.playerCount}/2 · 加入</i></button>`).join('');
      this.roomList.querySelectorAll('[data-room-id]').forEach((button) => button.addEventListener('click', () => this.joinRoom(button.dataset.roomId)));
      const hasRoom = Boolean(this.room);
      this.currentRoom?.classList.toggle('hidden', !hasRoom);
      this.leaveButton?.classList.toggle('hidden', !hasRoom);
      this.readyButton?.classList.toggle('hidden', !hasRoom);
      this.startButton?.classList.toggle('hidden', !hasRoom || this.seat !== 0);
      if (hasRoom) {
        const players = this.room.players || [];
        const me = players[this.seat];
        const other = players.find((player, index) => player && index !== this.seat);
        this.currentRoom.innerHTML = `<div class="online-current-heading"><div><span class="kicker">YOUR TABLE</span><strong>${this.room.roomId}</strong></div><button type="button" class="online-copy-code" data-copy-room="${this.room.roomId}">复制房间码</button></div><div class="online-seat-grid"><div class="online-seat ${me?.ready ? 'is-ready' : ''}"><span>座位 ${Number(this.seat) + 1}</span><b>${me?.name || getPlayerName()}</b><small>${me?.ready ? '已准备' : '等待准备'}</small></div><div class="online-seat ${other?.ready ? 'is-ready' : ''}"><span>座位 ${other ? (other.seat + 1) : '—'}</span><b>${other?.name || '等待牌友加入'}</b><small>${other ? (other.ready ? '已准备' : '等待准备') : '发送房间码'}</small></div></div>`;
        this.currentRoom.querySelector('[data-copy-room]')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(this.room.roomId); this.hint.textContent = '房间码已复制。'; } catch { this.hint.textContent = `房间码：${this.room.roomId}`; } });
        if (this.readyButton) { this.readyButton.textContent = me?.ready ? '取消准备' : '准备'; this.readyButton.disabled = !other; }
        if (this.startButton) this.startButton.disabled = players.some((player) => !player) || players.some((player) => !player?.ready) || this.room.phase !== 'waiting';
      }
    }
  }

  window.MultiplayerClient = MultiplayerClient;
  window.multiplayerClient = new MultiplayerClient();
})();
