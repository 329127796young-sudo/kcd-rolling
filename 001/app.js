const diceCatalog = [
  { id: 'alanka', name: '阿兰卡的骰子', desc: '偏爱奇数 · 1 / 3 / 5', weights: [29, 5, 29, 5, 29, 5] },
  { id: 'careful', name: '谨慎骗子的骰子', desc: '1、5 更常出现', weights: [24, 14, 10, 14, 24, 14] },
  { id: 'evil-two', name: '恶二骰', desc: '偏爱 6 点', weights: [13, 13, 13, 13, 13, 35] },
  { id: 'devil', name: '魔鬼骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] },
  { id: 'rain', name: '雨果的骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] },
  { id: 'misfortune', name: '厄运骰', desc: '中间点数更常见', weights: [5, 23, 23, 23, 23, 5] },
  { id: 'even', name: '偶数骰子', desc: '偏爱 2、4、6', weights: [7, 27, 7, 27, 7, 27] },
  { id: 'lucky', name: '幸运骰子', desc: '1、5、6 偏高', weights: [33, 5, 6, 6, 33, 22] },
  { id: 'greasy', name: '油腻骰子', desc: '1、3、5、6 偏高', weights: [18, 12, 18, 12, 18, 24] },
  { id: 'bad', name: '坏骰子', desc: '5 点异常常见', weights: [6, 31, 6, 6, 44, 6] },
  { id: 'groschen', name: '格罗什夫的幸运骰子', desc: '2 点异常常见', weights: [7, 67, 7, 7, 7, 7] },
  { id: 'kingdom', name: '天国骰', desc: '1、6 偏高', weights: [37, 11, 11, 11, 11, 21] },
  { id: 'holy-three', name: '圣三骰子', desc: '3 点异常常见', weights: [18, 23, 45, 5, 5, 5] },
  { id: 'king', name: '国王骰子', desc: '4 点偏高', weights: [13, 19, 22, 25, 13, 9] },
  { id: 'full-foot', name: '整脚骰子', desc: '5 点偏高', weights: [10, 15, 10, 15, 35, 15] },
  { id: 'mathematician', name: '数学家的骰子', desc: '4 点偏高', weights: [17, 21, 25, 29, 4, 4] },
  { id: 'molar', name: '臼齿骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] },
  { id: 'odd', name: '奇数骰子', desc: '偏爱 1、3、5', weights: [27, 7, 27, 7, 27, 7] },
  { id: 'ordinary', name: '普通骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] },
  { id: 'painted', name: '涂漆骰子', desc: '5 点异常常见', weights: [19, 6, 6, 6, 44, 19] },
  { id: 'pie', name: '派骰子', desc: '偏爱 1、3、4', weights: [46, 8, 23, 23, 0, 0] },
  { id: 'glazer', name: '悲伤格雷泽的骰子', desc: '1、2、5 偏高', weights: [26, 26, 4, 4, 26, 13] },
  { id: 'antiochus', name: '圣安提哥克斯的骰子', desc: '只会掷出 3 点', weights: [0, 0, 100, 0, 0, 0] },
  { id: 'low', name: '低出骰', desc: '偏爱低点数', weights: [22, 11, 11, 11, 11, 33] },
  { id: 'stephen', name: '圣斯蒂芬骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] },
  { id: 'undress', name: '脱衣骰子', desc: '1、5、6 偏高', weights: [25, 13, 13, 13, 19, 19] },
  { id: 'three', name: '出三骰', desc: '3 点异常常见', weights: [13, 6, 56, 6, 13, 6] },
  { id: 'off-balance', name: '失衡骰子', desc: '2 点偏高', weights: [25, 33, 8, 8, 17, 8] },
  { id: 'unlucky', name: '倒霉骰子', desc: '2、3、4、5 偏高', weights: [9, 27, 18, 18, 18, 9] },
  { id: 'charioteer', name: '战车御者的骰子', desc: '2、3 偏高', weights: [6, 28, 33, 11, 11, 11] },
  { id: 'loaded', name: '灌铅骰子', desc: '几乎总是 1 点', weights: [67, 7, 7, 7, 7, 7] },
  { id: 'wisdom', name: '智齿骰子', desc: '均匀分布', weights: [17, 17, 17, 17, 17, 17] }
];

const opponents = {
  milo: { name: '米洛 · 老练', short: '稳健型 · 喜欢在第二掷收集', status: '等待你的投掷', bankAt: 350, loadout: ['ordinary', 'ordinary', 'careful', 'evil-two', 'odd', 'ordinary'] },
  vlad: { name: '瓦茨拉夫 · 赌徒', short: '冒险型 · 追逐热骰与大顺', status: '准备冒险一掷', bankAt: 620, loadout: ['lucky', 'odd', 'odd', 'kingdom', 'painted', 'devil'] },
  marta: { name: '玛蒂娜 · 酒馆老板', short: '防守型 · 只拿稳妥分数', status: '从不贪杯', bankAt: 220, loadout: ['careful', 'ordinary', 'careful', 'ordinary', 'loaded', 'ordinary'] }
};
const DEFAULT_LOADOUT = Object.freeze(['ordinary', 'ordinary', 'ordinary', 'ordinary', 'ordinary', 'ordinary']);

const state = {
  target: 2000, playerTotal: 0, opponentTotal: 0, roundScore: 0, rollScoreBase: 0, activeRollIndices: [], round: 1, mode: 'solo',
  dice: [0, 0, 0, 0, 0, 0], locked: new Set(), hasRolled: false, rolling: false,
  turn: 'player', gameOver: false, room: 'WHT-731', equipSlot: 0,
  loadout: [...DEFAULT_LOADOUT],
  opponentId: 'milo', opponentLoadout: opponents.milo.loadout,
  opponentDice: [], opponentKept: [], opponentRoundScore: 0, opponentRolling: false
};

const $ = (selector) => document.querySelector(selector);
const els = {
  home: $('#home-screen'), arena: document.querySelector('.arena'), startGame: $('#start-game'), homeLoadout: $('#home-loadout'), homeCards: $('#opponent-cards'), homeTabs: document.querySelectorAll('.home-tab'), homeButton: $('#home-button'), restart: $('#restart-button'), ritual: $('#roll-ritual'),
  diceState: $('#dice-state'), roll: $('#roll-button'), rollLabel: $('#roll-label'),
  bank: $('#bank-button'), bankAmount: $('#bank-amount'), playerTotal: $('#player-total'),
  opponentRight: $('#opponent-total-right'), remaining: $('#remaining-dice'), comboName: $('#combo-name'),
  comboDetail: $('#combo-detail'), selectionScore: $('#selection-score'), turnLabel: $('#turn-label'), turnDetail: $('#turn-detail'),
  opponentName: $('#opponent-name'), opponentStatus: $('#opponent-status'), activity: $('#activity-list'),
  room: $('#room-code'), toast: $('#toast'), modeToggle: $('#mode-toggle'), modeLabel: $('#mode-label'),
  loadoutSlots: $('#loadout-slots'), restoreLoadout: $('#reset-loadout'),
  codexModal: $('#modal-backdrop'), codexTitle: $('#codex-title'), codexKicker: $('#codex-kicker'),
  codexPage: $('#codex-page'), codexContent: $('#codex-content'), codexDots: $('#page-dots'), prev: $('#page-prev'), next: $('#page-next'),
  tableStage: document.querySelector('.table-stage'), soundToggle: $('#sound-toggle')
};
const dicePhysics3D = window.DicePhysics3D || { init: () => {}, rollDice: () => [], onRollComplete: () => {} };

// ---------------------------------------------------------------------------
// 音效引擎：全部使用 Web Audio API 实时合成，不依赖任何外部音频文件。
// ---------------------------------------------------------------------------
const audio = (() => {
  let ctx = null; let muted = false;
  function ensureCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function noiseBuffer(context, duration) {
    const size = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, size, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / size);
    return buffer;
  }
  function tone(context, { freq, type = 'sine', start, duration, peak = 0.25 }) {
    const osc = context.createOscillator(); osc.type = type; osc.frequency.setValueAtTime(freq, start);
    const gain = context.createGain(); gain.gain.setValueAtTime(0.0001, start); gain.gain.linearRampToValueAtTime(peak, start + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(context.destination); osc.start(start); osc.stop(start + duration + 0.02);
  }
  function playShake() {
    if (muted) return; const context = ensureCtx();
    for (let i = 0; i < 4; i += 1) {
      const t = context.currentTime + i * 0.1 + Math.random() * 0.03;
      const src = context.createBufferSource(); src.buffer = noiseBuffer(context, 0.09);
      const filter = context.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1000 + Math.random() * 900; filter.Q.value = 0.9;
      const gain = context.createGain(); gain.gain.setValueAtTime(0.0001, t); gain.gain.linearRampToValueAtTime(0.22, t + 0.008); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      src.connect(filter).connect(gain).connect(context.destination); src.start(t); src.stop(t + 0.1);
    }
  }
  function playLand() {
    if (muted) return; const context = ensureCtx(); const t = context.currentTime;
    const src = context.createBufferSource(); src.buffer = noiseBuffer(context, 0.14);
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 850;
    const gain = context.createGain(); gain.gain.setValueAtTime(0.32, t); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    src.connect(filter).connect(gain).connect(context.destination); src.start(t); src.stop(t + 0.25);
    tone(context, { freq: 130, type: 'sine', start: t, duration: 0.2, peak: 0.28 });
  }
  function playClick() { if (!muted) tone(ensureCtx(), { freq: 720, type: 'triangle', start: ensureCtx().currentTime, duration: 0.06, peak: 0.2 }); }
  function playDeny() { if (!muted) tone(ensureCtx(), { freq: 160, type: 'square', start: ensureCtx().currentTime, duration: 0.09, peak: 0.12 }); }
  function playBank() {
    if (muted) return; const context = ensureCtx(); const t = context.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => tone(context, { freq, type: 'sine', start: t + i * 0.09, duration: 0.32, peak: 0.26 }));
  }
  function playFarkle() {
    if (muted) return; const context = ensureCtx(); const t = context.currentTime;
    [220, 196, 164.81].forEach((freq, i) => tone(context, { freq, type: 'sawtooth', start: t + i * 0.12, duration: 0.28, peak: 0.16 }));
  }
  function playWin() {
    if (muted) return; const context = ensureCtx(); const t = context.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(context, { freq, type: 'sine', start: t + i * 0.1, duration: 0.5, peak: 0.3 }));
  }
  return { playShake, playLand, playClick, playDeny, playBank, playFarkle, playWin, setMuted: (value) => { muted = value; }, get muted() { return muted; } };
})();

// ---------------------------------------------------------------------------
// 数字滚动过渡：让总分变化时有"滚动计数"而不是瞬间跳变。
// ---------------------------------------------------------------------------
function animateNumber(el, to, duration = 420) {
  if (!el) return; const from = Number(el.textContent) || 0; if (from === to) { el.textContent = to; return; }
  const start = performance.now();
  function step(now) {
    const progress = Math.min(1, (now - start) / duration); const eased = 1 - (1 - progress) ** 3;
    el.textContent = Math.round(from + (to - from) * eased);
    if (progress < 1) window.requestAnimationFrame(step); else el.textContent = to;
  }
  window.requestAnimationFrame(step);
}

function safeAudio(method) {
  try { audio[method]?.(); } catch (error) { console.warn(`[audio:${method}]`, error); }
}

function shakeStage() { if (!els.tableStage) return; els.tableStage.classList.add('shake'); dicePhysics3D.pulse?.('farkle'); window.setTimeout(() => els.tableStage.classList.remove('shake'), 480); }
function celebrateStage() { if (!els.tableStage) return; els.tableStage.classList.add('celebrate'); dicePhysics3D.pulse?.('bank'); window.setTimeout(() => els.tableStage.classList.remove('celebrate'), 620); }


const pipMap = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const pages = [
  { kicker: '骰子：基本规则', title: '骰子：基本规则', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die">${pipFace(1)}</div><div class="codex-die">${pipFace(5)}</div><div class="codex-die">${pipFace(6)}</div><div class="codex-die">${pipFace(3)}</div><div class="codex-caption">任意选择骰子 · 继续投掷剩余骰子</div></div><div class="codex-copy"><h3>骰子游戏</h3><p>如果你对赌博感兴趣，在任何一家体面的酒馆里都可以进行骰子游戏。</p><h4>选择骰子</h4><p>如果你的物品栏中有骰子，你可以在开始赌局之前选择使用他。大多数骰子都有自身特性，可以阅读它们的描述来了解相关信息。</p><h4>游戏进程</h4><p>游戏开始时，你将投掷全部六枚骰子。你可以标记任意骰子保留，接着继续投掷剩余的骰子；最终组合是否计分由点数规则决定。</p><p>暂存组合没有得分也不会限制继续投掷，分数会保持为 0；如果剩余骰子的下一掷没有任何获分骰子，则会触发爆骰并结束本轮。</p></div></div>` },
  { kicker: '骰子：点数组合', title: '骰子：点数组合', content: `<div class="codex-copy"><p>以下为所有骰子组合及其点数值。</p></div><table class="rule-table"><thead><tr><th>组合</th><th>点数</th><th>说明</th></tr></thead><tbody><tr><td>单个 1</td><td>100</td><td>可单独保留</td></tr><tr><td>单个 5</td><td>50</td><td>可单独保留</td></tr><tr><td>三个相同</td><td>1000 / 200–600</td><td>1 点为 1000，其余点数 × 100</td></tr><tr><td>四个相同</td><td>三同的 2 倍</td><td>三个骰子后每增加一个骰子，点数翻倍</td></tr><tr><td>五个、六个相同</td><td>继续翻倍</td><td>全部骰子得分时触发热骰</td></tr><tr><td>小顺 1–5 / 2–6</td><td>750</td><td>连续五个点数</td></tr><tr><td>大顺 1–6</td><td>1500</td><td>六个点数全部出现</td></tr><tr><td>三对</td><td>1500</td><td>三组相同点数</td></tr></tbody></table>` },
  { kicker: '骰子：属性与概率', title: '骰子：属性与概率', content: `<p class="codex-intro">不同骰子会改变各点数出现的概率。装备后，投掷将使用对应权重。</p><div class="prob-table" id="probability-table"></div>` },
  { kicker: '骰子：保留与爆骰', title: '骰子：保留与爆骰', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die locked-demo">${pipFace(1)}</div><div class="codex-die locked-demo">${pipFace(5)}</div><div class="codex-die">${pipFace(2)}</div></div><div class="codex-copy"><h3>把握时机</h3><p>点击任意骰子都可以将它保留。保留的骰子会从下一次投掷中移出，并按当前组合计入本轮暂存分数；暂时没有得分的组合也不会阻止你的选择。</p><p>你可以随时收集本轮分数结束回合。继续投掷会带来更多分数，也会让你承担爆骰归零的风险；最终没有得分时，本轮分数由你自行承担并保持为 0。</p></div></div>` },
  { kicker: '骰子：获胜条件', title: '骰子：获胜条件', content: `<div class="codex-columns"><div class="codex-copy"><h3>先到目标分数者获胜</h3><p>每位玩家的已赢取点数会显示在牌桌两侧。默认目标为 2000 分，也可以在完整游戏中调整目标。</p><h4>收集分数</h4><p>点击“收集”把本轮已保留的点数计入你的总分，然后交给对手回合。</p></div><div class="codex-illustration"><div class="codex-score">0 <span>/ 2000</span></div><div class="codex-score opponent-score-demo">0 <span>/ 2000</span></div></div></div>` },
  { kicker: '骰子：牌桌提示', title: '骰子：牌桌提示', content: `<div class="codex-copy"><h3>旅人的三条忠告</h3><p>一、先保留稳定的 1 和 5，再考虑高风险的三同与顺子。</p><p>二、当本轮分数足够接近目标时，及时收集，不要把胜利交给下一掷。</p><p>三、装备骰子会改变概率。打开骰子库，查看每一面真实的出现机会。</p></div>` }
];

let currentPage = 0;
let toastTimer;
let turnTimer;

function pipFace(value) {
  return `<span class="pip-grid">${Array.from({ length: 9 }, (_, index) => `<i class="pip ${pipMap[value].includes(index) ? '' : 'hidden'}"></i>`).join('')}</span>`;
}

function weightedRoll(weights) {
  const total = weights.reduce((sum, weight) => sum + weight, 0); let point = Math.random() * total;
  for (let i = 0; i < weights.length; i += 1) { point -= weights[i]; if (point <= 0) return i + 1; }
  return 6;
}

function dieById(id) { return diceCatalog.find((die) => die.id === id) || diceCatalog[0]; }
function currentDie(slot = 0) { return dieById(state.loadout[slot]); }

function countValues(values) { return values.reduce((counts, value) => { counts[value] = (counts[value] || 0) + 1; return counts; }, {}); }

function scoreSelection(values) {
  if (!values.length) return { score: 0, label: '等待投掷', detail: '1 点 = 100 · 5 点 = 50' };
  const counts = countValues(values); const unique = Object.keys(counts).map(Number).sort((a, b) => a - b).join('');
  if (unique === '123456') return { score: 1500, label: '大顺', detail: '1 至 6 全部出现 · +1500' };
  if (unique === '12345' || unique === '23456') return { score: 750, label: '小顺', detail: '连续五个点数 · +750' };
  if (values.length === 6 && Object.values(counts).every((count) => count === 2)) return { score: 1500, label: '三对', detail: '三组相同点数 · +1500' };
  let score = 0; const labels = [];
  Object.entries(counts).forEach(([rawValue, count]) => {
    const value = Number(rawValue);
    if (count >= 3) { const base = value === 1 ? 1000 : value * 100; score += base * (2 ** (count - 3)); labels.push(`${count} 个 ${value}`); }
    else { if (value === 1) { score += count * 100; labels.push('1 点'); } if (value === 5) { score += count * 50; labels.push('5 点'); } }
  });
  return { score, label: score ? labels.join(' + ') : '没有得分组合', detail: score ? `已锁定 ${values.length} 枚骰子` : '当前组合不计分 · 本轮风险由你承担' };
}

function selectedValues() { return [...state.locked].map((index) => state.dice[index]); }
function availableValues() { return state.dice.filter((_, index) => !state.locked.has(index)); }
function activeRollValues() {
  const active = new Set(state.activeRollIndices);
  return [...state.locked].filter((index) => active.has(index)).map((index) => state.dice[index]);
}
function recalculateRoundScore() { state.roundScore = state.rollScoreBase + scoreSelection(activeRollValues()).score; return state.roundScore; }

function renderDice() {
  // Dice are rendered only by the Three.js canvas. Keep this hook so the
  // state machine can reset cleanly without a second visual dice surface.
}

function renderOpponentDice() {
  // Opponent dice use the same 3D canvas and fixed six-slot pool.
}

function addActivity(type, message, time = '刚刚') {
  const item = document.createElement('div'); item.className = `activity-item ${type}`; item.innerHTML = `<span class="activity-dot"></span><div class="activity-copy">${message}<time>${time}</time></div>`;
  els.activity.prepend(item); while (els.activity.children.length > 5) els.activity.lastElementChild.remove();
}

function updateEquipped() {
  els.loadoutSlots.innerHTML = state.loadout.map((id, slot) => { const die = dieById(id); return `<button class="loadout-slot ${slot === state.equipSlot ? 'selected' : ''}" data-slot="${slot}" type="button" title="槽位 ${slot + 1} · ${die.name}"><span class="slot-number">${slot + 1}</span><span class="slot-die">${pipFace((slot % 6) + 1)}</span><span class="slot-name">${die.name.replace('的骰子', '')}</span></button>`; }).join('');
  els.loadoutSlots.querySelectorAll('.loadout-slot').forEach((slot) => slot.addEventListener('click', () => { state.equipSlot = Number(slot.dataset.slot); openCodex(2); }));
}

function updateUI() {
  const currentSelection = scoreSelection(activeRollValues());
  const selected = { score: state.roundScore, label: currentSelection.score ? currentSelection.label : state.roundScore ? '本轮暂存' : currentSelection.label, detail: currentSelection.score ? currentSelection.detail : state.roundScore ? `本轮累计 ${state.roundScore} 分` : currentSelection.detail };
  const available = availableValues();
  animateNumber(els.playerTotal, state.playerTotal); animateNumber(els.opponentRight, state.opponentTotal); els.bankAmount.textContent = state.roundScore;
  if (els.opponentRoundScore) els.opponentRoundScore.textContent = state.opponentRoundScore;
  els.remaining.textContent = state.hasRolled ? `可投掷 ${available.length} 枚` : '可投掷 6 枚';
  els.selectionScore.textContent = selected.score; els.comboName.textContent = state.hasRolled ? selected.label : '等待投掷'; els.comboDetail.textContent = state.hasRolled ? selected.detail : '1 点 = 100 · 5 点 = 50';
  els.bank.disabled = state.turn !== 'player' || state.rolling || state.roundScore <= 0 || state.gameOver; els.roll.disabled = state.turn !== 'player' || state.rolling || state.gameOver;
  els.rollLabel.textContent = state.hasRolled ? (state.locked.size === 6 ? '热骰 · 再掷' : '再次投掷') : '投掷骰子';
  els.diceState.textContent = state.rolling ? '骰子在桌面上翻滚……' : state.turn === 'ai' ? '对手正在思考下一掷 · 你可以看见他的骰池变化' : state.gameOver ? '牌局已结束 · 点击重新开始' : !state.hasRolled ? '投掷六枚骰子，点击 3D 骰子锁定任意点数' : available.length === 0 ? '六枚骰子均已锁定 · 可以继续投掷（热骰）或收集' : state.locked.size ? `已锁定 ${state.locked.size} 枚骰子 · 剩余骰子可以继续投掷或收集` : '点击 3D 骰子锁定任意点数';
  els.turnLabel.textContent = state.turn === 'player' ? '你的回合' : state.gameOver ? '牌局结束' : '对手回合'; els.turnDetail.textContent = state.turn === 'player' ? '选择任意骰子并保留' : '米洛正在掷骰'; els.opponentStatus.textContent = state.turn === 'player' ? '等待你的投掷' : state.gameOver ? '胜负已定' : '正在掷骰';
  if (els.opponentBoardTurn) els.opponentBoardTurn.textContent = state.turn === 'ai' ? '正在投掷 · 你可观察' : '等待你的回合';
  if (els.playerBoardTurn) { els.playerBoardTurn.textContent = state.turn === 'player' ? '选择任意骰子并保留' : '暂时观战'; els.playerBoardTurn.classList.toggle('active', state.turn === 'player'); }
  renderOpponentDice();
  document.body.classList.toggle('farkle', state.farkle); document.body.classList.toggle('hot-dice', state.hotDice);
}

function toggleDie(index, source = 'ui') {
  if (!state.hasRolled || state.rolling || state.turn !== 'player' || state.gameOver) return false;
  const next = new Set(state.locked); if (next.has(index)) next.delete(index); else next.add(index);
  safeAudio('playClick'); state.locked = next; recalculateRoundScore();
  if (source !== '3d') dicePhysics3D.setLocked?.('player', index, next.has(index), state.dice[index]);
  renderDice(); updateUI();
  if (state.roundScore > 0) { addActivity('you', `<b>你</b> 保留骰子，当前本轮 <strong>${state.roundScore}</strong> 分`); }
  return true;
}

function takeScoringDice() {
  if (!state.hasRolled || state.turn !== 'player' || state.rolling || state.gameOver) return;
  const availableIndices = state.dice.map((_, index) => index).filter((index) => !state.locked.has(index)); const picks = chooseScoringIndices(availableValues());
  if (!picks.length) { showToast('这一掷没有可保留的得分骰子'); return; }
  picks.forEach((pick) => {
    const index = availableIndices[pick];
    state.locked.add(index);
    dicePhysics3D.setLocked?.('player', index, true, state.dice[index]);
  });
  recalculateRoundScore(); renderDice(); updateUI(); addActivity('you', `<b>你</b> 快速保留得分骰子，本轮 <strong>${state.roundScore}</strong> 分`);
}

function rollDice(impulse = null) {
  if (state.turn !== 'player' || state.rolling || state.gameOver) return;
  state.rolling = true; state.farkle = false; state.hotDice = false; els.ritual?.classList.add('active'); updateUI();
  try { dicePhysics3D.pulse?.('roll'); } catch (error) { console.warn('[dice:pulse]', error); }
  safeAudio('playShake');
  if (state.locked.size === 6) {
    try { dicePhysics3D.resetOwner?.('player'); } catch (error) { console.warn('[dice:reset]', error); }
    state.locked.clear(); state.hasRolled = false; state.hotDice = true; showToast('热骰！六枚骰子重新加入投掷');
  }
  const lockedAtRoll = new Set(state.locked);
  const nextValues = state.dice.map((value, index) => lockedAtRoll.has(index) ? value : weightedRoll(currentDie(index).weights));
  const physicsIndices = nextValues.map((_, index) => index).filter((index) => !lockedAtRoll.has(index));
  const physicsTargets = physicsIndices.map((index) => nextValues[index]);
  state.rollScoreBase = state.roundScore;
  state.activeRollIndices = physicsIndices.slice();
  try {
    dicePhysics3D.rollDice(physicsTargets.length, physicsTargets, undefined, { owner: 'player', indices: physicsIndices, impulse });
  } catch (error) {
    // A failed optional 3D layer must never leave the game turn in a rolling state.
    console.warn('[dice:physics]', error);
  }
  window.setTimeout(() => {
    state.dice = nextValues; state.hasRolled = true; state.rolling = false; recalculateRoundScore(); els.ritual?.classList.remove('active'); renderDice(); updateUI();
    safeAudio('playLand');
    addActivity('you', `<b>你</b> 掷出 ${state.dice.join(' · ')} 点`);
    if (availableValues().length && scoreSelection(availableValues()).score === 0) farkleTurn(); else { showToast(state.hotDice ? '热骰继续，风险与分数一起增加' : '可锁定任意骰子，组合分数按规则计算'); }
  }, 560);
}

function bankScore() {
  if (state.roundScore <= 0 || state.turn !== 'player' || state.rolling || state.gameOver) return;
  const banked = state.roundScore; state.playerTotal += banked; safeAudio('playBank'); celebrateStage(); addActivity('you', `<b>你</b> 收集了 <strong>${banked}</strong> 分`, '本轮结算'); dicePhysics3D.resetOwner?.('player'); state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.locked.clear(); state.hasRolled = false; state.hotDice = false; state.farkle = false; renderDice(); updateUI();
  if (state.playerTotal >= state.target) { finishGame('player'); return; }
  passToOpponent();
}

function farkleTurn() {
  state.farkle = true; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; updateUI(); safeAudio('playFarkle'); shakeStage(); addActivity('ai', '<b>爆骰</b>！本轮未掷出任何得分骰子，分数归零', '本轮结束'); showToast('爆骰！本轮分数归零'); window.setTimeout(() => { dicePhysics3D.resetOwner?.('player'); state.locked.clear(); state.hasRolled = false; state.farkle = false; passToOpponent(); }, 900);
}

function passToOpponent() {
  dicePhysics3D.resetOwner?.('player'); state.turn = 'ai'; state.hasRolled = false; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.locked.clear(); state.opponentDice = []; state.opponentKept = []; state.opponentRoundScore = 0; renderDice(); renderOpponentDice(); updateUI(); clearTimeout(turnTimer); turnTimer = window.setTimeout(opponentRoll, 620);
}

function chooseScoringIndices(values) {
  if (!values.length) return [];
  const counts = countValues(values); const unique = Object.keys(counts).map(Number).sort((a, b) => a - b).join('');
  if (unique === '123456') return values.map((_, index) => index);
  if (unique === '12345' || unique === '23456') return values.map((_, index) => index).slice(0, 5);
  if (values.length === 6 && Object.values(counts).every((count) => count === 2)) return values.map((_, index) => index);
  const picked = [];
  Object.entries(counts).forEach(([raw, count]) => { const value = Number(raw); if (count >= 3) values.forEach((entry, index) => { if (entry === value) picked.push(index); }); });
  values.forEach((value, index) => { if ((value === 1 || value === 5) && !picked.includes(index)) picked.push(index); });
  return picked;
}

function opponentRoll() {
  if (state.turn !== 'ai' || state.gameOver) return;
  const opponentCount = state.opponentDice.length || 6;
  const opponentTargets = Array.from({ length: opponentCount }, (_, index) => weightedRoll(dieById(state.opponentLoadout?.[index] || 'ordinary').weights));
  state.opponentRolling = true; renderOpponentDice(); updateUI();
  try { dicePhysics3D.pulse?.('roll'); dicePhysics3D.rollDice(opponentCount, opponentTargets, undefined, { owner: 'opponent', replace: true }); } catch (error) { console.warn('[dice:opponent-physics]', error); }
  safeAudio('playShake');
  window.setTimeout(() => {
    state.opponentDice = opponentTargets;
    state.opponentRolling = false; renderOpponentDice(); updateUI(); safeAudio('playLand'); addActivity('ai', `<b>${els.opponentName.textContent}</b> 掷出 ${state.opponentDice.join(' · ')} 点`, '对手回合');
    const pickedIndices = chooseScoringIndices(state.opponentDice);
    if (!pickedIndices.length) { state.farkle = true; state.opponentRoundScore = 0; renderOpponentDice(); updateUI(); addActivity('ai', `<b>${els.opponentName.textContent}</b> 爆骰，本轮分数归零`, '对手回合结束'); showToast('对手爆骰，轮到你'); turnTimer = window.setTimeout(startPlayerTurn, 900); return; }
    const pickedSet = new Set(pickedIndices); const pickedValues = state.opponentDice.filter((_, index) => pickedSet.has(index)); state.opponentKept.push(...pickedValues); state.opponentDice = state.opponentDice.filter((_, index) => !pickedSet.has(index)); state.opponentRoundScore = scoreSelection(state.opponentKept).score; renderOpponentDice(); updateUI();
    addActivity('ai', `<b>${els.opponentName.textContent}</b> 保留 ${pickedValues.join(' · ')}，本轮 <strong>${state.opponentRoundScore}</strong> 分`, '对手回合');
    if (!state.opponentDice.length) { state.hotDice = true; showToast('对手热骰，六枚骰子重新加入'); turnTimer = window.setTimeout(() => { state.opponentDice = []; state.hotDice = false; opponentRoll(); }, 700); return; }
    const shouldBank = state.opponentRoundScore >= (state.opponentTotal > 1500 ? 250 : 350) || Math.random() > .45; turnTimer = window.setTimeout(shouldBank ? opponentBank : opponentRoll, 780);
  }, 520);
}

function opponentBank() {
  if (state.turn !== 'ai') return;
  const gain = state.opponentRoundScore; state.opponentTotal += gain; safeAudio('playBank'); addActivity('ai', `<b>${els.opponentName.textContent}</b> 收集了 <strong>${gain}</strong> 分`, '对手回合结算'); dicePhysics3D.resetOwner?.('opponent'); state.farkle = false; renderOpponentDice(); updateUI();
  if (state.opponentTotal >= state.target) { finishGame('opponent'); return; }
  turnTimer = window.setTimeout(startPlayerTurn, 880);
}

function startPlayerTurn() {
  dicePhysics3D.resetOwner?.('player'); state.round += 1; state.turn = 'player'; state.hasRolled = false; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.locked.clear(); state.dice = [0, 0, 0, 0, 0, 0]; state.farkle = false; state.hotDice = false; renderDice(); updateUI(); showToast(`第 ${String(state.round).padStart(2, '0')} 回合 · 轮到你`);
}

function finishGame(winner) { state.gameOver = true; state.turn = 'player'; updateUI(); if (winner === 'player') { safeAudio('playWin'); celebrateStage(); } else { safeAudio('playFarkle'); shakeStage(); } showToast(winner === 'player' ? '\u4F60\u5148\u5230\u8FBE\u76EE\u6807\u5206\u6570\uFF0C\u8D62\u4E0B\u8FD9\u5C40\uFF01' : '\u7C73\u6D1B\u5148\u5230\u8FBE\u76EE\u6807\u5206\u6570\uFF0C\u8FD9\u5C40\u5F52\u4ED6\u3002'); addActivity(winner === 'player' ? 'you' : 'ai', winner === 'player' ? '<b>你</b> 赢下墙洞酒馆牌桌' : '<b>米洛</b> 赢下墙洞酒馆牌桌', '牌局结束'); }

function resetGame(announce = true) { clearTimeout(turnTimer); dicePhysics3D.resetOwner?.('player'); dicePhysics3D.resetOwner?.('opponent'); const profile = opponents[state.opponentId]; state.playerTotal = 0; state.opponentTotal = 0; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.opponentRoundScore = 0; state.round = 1; state.dice = [0, 0, 0, 0, 0, 0]; state.opponentDice = []; state.opponentKept = []; state.locked.clear(); state.hasRolled = false; state.rolling = false; state.turn = 'player'; state.gameOver = false; state.farkle = false; state.hotDice = false; state.opponentLoadout = profile.loadout; els.opponentName.textContent = profile.name; els.opponentStatus.textContent = profile.status; els.room.textContent = state.mode === 'online' ? 'DUEL-208' : state.room; els.activity.innerHTML = ''; els.playerTotal.textContent = state.playerTotal; els.opponentRight.textContent = state.opponentTotal; addActivity('ai', `<b>${profile.name}</b> 把骰盅推到桌边，等你先手`, '刚才'); addActivity('you', '<b>你</b> 坐上墙洞酒馆牌桌', '刚才'); renderDice(); renderOpponentDice(); updateEquipped(); updateUI(); if (announce) showToast('牌桌已重新开始'); }

function showToast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2200); }

function renderProbabilityTable() {
  const header = `<div class="prob-row head"><span>骰子名称</span><span>1点</span><span>2点</span><span>3点</span><span>4点</span><span>5点</span><span>6点</span></div>`;
  els.codexContent.querySelector('#probability-table').innerHTML = header + diceCatalog.map((die) => `<button class="prob-row" data-die-id="${die.id}" type="button"><span>${die.name}</span>${die.weights.map((weight) => `<span>${weight}%</span>`).join('')}</button>`).join('');
  els.codexContent.querySelectorAll('[data-die-id]').forEach((row) => row.addEventListener('click', () => { equipDie(row.dataset.dieId); closeCodex(); }));
}

function setCodexPage(index) { currentPage = Math.max(0, Math.min(pages.length - 1, index)); const page = pages[currentPage]; els.codexKicker.textContent = page.kicker; els.codexPage.textContent = `${currentPage + 1} / ${pages.length}`; els.codexTitle.innerHTML = `${page.title} <em>(${currentPage + 1}/${pages.length})</em>`; els.codexContent.innerHTML = page.content; els.prev.disabled = currentPage === 0; els.next.disabled = currentPage === pages.length - 1; els.codexDots.innerHTML = pages.map((_, pageIndex) => `<i class="${pageIndex === currentPage ? 'active' : ''}"></i>`).join(''); if (currentPage === 2) { els.codexContent.insertAdjacentHTML('afterbegin', `<p class="codex-intro">正在编辑第 ${state.equipSlot + 1} 个装备槽位 · 点击下方骰子即可替换</p>`); renderProbabilityTable(); } }

function openCodex(pageIndex = 0) { setCodexPage(pageIndex); els.codexModal.classList.remove('hidden'); }
function closeCodex() { els.codexModal.classList.add('hidden'); }
function equipDie(id) { const die = diceCatalog.find((item) => item.id === id); if (!die) return; state.loadout[state.equipSlot] = id; updateEquipped(); showToast(`槽位 ${state.equipSlot + 1} 已装备：${die.name}`); }

function restoreDefaultLoadout() {
  state.loadout = [...DEFAULT_LOADOUT];
  updateEquipped();
  showToast('已还原为六枚普通骰');
}

function toggleMode() {
  state.mode = state.mode === 'solo' ? 'online' : 'solo';
  const online = state.mode === 'online'; els.modeLabel.textContent = online ? '联机演示' : '本地练习'; els.modeToggle.querySelector('i').style.background = online ? '#6fa76b' : '#83a969';
  els.room.textContent = online ? 'DUEL-208' : state.room;
  showToast(online ? '已进入联机演示房间 · 延迟 42ms' : '已返回本地练习');
}

function selectOpponent(id) { if (!opponents[id]) return; state.opponentId = id; document.querySelectorAll('.opponent-card').forEach((card) => card.classList.toggle('selected', card.dataset.opponent === id)); resetGame(false); showToast(`已选择 ${opponents[id].name}`); }
function showHome() { clearTimeout(turnTimer); els.arena.classList.add('hidden'); els.home.classList.remove('hidden'); }
function startGame() { resetGame(false); els.home.classList.add('hidden'); els.arena.classList.remove('hidden'); window.requestAnimationFrame(() => dicePhysics3D.resize?.()); showToast(`与 ${opponents[state.opponentId].name} 开始对局`); }

els.roll.addEventListener('click', rollDice); els.bank.addEventListener('click', bankScore); els.restoreLoadout?.addEventListener('click', restoreDefaultLoadout); $('#reset-button').addEventListener('click', () => resetGame()); els.restart.addEventListener('click', () => resetGame()); els.homeButton.addEventListener('click', showHome); $('#forfeit-button').addEventListener('click', () => { if (!state.gameOver) finishGame('opponent'); });
window.addEventListener('keydown', (event) => { if (event.code === 'Space' && !event.repeat) { event.preventDefault(); rollDice(); } if (event.code === 'KeyF' && !event.repeat) { takeScoringDice(); rollDice(); } if (event.code === 'KeyE' && !event.repeat) takeScoringDice(); if (event.code === 'KeyQ' && !event.repeat) bankScore(); if (event.code === 'KeyT' && !event.repeat) openCodex(0); if (event.code === 'KeyR' && !event.repeat) resetGame(); if (event.code === 'Escape') closeCodex(); });
$('#rules-button').addEventListener('click', () => openCodex(0)); $('#guide-button').addEventListener('click', () => openCodex(1)); $('#open-dice-library').addEventListener('click', () => openCodex(2)); $('#modal-close').addEventListener('click', closeCodex); els.codexModal.addEventListener('click', (event) => { if (event.target === els.codexModal) closeCodex(); }); els.prev.addEventListener('click', () => setCodexPage(currentPage - 1)); els.next.addEventListener('click', () => setCodexPage(currentPage + 1));
document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => { document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.toggle('active', nav === item)); if (item.dataset.view === 'rules') openCodex(0); if (item.dataset.view === 'dice') openCodex(2); }));
function toggleSound() { const next = !audio.muted; audio.setMuted(next); els.soundToggle.textContent = next ? '◗' : '◖'; showToast(next ? '声音已静音' : '声音已开启'); if (!next) safeAudio('playClick'); }
$('#mode-toggle').addEventListener('click', toggleMode); els.soundToggle.addEventListener('click', toggleSound); $('#profile-button').addEventListener('click', () => showToast('旅人档案：LIORA')); $('#copy-room').addEventListener('click', async () => { try { await navigator.clipboard.writeText(els.room.textContent); showToast('牌桌编号已复制'); } catch { showToast(`牌桌编号：${els.room.textContent}`); } });
document.querySelectorAll('.opponent-card').forEach((card) => card.addEventListener('click', () => selectOpponent(card.dataset.opponent))); document.querySelectorAll('.home-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.home-tab').forEach((item) => item.classList.toggle('active', item === tab)); state.mode = tab.dataset.homeMode; els.modeLabel.textContent = state.mode === 'online' ? '联机演示' : '本地练习'; })); els.startGame.addEventListener('click', startGame); els.homeLoadout.addEventListener('click', () => openCodex(2));

function onDiceSelected(diceId, value) {
  const parts = String(diceId).split('-');
  if (parts[0] !== 'player') return false;
  const index = Number(parts[1]);
  if (Number.isInteger(index)) return toggleDie(index, '3d');
  return false;
}
dicePhysics3D.onDiceSelected?.(onDiceSelected);
dicePhysics3D.onDragRoll?.((dx, dy) => {
  if (state.turn === 'player' && !state.rolling && !state.gameOver) rollDice({ x: dx, y: dy });
});

setCodexPage(0); resetGame(false); showHome();
try { dicePhysics3D.init(); } catch (error) { console.warn('[dice:init]', error); }
