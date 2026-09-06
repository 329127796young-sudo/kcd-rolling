const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('app.js', 'utf8');
const start = source.indexOf('function shouldOpponentBank() {');
const end = source.indexOf('\nfunction decideOpponentTurn', start);
if (start < 0 || end < 0) throw new Error('shouldOpponentBank source not found');
const functionSource = source.slice(start, end);

const profile = {
  bankAt: 620,
  riskTolerance: 0.78,
  continuationWeight: 1.12,
  comebackPressure: 0.72
};
const tuning = {
  beliefNoise: 0,
  decisionNoise: 0,
  greedyResponse: 0.86,
  lossAversion: 0.28,
  baseGreed: 0.78,
  baseCaution: 0.18,
  adaptRate: 0
};

function createScenario(overrides = {}) {
  const mind = {
    opponentId: 'vlad',
    confidence: 0.5,
    pressure: 0,
    frustration: 0,
    greed: 0.78,
    caution: 0.18,
    turnRolls: 0,
    consecutiveContinues: 0,
    hotChaseCount: 0,
    lastDecision: null,
    playerRead: { farkleRate: 0, bankCount: 0, bankMean: 0 }
  };
  const state = {
    opponentId: 'vlad',
    opponentTotal: 0,
    opponentRoundScore: 1000,
    playerTotal: 0,
    playerRoundBank: 0,
    opponentActiveIndices: [0, 1, 2],
    suddenDeath: false,
    round: 3,
    match: { type: 'practice', active: true }
  };
  Object.assign(state, overrides.state || {});
  Object.assign(mind, overrides.mind || {});
  const context = {
    state,
    opponents: { vlad: profile },
    MATCH_ROUNDS: 6,
    aiTuning: () => tuning,
    getAiMind: () => mind,
    estimateFarkleRisk: () => 0.25,
    getScoreGrowth: () => ({ total: 1 }),
    clampAi: (value, min = 0, max = 1) => Math.max(min, Math.min(max, Number(value) || 0)),
    clamp01: (value) => Math.max(0, Math.min(1, Number(value) || 0)),
    secureRandomFloat: () => 0.5,
    rememberAiAction: () => {}
  };
  vm.runInNewContext(`this.shouldOpponentBank = ${functionSource}`, context);
  return { state, mind, shouldOpponentBank: context.shouldOpponentBank };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// 连续继续达到瓦茨拉夫的理智边界后，必须收分。
{
  const scenario = createScenario({ mind: { turnRolls: 4, consecutiveContinues: 3, hotChaseCount: 1 } });
  assert(scenario.shouldOpponentBank() === true, 'expected vlad to bank after 3 consecutive continues');
  assert(scenario.mind.lastDecision.mode === 'vlad-rationality-brake', 'expected rationality brake mode');
}

// 达到回合最大投掷次数后，即使随机评估偏向继续，也必须结束回合。
{
  const scenario = createScenario({ mind: { turnRolls: 7, consecutiveContinues: 1 } });
  assert(scenario.shouldOpponentBank() === true, 'expected vlad to bank at hard roll limit');
  assert(scenario.mind.lastDecision.mode === 'turn-safety-limit', 'expected turn safety limit mode');
}

// 两次热骰追逐且暂存分达到安全线后，先进入理智收分。
{
  const scenario = createScenario({ mind: { turnRolls: 4, consecutiveContinues: 2, hotChaseCount: 2 } });
  assert(scenario.shouldOpponentBank() === true, 'expected vlad to bank after two hot-dice chases');
  assert(scenario.mind.lastDecision.mode === 'vlad-rationality-brake', 'expected hot chase brake mode');
}

console.log('Vlad AI safety checks passed');
