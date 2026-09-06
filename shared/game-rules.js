/* Shared rules for Wallhole Tavern online matches. Browser and Node both load
 * this file; keeping the calculation here prevents the client from inventing
 * dice results or a different score than the room server. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.WallholeRules = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const DICE_COUNT = 7;
  const MATCH_ROUNDS = 4;
  const HEAT_TRIGGER_DICE = DICE_COUNT - 1;
  const MULTIPLIER_STEPS = [1, 2, 3, 5];
  const SCORE_GROWTH_BY_TABLE_MULTIPLIER = { 1: 1, 2: 1.35, 3: 1.8, 5: 2.6 };
  const HOT_DICE_SCORE_GROWTH = [1, 2, 3, 5, 8, 12];
  const DEFAULT_LOADOUT = Array(DICE_COUNT).fill('ordinary');
  const DICE_WEIGHTS = {
    ordinary: [17, 17, 17, 17, 17, 17],
    alanka: [29, 5, 29, 5, 29, 5],
    careful: [24, 14, 10, 14, 24, 14],
    'evil-two': [13, 13, 13, 13, 13, 35],
    devil: [17, 17, 17, 17, 17, 17],
    rain: [17, 17, 17, 17, 17, 17],
    misfortune: [5, 23, 23, 23, 23, 5],
    even: [7, 27, 7, 27, 7, 27],
    lucky: [33, 5, 6, 6, 33, 22],
    greasy: [18, 12, 18, 12, 18, 24],
    bad: [6, 31, 6, 6, 44, 6],
    groschen: [7, 67, 7, 7, 7, 7],
    kingdom: [37, 11, 11, 11, 11, 21],
    'holy-three': [18, 23, 45, 5, 5, 5],
    king: [13, 19, 22, 25, 13, 9],
    'full-foot': [10, 15, 10, 15, 35, 15],
    mathematician: [17, 21, 25, 29, 4, 4],
    molar: [17, 17, 17, 17, 17, 17],
    odd: [27, 7, 27, 7, 27, 7],
    painted: [19, 6, 6, 6, 44, 19],
    pie: [46, 8, 23, 23, 0, 0],
    glazer: [26, 26, 4, 4, 26, 13],
    antiochus: [0, 0, 100, 0, 0, 0],
    low: [22, 11, 11, 11, 11, 33],
    stephen: [17, 17, 17, 17, 17, 17],
    undress: [25, 13, 13, 13, 19, 19],
    three: [13, 6, 56, 6, 13, 6],
    'off-balance': [25, 33, 8, 8, 17, 8],
    unlucky: [9, 27, 18, 18, 18, 9],
    charioteer: [6, 28, 33, 11, 11, 11],
    loaded: [67, 7, 7, 7, 7, 7],
    wisdom: [17, 17, 17, 17, 17, 17]
  };

  function clampInteger(value, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, Math.floor(number))) : min;
  }

  function normalizeLoadout(loadout) {
    return Array.from({ length: DICE_COUNT }, (_, index) => {
      const id = Array.isArray(loadout) ? loadout[index] : null;
      return DICE_WEIGHTS[id] ? id : 'ordinary';
    });
  }

  function randomFloat(random = Math.random) {
    const value = Number(random());
    return Number.isFinite(value) && value >= 0 && value < 1 ? value : Math.random();
  }

  function weightedRoll(weights, random = Math.random) {
    const values = Array.isArray(weights) && weights.length === 6 ? weights : DICE_WEIGHTS.ordinary;
    const total = values.reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0) || 6;
    let point = randomFloat(random) * total;
    for (let index = 0; index < values.length; index += 1) {
      point -= Math.max(0, Number(values[index]) || 0);
      if (point <= 0) return index + 1;
    }
    return 6;
  }

  function rollForLoadout(loadout, indices, random = Math.random) {
    const normalized = normalizeLoadout(loadout);
    return indices.map((index) => weightedRoll(DICE_WEIGHTS[normalized[index]], random));
  }

  function countValues(values) {
    return values.reduce((counts, value) => { counts[value] = (counts[value] || 0) + 1; return counts; }, {});
  }

  function removeSequence(counts, sequence) {
    if (!sequence.every((value) => (counts[value] || 0) > 0)) return false;
    sequence.forEach((value) => { counts[value] -= 1; });
    return true;
  }

  function scoreSelection(values) {
    const list = Array.isArray(values) ? values.map((value) => clampInteger(value, 1, 6)) : [];
    if (!list.length) return { score: 0, label: '等待投掷' };
    const counts = countValues(list);
    const remainingCounts = { ...counts };
    let score = 0;
    const labels = [];
    if (list.length >= 6 && removeSequence(remainingCounts, [1, 2, 3, 4, 5, 6])) {
      score += 1500; labels.push('大顺');
    } else if (list.length >= 5 && removeSequence(remainingCounts, [1, 2, 3, 4, 5])) {
      score += 500; labels.push('小顺 1–5');
    } else if (list.length >= 5 && removeSequence(remainingCounts, [2, 3, 4, 5, 6])) {
      score += 750; labels.push('小顺 2–6');
    }
    Object.entries(remainingCounts).forEach(([rawValue, count]) => {
      if (!count) return;
      const value = Number(rawValue);
      if (count >= 3) {
        const base = value === 1 ? 1000 : value * 100;
        score += base * (2 ** (count - 3));
        labels.push(`${count} 个 ${value}`);
      } else if (value === 1) {
        score += count * 100; labels.push('1 点');
      } else if (value === 5) {
        score += count * 50; labels.push('5 点');
      }
    });
    return { score, label: score ? labels.join(' + ') : '没有得分组合' };
  }

  function allDiceContribute(values) {
    const list = Array.isArray(values) ? values : [];
    if (!list.length) return false;
    const remainingCounts = { ...countValues(list) };
    if (list.length >= 6 && removeSequence(remainingCounts, [1, 2, 3, 4, 5, 6])) {
      // sequence consumed; remaining 1/5/triples are checked below
    } else if (list.length >= 5 && removeSequence(remainingCounts, [1, 2, 3, 4, 5])) {
      // small straight 1-5
    } else if (list.length >= 5 && removeSequence(remainingCounts, [2, 3, 4, 5, 6])) {
      // small straight 2-6
    }
    return Object.entries(remainingCounts).every(([rawValue, count]) => {
      if (!count) return true;
      const value = Number(rawValue);
      return count >= 3 || value === 1 || value === 5;
    });
  }

  function scoreGrowth(multiplier, hotDiceCount) {
    const tableGrowth = SCORE_GROWTH_BY_TABLE_MULTIPLIER[multiplier] || 1;
    const hotIndex = Math.max(0, Math.min(HOT_DICE_SCORE_GROWTH.length - 1, Number(hotDiceCount) || 0));
    return tableGrowth * HOT_DICE_SCORE_GROWTH[hotIndex];
  }

  function createPlayerState(player = {}) {
    return {
      playerId: String(player.playerId || ''),
      name: String(player.name || '旅人'),
      seat: Number(player.seat) || 0,
      loadout: normalizeLoadout(player.loadout),
      total: 0,
      roundBank: null,
      completedRound: false,
      dice: Array(DICE_COUNT).fill(0),
      locked: [],
      activeIndices: [],
      turnScore: 0,
      rollScoreBase: 0,
      hotDiceCount: 0,
      hasRolled: false,
      heatSelectionCounted: false,
      farkle: false
    };
  }

  function createMatchState(players, matchType = 'practice') {
    return {
      phase: 'playing',
      matchType: matchType === 'stake' ? 'stake' : 'practice',
      round: 1,
      suddenDeath: false,
      turnSeat: 0,
      multiplier: 1,
      hasSuccessfulBank: false,
      lastRaiseRound: 0,
      lastRaiseBy: null,
      pendingRaise: null,
      winnerSeat: null,
      players: players.map(createPlayerState),
      sequence: 0,
      stateVersion: 1
    };
  }

  function activeSelection(player) {
    const active = new Set(player.activeIndices);
    return player.locked.filter((index) => active.has(index)).map((index) => player.dice[index]).filter(Boolean);
  }

  function resetTurn(player) {
    player.dice = Array(DICE_COUNT).fill(0);
    player.locked = [];
    player.activeIndices = [];
    player.turnScore = 0;
    player.rollScoreBase = 0;
    player.hotDiceCount = 0;
    player.hasRolled = false;
    player.heatSelectionCounted = false;
    player.farkle = false;
  }

  function completeTurn(match, seat, banked) {
    const player = match.players[seat];
    player.roundBank = Math.max(0, Math.floor(Number(banked) || 0));
    player.completedRound = true;
    resetTurn(player);
    match.turnSeat = seat === 0 ? 1 : 0;
    if (!match.players.every((item) => item.completedRound)) return { roundComplete: false };

    const banks = match.players.map((item) => item.roundBank || 0);
    if (match.suddenDeath && banks[0] !== banks[1]) {
      match.phase = 'finished';
      match.winnerSeat = banks[0] > banks[1] ? 0 : 1;
      return { roundComplete: true, finished: true, banks };
    }
    if (!match.suddenDeath && match.round >= MATCH_ROUNDS) {
      if (match.players[0].total !== match.players[1].total) {
        match.phase = 'finished';
        match.winnerSeat = match.players[0].total > match.players[1].total ? 0 : 1;
        return { roundComplete: true, finished: true, banks };
      }
      match.suddenDeath = true;
    }
    match.round += 1;
    match.players.forEach((item) => { item.roundBank = null; item.completedRound = false; });
    match.turnSeat = 0;
    return { roundComplete: true, finished: false, banks };
  }

  function applyAction(match, seat, action, random = Math.random) {
    if (!match || match.phase !== 'playing') return { error: '对局已经结束。' };
    if (!match.players[seat]) return { error: '玩家座位不存在。' };
    const player = match.players[seat];
    const kind = String(action?.kind || '');
    if (kind !== 'multiplier:respond' && kind !== 'multiplier:propose' && match.turnSeat !== seat) return { error: '还没有轮到你。' };

    if (kind === 'roll') {
      if (match.pendingRaise) return { error: '请先处理倍率申请。' };
      if (player.hasRolled && !allDiceContribute(activeSelection(player))) return { error: '这一掷还有未完成的得分选择。' };
      const heatKind = player.locked.length >= HEAT_TRIGGER_DICE && player.heatSelectionCounted
        ? (player.locked.length >= DICE_COUNT && player.activeIndices.length >= DICE_COUNT ? 'perfect' : 'ordinary')
        : null;
      if (heatKind) {
        player.locked = [];
        player.activeIndices = Array.from({ length: DICE_COUNT }, (_, index) => index);
        player.hasRolled = false;
        player.rollScoreBase = player.turnScore;
        player.heatSelectionCounted = false;
      }
      const indices = heatKind ? player.activeIndices.slice() : Array.from({ length: DICE_COUNT }, (_, index) => index).filter((index) => !player.locked.includes(index));
      const values = rollForLoadout(player.loadout, indices, random);
      indices.forEach((index, offset) => { player.dice[index] = values[offset]; });
      player.activeIndices = indices;
      player.hasRolled = true;
      player.farkle = false;
      player.heatSelectionCounted = false;
      const score = scoreSelection(values).score;
      if (!score) {
        const lostScore = player.turnScore;
        player.turnScore = 0;
        player.farkle = true;
        const transition = completeTurn(match, seat, 0);
        return { type: 'farkle', seat, indices, values, lostScore, heatKind, transition };
      }
      return { type: 'roll', seat, indices, values, heatKind, turnScore: player.turnScore };
    }

    if (kind === 'lock' || kind === 'lock-many') {
      if (!player.hasRolled) return { error: '请先投掷骰子。' };
      const indices = Array.isArray(action.indices) ? action.indices : [action.index];
      const shouldLock = kind === 'lock-many' ? true : action.locked !== false;
      indices.forEach((rawIndex) => {
        const index = clampInteger(rawIndex, 0, DICE_COUNT - 1);
        if (!player.activeIndices.includes(index)) return;
        if (shouldLock && !player.locked.includes(index)) player.locked.push(index);
        if (!shouldLock) player.locked = player.locked.filter((item) => item !== index);
      });
      player.locked.sort((a, b) => a - b);
      const selected = activeSelection(player);
      const rawScore = scoreSelection(selected).score;
      if (rawScore > 0 && allDiceContribute(selected) && !player.heatSelectionCounted) {
        player.heatSelectionCounted = true;
        player.hotDiceCount += 1;
      }
      player.turnScore = player.rollScoreBase + Math.round(rawScore * scoreGrowth(match.multiplier, player.hotDiceCount));
      return { type: 'lock', seat, indices: player.locked.slice(), turnScore: player.turnScore, selected, label: scoreSelection(selected).label };
    }

    if (kind === 'bank') {
      if (!player.hasRolled || player.turnScore <= 0 || !allDiceContribute(activeSelection(player))) return { error: '当前没有可收集的合法分数。' };
      const banked = player.turnScore;
      player.total += banked;
      match.hasSuccessfulBank = true;
      const transition = completeTurn(match, seat, banked);
      return { type: 'bank', seat, banked, total: player.total, transition };
    }

    if (kind === 'multiplier:propose') {
      if (match.matchType !== 'stake') return { error: '练习桌不开放倍率。' };
      if (match.pendingRaise) return { error: '已有倍率申请等待回应。' };
      if (player.hasRolled || match.lastRaiseRound === match.round) return { error: '倍率只能在本回合第一次投掷前申请。' };
      const target = Number(action.target);
      const currentIndex = MULTIPLIER_STEPS.indexOf(match.multiplier);
      if (!MULTIPLIER_STEPS.includes(target) || target !== MULTIPLIER_STEPS[currentIndex + 1]) return { error: '倍率必须按顺序提升。' };
      if (target >= 3 && !match.hasSuccessfulBank) return { error: '完成一次收分后才能申请更高倍率。' };
      match.pendingRaise = { proposer: seat, from: match.multiplier, to: target };
      match.lastRaiseRound = match.round;
      match.lastRaiseBy = seat;
      return { type: 'multiplier:pending', seat, pendingRaise: { ...match.pendingRaise } };
    }

    if (kind === 'multiplier:respond') {
      const pending = match.pendingRaise;
      if (!pending || pending.proposer === seat) return { error: '当前没有需要你回应的倍率申请。' };
      const accepted = action.accepted === true;
      match.pendingRaise = null;
      if (accepted) {
        match.multiplier = pending.to;
        return { type: 'multiplier:accepted', seat, pendingRaise: pending, multiplier: match.multiplier };
      }
      match.phase = 'finished';
      match.winnerSeat = pending.proposer;
      return { type: 'multiplier:declined', seat, pendingRaise: pending, winnerSeat: pending.proposer };
    }

    if (kind === 'forfeit') {
      match.phase = 'finished';
      match.winnerSeat = seat === 0 ? 1 : 0;
      return { type: 'forfeit', seat, winnerSeat: match.winnerSeat };
    }

    return { error: `未知对局动作：${kind}` };
  }

  function publicMatchState(match) {
    return {
      phase: match.phase,
      matchType: match.matchType,
      round: match.round,
      suddenDeath: match.suddenDeath,
      turnSeat: match.turnSeat,
      multiplier: match.multiplier,
      hasSuccessfulBank: match.hasSuccessfulBank,
      lastRaiseRound: match.lastRaiseRound,
      lastRaiseBy: match.lastRaiseBy,
      pendingRaise: match.pendingRaise ? { ...match.pendingRaise } : null,
      winnerSeat: match.winnerSeat,
      sequence: match.sequence,
      stateVersion: match.stateVersion,
      players: match.players.map((player) => ({
        playerId: player.playerId,
        name: player.name,
        seat: player.seat,
        total: player.total,
        roundBank: player.roundBank,
        dice: player.dice.slice(),
        locked: player.locked.slice(),
        activeIndices: player.activeIndices.slice(),
        turnScore: player.turnScore,
        hotDiceCount: player.hotDiceCount,
        hasRolled: player.hasRolled,
        farkle: player.farkle
      }))
    };
  }

  return {
    DICE_COUNT,
    MATCH_ROUNDS,
    HEAT_TRIGGER_DICE,
    MULTIPLIER_STEPS,
    DEFAULT_LOADOUT,
    DICE_WEIGHTS,
    normalizeLoadout,
    weightedRoll,
    rollForLoadout,
    scoreSelection,
    allDiceContribute,
    scoreGrowth,
    createMatchState,
    applyAction,
    publicMatchState
  };
});
