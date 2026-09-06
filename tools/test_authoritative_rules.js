const assert = require('node:assert/strict');
const rules = require('../shared/game-rules.js');

const match = rules.createMatchState([
  { playerId: 'p1', name: '玩家一', seat: 0, loadout: Array(7).fill('loaded') },
  { playerId: 'p2', name: '玩家二', seat: 1, loadout: Array(7).fill('ordinary') }
], 'practice');

let randomIndex = 0;
const fixedRandom = () => [0, 0, 0, 0, 0, 0, 0][randomIndex++ % 7];
let result = rules.applyAction(match, 0, { kind: 'roll' }, fixedRandom);
assert.equal(result.type, 'roll');
assert.deepEqual(result.values, [1, 1, 1, 1, 1, 1, 1]);
result = rules.applyAction(match, 0, { kind: 'lock-many', indices: [0, 1, 2, 3, 4, 5, 6] }, fixedRandom);
assert.equal(result.type, 'lock');
assert.ok(result.turnScore > 0);
result = rules.applyAction(match, 0, { kind: 'bank' }, fixedRandom);
assert.equal(result.type, 'bank');
assert.equal(match.turnSeat, 1);
assert.ok(match.players[0].total > 0);

const stakeMatch = rules.createMatchState([
  { playerId: 'p1', name: '玩家一', seat: 0 },
  { playerId: 'p2', name: '玩家二', seat: 1 }
], 'stake');
let raise = rules.applyAction(stakeMatch, 0, { kind: 'multiplier:propose', target: 2 }, fixedRandom);
assert.equal(raise.type, 'multiplier:pending');
raise = rules.applyAction(stakeMatch, 1, { kind: 'multiplier:respond', accepted: true }, fixedRandom);
assert.equal(raise.type, 'multiplier:accepted');
assert.equal(stakeMatch.multiplier, 2);
console.log('PASS authoritative roll -> lock -> bank -> turn transition -> multiplier response');
