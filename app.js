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

// 收藏品稀有度：用于名片与骰子皮肤的展示标签，不影响价格、解锁或实际能力。
const RARITY_META = Object.freeze({
  mythic: { label: '神话', className: 'rarity-mythic' },
  legendary: { label: '传说', className: 'rarity-legendary' },
  epic: { label: '史诗', className: 'rarity-epic' },
  rare: { label: '稀有', className: 'rarity-rare' },
  common: { label: '普通', className: 'rarity-common' }
});
function rarityMeta(value = 'common') { return RARITY_META[value] || RARITY_META.common; }

// 神话骰面的符号只改变视觉，不改变点数、权重或计分。
// 符号数量和传统骰面位置仍然对应 1—6，避免对局中出现读数歧义。
const MYTHIC_SYMBOLS = Object.freeze({
  1: '◆',
  2: '◈',
  3: '❧',
  4: '✤',
  5: '✣',
  6: '✥'
});

function mythicSymbolFace(value) {
  const glyph = MYTHIC_SYMBOLS[value] || MYTHIC_SYMBOLS[1];
  return `<span class="mythic-symbol-face" data-symbol-value="${value}" aria-label="${value} 点"><span class="mythic-symbol-glyph">${glyph}</span></span>`;
}

// 外观皮肤与功能骰子严格分离：皮肤只改变 3D 材质，不改变点数权重、计分或 AI。
const DICE_SKINS = Object.freeze([
  { id: 'default', name: '普通骰 · 原木', description: '浅色原木骰体，保留自然木色与简洁圆点。', rarity: 'common', price: 0, paid: false, collectionGroup: 'default', unlock: '初始拥有', bodyColor: '#c68a4b', pipColor: '#422512', roughness: .82, metalness: 0, pipMetalness: 0, pipRoughness: .92 },
  { id: 'tavern-oak-brass', name: '墙洞酒馆 · 黑橡木铜箍', description: '深色黑橡木骰体，配以磨旧黄铜点数。', rarity: 'rare', price: 120, paid: true, collectionGroup: 'tavern', unlock: '酒馆商柜：120 格罗申', bodyColor: '#2b1b12', pipColor: '#c59a4e', roughness: .86, metalness: .18, pipMetalness: .34, pipRoughness: .5 },
  { id: 'blood-oak-iron', name: '猩红酒馆 · 铁環', description: '暗红染色橡木骰体，两道铁箍环绕，带着酒桶般的粗犷质感。', rarity: 'epic', price: 260, paid: true, collectionGroup: 'tavern', unlock: '酒馆商柜：260 格罗申', bodyColor: '#3c100c', pipColor: '#b8ada0', roughness: .84, metalness: .08, pipMetalness: .3, pipRoughness: .4, textureProfile: 'blood-oak', detailStyle: 'iron-edge', detailColor: '#77736d', detailRoughness: .38, detailMetalness: .82 },
  { id: 'gilded-feast', name: '鎏金宴席', description: '暖金色骰体带有菱格纹理，点数以高亮金属嵌入，边缘覆有细窄金色护边。', rarity: 'legendary', lotteryOnly: true, price: 420, paid: false, collectionGroup: 'tavern', unlock: '仅限酒馆抽奖', bodyColor: '#8f6a24', pipColor: '#f4dfa0', roughness: .32, metalness: .12, pipMetalness: .78, pipRoughness: .18, textureProfile: 'gilded-feast', detailStyle: 'gold-edge', detailColor: '#e3ad43', detailRoughness: .2, detailMetalness: .86 },
  { id: 'blue-enamel-gilt', name: '蓝珐琅·鎏金纹', description: '深靛蓝珐琅骰体，棱角覆以细金线与手工卷草纹，点数采用高纯度金属嵌入。', rarity: 'legendary', lotteryOnly: true, price: 480, paid: false, collectionGroup: 'tavern', unlock: '仅限酒馆抽奖', bodyColor: '#172844', pipColor: '#d6aa4f', roughness: .24, metalness: .1, pipMetalness: .92, pipRoughness: .16, textureProfile: 'blue-enamel-gilt', detailStyle: 'gilt-filigree', detailColor: '#c99a3a', detailRoughness: .17, detailMetalness: .9, bumpScale: .034 },
  { id: 'plumwood-vine', name: '紫檀酒窖·流藤', description: '深紫红紫檀漆木骰体，锡色葡萄藤沿圆角展开，开放式边饰不设方格边框。', rarity: 'epic', price: 560, paid: true, collectionGroup: 'tavern', unlock: '酒馆商柜：560 格罗申', bodyColor: '#4b2430', pipColor: '#c8bda8', roughness: .44, metalness: .06, pipMetalness: .42, pipRoughness: .38, textureProfile: 'plumwood-lacquer', detailStyle: 'pewter-vine-open', detailColor: '#9b9486', detailRoughness: .28, detailMetalness: .72, bumpScale: .07 },
  { id: 'celadon-pewter', name: '萨扎瓦·青釉银点', description: '青瓷釉面带有细密开片与烧制色差，旧锡点数表面呈现氧化后的深色斑驳。', rarity: 'legendary', lotteryOnly: true, price: 520, paid: false, collectionGroup: 'kingdom-workshop', unlock: '仅限酒馆抽奖', bodyColor: '#5b8980', pipColor: '#3f4a47', roughness: .3, metalness: .04, pipMetalness: .84, pipRoughness: .18, textureProfile: 'celadon-glaze', detailStyle: 'carved-celadon', detailColor: '#7ca69a', detailRoughness: .38, detailMetalness: .02, bumpScale: .036 },
  { id: 'amber-royal-seal', name: '王国工坊·琥珀王印', description: '半透明琥珀釉包裹深色矿物纹理，黑化青铜点数像旧王国印记般嵌入骰面。', rarity: 'legendary', lotteryOnly: true, price: 0, paid: false, collectionGroup: 'kingdom-workshop', unlock: '仅限酒馆抽奖', bodyColor: '#b96f32', pipColor: '#332922', roughness: .22, metalness: .12, pipMetalness: .9, pipRoughness: .2, textureProfile: 'amber-glaze-mineral', detailStyle: 'bronze-corner-rivets', detailColor: '#82633d', detailRoughness: .25, detailMetalness: .82, bumpScale: .055 },
  { id: 'crimson-seal', name: '王国工坊·绯红圣印', description: '深朱砂红漆木骰体透出自然木纹，窄幅暗红铜护边刻有王国印契；六面嵌着蜡封、铁环、卷草与车轮浅浮雕纹章。', rarity: 'mythic', lotteryOnly: true, price: 0, paid: false, collectionGroup: 'kingdom-workshop', unlock: '仅限酒馆抽奖 · 神话 1%', bodyColor: '#74232b', pipColor: '#e1cfad', roughness: .38, metalness: .08, pipMetalness: .62, pipRoughness: .3, textureProfile: 'mythic-crimson-seal', detailStyle: 'crimson-copper-seal', detailColor: '#713a35', detailRoughness: .3, detailMetalness: .74, bumpScale: .078, pipStyle: 'mythic-symbols' }
]);
const DICE_SKIN_STORAGE_KEY = 'wallhole-dice-skins-v1';
const DEFAULT_DICE_SKIN_COLLECTION = Object.freeze({ ownedSkins: ['default'], purchasedSkins: [], equippedSkin: 'default' });

const DICE_COUNT = 7;
const HEAT_TRIGGER_DICE = DICE_COUNT - 1;
const MATCH_ROUNDS = 6;

const opponents = {
  // AI 参数描述的是偏好，不是固定脚本。比分、剩余骰子和爆骰风险会在每回合动态修正它们。
  milo: { name: '米洛 · 老练', role: '老练旅人', short: '稳健型 · 喜欢在第二掷收集', style: '重视小胜 · 偶有失手', riskLabel: '稳健', traits: ['二掷收手', '重视小胜', '偶有失手'], avatar: '米洛.jpg', status: '等待你的投掷', bankAt: 325, riskTolerance: 0.27, continuationWeight: 0.6, mistakeRate: 0.1, hotDiceBias: 0.05, comebackPressure: 0.16, comboBias: { straight: 0.08, triple: 0.03 }, raisePolicy: { baseAccept: .7, multiplier: { 2: .1, 3: .01, 5: -.12 }, behindBonus: .22, aheadBonus: .08, riskPenalty: .25, endgamePenalty: .18, stakePenalty: .04, comebackEndgame: .1, volatility: .06, minAccept: .45 }, loadout: ['ordinary', 'ordinary', 'careful', 'evil-two', 'odd', 'ordinary', 'ordinary'] },
  vlad: { name: '瓦茨拉夫 · 赌徒', role: '高风险赌徒', short: '冒险型 · 追逐热骰与大顺', style: '敢押大注 · 情绪起伏', riskLabel: '冒险', traits: ['追逐热骰', '偏爱大顺', '情绪化'], avatar: '瓦茨拉夫.jpg', status: '准备冒险一掷', bankAt: 620, riskTolerance: 0.78, continuationWeight: 1.12, mistakeRate: 0.16, hotDiceBias: 0.42, comebackPressure: 0.72, comboBias: { straight: 0.26, triple: 0.18 }, raisePolicy: { baseAccept: .91, multiplier: { 2: .04, 3: .01, 5: -.08 }, behindBonus: .18, aheadBonus: .06, riskPenalty: .11, endgamePenalty: .08, stakePenalty: .02, comebackEndgame: .14, volatility: .11, minAccept: .68 }, loadout: ['lucky', 'odd', 'odd', 'kingdom', 'painted', 'devil', 'ordinary'] },
  marta: { name: '玛蒂娜 · 酒馆老板', role: '墙洞酒馆老板', short: '账房型 · 先算风险再收分', style: '领先时封锁分差 · 落后时只追有把握的牌面', riskLabel: '谨慎', traits: ['稳定收集', '领先封锁', '算账追分'], avatar: '酒馆老板娘.jpg', status: '从不贪杯', bankAt: 300, riskTolerance: 0.22, riskLimit: 0.22, continuationWeight: 0.72, mistakeRate: 0.035, hotDiceBias: 0.06, comebackPressure: 0.42, comboBias: { straight: 0.08, triple: 0.04 }, lookaheadSamples: 14, lookaheadWeight: 0.18, raisePolicy: { baseAccept: .77, multiplier: { 2: .07, 3: -.01, 5: -.16 }, behindBonus: .26, aheadBonus: .1, riskPenalty: .34, endgamePenalty: .22, stakePenalty: .08, comebackEndgame: .16, volatility: .05, minAccept: .5 }, loadout: ['careful', 'ordinary', 'careful', 'ordinary', 'loaded', 'ordinary', 'ordinary'] },
  musa: { name: '马里的穆萨', role: '宫廷医者 · 学者', short: '读桌型 · 根据局势调整风险', style: '擅长概率判断，偶尔也会被自己的推断误导', riskLabel: '大师', traits: ['读桌判断', '小顺专家', '临场纠错'], avatar: '穆萨.jpg', status: '审视牌面与风险', bankAt: 470, riskTolerance: 0.31, continuationWeight: 0.88, mistakeRate: 0.07, hotDiceBias: 0.22, comebackPressure: 0.48, comboBias: { straight: 0.22, triple: 0.12 }, raisePolicy: { baseAccept: .84, multiplier: { 2: .06, 3: .03, 5: -.1 }, behindBonus: .22, aheadBonus: .06, riskPenalty: .22, endgamePenalty: .14, stakePenalty: .04, comebackEndgame: .18, volatility: .06, minAccept: .58 }, loadout: ['ordinary', 'wisdom', 'careful', 'ordinary', 'odd', 'wisdom', 'ordinary'] }
};
const DEFAULT_LOADOUT = Object.freeze(Array.from({ length: DICE_COUNT }, () => 'ordinary'));

const COLLECTION_REWARDS = Object.freeze({
  milo: { card: 'card-portrait-landscape-01.png', medal: 'medal-01-dragon.png', medalName: '赤龙纹章', cardName: '老练旅人的名片', rarity: 'rare' },
  vlad: { card: 'card-portrait-landscape-02.png', medal: 'medal-02-wheat.png', medalName: '三束麦穗', cardName: '赌徒的名片', rarity: 'epic' },
  marta: { card: 'card-portrait-landscape-03.png', medal: 'medal-03-red-sack.png', medalName: '酒囊纹章', cardName: '酒馆老板的名片', rarity: 'legendary', cardLotteryOnly: true }
});
const PAID_NAME_CARDS = Object.freeze([
  { file: 'card-landscape-01.png', name: '晨雾里的拉泰', description: '城墙外的第一缕晨光', rarity: 'common', price: 60 },
  { file: 'card-landscape-02.png', name: '萨扎瓦河湾', description: '河水绕过旧木桥', rarity: 'common', price: 75 },
  { file: 'card-landscape-03.png', name: '秋日麦田', description: '收获季的金色田埂', rarity: 'common', price: 90 },
  { file: 'card-landscape-04.png', name: '林间小路', description: '通往酒馆的土路', rarity: 'rare', price: 105 },
  { file: 'card-landscape-05.png', name: '城堡远眺', description: '山脊上的石墙与钟楼', rarity: 'rare', price: 120 },
  { file: 'card-landscape-06.png', name: '烛火窗台', description: '夜里仍有人守着酒馆', rarity: 'rare', price: 150 },
  { file: 'card-landscape-07.png', name: '旧城集市', description: '商贩收摊前的喧闹', rarity: 'epic', price: 180 },
  { file: 'card-landscape-08.png', name: '葡萄园坡地', description: '晚夏的葡萄藤与石墙', rarity: 'epic', price: 225 }
]);
const OIL_PAINT_DLC_CARDS = Object.freeze([
  { file: 'C1.jpg', name: '油画 DLC · 01', description: '油画系列名片 · 第一幅', rarity: 'rare', price: 500 },
  { file: 'C2.jpg', name: '油画 DLC · 02', description: '油画系列名片 · 第二幅', rarity: 'rare', price: 650 },
  { file: 'C3.jpg', name: '油画 DLC · 03', description: '油画系列名片 · 第三幅', rarity: 'epic', price: 800 },
  { file: 'C4.jpg', name: '油画 DLC · 04', description: '油画系列名片 · 第四幅', rarity: 'epic', price: 950 },
  { file: 'C5.jpg', name: '油画 DLC · 05', description: '油画系列名片 · 第五幅', rarity: 'epic', price: 1100 },
  { file: 'C6.jpg', name: '油画 DLC · 06', description: '油画系列名片 · 第六幅', rarity: 'epic', price: 1250 },
  { file: 'C7.jpg', name: '油画 DLC · 07', description: '油画系列名片 · 第七幅', rarity: 'legendary', lotteryOnly: true, price: 1400 },
  { file: 'C8.jpg', name: '油画 DLC · 08', description: '油画系列名片 · 第八幅', rarity: 'legendary', lotteryOnly: true, price: 1500 }
]);
const OIL_PAINT_DLC_FILES = new Set(OIL_PAINT_DLC_CARDS.map((card) => card.file));
const OPPONENT_STAKES = Object.freeze({ milo: 10, vlad: 50, marta: 100, musa: 300 });
const PRACTICE_REWARD = 5;
const LOTTERY_DRAW_COST = 600;
const LOTTERY_RARITY_WEIGHTS = Object.freeze({ common: 51, rare: 30, epic: 15, legendary: 3, mythic: 1 });
const LOTTERY_STORAGE_KEY = 'wallhole-lottery-v1';
const DEFAULT_LOTTERY = Object.freeze({ drawCount: 0, lastResult: null });
const MULTIPLIER_STEPS = Object.freeze([1, 2, 3, 5]);
const ALL_DICE_INDICES = Object.freeze(Array.from({ length: DICE_COUNT }, (_, index) => index));
// 正式牌局最高公共倍率为 x5；入场前需准备基础赌注的 5 倍，
// 以覆盖接受加码后的最高结算风险。
const LOSS_MULTIPLIER_CAP = 5;
const DEFAULT_TABLE_MULTIPLIER = 1;
// 下注倍率与得分倍率分开：下注倍率只结算格罗申，得分成长只影响牌局分数。
// 采用递进而不是直接 1:1 映射，避免正式牌局一进入 x5 就立刻跳过整段对局。
const SCORE_GROWTH_BY_TABLE_MULTIPLIER = Object.freeze({ 1: 1, 2: 1.35, 3: 1.8, 5: 2.6 });
const HOT_DICE_SCORE_GROWTH = Object.freeze([1, 2, 3, 5, 8, 12]);
const HOT_DICE_MAX_COUNTED = HOT_DICE_SCORE_GROWTH.length - 1;
const COLLECTION_STORAGE_KEY = 'wallhole-collection-v1';
const DEFAULT_COLLECTION = Object.freeze({ unlockedCards: [], unlockedMedals: [], purchasedCards: [], equippedCard: null, equippedMedals: [] });
const WALLET_STORAGE_KEY = 'wallhole-wallet-v1';
const DEFAULT_WALLET = Object.freeze({ groschen: 100, lifetimeEarned: 0, lifetimeSpent: 0, lastSettlement: null });
const BOARD_THEME_STORAGE_KEY = 'wallhole-board-theme-v1';
const PLAYER_PROFILE_STORAGE_KEY = 'wallhole-player-profile-v1';
const DEFAULT_PLAYER_NAME = 'LIORA';
const MAX_PLAYER_NAME_LENGTH = 18;
const MAX_PLAYER_AVATAR_FILE_SIZE = 8 * 1024 * 1024;
const AI_TIMING = Object.freeze({
  firstThink: 1350,
  afterRollThink: 1250,
  afterKeepThink: 1200,
  afterDecision: 1150,
  afterBank: 1450,
  afterFarkle: 1650,
  hotDicePause: 1500
});

// AI 性格不是只有一组“难度数值”。这些参数描述的是有限理性：
// 它会记住最近发生的事、受情绪影响、带着一点判断误差，但仍然只会执行合法行动。
const AI_PERSONALITY_TUNING = Object.freeze({
  milo: { decisionNoise: .22, beliefNoise: .16, tiltGain: .68, tiltRecovery: .3, lossAversion: .78, greedResponse: .22, adaptRate: .2, bluffRate: .04, overthinkRate: .12, timingBias: 1.08, timingJitter: .14, baseGreed: .24, baseCaution: .64 },
  vlad: { decisionNoise: .42, beliefNoise: .24, tiltGain: .94, tiltRecovery: .18, lossAversion: .28, greedResponse: .86, adaptRate: .16, bluffRate: .22, overthinkRate: .08, timingBias: .86, timingJitter: .2, baseGreed: .78, baseCaution: .18 },
  marta: { decisionNoise: .16, beliefNoise: .1, tiltGain: .46, tiltRecovery: .42, lossAversion: .92, greedResponse: .28, adaptRate: .5, bluffRate: .08, overthinkRate: .28, timingBias: 1.14, timingJitter: .1, baseGreed: .28, baseCaution: .78 },
  musa: { decisionNoise: .14, beliefNoise: .07, tiltGain: .58, tiltRecovery: .32, lossAversion: .68, greedResponse: .42, adaptRate: .72, bluffRate: .14, overthinkRate: .48, timingBias: 1.2, timingJitter: .16, baseGreed: .42, baseCaution: .58 }
});

function aiTuning(opponentId = 'milo') { return AI_PERSONALITY_TUNING[opponentId] || AI_PERSONALITY_TUNING.milo; }

function createAiMind(opponentId = 'milo') {
  const tuning = aiTuning(opponentId);
  return {
    opponentId,
    confidence: .5,
    pressure: 0,
    frustration: 0,
    greed: tuning.baseGreed,
    caution: tuning.baseCaution,
    // 回合级行为计数：让高风险性格有“敢赌但会刹车”的边界，
    // 同时为所有 AI 提供最终安全阀，避免任何异常概率组合卡在无限投掷。
    turnRolls: 0,
    consecutiveContinues: 0,
    hotChaseCount: 0,
    lastBankScore: 0,
    recentActions: [],
    playerRead: { bankMean: 0, bankCount: 0, farkleRate: 0, raiseCount: 0, raiseAcceptanceRate: .5, lastRaise: 0 },
    lastEvent: 'opening',
    lastDecision: null
  };
}

function getAiMind() {
  if (!state.aiMind || state.aiMind.opponentId !== state.opponentId) state.aiMind = createAiMind(state.opponentId);
  return state.aiMind;
}

function resetAiMind(opponentId = state.opponentId) { state.aiMind = createAiMind(opponentId); return state.aiMind; }

function resetAiTurnMetrics() {
  const mind = getAiMind();
  mind.turnRolls = 0;
  mind.consecutiveContinues = 0;
  mind.hotChaseCount = 0;
  mind.lastBankScore = 0;
  mind.turnStartedAt = Date.now();
  mind.turnStartRound = state.round;
  return mind;
}

function clampAi(value, min = 0, max = 1) { return Math.max(min, Math.min(max, Number(value) || 0)); }

function aiRandom(min, max) { return min + secureRandomFloat() * (max - min); }

function rememberAiAction(action, details = {}) {
  const mind = getAiMind();
  mind.recentActions.push({ action, ...details, at: Date.now() });
  if (mind.recentActions.length > 12) mind.recentActions.shift();
}

function observeAiEvent(event, details = {}) {
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const score = Math.max(0, Number(details.score) || 0);
  const previousLead = Number(details.previousLead) || 0;
  const lead = Number(details.lead ?? (state.opponentTotal - state.playerTotal)) || 0;
  const impact = clampAi(score / 1400);

  if (event === 'playerBank') {
    const read = mind.playerRead;
    read.bankCount += 1;
    read.bankMean = read.bankCount === 1 ? score : read.bankMean * .78 + score * .22;
    mind.pressure = clampAi(mind.pressure + impact * .12 + (lead < 0 ? .03 : 0));
    mind.confidence = clampAi(mind.confidence - impact * .04);
  } else if (event === 'playerFarkle') {
    const read = mind.playerRead;
    read.farkleRate = read.farkleRate * .78 + .22;
    mind.pressure = clampAi(mind.pressure - .12);
    mind.confidence = clampAi(mind.confidence + .09);
    mind.greed = clampAi(mind.greed + tuning.greedResponse * .06);
  } else if (event === 'playerRaise') {
    const read = mind.playerRead;
    read.raiseCount += 1;
    read.lastRaise = Number(details.multiplier) || 1;
    mind.pressure = clampAi(mind.pressure + .07 + (read.raiseCount > 2 ? .04 : 0));
    mind.caution = clampAi(mind.caution + tuning.lossAversion * .05);
  } else if (event === 'ownBank') {
    mind.confidence = clampAi(mind.confidence + .045);
    mind.frustration = clampAi(mind.frustration - .1);
    mind.pressure = clampAi(mind.pressure - .035);
  } else if (event === 'ownFarkle') {
    mind.confidence = clampAi(mind.confidence - .11 * tuning.tiltGain);
    mind.frustration = clampAi(mind.frustration + .16 * tuning.tiltGain);
    mind.caution = clampAi(mind.caution + tuning.lossAversion * .08);
    mind.greed = clampAi(mind.greed + tuning.greedResponse * .04 - tuning.lossAversion * .02);
  } else if (event === 'ownHotDice') {
    mind.confidence = clampAi(mind.confidence + .1);
    mind.greed = clampAi(mind.greed + tuning.greedResponse * .09);
    mind.frustration = clampAi(mind.frustration - .08);
  } else if (event === 'raiseAccepted') {
    mind.confidence = clampAi(mind.confidence + .06);
    mind.pressure = clampAi(mind.pressure + .035);
  } else if (event === 'raiseDeclined') {
    mind.confidence = clampAi(mind.confidence + .08);
    mind.pressure = clampAi(mind.pressure - .06);
  } else if (event === 'ownRaise') {
    mind.confidence = clampAi(mind.confidence + .04);
    mind.greed = clampAi(mind.greed + tuning.greedResponse * .06);
    mind.pressure = clampAi(mind.pressure + .025);
  } else if (event === 'roundEnd') {
    const swing = lead - previousLead;
    mind.pressure = clampAi(mind.pressure + (swing < 0 ? .05 : -.035));
    mind.frustration = clampAi(mind.frustration - tuning.tiltRecovery * .14);
  }

  // 情绪不会永久累积，回合之间慢慢回到角色的基线，避免 AI 进入不可逆的“上头”状态。
  mind.frustration = clampAi(mind.frustration - tuning.tiltRecovery * .012);
  mind.pressure = clampAi(mind.pressure * .985);
  mind.caution = clampAi(mind.caution + (tuning.baseCaution - mind.caution) * .035);
  mind.greed = clampAi(mind.greed + (tuning.baseGreed - mind.greed) * .03);
  mind.lastEvent = event;
  rememberAiAction(event, { score, lead });
  return mind;
}

function humanizeAiDelay(baseDelay, kind = 'decision', context = {}) {
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const base = Math.max(300, Number(baseDelay) || AI_TIMING.afterDecision);
  const risk = clampAi(context.risk ?? estimateFarkleRisk(state.opponentActiveIndices?.length ? state.opponentActiveIndices : ALL_DICE_INDICES));
  const uncertainty = clampAi(context.uncertainty ?? (risk * .65 + tuning.overthinkRate * .2 + mind.pressure * .15));
  const kindBias = kind === 'firstThink' ? .04 : kind === 'afterRollThink' ? .08 : kind === 'afterKeepThink' ? .12 : kind === 'bank' ? -.05 : kind === 'afterFarkle' ? .18 : kind === 'hotDicePause' ? -.08 : 0;
  const confidenceBias = (mind.confidence - .5) * -.16;
  const jitter = (secureRandomFloat() - .5) * 2 * (tuning.timingJitter + .04);
  const factor = tuning.timingBias + kindBias + uncertainty * (tuning.overthinkRate * .22) + mind.frustration * .1 + confidenceBias + jitter;
  const floor = kind === 'hotDicePause' ? 780 : kind === 'afterFarkle' ? 1100 : 620;
  return Math.round(Math.max(floor, Math.min(3200, base * Math.max(.72, factor))));
}

// AI 台词不是固定脚本：同一事件会根据角色、当前分数、剩余骰子和领先/落后情况
// 从不同语气池里抽取，连续出现的句子也会被短暂排除，保证牌桌动态更像真人。
const AI_DIALOGUE = Object.freeze({
  milo: {
    opening: ['先看看你的起手，我不急着把好牌全押上。', '慢慢来，桌面上的每个点数都值得算一遍。', '你先掷，我听听骰子落桌的声音。'],
    raise: [({ multiplier }) => `我把牌桌抬到 x${multiplier}，只多走一步。`, ({ multiplier }) => `x${multiplier} 可以，先把风险记在账上。`],
    playerRaise: [({ multiplier }) => `你把倍率推到 x${multiplier} 了？我会按这个数字重新算。`, ({ multiplier }) => `x${multiplier} 不算小，我不会白送下一掷。`],
    acceptRaise: [({ multiplier }) => `x${multiplier} 我接。真要分胜负，不能只靠你喊。`, ({ multiplier }) => `我把风险记下了，但还没到让桌子的地步。`],
    declineRaise: [({ multiplier }) => `x${multiplier} 太冒进，我不拿整局去赌这一步。`, ({ multiplier }) => `这次我让出牌桌，账面不值得硬撑。`],
    rollHigh: ['这组点数有点意思，先别让贪心替我做决定。', '不错，但还没到把账本合上的时候。', '好牌要留余地，我再观察一轮。'],
    rollPositive: ['先拿稳眼前的分数，剩下的再说。', '有得分就不算白掷，关键是别把它浪费掉。', '这桌面还算老实，继续看一眼。'],
    rollBad: ['这一掷不漂亮，我得重新排一遍算盘。', '点数散了，别急，稳住再来。', '骰子今天有自己的脾气。'],
    keepBig: ['这手值得记进账本，不过还不能掉以轻心。', '大组合先收好，接下来只做有把握的事。'],
    keepMid: ['一口一口吃，分数总会堆起来。', '先把中间这块稳住，别让它白白溜走。'],
    keepSmall: ['小分也是分，我宁愿稳稳拿走。', '别小看这几个点，酒馆里常说积少成多。'],
    bank: ['账面已经够好看了，先把它收进袋里。', '风险开始超过收益，见好就收是老手的规矩。', '我先把这笔记下，下一轮再谈更大的。'],
    continue: ['再看一掷，但只走稳路。', '还有余地，我再给骰子一次机会。', '不冒无谓的险，继续。'],
    farkle: ['啧，算盘打错了一格，这轮算我失手。', '骰子不肯给面子，只能把这轮划掉。', '这下确实贪过头了，记住这个教训。'],
    hotDice: ['六枚已经结算，热骰也得按规矩来。', '普通热骰够稳；下一轮更要小心。'],
    playerBank: ['你收得很及时，我会按这个分数重新算风险。', '这笔分数拿得干净，看来你不打算白送机会。'],
    playerFarkle: ['爆骰了？那我会把这笔运气记在心里。', '你这一掷没留下分数，桌面暂时对我有利。']
  },
  vlad: {
    opening: ['来，把骰盅推过来！今晚我可不满足于小钱。', '先给我一掷热闹的，安静的牌局没意思。', '你先来，我要看看这桌子愿不愿意站在我这边。'],
    raise: [({ multiplier }) => `x${multiplier}！这才像一张真正的牌桌。`, ({ multiplier }) => `我把筹码推到 x${multiplier}，谁都别想退回去。`],
    playerRaise: [({ multiplier }) => `你敢推到 x${multiplier}？很好，我就等着这一刻。`, ({ multiplier }) => `x${multiplier} 已经点火了，别指望我替你踩刹车。`],
    acceptRaise: [({ multiplier }) => `x${multiplier}？接！现在才像真正的赌局。`, ({ multiplier }) => `你把火点起来了，我不会自己熄掉。`],
    declineRaise: [({ multiplier }) => `连 x${multiplier} 都不值得我押？这桌子的风向不对。`, ({ multiplier }) => `我暂时退一步，但别以为你赢得漂亮。`],
    rollHigh: ['漂亮！这种点数不追一把，回头会后悔。', '这不是收手的信号，这是加注的信号。', '骰子已经开口了，我得听完它要说什么。'],
    rollPositive: ['有分就追，别给机会喘气。', '还行，火候刚起来，再压一次。', '小胜也是风向，继续把势头做大。'],
    rollBad: ['散得难看，但我不信它会一直坏下去。', '这一掷不给面子？那就用下一掷扳回来。', '风险上来了，正合我意。'],
    keepBig: ['这手够硬，先留着，下一掷我要把桌面掀起来。', '大牌到手，当然不能只拿这么一点。'],
    keepMid: ['中等分数？可以，当作下一次加注的筹码。', '先吃进去，等热度起来再狠狠干一把。'],
    keepSmall: ['小分不嫌少，凑够气势就能变大。', '先拿着，别让一颗好骰子白滚。'],
    bank: ['这次先收，但不是因为怕，是为了下一轮押更大的。', '好，利润落袋；下一把我要把差距拉开。', '收下这笔，别以为我就改走保守路线了。'],
    continue: ['还没到极限，再来！', '机会就在下一掷，谁先眨眼谁输。', '继续加压，我要看看它能不能给我一手大的。'],
    farkle: ['哈！这次骰子赢了，但下一轮我会赢回来。', '爆了就爆了，真正的赌徒不会因为一轮皱眉。', '运气暂时站在你那边，别高兴太早。'],
    hotDice: ['热骰！这才像一张真正的牌桌。', '六枚先吃进来，下一轮我直接把风险拉满。'],
    playerBank: ['收得挺快嘛，是怕我追上来？', '你把分数装进口袋了，那我只好用更大的牌回敬。'],
    playerFarkle: ['爆骰？谢了，这桌面终于轮到我说话。', '你把机会丢了，我可不会替你捡回来。']
  },
  marta: {
    opening: ['先把桌面看清楚，酒馆的账不能算错。', '别急，骰盅会告诉我们今天的运气。', '你先请，我只在值得的时候出手。'],
    raise: [({ multiplier }) => `牌桌倍率到 x${multiplier}，我会把每一步都记清。`, ({ multiplier }) => `x${multiplier} 可以，但风险必须有上限。`],
    playerRaise: [({ multiplier }) => `你把倍率抬到 x${multiplier}，那就别在这一掷上浪费机会。`, ({ multiplier }) => `x${multiplier} 已经写进账本，我会按风险行事。`],
    acceptRaise: [({ multiplier }) => `x${multiplier} 可以，我已经把最坏的账算过了。`, ({ multiplier }) => `接受。只要风险有回报，就没必要把牌桌让给你。`],
    declineRaise: [({ multiplier }) => `x${multiplier} 超过这桌的安全线，我不替骰子承担坏账。`, ({ multiplier }) => `账面不支持这次加码，我选择止损。`],
    rollHigh: ['这组牌面够分量，但还要看看风险值不值得。', '好牌不等于好时机，我先把账算完。', '可以，先留出退路，再决定是否继续。'],
    rollPositive: ['有分就先守住，稳妥比漂亮更重要。', '这笔收益合格，接下来只看风险。', '桌面还算安全，我再给它一次机会。'],
    rollBad: ['点数太散，继续硬掷只会把账做坏。', '这一掷不合算，我会把风险记高一些。', '骰子不给分，就不要拿面子去赌。'],
    keepBig: ['这手分数够厚，先放进账本，不让它回桌。', '大分已经到手，接下来要守住它。'],
    keepMid: ['中规中矩，正好。稳稳积累才是长久生意。', '这笔可以，别为了多一点把整轮都赔进去。'],
    keepSmall: ['小分也能垒成墙，先收下。', '先把能拿的拿走，剩下的交给下一轮。'],
    bank: ['账面达到安全线，收。', '风险不再划算，及时结算。', '这轮够用了，我不把利润留给骰子。'],
    continue: ['风险还在可控范围，再掷一次。', '再看一掷，但只要风向变坏就收手。', '可以继续，不过我会盯着每一枚骰子。'],
    farkle: ['爆骰，记账归零。下一轮重新来过。', '这轮没有得分，别让一次失手影响下一轮。', '骰子没给收益，生意就到此为止。'],
    hotDice: ['六枚结算，普通热骰也要留意风险。', '热骰是机会，也是账房最怕的麻烦。'],
    playerBank: ['你把分数收好，做得稳。现在轮到我重新评估。', '及时结算是聪明的选择，但我不会因此放松。'],
    playerFarkle: ['爆骰会让桌面重新平衡，我会利用这点优势。', '这一轮归零，下一轮别再把风险留给骰子。']
  },
  musa: {
    opening: ['先让我看看骰子的分布，再决定该走哪一步。', '每一张桌子都有自己的规律，先别急着替它下结论。', '你先请，我会把点数和风险一起记下来。'],
    raise: [({ multiplier }) => `我把倍率提到 x${multiplier}，这是计算后的选择，不是冲动。`, ({ multiplier }) => `x${multiplier}。风险已经写进账本，接下来只看牌面。`],
    playerRaise: [({ multiplier }) => `你把桌面抬到 x${multiplier}，那我得重新估算这一步的价值。`, ({ multiplier }) => `x${multiplier} 已经改变了收益结构，我不会只凭气势回应。`],
    acceptRaise: [({ multiplier }) => `我接受 x${multiplier}。继续对局的期望值仍然高于离场。`, ({ multiplier }) => `x${multiplier} 已经改变收益结构，但还没有改变胜负概率。`],
    declineRaise: [({ multiplier }) => `x${multiplier} 的风险溢价不够，我不接受这次样本。`, ({ multiplier }) => `这一步的期望值不支持继续，我先退出。`],
    rollHigh: ['这组点数值得认真看待，但好结果也需要及时收住。', '小顺的轮廓出来了，关键是别为了完整而浪费优势。', '牌面给了提示，我先保留最有价值的部分。'],
    rollPositive: ['有分数，也有继续观察的空间。', '这不是最好的组合，但足够说明骰子暂时站在这边。', '先把确定的收益分离出来，再看剩下的风险。'],
    rollBad: ['这一掷的样本太差，我刚才的判断需要修正。', '点数散开了，继续投掷的代价比刚才更高。', '骰子没有给答案，我不该替它补上结论。'],
    keepBig: ['高价值组合先留下，下一步只追有把握的变化。', '这一组足够改变局势，先把它从风险里拿出来。'],
    keepMid: ['中等收益可以接受，关键是留下足够的选择。', '先拿住这笔分数，剩余骰子仍有形成小顺的空间。'],
    keepSmall: ['小分不是浪费，它能让下一次判断更干净。', '先收下确定的点数，别让不确定性吞掉它。'],
    bank: ['判断已经足够清楚，先把分数收进账本。', '收益超过风险，继续投掷就不再合算。', '我接受这次结果，下一轮再重新观察。'],
    continue: ['还剩足够的选择，我再验证一次判断。', '风险尚未超过收益，再给骰子一次机会。', '继续，但只保留能解释得通的路线。'],
    farkle: ['骰子证明我错了，这一轮归零。', '我把概率看得太乐观，失手也算一种记录。', '没有得分，就没有继续解释的必要。'],
    hotDice: ['七枚骰子的样本已经结算，重新开始一轮观察。', '热骰改变了样本数量，下一步需要重新估算。'],
    playerBank: ['你及时把收益收走了，我会把这个选择记入下一轮判断。', '这笔分数拿得很干净，看来你比刚才更谨慎。'],
    playerFarkle: ['爆骰让局面重新平衡，但不能把它当成必然趋势。', '你这一轮归零，我获得了机会，但还没有获得胜势。']
  }
});

// 棋盘主题配置：默认旧橡木、贵族大厅与金穗宴厅都可独立切换。
const BOARD_THEMES = Object.freeze({
  'tavern-oak': { name: '墙洞酒馆 · 旧橡木', status: '默认棋盘', base: 'assets/images/boards/tavern-oak/base.webp', wear: 'assets/images/boards/tavern-oak/wear.png', accent: '#d2b96a', lightProfile: 'tavern', boardLightAlpha: '.16', boardVignette: '.86', wearOpacity: '.52', enabled: true },
  'noble-hall': { name: '贵族大厅 · 胡桃木', status: '可使用', base: 'assets/images/boards/noble-hall/base.webp', wear: 'assets/images/boards/noble-hall/wear.png', accent: '#c7b59b', lightProfile: 'noble', boardLightAlpha: '.14', boardVignette: '.82', wearOpacity: '.52', enabled: true },
  'gilded-banquet': {
    name: '金穗宴厅 · 胡桃鎏金桌',
    status: '新棋盘 · 可使用',
    // Keep the authored SVG as the board structure.  wood1 is injected into
    // its inner playing surface so the real grain acts as a wood base rather
    // than replacing the frame, ornaments, and wear treatment.
    base: 'assets/images/boards/gilded-banquet/base.svg',
    woodBase: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_BaseColor.jpg',
    textureMaps: {
      normal: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_Normal.png',
      roughness: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_Roughness.jpg',
      displacement: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_Displacement.tiff',
      ambientOcclusion: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_AmbientOcclusion.jpg',
      metallic: 'assets/images/boards/gilded-banquet/wood1/2K/Poliigon_WoodVeneerOak_7760_Metallic.jpg'
    },
    wear: 'assets/images/boards/gilded-banquet/wear.svg',
    ornaments: 'assets/images/boards/gilded-banquet/ornaments.svg',
    highlight: 'assets/images/boards/gilded-banquet/brass-highlight.svg',
    accent: '#d8ae58',
    lightProfile: 'bright-banquet',
    boardLightAlpha: '.22',
    boardVignette: '.48',
    wearOpacity: '.44',
    enabled: true
  },
  'castle-feast': { name: '城堡宴席 · 石木桌', status: '后续加入', base: 'assets/images/boards/castle-feast/base.webp', wear: 'assets/images/boards/castle-feast/wear.png', accent: '#b7a47b', enabled: false }
});

function loadBoardTheme() {
  try {
    const stored = window.localStorage.getItem(BOARD_THEME_STORAGE_KEY);
    return BOARD_THEMES[stored]?.enabled ? stored : 'tavern-oak';
  } catch {
    return 'tavern-oak';
  }
}

function saveBoardTheme(id) {
  try { window.localStorage.setItem(BOARD_THEME_STORAGE_KEY, id); } catch { /* storage may be unavailable for file:// pages */ }
}

const state = {
  playerName: DEFAULT_PLAYER_NAME, playerAvatar: null, playerTotal: 0, opponentTotal: 0, playerRoundBank: 0, opponentRoundBank: 0, suddenDeath: false, roundScore: 0, rollScoreBase: 0, activeRollIndices: [], round: 1, mode: 'solo',
  dice: Array(DICE_COUNT).fill(0), locked: new Set(), hasRolled: false, rolling: false,
  turn: 'player', gameOver: false, room: 'WHT-731', equipSlot: 0,
  loadout: [...DEFAULT_LOADOUT],
  opponentId: 'milo', opponentLoadout: opponents.milo.loadout, boardTheme: loadBoardTheme(),
  opponentDice: [], opponentActiveIndices: [], opponentKept: [], opponentKeptIndices: [],
  opponentRoundScore: 0, opponentRollScoreBase: 0, opponentRolling: false, opponentPhase: 'idle',
  hotDiceCount: 0, opponentHotDiceCount: 0, hotDiceType: null, opponentHotDiceType: null, heatSelectionCounted: false,
  collectionTab: 'cards', collection: null, diceSkinCollection: null, lottery: null, wallet: null,
  match: { type: 'practice', stake: 0, entryPaid: false, settled: false, active: false, result: null, payout: 0, multiplier: DEFAULT_TABLE_MULTIPLIER, scoreMultiplier: DEFAULT_TABLE_MULTIPLIER, lastRaisedBy: null, lastRaiseRound: 0, raiseCount: 0, hasSuccessfulBank: false, pendingRaise: null },
  aiDialogueHistory: [],
  aiMind: null,
  playerHistory: { banks: [], farkles: 0 }
};

const $ = (selector) => document.querySelector(selector);
const els = {
  home: $('#home-screen'), arena: document.querySelector('.arena'), startGame: $('#start-game'), homeLoadout: $('#home-loadout'), homeRulesButton: $('#home-rules-button'), homeCards: $('#opponent-cards'), homeTabs: document.querySelectorAll('.home-tab'), homeButton: $('#home-button'), restart: $('#restart-button'), ritual: $('#roll-ritual'), boardButton: $('#board-button'), boardMenu: $('#board-menu'), boardCards: document.querySelectorAll('.board-card'), profileName: $('#profile-name'), profileAvatarLetter: $('#profile-avatar-letter'), profileAvatarImage: $('#profile-avatar-image'), playerAvatarLetter: $('#player-avatar-letter'), playerAvatarImage: $('#player-avatar-image'),
  walletBalance: $('#wallet-balance'), walletSubcopy: $('#wallet-subcopy'),
  opponentModal: $('#opponent-modal-backdrop'), opponentModalCards: $('#opponent-modal-cards'), opponentModalStatus: $('#opponent-modal-status'), opponentModalConfirm: $('#confirm-opponent'), opponentModalClose: $('#opponent-modal-close'), matchTypeButtons: document.querySelectorAll('[data-match-type]'),
  diceBoxModal: $('#dice-box-modal-backdrop'), diceBoxContent: $('#dice-box-content'), diceBoxClose: $('#dice-box-close'),
  detailModal: $('#detail-modal-backdrop'), detailModalKicker: $('#detail-modal-kicker'), detailModalTitle: $('#detail-modal-title'), detailModalSubtitle: $('#detail-modal-subtitle'), detailModalContent: $('#detail-modal-content'), detailModalClose: $('#detail-modal-close'), playerDetailsButton: $('#open-player-details'), opponentDetailsButton: $('#open-opponent-details'), tableInfoButton: $('#open-table-info'), rulesButton: $('#rules-button'),
  restartModal: $('#restart-modal-backdrop'), restartModalClose: $('#restart-modal-close'), restartModalTitle: $('#restart-modal-title'), restartModalCopy: $('#restart-modal-copy'), restartSettlementPreview: $('#restart-settlement-preview'), restartCancel: $('#restart-cancel'), restartConfirm: $('#restart-confirm'), playerAvatarInput: $('#player-avatar-input'),
  collectionScreen: $('#collection-screen'), collectionTitle: $('#collection-title'), collectionDescription: $('#collection-description'), collectionContent: $('#collection-content'), collectionSummary: $('#collection-summary'), collectionClose: $('#collection-close'), collectionTabs: document.querySelectorAll('.collection-tab'), cardsButton: $('#cards-button'), medalsButton: $('#medals-button'), diceSkinsButton: $('#dice-skins-button'), openMedalCollection: $('#open-medal-collection'),
  diceState: $('#dice-state'), roll: $('#roll-button'), rollLabel: $('#roll-label'),
  bank: $('#bank-button'), bankAmount: $('#bank-amount'), playerTotal: $('#player-total'),
  opponentRight: $('#opponent-total-right'), roundNumber: $('#round-number'), roundTotal: $('#round-total'), remaining: $('#remaining-dice'), comboName: $('#combo-name'),
  comboDetail: $('#combo-detail'), selectionScore: $('#selection-score'), hotDiceCount: $('#hot-dice-count'), scoreGrowthFactor: $('#score-growth-factor'), turnLabel: $('#turn-label'), turnDetail: $('#turn-detail'), multiplierPanel: $('#multiplier-panel'), multiplierValue: $('#multiplier-value'), multiplierCap: $('#multiplier-cap'), multiplierHint: $('#multiplier-hint'), multiplierButtons: document.querySelectorAll('[data-multiplier]'), multiplierChallenge: $('#multiplier-challenge'), multiplierChallengeLabel: $('#multiplier-challenge-label'), multiplierChallengeValue: $('#multiplier-challenge-value'), multiplierChallengeCopy: $('#multiplier-challenge-copy'), multiplierAccept: $('#multiplier-accept'), multiplierDecline: $('#multiplier-decline'),
  opponentName: $('#opponent-name'), opponentStatus: $('#opponent-status'), opponentAvatar: $('#opponent-avatar'), opponentRoleCopy: $('#opponent-role-copy'), opponentStyleCopy: $('#opponent-style-copy'), opponentRiskLabel: $('#opponent-risk-label'), opponentTraits: $('#opponent-traits'), opponentLoadoutSlots: $('#opponent-loadout-slots'), opponentState: $('#opponent-state'), opponentReaction: $('#opponent-reaction'), opponentRoundScore: $('#opponent-round-score'), opponentKeptCount: $('#opponent-kept-count'), opponentRemainingCount: $('#opponent-remaining-count'), opponentHotDiceCount: $('#opponent-hot-dice-count'), opponentProgress: $('#opponent-progress'), activity: $('#activity-list'),
  playerBoardTurn: $('#player-board-turn'), playerState: $('#player-state'), playerModeCopy: $('#player-mode-copy'), playerCardDisplay: $('#player-card-display'), playerMedalsDisplay: $('#player-medals-display'), playerRoundScore: $('#player-round-score'), playerKeptCount: $('#player-kept-count'), playerRemainingCount: $('#player-remaining-count'), playerHotDiceCount: $('#player-hot-dice-count'), playerProgress: $('#player-progress'),
  room: $('#room-code'), toast: $('#toast'), modeToggle: $('#mode-toggle'), modeLabel: $('#mode-label'),
  loadoutSlots: $('#loadout-slots'), restoreLoadout: $('#reset-loadout'),
  codexModal: $('#modal-backdrop'), codexTitle: $('#codex-title'), codexKicker: $('#codex-kicker'),
  codexPage: $('#codex-page'), codexContent: $('#codex-content'), codexDots: $('#page-dots'), prev: $('#page-prev'), next: $('#page-next'),
  tableStage: document.querySelector('.table-stage'), soundToggle: $('#sound-toggle'),
  musicPlayToggle: $('#music-play-toggle'), musicVolume: $('#music-volume'), musicVolumeValue: $('#music-volume-value'),
  backgroundMusic: $('#background-music')
};
const dicePhysics3D = window.DicePhysics3D || { init: () => {}, rollDice: () => [], onRollComplete: () => {} };
window.__diceAudioMuted = false;

function loadCollection() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(COLLECTION_STORAGE_KEY) || 'null');
    return {
      unlockedCards: Array.isArray(stored?.unlockedCards) ? stored.unlockedCards : [...DEFAULT_COLLECTION.unlockedCards],
      unlockedMedals: Array.isArray(stored?.unlockedMedals) ? stored.unlockedMedals : [...DEFAULT_COLLECTION.unlockedMedals],
      purchasedCards: Array.isArray(stored?.purchasedCards) ? stored.purchasedCards : [...DEFAULT_COLLECTION.purchasedCards],
      equippedCard: typeof stored?.equippedCard === 'string' ? stored.equippedCard : DEFAULT_COLLECTION.equippedCard,
      equippedMedals: Array.isArray(stored?.equippedMedals) ? stored.equippedMedals.slice(0, 3) : [...DEFAULT_COLLECTION.equippedMedals]
    };
  } catch {
    return { unlockedCards: [], unlockedMedals: [], purchasedCards: [], equippedCard: null, equippedMedals: [] };
  }
}

function saveCollection() {
  try { window.localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(state.collection)); } catch { /* localStorage may be unavailable for file:// pages */ }
}

function loadDiceSkinCollection() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(DICE_SKIN_STORAGE_KEY) || 'null');
    const ownedSkins = Array.isArray(stored?.ownedSkins) ? stored.ownedSkins : [...DEFAULT_DICE_SKIN_COLLECTION.ownedSkins];
    const purchasedSkins = Array.isArray(stored?.purchasedSkins) ? stored.purchasedSkins : [...DEFAULT_DICE_SKIN_COLLECTION.purchasedSkins];
    const equippedSkin = DICE_SKINS.some((skin) => skin.id === stored?.equippedSkin) && ownedSkins.includes(stored.equippedSkin) ? stored.equippedSkin : DEFAULT_DICE_SKIN_COLLECTION.equippedSkin;
    return {
      ownedSkins: Array.from(new Set(['default', ...ownedSkins])),
      purchasedSkins: Array.from(new Set(purchasedSkins)),
      equippedSkin
    };
  } catch {
    return { ...DEFAULT_DICE_SKIN_COLLECTION, ownedSkins: [...DEFAULT_DICE_SKIN_COLLECTION.ownedSkins], purchasedSkins: [] };
  }
}

function saveDiceSkinCollection() {
  try { window.localStorage.setItem(DICE_SKIN_STORAGE_KEY, JSON.stringify(state.diceSkinCollection)); } catch { /* localStorage may be unavailable for file:// pages */ }
}

function loadLottery() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(LOTTERY_STORAGE_KEY) || 'null');
    const result = stored?.lastResult && typeof stored.lastResult.name === 'string'
      ? {
        type: stored.lastResult.type === 'dice-skins' ? 'dice-skins' : 'cards',
        key: String(stored.lastResult.key || ''),
        name: String(stored.lastResult.name),
        rarity: RARITY_META[stored.lastResult.rarity] ? stored.lastResult.rarity : 'common'
      }
      : null;
    return { drawCount: Math.max(0, Math.floor(Number(stored?.drawCount) || 0)), lastResult: result };
  } catch {
    return { drawCount: 0, lastResult: null };
  }
}

function saveLottery() {
  try { window.localStorage.setItem(LOTTERY_STORAGE_KEY, JSON.stringify(state.lottery)); } catch { /* storage may be unavailable for file:// pages */ }
}

function loadWallet() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(WALLET_STORAGE_KEY) || 'null');
    return {
      groschen: Number.isFinite(Number(stored?.groschen)) ? Math.max(0, Math.floor(Number(stored.groschen))) : DEFAULT_WALLET.groschen,
      lifetimeEarned: Number.isFinite(Number(stored?.lifetimeEarned)) ? Math.max(0, Math.floor(Number(stored.lifetimeEarned))) : 0,
      lifetimeSpent: Number.isFinite(Number(stored?.lifetimeSpent)) ? Math.max(0, Math.floor(Number(stored.lifetimeSpent))) : 0,
      lastSettlement: stored?.lastSettlement || null
    };
  } catch {
    return { ...DEFAULT_WALLET };
  }
}

function saveWallet() {
  try { window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(state.wallet)); } catch { /* storage may be unavailable for file:// pages */ }
}

function formatGroschen(value) {
  return `${Math.max(0, Math.floor(Number(value) || 0)).toLocaleString('zh-CN')} 格罗申`;
}

function normalizePlayerName(value) {
  const normalized = String(value ?? '').trim().replace(/\s+/g, ' ');
  const limited = Array.from(normalized).slice(0, MAX_PLAYER_NAME_LENGTH).join('');
  return limited || DEFAULT_PLAYER_NAME;
}

function normalizePlayerAvatar(value) {
  const avatar = String(value ?? '');
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(avatar) ? avatar : null;
}

function loadPlayerProfile() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PLAYER_PROFILE_STORAGE_KEY) || 'null');
    if (typeof stored === 'string') return { name: normalizePlayerName(stored), avatar: null };
    return { name: normalizePlayerName(stored?.name), avatar: normalizePlayerAvatar(stored?.avatar) };
  } catch {
    return { name: DEFAULT_PLAYER_NAME, avatar: null };
  }
}

function loadPlayerName() {
  return loadPlayerProfile().name;
}

function loadPlayerAvatar() {
  return loadPlayerProfile().avatar;
}

function savePlayerProfile() {
  try {
    window.localStorage.setItem(PLAYER_PROFILE_STORAGE_KEY, JSON.stringify({ name: normalizePlayerName(state.playerName), avatar: normalizePlayerAvatar(state.playerAvatar) }));
  } catch { /* localStorage may be unavailable for file:// pages */ }
}

function savePlayerName() {
  savePlayerProfile();
}

function renderPlayerNameUI() {
  const name = normalizePlayerName(state.playerName);
  state.playerName = name;
  const initial = Array.from(name)[0] || 'L';
  const avatar = normalizePlayerAvatar(state.playerAvatar);
  state.playerAvatar = avatar;
  if (els.profileName) els.profileName.textContent = name;
  if (els.profileAvatarLetter) els.profileAvatarLetter.textContent = initial;
  if (els.playerAvatarLetter) els.playerAvatarLetter.textContent = initial;
  if (els.profileAvatarLetter) {
    els.profileAvatarLetter.hidden = Boolean(avatar);
    els.profileAvatarLetter.classList.toggle('has-image', Boolean(avatar));
  }
  if (els.playerAvatarLetter) els.playerAvatarLetter.hidden = Boolean(avatar);
  if (els.profileAvatarImage) {
    els.profileAvatarImage.hidden = !avatar;
    if (avatar) els.profileAvatarImage.src = avatar; else els.profileAvatarImage.removeAttribute('src');
  }
  if (els.playerAvatarImage) {
    els.playerAvatarImage.hidden = !avatar;
    if (avatar) els.playerAvatarImage.src = avatar; else els.playerAvatarImage.removeAttribute('src');
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function fileToPlayerAvatar(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(?:png|jpe?g|webp)$/i.test(file.type)) {
      reject(new Error('仅支持 PNG、JPG 或 WebP 图片'));
      return;
    }
    if (file.size > MAX_PLAYER_AVATAR_FILE_SIZE) {
      reject(new Error('图片不能超过 8MB'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('图片读取失败，请重试'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('图片无法解析，请更换文件'));
      image.onload = () => {
        const size = 320;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        if (!context) { reject(new Error('当前浏览器不支持图片处理')); return; }
        context.fillStyle = '#171713';
        context.fillRect(0, 0, size, size);
        const scale = Math.max(size / image.width, size / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        resolve(canvas.toDataURL('image/jpeg', .86));
      };
      image.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });
}

async function handlePlayerAvatarUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    state.playerAvatar = await fileToPlayerAvatar(file);
    savePlayerProfile();
    renderPlayerNameUI();
    renderPlayerCollection();
    if (!els.detailModal?.classList.contains('hidden')) renderDetailModal('player');
    showToast('玩家头像已更新');
  } catch (error) {
    showToast(error?.message || '头像上传失败');
  }
}

function resetPlayerAvatar() {
  state.playerAvatar = null;
  savePlayerProfile();
  renderPlayerNameUI();
  renderPlayerCollection();
  if (!els.detailModal?.classList.contains('hidden')) renderDetailModal('player');
  showToast('已恢复默认头像');
}

function renderWallet() {
  if (!state.wallet) return;
  if (els.walletBalance) els.walletBalance.textContent = formatGroschen(state.wallet.groschen);
  if (els.walletSubcopy) els.walletSubcopy.textContent = `钱包 · ${formatGroschen(state.wallet.groschen)}`;
}

function matchTypeLabel(type = state.match?.type) {
  return type === 'stake' ? `正式赌局 · 赌注 ${formatGroschen(state.match?.stake || 0)}` : `免费练习桌 · 胜利 +${PRACTICE_REWARD} 格罗申`;
}

function collectionAsset(type, file) {
  if (type !== 'cards') return `assets/images/medals/${file}`;
  return OIL_PAINT_DLC_FILES.has(file) ? `assets/images/${file}` : `assets/images/name-cards/landscape/${file}`;
}

function diceSkinById(id = 'default') {
  return DICE_SKINS.find((skin) => skin.id === id) || DICE_SKINS[0];
}

function renderDiceSkinPreview(skin) {
  const faces = [1, 2, 3, 4, 5, 6];
  const faceMarkup = faces.map((face) => skin?.pipStyle === 'mythic-symbols' ? mythicSymbolFace(face) : pipFace(face));
  return `<span class="collection-art dice-skin-art dice-skin-art-${skin.id}" aria-hidden="true"><span class="dice-skin-preview">${faceMarkup.map((face) => `<span class="skin-preview-die">${face}</span>`).join('')}</span></span>`;
}

function applyEquippedDiceSkin() {
  if (!state.diceSkinCollection) return;
  dicePhysics3D.applySkin?.(diceSkinById(state.diceSkinCollection.equippedSkin), 'player');
}

function collectionItems(type) {
  if (type === 'dice-skins') return DICE_SKINS.map((skin) => ({ ...skin, itemId: skin.id }));
  if (type === 'dice-loadout') return [];
  const rewards = Object.entries(COLLECTION_REWARDS).map(([opponentId, reward]) => ({
    opponentId,
    file: reward[type === 'cards' ? 'card' : 'medal'],
    name: reward[type === 'cards' ? 'cardName' : 'medalName'],
    rarity: type === 'cards' ? reward.rarity : 'rare',
    opponent: opponents[opponentId].name,
    lotteryOnly: type === 'cards' ? Boolean(reward.cardLotteryOnly) : false,
    unlock: type === 'cards' && reward.cardLotteryOnly ? '仅限酒馆抽奖' : `击败 ${opponents[opponentId].name.split(' · ')[0]} 后解锁`,
    paid: false,
    collectionGroup: 'legacy'
  }));
  if (type !== 'cards') return rewards;
  return rewards
    .concat(PAID_NAME_CARDS.map((card) => ({
      file: card.file,
      name: card.name,
      opponent: '酒馆画师的风景稿',
      description: card.description,
      rarity: card.rarity,
      lotteryOnly: Boolean(card.lotteryOnly),
      price: card.price,
      paid: true,
      collectionGroup: 'legacy',
      unlock: card.lotteryOnly ? '仅限酒馆抽奖' : `画师费：${formatGroschen(card.price)}`
    })))
    .concat(OIL_PAINT_DLC_CARDS.map((card) => ({
      file: card.file,
      name: card.name,
      opponent: '油画 DLC 系列',
      description: card.description,
      rarity: card.rarity,
      lotteryOnly: Boolean(card.lotteryOnly),
      price: card.price,
      paid: !card.lotteryOnly,
      collectionGroup: 'oil-paint-dlc',
      unlock: card.lotteryOnly ? '仅限酒馆抽奖' : `DLC 画作：${formatGroschen(card.price)}`
    })));
}

function isLotteryOnlyItem(item) {
  // 传说与神话品质统一走抽奖入口；显式 lotteryOnly 兼容未来非传说的限定物品。
  return Boolean(item?.lotteryOnly || item?.rarity === 'legendary' || item?.rarity === 'mythic');
}

function lotteryCatalogItems() {
  return [
    ...collectionItems('cards').map((item) => ({ type: 'cards', key: item.file, item })),
    ...collectionItems('dice-skins')
      .filter((item) => item.itemId !== 'default')
      .map((item) => ({ type: 'dice-skins', key: item.itemId, item }))
  ];
}

function isLotteryItemOwned(entry) {
  if (!entry?.item) return false;
  if (entry.type === 'cards') {
    const purchasedCards = state.collection?.purchasedCards || [];
    const unlockedCards = state.collection?.unlockedCards || [];
    return entry.item.paid ? purchasedCards.includes(entry.key) : unlockedCards.includes(entry.key);
  }
  return (state.diceSkinCollection?.ownedSkins || []).includes(entry.key);
}

function getLotteryPool() {
  return lotteryCatalogItems().filter((entry) => !isLotteryItemOwned(entry));
}

function pickLotteryRarity(pool) {
  const available = ['mythic', 'legendary', 'epic', 'rare', 'common']
    .filter((rarity) => pool.some((entry) => entry.item.rarity === rarity));
  if (!available.length) return 'common';
  // 神话是固定 1% 的终极稀有度：只要奖池里仍有神话物品，就先独立
  // 切出 1% 的结果；其余 99% 再在当前可用的非神话品质之间动态分配。
  // 这样不会因为玩家抽空普通/稀有物品而意外抬高神话概率。
  if (available.includes('mythic')) {
    if (!available.some((rarity) => rarity !== 'mythic')) return 'mythic';
    if (secureRandomFloat() < LOTTERY_RARITY_WEIGHTS.mythic / 100) return 'mythic';
  }
  const fallback = available.filter((rarity) => rarity !== 'mythic');
  const total = fallback.reduce((sum, rarity) => sum + LOTTERY_RARITY_WEIGHTS[rarity], 0);
  let roll = secureRandomFloat() * total;
  for (const rarity of fallback) {
    roll -= LOTTERY_RARITY_WEIGHTS[rarity];
    if (roll <= 0) return rarity;
  }
  return fallback[fallback.length - 1] || 'mythic';
}

const LOTTERY_DICE_PATTERNS = Object.freeze({
  common: { label: '散骰 · 小额得分', values: [1, 5, 2, 4, 3, 6] },
  rare: { label: '三同 · 三个 1', values: [1, 1, 1, 4, 5, 6] },
  epic: { label: '小顺 · 2–6', values: [2, 3, 4, 5, 6, 1] },
  legendary: { label: '大顺 · 1–6', values: [1, 2, 3, 4, 5, 6] },
  mythic: { label: '绯红圣印 · 六面纹章', values: [1, 2, 3, 4, 5, 6] },
  preview: { label: '等待投掷', values: [4, 2, 6, 1, 5, 3] }
});

function lotteryDicePattern(rarity = 'preview') {
  return LOTTERY_DICE_PATTERNS[rarity] || LOTTERY_DICE_PATTERNS.preview;
}

function renderLotteryDice(rarity = 'preview') {
  const pattern = lotteryDicePattern(rarity);
  const meta = rarityMeta(rarity === 'preview' ? 'common' : rarity);
  const dice = pattern.values.map((value, index) => {
    const face = rarity === 'mythic'
      ? mythicSymbolFace(value)
      : `<span class="lottery-pips">${Array.from({ length: 9 }, (_, pipIndex) => `<i class="lottery-pip ${pipMap[value].includes(pipIndex) ? '' : 'is-hidden'}"></i>`).join('')}</span>`;
    return `<span class="lottery-die lottery-die-${meta.className}" style="--lottery-index:${index};">${face}</span>`;
  }).join('');
  return `<div class="lottery-dice-roll ${rarity === 'preview' ? 'is-preview' : meta.className}">${dice}</div><div class="lottery-combination-label ${rarity === 'preview' ? 'is-preview' : meta.className}">${pattern.label}</div>`;
}

function renderLotteryCollection() {
  if (!els.collectionContent) return;
  const balance = state.wallet?.groschen || 0;
  const pool = getLotteryPool();
  const last = state.lottery?.lastResult;
  const odds = ['mythic', 'legendary', 'epic', 'rare', 'common'].map((rarity) => {
    const meta = rarityMeta(rarity);
    const available = pool.some((entry) => entry.item.rarity === rarity);
    return `<span class="lottery-odds-item ${meta.className} ${available ? '' : 'is-empty'}"><b>${meta.label}</b><small>${LOTTERY_RARITY_WEIGHTS[rarity]}%</small></span>`;
  }).join('');
  const result = last
    ? (() => {
        const meta = rarityMeta(last.rarity);
        const art = last.type === 'dice-skins'
          ? renderDiceSkinPreview(diceSkinById(last.key))
          : `<span class="collection-art name-card-art"><img src="${collectionAsset('cards', last.key)}" alt="${escapeHtml(last.name)}" /></span>`;
        return `<div class="lottery-result ${meta.className}"><div class="lottery-result-art">${art}</div><div class="lottery-result-copy"><span class="rarity-tag ${meta.className}">${meta.label}</span><b>${escapeHtml(last.name)}</b><small>${last.type === 'dice-skins' ? '骰子皮肤' : '名片'} · 已加入收藏</small></div></div>`;
      })()
    : '<div class="lottery-result lottery-result-empty"><b>还没有抽取记录</b><small>抽出一件物品后，结果会留在这里。</small></div>';
  const buttonCopy = !pool.length
    ? '奖池已集齐'
    : balance < LOTTERY_DRAW_COST
      ? `还需 ${formatGroschen(LOTTERY_DRAW_COST - balance)}`
      : `投入 ${formatGroschen(LOTTERY_DRAW_COST)}`;
  els.collectionContent.innerHTML = `<section class="lottery-page"><div class="lottery-stage ${last ? 'has-result' : ''}"><div class="lottery-stage-head"><div><span class="kicker">TAVERN DRAW</span><h2>酒馆掷骰开奖</h2></div><span class="lottery-cost-badge">单抽 · ${formatGroschen(LOTTERY_DRAW_COST)}</span></div><div class="lottery-roll-zone" aria-label="独立抽奖骰子动画">${renderLotteryDice(last?.rarity || 'preview')}</div><p class="lottery-stage-copy">投入 ${formatGroschen(LOTTERY_DRAW_COST)}，让六枚独立开奖骰先滚动，再揭示本次收藏。</p><button id="lottery-draw-button" class="lottery-draw-button" type="button" ${balance < LOTTERY_DRAW_COST || !pool.length ? 'disabled' : ''}><span class="lottery-button-mark">¤</span>${buttonCopy}</button><small class="lottery-stage-note">开奖骰仅用于动画展示，不会改变局内骰子点数或概率。</small></div><aside class="lottery-panel"><div class="lottery-panel-block"><div class="lottery-odds-heading"><b>稀有度概率</b><small>未拥有池动态抽取</small></div><div class="lottery-odds">${odds}</div></div><div class="lottery-panel-block lottery-latest-block"><div class="lottery-panel-label"><b>最近抽取</b><small>结果会保留在本地存档</small></div>${result}</div><div class="lottery-footnote">已抽取 ${state.lottery?.drawCount || 0} 次 · 奖池剩余 ${pool.length} 件</div></aside></section>`;
  els.collectionContent.querySelector('#lottery-draw-button')?.addEventListener('click', drawLottery);
}

function drawLottery() {
  if (!state.wallet || !state.collection || !state.diceSkinCollection) return;
  if (state.wallet.groschen < LOTTERY_DRAW_COST) {
    showToast(`至少需要 ${formatGroschen(LOTTERY_DRAW_COST)} 才能抽奖`);
    return;
  }
  const pool = getLotteryPool();
  if (!pool.length) {
    showToast('奖池已经全部收集完毕');
    return;
  }
  const rarity = pickLotteryRarity(pool);
  const candidates = pool.filter((entry) => entry.item.rarity === rarity);
  const entry = candidates[Math.floor(secureRandomFloat() * candidates.length)] || candidates[0];
  if (!entry) return;
  state.wallet.groschen -= LOTTERY_DRAW_COST;
  state.wallet.lifetimeSpent += LOTTERY_DRAW_COST;
  if (entry.type === 'cards') {
    if (entry.item.paid) {
      state.collection.purchasedCards.push(entry.key);
    } else {
      state.collection.unlockedCards.push(entry.key);
    }
  } else {
    state.diceSkinCollection.ownedSkins.push(entry.key);
  }
  state.lottery = state.lottery || { drawCount: 0, lastResult: null };
  state.lottery.drawCount += 1;
  state.lottery.lastResult = { type: entry.type, key: entry.key, name: entry.item.name, rarity };
  saveWallet(); saveCollection(); saveDiceSkinCollection(); saveLottery();
  renderWallet(); renderCollection();
  const revealStage = els.collectionContent?.querySelector('.lottery-stage');
  revealStage?.classList.add('is-revealed');
  window.setTimeout(() => revealStage?.classList.remove('is-revealed'), 900);
  safeAudio('playClick');
  showToast(`抽到${rarityMeta(rarity).label}：${entry.item.name}`);
}

function renderCollection() {
  if (!els.collectionContent || !els.collectionSummary) return;
  const validTypes = ['cards', 'medals', 'dice-skins', 'dice-loadout', 'lottery'];
  const type = validTypes.includes(state.collectionTab) ? state.collectionTab : 'cards';
  if (!state.diceSkinCollection) state.diceSkinCollection = loadDiceSkinCollection();
  const viewMeta = {
    cards: { title: '名片', description: '胜利奖励名片免费解锁，普通与非传说油画名片可用格罗申购买；传说与神话收藏品仅限酒馆抽奖。' },
    medals: { title: '勋章', description: '装备勋章会显示在玩家左侧角色面板中，最多同时展示三枚。' },
    'dice-skins': { title: '骰子皮肤', description: '购买或解锁骰子外观；皮肤只改变材质，不影响点数概率与计分。' },
    'dice-loadout': { title: '我的骰盒', description: '配置七个功能骰子槽位；不同骰子会改变对应点数的出现概率。' },
    lottery: { title: '酒馆抽奖', description: '每次抽取消耗 600 格罗申；神话品质仅有 1% 概率，传说与神话骰子只能从这里抽出。' }
  }[type];
  if (els.collectionTitle) els.collectionTitle.textContent = viewMeta.title;
  if (els.collectionDescription) els.collectionDescription.textContent = viewMeta.description;
  const unlocked = type === 'cards' ? state.collection.unlockedCards : type === 'medals' ? state.collection.unlockedMedals : type === 'dice-skins' ? state.diceSkinCollection.ownedSkins : [];
  const equipped = type === 'cards' ? state.collection.equippedCard : type === 'medals' ? state.collection.equippedMedals : type === 'dice-skins' ? state.diceSkinCollection.equippedSkin : null;
  const items = type === 'lottery' ? [] : collectionItems(type);
  const purchasedCards = state.collection.purchasedCards || [];
  const purchasedSkins = state.diceSkinCollection.purchasedSkins || [];
  const isItemUnlocked = (item) => type === 'dice-skins' ? unlocked.includes(item.itemId) : item.paid ? purchasedCards.includes(item.file) : unlocked.includes(item.file);
  const unlockedCount = type === 'dice-loadout' ? state.loadout.length : items.filter(isItemUnlocked).length;
  const totalCount = type === 'dice-loadout' ? state.loadout.length : items.length;
  const equippedCount = type === 'cards' ? (equipped ? 1 : 0) : type === 'medals' ? equipped.length : type === 'dice-skins' ? 1 : state.loadout.length;
  els.collectionTabs?.forEach((tab) => {
    const active = tab.dataset.collectionTab === type;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
  if (type === 'lottery') {
    const pool = getLotteryPool();
    els.collectionSummary.innerHTML = `<span>抽奖费用 <strong>${formatGroschen(LOTTERY_DRAW_COST)}</strong></span><span>神话概率 <strong>${LOTTERY_RARITY_WEIGHTS.mythic}%</strong></span><small>奖池剩余 ${pool.length} 件，优先提供未拥有物品</small>`;
    renderLotteryCollection();
    return;
  }
  const summaryCopy = type === 'cards' ? '三位对手奖励、风景名片与油画 DLC，纯展示用途' : type === 'medals' ? '勋章最多同时展示三枚' : type === 'dice-skins' ? '外观皮肤不改变骰子功能' : '功能骰子影响点数概率，皮肤在“骰子”标签管理';
  const equippedCopy = type === 'cards' ? `${equippedCount} 张` : type === 'medals' ? `${equippedCount} / 3 枚` : type === 'dice-skins' ? '1 套' : `${equippedCount} 槽位`;
  const summaryLabel = type === 'dice-loadout' ? '已配置' : '已解锁';
  els.collectionSummary.innerHTML = `<span>${summaryLabel} <strong>${unlockedCount} / ${totalCount}</strong></span><span>已装备 <strong>${equippedCopy}</strong></span><small>${summaryCopy}</small>`;
  if (type === 'dice-loadout') {
    renderDiceLoadoutCollection();
    return;
  }
  const renderItem = (item) => {
    const isUnlocked = isItemUnlocked(item);
    const rarity = rarityMeta(item.rarity);
    const itemKey = type === 'dice-skins' ? item.itemId : item.file;
    const isEquipped = type === 'cards' ? state.collection.equippedCard === item.file : type === 'medals' ? state.collection.equippedMedals.includes(item.file) : state.diceSkinCollection.equippedSkin === item.itemId;
    const lotteryOnly = isLotteryOnlyItem(item);
    const action = isUnlocked ? (isEquipped ? '已装备' : '装备') : lotteryOnly ? '抽奖获得' : item.paid ? (state.wallet?.groschen >= item.price ? '购买' : '余额不足') : '未解锁';
    const status = isUnlocked ? (isEquipped ? '当前装备' : '已解锁 · 点击装备') : lotteryOnly ? '仅限酒馆抽奖' : item.unlock;
    const actionLabel = item.paid && !lotteryOnly && !isUnlocked && state.wallet?.groschen >= item.price ? `购买 · ${formatGroschen(item.price)}` : action;
    const art = type === 'dice-skins' ? renderDiceSkinPreview(item) : `<span class="collection-art ${type === 'cards' ? 'name-card-art' : ''}"><img src="${collectionAsset(type, item.file)}" alt="${item.name}" loading="lazy" /></span>`;
    const keyAttribute = type === 'dice-skins' ? `data-collection-skin="${itemKey}"` : `data-collection-file="${itemKey}"`;
    return `<button class="collection-item ${type === 'dice-skins' ? 'dice-skin-item' : ''} ${isUnlocked ? '' : 'is-locked'} ${item.paid && !lotteryOnly ? 'is-paid' : 'is-reward'} ${lotteryOnly ? 'is-lottery-only' : ''} ${isEquipped ? 'is-equipped' : ''}" data-collection-type="${type}" ${keyAttribute} type="button" aria-label="${item.name} · ${rarity.label} · ${actionLabel}" ${isUnlocked || item.paid || lotteryOnly ? '' : 'aria-disabled="true"'}>${art}<span class="collection-copy"><span class="collection-name-row"><b>${item.name}</b><span class="rarity-tag ${rarity.className}">${rarity.label}</span></span><small>${item.description || item.opponent}</small><em>${status}</em></span><strong class="collection-action">${actionLabel}</strong></button>`;
  };
  if (type === 'cards') {
    const groups = [
      { key: 'legacy', title: '基础名片', subtitle: '原有 11 张 · 对手胜利奖励与风景收藏' },
      { key: 'oil-paint-dlc', title: '油画 DLC', subtitle: '全新系列 · 6 张可购买 · 2 张传说抽奖专属' }
    ];
    els.collectionContent.innerHTML = groups.map((group) => {
      const groupItems = items.filter((item) => item.collectionGroup === group.key);
      return `<section class="collection-group" data-collection-group="${group.key}"><div class="collection-group-heading"><div><b>${group.title}</b><small>${group.subtitle}</small></div><span>${groupItems.length} 张</span></div><div class="collection-group-grid">${groupItems.map(renderItem).join('')}</div></section>`;
    }).join('');
  } else if (type === 'dice-skins') {
    const groups = [
      { key: 'default', title: '基础骰子', subtitle: '墙洞酒馆默认装备' },
      { key: 'tavern', title: '酒馆奢华系列', subtitle: '猩红、鎏金与蓝珐琅收藏' },
      { key: 'kingdom-workshop', title: '王国工坊·釉石珍藏', subtitle: '陶釉、琥珀与天然石材系列' }
    ];
    els.collectionContent.innerHTML = groups.map((group) => {
      const groupItems = items.filter((item) => item.collectionGroup === group.key);
      if (!groupItems.length) return '';
      return `<section class="collection-group" data-collection-group="${group.key}"><div class="collection-group-heading"><div><b>${group.title}</b><small>${group.subtitle}</small></div><span>${groupItems.length} 套</span></div><div class="collection-group-grid">${groupItems.map(renderItem).join('')}</div></section>`;
    }).join('');
  } else {
    els.collectionContent.innerHTML = `<section class="collection-group collection-group-single"><div class="collection-group-grid">${items.map(renderItem).join('')}</div></section>`;
  }
  els.collectionContent.querySelectorAll('.collection-item').forEach((item) => item.addEventListener('click', () => {
    const key = type === 'dice-skins' ? item.dataset.collectionSkin : item.dataset.collectionFile;
    const file = key;
    const catalogItem = items.find((entry) => (type === 'dice-skins' ? entry.itemId === key : entry.file === key));
    if (type === 'dice-skins') {
      if (isLotteryOnlyItem(catalogItem) && !isItemUnlocked(catalogItem)) { openCollection('lottery'); showToast('传说与神话骰子皮肤只能通过酒馆抽奖获得'); return; }
      if (catalogItem?.paid && !purchasedSkins.includes(key)) { purchaseDiceSkin(catalogItem); return; }
      if (item.classList.contains('is-locked')) { showToast(item.querySelector('em')?.textContent || '尚未解锁'); return; }
      state.diceSkinCollection.equippedSkin = state.diceSkinCollection.equippedSkin === key ? 'default' : key;
      saveDiceSkinCollection(); applyEquippedDiceSkin(); renderCollection(); safeAudio('playClick');
      showToast(`已装备骰子皮肤：${diceSkinById(state.diceSkinCollection.equippedSkin).name}`);
      return;
    }
    if (isLotteryOnlyItem(catalogItem) && !isItemUnlocked(catalogItem)) { openCollection('lottery'); showToast('传说与神话名片只能通过酒馆抽奖获得'); return; }
    if (catalogItem?.paid && !purchasedCards.includes(file)) { purchaseNameCard(catalogItem); return; }
    if (item.classList.contains('is-locked')) { showToast(item.querySelector('em')?.textContent || '尚未解锁'); return; }
    if (type === 'cards') state.collection.equippedCard = state.collection.equippedCard === file ? null : file;
    else state.collection.equippedMedals = state.collection.equippedMedals.includes(file) ? state.collection.equippedMedals.filter((id) => id !== file) : [...state.collection.equippedMedals.slice(-2), file];
    saveCollection(); renderCollection(); renderPlayerCollection(); safeAudio('playClick');
  }));
}

function renderDiceLoadoutCollection() {
  const slots = state.loadout.map((id, slot) => {
    const die = dieById(id);
    return `<button class="loadout-slot" data-dice-loadout-slot="${slot}" type="button" title="槽位 ${slot + 1} · ${die.name}"><span class="slot-number">${slot + 1}</span><span class="slot-die">${pipFace((slot % 6) + 1)}</span><span class="slot-name">${die.name.replace('的骰子', '')}</span></button>`;
  }).join('');
  els.collectionContent.innerHTML = `<section class="dice-loadout-page"><div class="collection-group-heading"><div><b>七个功能骰子槽位</b><small>点击槽位后打开概率库；这些骰子决定实际投掷权重。</small></div><button class="collection-reset-loadout" id="collection-reset-loadout" type="button">还原普通骰</button></div><div class="loadout-slots dice-loadout-grid">${slots}</div><p class="dice-loadout-note">骰子皮肤只改变外观，请前往“骰子皮肤”标签购买与装备。</p></section>`;
  els.collectionContent.querySelectorAll('[data-dice-loadout-slot]').forEach((slot) => slot.addEventListener('click', () => { state.equipSlot = Number(slot.dataset.diceLoadoutSlot); openCodex(2); }));
  els.collectionContent.querySelector('#collection-reset-loadout')?.addEventListener('click', () => { restoreDefaultLoadout(); renderCollection(); });
}

function purchaseNameCard(card) {
  if (!card || !state.wallet) return;
  if (isLotteryOnlyItem(card)) {
    showToast('传说与神话品质只能通过酒馆抽奖获得');
    return;
  }
  if (state.collection.purchasedCards.includes(card.file)) return;
  const activeStakeReserve = state.match?.active && state.match.type === 'stake' ? Math.max(0, Number(state.match.maxRisk) || 0) : 0;
  if (activeStakeReserve && state.wallet.groschen - card.price < activeStakeReserve) { showToast(`牌局进行中需保留 ${formatGroschen(activeStakeReserve)} 风险额度`); return; }
  if (state.wallet.groschen < card.price) { showToast(`还差 ${formatGroschen(card.price - state.wallet.groschen)}，暂时买不起这张名片`); return; }
  state.wallet.groschen -= card.price;
  state.wallet.lifetimeSpent += card.price;
  state.collection.purchasedCards.push(card.file);
  saveWallet(); saveCollection(); renderWallet(); renderCollection();
  showToast(`已购买「${card.name}」 · ${formatGroschen(card.price)}`);
  safeAudio('playClick');
}

function purchaseDiceSkin(skin) {
  if (!skin || !state.wallet || !state.diceSkinCollection) return;
  if (isLotteryOnlyItem(skin)) {
    showToast('传说与神话品质只能通过酒馆抽奖获得');
    return;
  }
  if (state.diceSkinCollection.ownedSkins.includes(skin.id)) return;
  const activeStakeReserve = state.match?.active && state.match.type === 'stake' ? Math.max(0, Number(state.match.maxRisk) || 0) : 0;
  if (activeStakeReserve && state.wallet.groschen - skin.price < activeStakeReserve) { showToast(`牌局进行中需保留 ${formatGroschen(activeStakeReserve)} 风险额度`); return; }
  if (state.wallet.groschen < skin.price) { showToast(`还差 ${formatGroschen(skin.price - state.wallet.groschen)}，暂时买不起这套骰子皮肤`); return; }
  state.wallet.groschen -= skin.price;
  state.wallet.lifetimeSpent += skin.price;
  state.diceSkinCollection.purchasedSkins.push(skin.id);
  state.diceSkinCollection.ownedSkins.push(skin.id);
  saveWallet(); saveDiceSkinCollection(); renderWallet(); renderCollection();
  showToast(`已购买「${skin.name}」 · ${formatGroschen(skin.price)}`);
  safeAudio('playClick');
}

function openCollection(tab = 'cards') {
  closeBoardMenu(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal();
  const validTabs = ['cards', 'medals', 'dice-skins', 'dice-loadout', 'lottery'];
  state.collectionTab = validTabs.includes(tab) ? tab : 'cards';
  renderCollection();
  els.collectionScreen?.classList.remove('hidden');
  document.body.classList.add('collection-open');
  const activeView = state.collectionTab.startsWith('dice-') ? 'dice-collection' : 'collection';
  document.querySelectorAll('.nav-item').forEach((nav) => {
    const active = nav.dataset.collectionTab
      ? nav.dataset.collectionTab === state.collectionTab
      : nav.dataset.view === activeView;
    nav.classList.toggle('active', active);
  });
}

function closeCollection() {
  els.collectionScreen?.classList.add('hidden');
  document.body.classList.remove('collection-open');
  document.querySelector('.nav-item[data-view="game"]')?.classList.add('active');
  document.querySelectorAll('.nav-item[data-view="collection"], .nav-item[data-view="dice-collection"]').forEach((nav) => nav.classList.remove('active'));
}

function grantVictoryReward(opponentId) {
  const reward = COLLECTION_REWARDS[opponentId];
  if (!reward || !state.collection) return '';
  const newlyUnlocked = [];
  if (!reward.cardLotteryOnly && !state.collection.unlockedCards.includes(reward.card)) { state.collection.unlockedCards.push(reward.card); newlyUnlocked.push(reward.cardName); }
  if (!state.collection.unlockedMedals.includes(reward.medal)) { state.collection.unlockedMedals.push(reward.medal); newlyUnlocked.push(reward.medalName); }
  if (!newlyUnlocked.length) return '你已拥有这位对手的胜利奖励';
  saveCollection();
  return `解锁奖励：${newlyUnlocked.join(' · ')}`;
}

function renderOpponentLoadout(profile) {
  if (!els.opponentLoadoutSlots) return;
  els.opponentLoadoutSlots.innerHTML = profile.loadout.map((id, index) => {
    const die = dieById(id);
    return `<span class="opponent-loadout-slot" title="${die.name}"><i>${index + 1}</i><b>${die.name.replace('的骰子', '')}</b></span>`;
  }).join('');
}

function renderRolePanels() {
  const profile = opponents[state.opponentId] || opponents.milo;
  if (els.opponentAvatar) { els.opponentAvatar.src = profile.avatar; els.opponentAvatar.alt = `${profile.name}头像`; }
  if (els.opponentName) els.opponentName.textContent = profile.name;
  if (els.opponentRoleCopy) els.opponentRoleCopy.textContent = `${profile.short.split(' · ')[0]} · ${profile.role}`;
  if (els.opponentStyleCopy) els.opponentStyleCopy.textContent = profile.style;
  if (els.opponentRiskLabel) els.opponentRiskLabel.textContent = profile.riskLabel;
  if (els.opponentTraits) els.opponentTraits.innerHTML = profile.traits.map((trait) => `<span>${trait}</span>`).join('');
  renderOpponentLoadout(profile);
  renderPlayerCollection();
}

function renderPlayerCollection() {
  if (!state.collection) return;
  renderPlayerNameUI();
  const playerName = escapeHtml(state.playerName);
  const equippedCard = state.collection.equippedCard;
  if (els.playerCardDisplay) {
    els.playerCardDisplay.classList.toggle('is-equipped', Boolean(equippedCard));
    els.playerCardDisplay.innerHTML = equippedCard
      ? `<button class="equipped-card-button" type="button" title="打开名片收藏"><img src="${collectionAsset('cards', equippedCard)}" alt="已装备名片" /><span class="player-card-name">${playerName}</span></button>`
      : `<div class="player-name-fallback">${playerName}</div><button class="equipped-card-empty" type="button" title="打开名片收藏">未装备名片</button>`;
    els.playerCardDisplay.querySelector('button')?.addEventListener('click', () => openCollection('cards'));
  }
  if (els.playerMedalsDisplay) {
    const medals = state.collection.equippedMedals || [];
    els.playerMedalsDisplay.innerHTML = Array.from({ length: 3 }, (_, index) => {
      const file = medals[index];
      return file
        ? `<button class="equipped-medal-slot filled" type="button" title="打开勋章收藏"><img src="${collectionAsset('medals', file)}" alt="已装备勋章" /></button>`
        : '<button class="equipped-medal-slot" type="button" title="打开勋章收藏"><span>＋</span></button>';
    }).join('');
    els.playerMedalsDisplay.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => openCollection('medals')));
  }
}

function addOpponentReaction(message, time = 'AI 反应') {
  if (els.opponentReaction) els.opponentReaction.textContent = message;
  const name = (opponents[state.opponentId]?.name || '对手').split(' · ')[0];
  addActivity('ai reaction', `<b>${name}</b> <span class="reaction-copy">“${message}”</span>`, time);
}

// ---------------------------------------------------------------------------
// 音效引擎：全部使用 Web Audio API 实时合成，不依赖任何外部音频文件。
// ---------------------------------------------------------------------------
const audio = (() => {
  let ctx = null; let muted = false; let musicStarted = false;
  let sfxBus = null; let sfxCompressor = null; let sfxIntensity = 0.9;
  const music = els.backgroundMusic;
  // 背景音乐文件已从仓库移除以控制 GitHub 体积；骰子音效仍由 Web Audio
  // 实时合成。保留这层接口，后续重新加入轻量音乐资源时无需改动调用方。
  const musicTracks = [];
  let musicIndex = -1;
  const MUSIC_VOLUME_KEY = 'dice-music-volume';
  const DEFAULT_MUSIC_VOLUME = 28;
  function clampVolume(value) {
    if (value === null || value === undefined || value === '') return DEFAULT_MUSIC_VOLUME;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return DEFAULT_MUSIC_VOLUME;
    return Math.max(0, Math.min(100, Math.round(parsed)));
  }
  function readStoredVolume() {
    try { return clampVolume(window.localStorage.getItem(MUSIC_VOLUME_KEY)); } catch { return DEFAULT_MUSIC_VOLUME; }
  }
  let musicVolume = readStoredVolume();
  if (music) music.volume = musicVolume / 100;
  function ensureCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function ensureSfxOutput(context) {
    if (!sfxBus || !sfxCompressor) {
      sfxBus = context.createGain(); sfxBus.gain.value = 0.94;
      sfxCompressor = context.createDynamicsCompressor();
      sfxCompressor.threshold.value = -18;
      sfxCompressor.knee.value = 16;
      sfxCompressor.ratio.value = 3;
      sfxCompressor.attack.value = 0.003;
      sfxCompressor.release.value = 0.2;
      sfxBus.connect(sfxCompressor).connect(context.destination);
    }
    return sfxBus;
  }
  function scaledPeak(base, multiplier = 1) { return Math.min(0.72, base * sfxIntensity * multiplier); }
  function setSfxIntensity(value) {
    const next = Number(value);
    sfxIntensity = Number.isFinite(next) ? Math.max(0.82, Math.min(1.3, next)) : 0.9;
    window.__diceAudioIntensity = sfxIntensity;
    return sfxIntensity;
  }
  function setMusicTrack(index) {
    if (!music || !musicTracks.length) return null;
    const normalized = ((Number(index) || 0) % musicTracks.length + musicTracks.length) % musicTracks.length;
    const track = musicTracks[normalized];
    musicIndex = normalized;
    if (music.dataset.trackId !== track.id) {
      music.dataset.trackId = track.id;
      music.src = track.src;
      music.load();
    }
    return track;
  }
  async function playNextTrack() {
    if (!music || muted || !musicTracks.length) return false;
    const track = setMusicTrack(musicIndex + 1);
    if (!track) return false;
    music.muted = false;
    try {
      await music.play();
      musicStarted = true;
      return true;
    } catch (error) {
      console.warn('[audio:next-track]', track.label, error);
      return false;
    }
  }
  async function startMusic() {
    if (!music || muted) return false;
    if (!music.dataset.trackId) setMusicTrack(0);
    music.muted = false;
    try {
      await music.play();
      musicStarted = true;
      return true;
    } catch (error) {
      console.warn('[audio:background-music]', error);
      return false;
    }
  }
  function pauseMusic() {
    if (!music) return false;
    music.pause();
    musicStarted = false;
    return true;
  }
  async function toggleMusic() {
    if (!music) return false;
    if (music.paused || music.ended) return startMusic();
    pauseMusic();
    return false;
  }
  if (music) {
    music.addEventListener('ended', () => {
      musicStarted = false;
      playNextTrack();
    });
    ['play', 'pause', 'ended'].forEach((eventName) => music.addEventListener(eventName, () => window.updateMusicPlaybackUI?.()));
  }
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
    osc.connect(gain).connect(ensureSfxOutput(context)); osc.start(start); osc.stop(start + duration + 0.02);
  }
  function sweepTone(context, { from, to, type = 'triangle', start, duration, peak = 0.16 }) {
    const osc = context.createOscillator(); osc.type = type;
    osc.frequency.setValueAtTime(from, start);
    osc.frequency.exponentialRampToValueAtTime(to, start + duration * 0.86);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ensureSfxOutput(context)); osc.start(start); osc.stop(start + duration + 0.02);
  }
  function playShake() {
    if (muted) return; const context = ensureCtx();
    for (let i = 0; i < 4; i += 1) {
      const t = context.currentTime + i * 0.1 + Math.random() * 0.03;
      const src = context.createBufferSource(); src.buffer = noiseBuffer(context, 0.09);
      const filter = context.createBiquadFilter(); filter.type = 'bandpass'; filter.frequency.value = 1000 + Math.random() * 900; filter.Q.value = 0.9;
      const gain = context.createGain(); gain.gain.setValueAtTime(0.0001, t); gain.gain.linearRampToValueAtTime(scaledPeak(0.22), t + 0.008); gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      src.connect(filter).connect(gain).connect(ensureSfxOutput(context)); src.start(t); src.stop(t + 0.1);
    }
  }
  function playLand() {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const landingIntensity = sfxIntensity;
    // 结算落地由“主闷响 + 两次轻碰撞”组成，听起来像一把骰子同时落到木桌。
    [
      { offset: 0, duration: 0.12, peak: 0.23, filter: 900 },
      { offset: 0.026, duration: 0.085, peak: 0.13, filter: 1220 },
      { offset: 0.058, duration: 0.115, peak: 0.085, filter: 650 }
    ].forEach(({ offset, duration, peak, filter: cutoff }) => {
      const impact = context.createBufferSource(); impact.buffer = noiseBuffer(context, duration);
      const impactFilter = context.createBiquadFilter(); impactFilter.type = 'lowpass'; impactFilter.frequency.value = cutoff;
      const impactGain = context.createGain(); const start = t + offset;
      impactGain.gain.setValueAtTime(0.0001, start);
      impactGain.gain.linearRampToValueAtTime(scaledPeak(peak), start + 0.006);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      impact.connect(impactFilter).connect(impactGain).connect(ensureSfxOutput(context));
      impact.start(start); impact.stop(start + duration + 0.01);
    });
    tone(context, { freq: 124 + Math.random() * 8, type: 'sine', start: t, duration: 0.22, peak: scaledPeak(0.2) });
    tone(context, { freq: 168 + Math.random() * 10, type: 'triangle', start: t + 0.045, duration: 0.18, peak: scaledPeak(0.075) });
    // 留一小段木桌共鸣，x3/x5 时更有重量，但仍由总线压缩保护。
    tone(context, { freq: 92 + Math.random() * 6, type: 'sine', start: t + 0.055, duration: 0.3, peak: scaledPeak(0.07) * landingIntensity });
  }
  function playClick() { if (!muted) tone(ensureCtx(), { freq: 720, type: 'triangle', start: ensureCtx().currentTime, duration: 0.06, peak: 0.2 }); }
  // 骰子锁定专用音效：用低沉的木桌/皮革触感替代通用高频 UI 点击。
  // 这里刻意保持短、轻、带一点随机音高，连续点选时不会像机械提示音。
  function playDiceSelect() {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const woodNoise = context.createBufferSource(); woodNoise.buffer = noiseBuffer(context, 0.075);
    const woodFilter = context.createBiquadFilter(); woodFilter.type = 'lowpass'; woodFilter.frequency.value = 1500;
    const woodGain = context.createGain();
    woodGain.gain.setValueAtTime(0.0001, t);
    woodGain.gain.linearRampToValueAtTime(scaledPeak(0.19), t + 0.006);
    woodGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    woodNoise.connect(woodFilter).connect(woodGain).connect(ensureSfxOutput(context));
    woodNoise.start(t); woodNoise.stop(t + 0.085);
    tone(context, { freq: 142 + Math.random() * 14, type: 'sine', start: t, duration: 0.14, peak: scaledPeak(0.2) });
    tone(context, { freq: 410 + Math.random() * 28, type: 'triangle', start: t + 0.008, duration: 0.11, peak: scaledPeak(0.105) });
    // 极短的锁定“卡扣”亮点，提升可辨识度但不做成电子提示音。
    const lockSnap = context.createBufferSource(); lockSnap.buffer = noiseBuffer(context, 0.032);
    const snapFilter = context.createBiquadFilter(); snapFilter.type = 'bandpass'; snapFilter.frequency.value = 1850 + Math.random() * 220; snapFilter.Q.value = 1.1;
    const snapGain = context.createGain();
    snapGain.gain.setValueAtTime(0.0001, t + 0.014);
    snapGain.gain.linearRampToValueAtTime(scaledPeak(0.07), t + 0.019);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.047);
    lockSnap.connect(snapFilter).connect(snapGain).connect(ensureSfxOutput(context));
    lockSnap.start(t + 0.014); lockSnap.stop(t + 0.055);
  }
  function playDiceUnselect() {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const clothNoise = context.createBufferSource(); clothNoise.buffer = noiseBuffer(context, 0.06);
    const clothFilter = context.createBiquadFilter(); clothFilter.type = 'lowpass'; clothFilter.frequency.value = 720;
    const clothGain = context.createGain();
    clothGain.gain.setValueAtTime(0.0001, t);
    clothGain.gain.linearRampToValueAtTime(scaledPeak(0.08, 0.94), t + 0.008);
    clothGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
    clothNoise.connect(clothFilter).connect(clothGain).connect(ensureSfxOutput(context));
    clothNoise.start(t); clothNoise.stop(t + 0.07);
    tone(context, { freq: 112 + Math.random() * 8, type: 'sine', start: t, duration: 0.085, peak: scaledPeak(0.07, 0.94) });
  }
  function playHeatChain(chain = 1) {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const level = Math.max(1, Math.min(12, Number(chain) || 1));
    const weight = Math.min(1.2, 0.9 + level * 0.028);
    // 连火是短促、可重复的“卡扣”反馈，不抢普通热骰/完美热骰的声场。
    tone(context, { freq: 148 + level * 5, type: 'sine', start: t, duration: 0.14, peak: scaledPeak(0.12, weight) });
    tone(context, { freq: 302 + level * 9, type: 'triangle', start: t + 0.018, duration: 0.13, peak: scaledPeak(0.085, weight) });
    sweepTone(context, { from: 210 + level * 7, to: 470 + level * 16, type: 'triangle', start: t + 0.012, duration: 0.14, peak: scaledPeak(0.045, weight) });
  }
  function playOrdinaryHotDice(chain = 1) {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const level = Math.max(1, Math.min(12, Number(chain) || 1));
    const weight = Math.min(1.32, 0.98 + level * 0.035);
    // 普通热骰：三段木桌撞击 + 上行铜杯共鸣，清楚表达“骰池重新点燃”。
    [
      { offset: 0, duration: 0.085, peak: 0.18, filter: 650 },
      { offset: 0.055, duration: 0.075, peak: 0.13, filter: 820 },
      { offset: 0.108, duration: 0.09, peak: 0.1, filter: 1060 }
    ].forEach(({ offset, duration, peak, filter: cutoff }) => {
      const impact = context.createBufferSource(); impact.buffer = noiseBuffer(context, duration);
      const impactFilter = context.createBiquadFilter(); impactFilter.type = 'lowpass'; impactFilter.frequency.value = cutoff;
      const impactGain = context.createGain(); const start = t + offset;
      impactGain.gain.setValueAtTime(0.0001, start);
      impactGain.gain.linearRampToValueAtTime(scaledPeak(peak, weight), start + 0.006);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      impact.connect(impactFilter).connect(impactGain).connect(ensureSfxOutput(context));
      impact.start(start); impact.stop(start + duration + 0.01);
    });
    const notes = [330, 415.3, 523.25, 659.25];
    const shift = Math.min(1.18, 1 + (level - 1) * 0.014);
    notes.forEach((freq, index) => tone(context, {
      freq: freq * shift,
      type: index % 2 ? 'triangle' : 'sine',
      start: t + 0.035 + index * 0.064,
      duration: 0.22 + index * 0.025,
      peak: scaledPeak(0.09 + Math.min(0.035, level * 0.0025), weight)
    }));
    sweepTone(context, { from: 250 + level * 8, to: 920 + level * 14, type: 'triangle', start: t + 0.018, duration: 0.28, peak: scaledPeak(0.06, weight) });
  }
  function playPerfectHotDice(chain = 1) {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const level = Math.max(1, Math.min(12, Number(chain) || 1));
    const weight = Math.min(1.42, 1.08 + level * 0.04);
    // 完美热骰：七枚骰子的连续撞桌合奏，尾端用长一点的铜/木共鸣收束。
    for (let index = 0; index < 7; index += 1) {
      const offset = index * 0.038;
      const impact = context.createBufferSource(); impact.buffer = noiseBuffer(context, 0.075);
      const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 720 + index * 95;
      const gain = context.createGain(); const start = t + offset;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(scaledPeak(0.105 + index * 0.009, weight), start + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.072);
      impact.connect(filter).connect(gain).connect(ensureSfxOutput(context));
      impact.start(start); impact.stop(start + 0.085);
    }
    [261.63, 329.63, 392, 523.25, 659.25].forEach((freq, index) => tone(context, {
      freq: freq * (1 + Math.min(0.08, (level - 1) * 0.006)),
      type: index === 2 ? 'triangle' : 'sine',
      start: t + 0.075 + index * 0.075,
      duration: 0.42 + index * 0.045,
      peak: scaledPeak(0.105 + index * 0.014, weight)
    }));
    sweepTone(context, { from: 180 + level * 10, to: 1480 + level * 18, type: 'triangle', start: t + 0.035, duration: 0.52, peak: scaledPeak(0.11, weight) });
    const shimmer = context.createBufferSource(); shimmer.buffer = noiseBuffer(context, 0.22);
    const shimmerFilter = context.createBiquadFilter(); shimmerFilter.type = 'bandpass'; shimmerFilter.frequency.value = 2300 + level * 60; shimmerFilter.Q.value = 1.2;
    const shimmerGain = context.createGain();
    shimmerGain.gain.setValueAtTime(0.0001, t + 0.22);
    shimmerGain.gain.linearRampToValueAtTime(scaledPeak(0.08, weight), t + 0.24);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);
    shimmer.connect(shimmerFilter).connect(shimmerGain).connect(ensureSfxOutput(context));
    shimmer.start(t + 0.22); shimmer.stop(t + 0.56);
  }
  function playHotDice(chain = 1, options = {}) {
    const kind = options.kind || (options.full ? 'perfect' : 'ordinary');
    if (kind === 'perfect') return playPerfectHotDice(chain);
    if (kind === 'ordinary') return playOrdinaryHotDice(chain);
    return playHeatChain(chain);
  }
  function playDeny() { if (!muted) tone(ensureCtx(), { freq: 160, type: 'square', start: ensureCtx().currentTime, duration: 0.09, peak: 0.12 }); }
  function playBank(score = 0) {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;
    const numericScore = Math.max(0, Number(score) || 0);
    const intensity = Math.min(1.12, 0.82 + Math.sqrt(numericScore / 1200) * 0.25) * sfxIntensity;

    // 一下轻短的木桌/皮革闷响，先给出“骰子被收回”的触感。
    const tableThump = context.createBufferSource(); tableThump.buffer = noiseBuffer(context, 0.085);
    const tableFilter = context.createBiquadFilter(); tableFilter.type = 'lowpass'; tableFilter.frequency.value = 980;
    const tableGain = context.createGain();
    tableGain.gain.setValueAtTime(0.0001, t);
    tableGain.gain.linearRampToValueAtTime(Math.min(0.3, 0.12 * intensity), t + 0.006);
    tableGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.082);
    tableThump.connect(tableFilter).connect(tableGain).connect(ensureSfxOutput(context));
    tableThump.start(t); tableThump.stop(t + 0.095);

    // 低频触感之后接明亮但温暖的上行琶音，形成“投入得到回报”的快感。
    [293.66, 369.99, 440, 587.33].forEach((freq, i) => tone(context, {
      freq: freq * (1 + (Math.random() - 0.5) * 0.012),
      type: i === 1 || i === 3 ? 'triangle' : 'sine',
      start: t + i * 0.075,
      duration: 0.2 + i * 0.045,
      peak: Math.min(0.25, (0.095 + i * 0.012) * intensity)
    }));
    const rewardSpark = context.createBufferSource(); rewardSpark.buffer = noiseBuffer(context, 0.045);
    const sparkFilter = context.createBiquadFilter(); sparkFilter.type = 'bandpass'; sparkFilter.frequency.value = 2100; sparkFilter.Q.value = 0.8;
    const sparkGain = context.createGain();
    sparkGain.gain.setValueAtTime(0.0001, t + 0.12);
    sparkGain.gain.linearRampToValueAtTime(Math.min(0.1, 0.045 * intensity), t + 0.128);
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.165);
    rewardSpark.connect(sparkFilter).connect(sparkGain).connect(ensureSfxOutput(context));
    rewardSpark.start(t + 0.12); rewardSpark.stop(t + 0.18);
  }
  function playFarkle() {
    if (muted) return;
    const context = ensureCtx(); const t = context.currentTime;

    // 三次间隔很短的低通噪声，模拟骰子在木桌上连续撞散。
    [
      { offset: 0, duration: 0.055, peak: 0.13, filter: 720 },
      { offset: 0.065, duration: 0.06, peak: 0.09, filter: 620 },
      { offset: 0.135, duration: 0.07, peak: 0.065, filter: 520 }
    ].forEach(({ offset, duration, peak, filter: cutoff }) => {
      const impact = context.createBufferSource(); impact.buffer = noiseBuffer(context, duration);
      const impactFilter = context.createBiquadFilter(); impactFilter.type = 'lowpass'; impactFilter.frequency.value = cutoff;
      const impactGain = context.createGain(); const start = t + offset;
      impactGain.gain.setValueAtTime(0.0001, start);
      impactGain.gain.linearRampToValueAtTime(scaledPeak(peak), start + 0.005);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      impact.connect(impactFilter).connect(impactGain).connect(ensureSfxOutput(context));
      impact.start(start); impact.stop(start + duration + 0.01);
    });

    // 低沉、逐步下坠的音高表达“本轮分数落空”，替代尖锐锯齿波。
    [236, 178, 132].forEach((freq, i) => tone(context, {
      freq: freq * (1 + (Math.random() - 0.5) * 0.015),
      type: i === 1 ? 'triangle' : 'sine',
      start: t + i * 0.105,
      duration: 0.16 + i * 0.035,
      peak: scaledPeak([0.12, 0.085, 0.06][i])
    }));
    sweepTone(context, { from: 310, to: 126, type: 'triangle', start: t + 0.02, duration: 0.28, peak: scaledPeak(0.09) });
    const failureSnap = context.createBufferSource(); failureSnap.buffer = noiseBuffer(context, 0.04);
    const failureFilter = context.createBiquadFilter(); failureFilter.type = 'bandpass'; failureFilter.frequency.value = 1380; failureFilter.Q.value = 0.75;
    const failureGain = context.createGain();
    failureGain.gain.setValueAtTime(0.0001, t + 0.018);
    failureGain.gain.linearRampToValueAtTime(scaledPeak(0.06), t + 0.023);
    failureGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.058);
    failureSnap.connect(failureFilter).connect(failureGain).connect(ensureSfxOutput(context));
    failureSnap.start(t + 0.018); failureSnap.stop(t + 0.07);

    // 很轻的低频尾部，让牌桌震动和声音自然收束。
    const rumble = context.createBufferSource(); rumble.buffer = noiseBuffer(context, 0.34);
    const rumbleFilter = context.createBiquadFilter(); rumbleFilter.type = 'lowpass'; rumbleFilter.frequency.value = 260;
    const rumbleGain = context.createGain();
    rumbleGain.gain.setValueAtTime(0.0001, t + 0.02);
    rumbleGain.gain.linearRampToValueAtTime(scaledPeak(0.042, 0.86), t + 0.045);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
    rumble.connect(rumbleFilter).connect(rumbleGain).connect(ensureSfxOutput(context));
    rumble.start(t + 0.02); rumble.stop(t + 0.36);
  }
  function playWin() {
    if (muted) return; const context = ensureCtx(); const t = context.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => tone(context, { freq, type: 'sine', start: t + i * 0.1, duration: 0.5, peak: 0.3 }));
  }
  return {
    playShake, playLand, playClick, playDiceSelect, playDiceUnselect, playHeatChain, playOrdinaryHotDice, playPerfectHotDice, playHotDice, playDeny, playBank, playFarkle, playWin, startMusic, pauseMusic, toggleMusic, setSfxIntensity,
    setMusicVolume: (value) => {
      musicVolume = clampVolume(value);
      if (music) music.volume = musicVolume / 100;
      try { window.localStorage.setItem(MUSIC_VOLUME_KEY, String(musicVolume)); } catch { /* storage may be unavailable for file:// pages */ }
      return musicVolume;
    },
    get musicVolume() { return musicVolume; },
    get musicAvailable() { return musicTracks.length > 0; },
    get musicPlaying() { return Boolean(music && !music.paused && !muted); },
    setMuted: (value) => {
      muted = value;
      window.__diceAudioMuted = muted;
      if (music) music.muted = muted;
      if (!muted && musicStarted) startMusic();
    },
    get muted() { return muted; }
  };
})();

// ---------------------------------------------------------------------------
// 数字滚动过渡：累计分结算时先慢后快，最后轻微回弹，接近《小丑牌》的
// “分数不断跳动、末段快速冲线”手感。动画状态挂在元素上，避免 updateUI
// 高频刷新时反复从头播放。
// ---------------------------------------------------------------------------
function animateNumber(el, to, duration = 680) {
  if (!el) return;
  const target = Math.round(Number(to) || 0);
  const active = el.__scoreCountAnimation;
  if (active?.to === target) return;
  if (active?.raf) window.cancelAnimationFrame(active.raf);
  const from = active ? active.value : (Number(String(el.textContent).replace(/[^\d-]/g, '')) || 0);
  if (from === target) { el.textContent = target; return; }

  const animation = { from, to: target, value: from, start: performance.now(), duration: Math.max(360, duration), raf: 0 };
  el.__scoreCountAnimation = animation;
  el.classList.remove('score-counting');
  void el.offsetWidth;
  el.classList.add('score-counting');

  const step = (now) => {
    if (el.__scoreCountAnimation !== animation) return;
    const progress = Math.min(1, (now - animation.start) / animation.duration);
    // 慢速起步，末段明显加速；比传统 ease-out 更符合“累计冲线”的感觉。
    const eased = progress ** 2.5;
    animation.value = Math.round(animation.from + (animation.to - animation.from) * eased);
    el.textContent = animation.value;
    if (progress < 1) {
      animation.raf = window.requestAnimationFrame(step);
      return;
    }
    animation.value = animation.to;
    el.textContent = animation.to;
    el.__scoreCountAnimation = null;
    window.setTimeout(() => el.classList.remove('score-counting'), 260);
  };
  animation.raf = window.requestAnimationFrame(step);
}

function spawnScoreFloat(amount, anchor, kind = 'gain', options = {}) {
  const value = Math.round(Number(amount) || 0);
  if (!value || !anchor) return;
  const host = anchor.closest('.role-score-line, .role-round-stats > div, .score-callout') || anchor.parentElement;
  if (!host) return;
  host.classList.add('score-float-host');
  const hostRect = host.getBoundingClientRect();
  const anchorRect = anchor.getBoundingClientRect();
  const float = document.createElement('span');
  const positive = value > 0;
  const delay = Math.max(0, Number(options.delay) || 0);
  const tier = options.tier ? ` score-float-${options.tier}` : '';
  const owner = options.owner ? ` score-float-${options.owner}` : '';
  float.className = `score-float ${positive ? kind : 'loss'}${tier}${owner}`;
  float.textContent = `${positive ? '+' : '−'}${Math.abs(value)}`;
  if (options.label) float.dataset.scoreLabel = options.label;
  float.style.left = `${anchorRect.left - hostRect.left + anchorRect.width / 2}px`;
  const stackIndex = host.querySelectorAll('.score-float').length % 5;
  float.style.top = `${anchorRect.top - hostRect.top - 3 - stackIndex * 18}px`;
  float.style.animationDelay = `${delay}ms`;
  host.appendChild(float);
  const activeFloats = host.querySelectorAll('.score-float');
  if (activeFloats.length > 5) activeFloats[0].remove();
  window.requestAnimationFrame(() => float.classList.add('is-visible'));
  window.setTimeout(() => float.remove(), 920 + delay);
}

function safeAudio(method, ...args) {
  try { audio[method]?.(...args); } catch (error) { console.warn(`[audio:${method}]`, error); }
}

let boardLightTimer;
function flashBoardLight(kind = 'roll') {
  if (!els.tableStage) return;
  const classes = ['board-roll-highlight', 'board-land-highlight', 'board-score-highlight', 'board-x5-highlight'];
  classes.forEach((className) => els.tableStage.classList.remove(className));
  if (document.body.dataset.boardTheme !== 'gilded-banquet') return;
  const className = kind === 'land' ? 'board-land-highlight' : kind === 'score' ? 'board-score-highlight' : kind === 'x5' ? 'board-x5-highlight' : 'board-roll-highlight';
  // Force a fresh animation when two events happen in quick succession.
  void els.tableStage.offsetWidth;
  els.tableStage.classList.add(className);
  window.clearTimeout(boardLightTimer);
  boardLightTimer = window.setTimeout(() => els.tableStage?.classList.remove(className), kind === 'score' ? 700 : kind === 'x5' ? 1150 : 520);
}
function shakeStage() { if (!els.tableStage) return; els.tableStage.classList.add('shake'); dicePhysics3D.pulse?.('farkle'); window.setTimeout(() => els.tableStage.classList.remove('shake'), 480); }
function celebrateStage() { if (!els.tableStage) return; els.tableStage.classList.add('celebrate'); flashBoardLight('score'); dicePhysics3D.pulse?.('bank'); window.setTimeout(() => els.tableStage.classList.remove('celebrate'), 620); }


const pipMap = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
const pages = [
  { kicker: '骰子：基本规则', title: '骰子：基本规则', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die">${pipFace(1)}</div><div class="codex-die">${pipFace(5)}</div><div class="codex-die">${pipFace(6)}</div><div class="codex-die">${pipFace(3)}</div><div class="codex-caption">七枚骰子 · 保留得分 · 继续冒险</div></div><div class="codex-copy"><h3>骰子游戏</h3><p>每个大回合从七枚骰子开始。你可以锁定本次投掷中真正计分的骰子，再用剩余骰子继续投掷，或在安全时收集本轮暂存分。</p><h4>热骰</h4><p>六枚骰子完成有效计分时触发<strong>普通热骰</strong>，七枚全部完成有效计分时触发<strong>完美热骰</strong>；两者都会让七枚骰子重新加入下一掷。连续触发会逐次放大计分倍率，档位为 x1、x2、x3、x5、x8，最高 x12。</p><p>每次投掷落地后，必须从这一掷里锁定至少一组完整计分组合（1、5、三同或顺子），才能继续投掷或收集；若剩余骰子没有任何得分组合，则触发爆骰，本轮暂存分归零并结束本轮。</p></div></div>` },
  { kicker: '骰子：点数组合', title: '骰子：点数组合', content: `<div class="codex-copy"><p>以下为七骰规则下的组合及其点数值。</p><p>本版本不使用三对，也不加入魔鬼骰；只按下表的单点、三同和顺子计分。</p></div><table class="rule-table"><thead><tr><th>组合</th><th>点数</th><th>说明</th></tr></thead><tbody><tr><td>单个 1</td><td>100</td><td>可单独保留</td></tr><tr><td>单个 5</td><td>50</td><td>可单独保留</td></tr><tr><td>三个相同</td><td>1000 / 200–600</td><td>1 点为 1000，其余点数 × 100</td></tr><tr><td>四个相同</td><td>三同的 2 倍</td><td>三个骰子后每增加一个骰子，点数翻倍</td></tr><tr><td>五至七个相同</td><td>继续翻倍</td><td>每多一枚相同骰子，点数再翻倍</td></tr><tr><td>小顺 1–5</td><td>500</td><td>连续五个点数</td></tr><tr><td>小顺 2–6</td><td>750</td><td>连续五个点数</td></tr><tr><td>大顺 1–6</td><td>1500</td><td>连续六个点数，可与额外 1/5 或三同组合</td></tr><tr><td>普通热骰</td><td>—</td><td>七枚中六枚完成有效计分，额外一枚可舍弃并重新投掷七枚</td></tr><tr><td>完美热骰</td><td>—</td><td>七枚全部完成有效计分，重新投掷七枚</td></tr></tbody></table>` },
  { kicker: '骰子：属性与概率', title: '骰子：属性与概率', content: `<p class="codex-intro">不同骰子会改变各点数出现的概率。装备后，投掷将使用对应权重。</p><div class="prob-table" id="probability-table"></div>` },
  { kicker: '骰子：保留与爆骰', title: '骰子：保留与爆骰', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die locked-demo">${pipFace(1)}</div><div class="codex-die locked-demo">${pipFace(5)}</div><div class="codex-die">${pipFace(2)}</div></div><div class="codex-copy"><h3>把握时机</h3><p>点击任意骰子都可以将它保留。保留的骰子会从下一次投掷中移出，并按当前组合计入本轮暂存分数。每次投掷落地后，必须先锁定这一掷里至少一个计分骰子，才能继续投掷或收集分数——不能空手跳过。</p><p>如果这一掷剩余骰子里没有任何计分组合，则直接触发爆骰：本轮暂存分数归零，回合立刻交给对手。</p></div></div>` },
  { kicker: '骰子：获胜条件', title: '骰子：获胜条件', content: `<div class="codex-columns"><div class="codex-copy"><h3>六回合比累计分</h3><p>一局固定进行六个大回合。每个大回合先由你完成一轮，再由对手完成一轮；双方本轮最终收集分数都会计入累计战绩。</p><p>第六回合结束后，累计总分更高者获胜。若双方总分相同，则进入突然死亡：下一轮分数更高者立即获胜，若仍平分则继续加赛。</p><h4>收集分数</h4><p>点击“收集”把本轮已保留的点数计入累计战绩，并把本轮结果交给对手。累计分数越高，最后结算时的优势越大。</p></div><div class="codex-illustration"><div class="codex-score">累计总分 <span>最终比较</span></div><div class="codex-score opponent-score-demo">回合 <span>01 / 06</span></div></div></div>` },
  { kicker: '骰子：牌桌提示', title: '骰子：牌桌提示', content: `<div class="codex-copy"><h3>旅人的三条忠告</h3><p>一、先保留稳定的 1 和 5，再考虑高风险的三同与顺子。</p><p>二、当本轮分数已经领先时，及时收集，不要把胜点交给下一掷。</p><p>三、装备骰子会改变概率。打开骰子库，查看每一面真实的出现机会。</p></div>` }
];

pages.push({ kicker: '牌桌：倍率与承担', title: '牌桌：倍率与承担', content: `<div class="codex-columns"><div class="codex-copy"><h3>提议、回应、共同承担</h3><p>正式赌局使用公共牌桌倍率：x1、x2、x3、x5。任一方只能在自己本回合第一次投掷前，向对手提议下一档倍率；同一回合每方最多提议一次。</p><h4>接受加码</h4><p>对手接受后，公共倍率和分数成长倍率同步切换到新档位，双方从这一刻起都按同一个倍率结算；最高倍率为 x5。</p><h4>拒绝加码</h4><p>拒绝不是继续观望，而是立即认输离场。提议方赢下牌局，并按加码前的旧倍率结算。</p><p>进入正式赌局前，需要准备基础赌注的 5 倍作为最高风险储备。练习桌固定 x1，不收取赌注，胜利奖励 5 格罗申。</p></div><div class="codex-illustration"><div class="codex-score">x1 <span>→ x2 → x3 → x5</span></div><div class="codex-caption">接受后双方共用新倍率 · 拒绝即认输</div></div></div>` });
pages[1].content = pages[1].content
  .replace('<tr><td>小顺 1–5 / 2–6</td><td>750</td><td>连续五个点数</td></tr>', '<tr><td>小顺 1–5</td><td>500</td><td>连续五个点数</td></tr><tr><td>小顺 2–6</td><td>750</td><td>连续五个点数</td></tr>')
  .replace('<tr><td>三对</td><td>1500</td><td>三组相同点数</td></tr>', '');

let currentPage = 0;
let toastTimer;
let turnTimer;
let opponentActionTimer;
let opponentRollFallback;
let opponentTurnToken = 0;
let playerRollToken = 0;

function clearOpponentActionTimer(invalidate = false) {
  window.clearTimeout(opponentActionTimer);
  window.clearTimeout(opponentRollFallback);
  opponentActionTimer = undefined;
  opponentRollFallback = undefined;
  if (invalidate) opponentTurnToken += 1;
}

function scheduleOpponentAction(callback, delay, token = opponentTurnToken, context = {}) {
  clearOpponentActionTimer();
  const resolvedDelay = humanizeAiDelay(delay, context.kind || 'decision', context);
  opponentActionTimer = window.setTimeout(() => {
    opponentActionTimer = undefined;
    // An AI raise pauses the turn until the player accepts or declines it.
    // Keep this guard in the scheduler as a second line of defence so an
    // already queued callback cannot start rolling behind the challenge UI.
    if (state.turn !== 'ai' || state.gameOver || token !== opponentTurnToken || state.match?.pendingRaise) return;
    callback(token);
  }, resolvedDelay);
}

function isOpponentTurn(token) {
  return state.turn === 'ai' && !state.gameOver && token === opponentTurnToken;
}

function opponentPhaseCopy() {
  const remaining = state.opponentActiveIndices.length;
  const opponentName = opponents[state.opponentId]?.name || '对手';
  const copies = {
    idle: '等待你的投掷',
    preparing: `正在掂量骰盅 · 剩余 ${remaining || DICE_COUNT} 枚`,
    rolling: `正在投掷剩余 ${remaining || DICE_COUNT} 枚`,
    selecting: '观察落点，挑选可计分骰子',
    deciding: `暂存 ${state.opponentRoundScore} 分，正在权衡`,
    banking: `收集 ${state.opponentRoundScore} 分`,
    farkle: '爆骰 · 本轮分数归零',
    hotDice: `热骰 · 保留 ${state.opponentRoundScore} 分后重掷七枚`
  };
  return { name: opponentName, text: copies[state.opponentPhase] || copies.idle };
}

const AI_MOOD_LINES = Object.freeze({
  confident: ['这桌面正在回应我。', '我手里有数。'],
  pressured: ['我不能再把分差让出去。', '这一步得更谨慎。'],
  rattled: ['刚才那一下还在脑子里。', '别急，重新来。'],
  greedy: ['再多拿一口，也许就够了。', '这点收益还没到我满意的时候。']
});

function pickAiMoodLine(event, mind = getAiMind()) {
  const eligible = ['rollHigh', 'rollPositive', 'rollBad', 'keepBig', 'keepMid', 'keepSmall', 'bank', 'continue', 'farkle', 'acceptRaise', 'declineRaise'];
  if (!eligible.includes(event)) return '';
  const mood = mind.frustration > .58 ? 'rattled' : mind.pressure > .58 ? 'pressured' : mind.greed > .66 && mind.confidence > .58 ? 'greedy' : mind.confidence > .7 ? 'confident' : '';
  if (!mood || secureRandomFloat() > .3) return '';
  const pool = AI_MOOD_LINES[mood] || [];
  return pool[Math.floor(secureRandomFloat() * pool.length)] || '';
}

function pickAiDialogue(event, extra = {}) {
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const pool = AI_DIALOGUE[state.opponentId]?.[event] || AI_DIALOGUE.milo[event] || [];
  if (!pool.length) return '我先观察一会儿。';
  const recent = state.aiDialogueHistory || [];
  const available = pool.filter((line) => !recent.includes(line));
  const selectedPool = available.length ? available : pool;
  const selected = selectedPool[Math.floor(secureRandomFloat() * selectedPool.length)] || selectedPool[0];
  const lead = state.opponentTotal - state.playerTotal;
  const context = {
    name: profile.name,
    score: extra.score ?? state.opponentRoundScore,
    remaining: extra.remaining ?? state.opponentActiveIndices.length,
    lead,
    behind: Math.max(0, -lead),
    ahead: Math.max(0, lead),
    risk: Math.round((extra.risk ?? estimateFarkleRisk(state.opponentActiveIndices)) * 100),
    confidence: Math.round(mind.confidence * 100),
    pressure: Math.round(mind.pressure * 100),
    frustration: Math.round(mind.frustration * 100),
    mood: mind.frustration > .58 ? 'rattled' : mind.pressure > .58 ? 'pressured' : mind.greed > .66 && mind.confidence > .58 ? 'greedy' : mind.confidence > .7 ? 'confident' : 'steady',
    ...extra
  };
  const baseLine = typeof selected === 'function' ? selected(context) : selected;
  const moodLine = pickAiMoodLine(event, mind);
  const line = moodLine && !baseLine.includes(moodLine) ? `${baseLine} ${moodLine}` : baseLine;
  state.aiDialogueHistory.push(line);
  if (state.aiDialogueHistory.length > 12) state.aiDialogueHistory.shift();
  return line;
}

function getTableMultiplier() {
  if (state.match?.type !== 'stake') return DEFAULT_TABLE_MULTIPLIER;
  const multiplier = Number(state.match.multiplier);
  return MULTIPLIER_STEPS.includes(multiplier) ? multiplier : DEFAULT_TABLE_MULTIPLIER;
}

function getScoreTableMultiplier() {
  if (state.match?.type !== 'stake' || !state.match?.active) return DEFAULT_TABLE_MULTIPLIER;
  const multiplier = Number(state.match.scoreMultiplier);
  return MULTIPLIER_STEPS.includes(multiplier) ? multiplier : DEFAULT_TABLE_MULTIPLIER;
}

function getScoreGrowth(owner = 'player') {
  const tableMultiplier = getScoreTableMultiplier();
  const tableGrowth = SCORE_GROWTH_BY_TABLE_MULTIPLIER[tableMultiplier] || 1;
  const hotCount = owner === 'opponent' ? state.opponentHotDiceCount : state.hotDiceCount;
  const hotGrowth = HOT_DICE_SCORE_GROWTH[Math.min(Math.max(0, Number(hotCount) || 0), HOT_DICE_MAX_COUNTED)] || 1;
  return { tableMultiplier, tableGrowth, hotCount: Math.max(0, Number(hotCount) || 0), hotGrowth, total: tableGrowth * hotGrowth };
}

function applyScoreGrowth(rawScore, owner = 'player') {
  const score = Math.max(0, Number(rawScore) || 0);
  if (!score) return 0;
  return Math.max(0, Math.round(score * getScoreGrowth(owner).total));
}

function formatScoreGrowth(value) {
  return (Number(value) || 1).toFixed(2).replace(/\.00$/, '');
}

function advanceHeatChain(owner = 'player', full = false) {
  const key = owner === 'opponent' ? 'opponentHotDiceCount' : 'hotDiceCount';
  state[key] = Math.max(0, Number(state[key]) || 0) + 1;
  safeAudio('playHeatChain', state[key]);
  return state[key];
}

function triggerHotDiceAudio(owner = 'player', kind = 'ordinary') {
  const key = owner === 'opponent' ? 'opponentHotDiceCount' : 'hotDiceCount';
  safeAudio(kind === 'perfect' ? 'playPerfectHotDice' : 'playOrdinaryHotDice', state[key]);
}

function getHeatKind(scoredDiceCount, activeDiceCount = DICE_COUNT) {
  const count = Math.max(0, Number(scoredDiceCount) || 0);
  const active = Math.max(0, Number(activeDiceCount) || 0);
  if (count >= DICE_COUNT && active >= DICE_COUNT) return 'perfect';
  if (count >= HEAT_TRIGGER_DICE) return 'ordinary';
  return null;
}

function markPlayerHeatSelection() {
  if (!state.hasRolled || state.heatSelectionCounted) return false;
  if (!allDiceContribute(activeRollValues())) return false;
  state.heatSelectionCounted = true;
  advanceHeatChain('player');
  return true;
}

// The next raise always advances the single public table multiplier. Once a
// challenge is accepted, both sides use that same multiplier for score growth
// and final settlement; there is no separate personal x2 loss cap.
function getNextTableMultiplier() {
  const index = MULTIPLIER_STEPS.indexOf(getTableMultiplier());
  return index >= 0 && index < MULTIPLIER_STEPS.length - 1 ? MULTIPLIER_STEPS[index + 1] : null;
}

function isMultiplierStepUnlocked(step) {
  if (step <= 2) return true;
  if (!state.match?.hasSuccessfulBank) return false;
  if (step === 3) return true;
  const scoreGap = Math.abs(state.playerTotal - (state.opponentTotal + (state.opponentRoundScore || 0)));
  const lateRound = state.suddenDeath || state.round >= MATCH_ROUNDS - 2;
  const endgameScore = state.round >= MATCH_ROUNDS - 1;
  return lateRound || scoreGap >= 300 || endgameScore;
}

// 加码不再是"单方面推一下、双方自动同步"——而是天2/双陆棋倍率骰那种真正的对赌：
// 提议方喊出新倍率，另一方必须做出选择：接受（双方从此对称地暴露在新倍率下，
// 赢和输都按这个数结算），或者认输离场（这一局立刻结束，按加码前的旧倍率结算，
// 提议方获胜）。所以"加码"本身变成一次真实的威胁/试探，而不是白送对方一份免费的
// 上行收益——这也是为什么不再需要 getActorLossMultiplier 那套"个人历史最高加码"
// 的追踪：一旦接受，双方就是同一个数字，没有谁能悄悄只暴露自己一半的风险。
function raiseTableMultiplier(target, actor = 'player') {
  if (!state.match?.active || state.match.type !== 'stake' || state.gameOver) return false;
  if (state.match.pendingRaise) return false;
  const requested = Number(target);
  const next = getNextTableMultiplier();
  if (!next || requested !== next || !isMultiplierStepUnlocked(requested)) return false;
  if (state.match.lastRaiseRound === state.round) {
    if (actor === 'player') showToast('这一回合已经加过码，下一回合再提议');
    return false;
  }
  const canRaise = actor === 'ai'
    ? state.turn === 'ai' && state.opponentPhase === 'preparing' && !state.opponentRolling
    : state.turn === 'player' && !state.hasRolled && !state.rolling;
  if (!canRaise) {
    if (actor === 'player') showToast('倍率只能在本回合第一次投掷前提议');
    return false;
  }

  const from = getTableMultiplier();
  state.match.pendingRaise = { proposer: actor, from, to: requested, resumeToken: actor === 'ai' ? opponentTurnToken : null };
  state.match.lastRaisedBy = actor;
  state.match.lastRaiseRound = state.round;
  state.match.raiseCount = (state.match.raiseCount || 0) + 1;
  const profile = opponents[state.opponentId] || opponents.milo;
  const actorName = actor === 'ai' ? profile.name : '你';
  observeAiEvent(actor === 'ai' ? 'ownRaise' : 'playerRaise', { multiplier: requested });
  addActivity(actor === 'ai' ? 'ai' : 'you', `<b>${actorName}</b> 把牌桌倍率提议到 <strong>x${requested}</strong>`, '牌桌加码');
  updateUI();

  if (actor === 'ai') {
    addOpponentReaction(pickAiDialogue('raise', { multiplier: requested }), 'AI 加码');
    safeAudio('playShake');
    openRaiseOfferModal(state.match.pendingRaise);
  } else {
    safeAudio('playClick');
    showToast(`已向对手提议 x${requested} · 等待对方回应`);
    window.setTimeout(() => resolveOpponentRaiseResponse(requested), 620);
  }
  return true;
}

// AI 要不要接受玩家提出的加码：拒绝等于把整局直接让给玩家，因此不能
// 只用一个很低的全局随机概率。每个角色都有自己的回应策略，再结合
// 当前分差、爆骰风险、牌桌进度和赌注做动态修正。
function shouldOpponentAcceptRaise(target) {
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const policy = profile.raisePolicy || {};
  const proposed = Number(target);
  const activeSlots = state.opponentActiveIndices.length ? state.opponentActiveIndices : ALL_DICE_INDICES.slice();
  const lead = (state.opponentTotal + state.opponentRoundScore) - state.playerTotal;
  const behind = Math.max(0, -lead);
  const ahead = Math.max(0, lead);
  const risk = estimateFarkleRisk(activeSlots);
  const believedRisk = clampAi(risk + (secureRandomFloat() - .5) * 2 * tuning.beliefNoise);
  const closeToEnd = state.suddenDeath ? 1 : clamp01(state.round / MATCH_ROUNDS);
  const pressureUnit = 650;
  const behindPressure = clamp01(behind / pressureUnit);
  const aheadPressure = clamp01(ahead / pressureUnit);
  const stakePressure = clamp01(Number(state.match?.stake || 0) / 300);
  const multiplierBias = Number(policy.multiplier?.[proposed]) || 0;

  let chance = Number.isFinite(Number(policy.baseAccept)) ? Number(policy.baseAccept) : .72;
  chance += multiplierBias;
  chance += behindPressure * (Number(policy.behindBonus) || .15);
  chance += aheadPressure * (Number(policy.aheadBonus) || .06);
  chance -= believedRisk * (Number(policy.riskPenalty) || .25);
  chance += mind.confidence * tuning.greedResponse * .08;
  chance += mind.pressure * (lead < 0 ? .1 : .035);
  chance -= mind.caution * tuning.lossAversion * .08;
  chance += mind.playerRead.farkleRate * (proposed >= 3 ? .08 : .03);
  if (mind.playerRead.raiseCount >= 2 && mind.playerRead.lastRaise >= proposed) chance -= .035;

  // 临近终局时，领先者更重视封锁胜势；落后者则会获得额外的翻盘动力。
  if (closeToEnd > .65) {
    chance -= closeToEnd * (Number(policy.endgamePenalty) || .12) * (lead >= 0 ? 1 : .45);
    if (lead < 0) chance += closeToEnd * behindPressure * (Number(policy.comebackEndgame) || .1);
  }

  // 300 格罗申的穆萨桌压力更高，但赌注不会让 AI 直接变成“必拒绝”。
  chance -= stakePressure * (Number(policy.stakePenalty) || .03) * (proposed >= 3 ? 1 : .55);

  // 保留真人式犹豫：同一局势下不会每次都给出完全相同的回应。
  const volatility = Number(policy.volatility) || .05;
  chance += (secureRandomFloat() - .5) * 2 * (volatility + tuning.decisionNoise * .08);

  // 拒绝会立即输掉整局，因此每个角色都有一个最低接受底线。
  const minAccept = Number.isFinite(Number(policy.minAccept)) ? Number(policy.minAccept) : .5;
  const acceptanceChance = clamp01(Math.max(minAccept, chance));
  mind.lastDecision = { action: 'acceptRaise', target: proposed, chance: acceptanceChance, risk: believedRisk };
  rememberAiAction('acceptRaise', { target: proposed, chance: acceptanceChance, risk: believedRisk });
  return secureRandomFloat() < acceptanceChance;
}

function resolveOpponentRaiseResponse(target) {
  if (!state.match?.pendingRaise || state.match.pendingRaise.proposer !== 'player') return;
  const accepted = shouldOpponentAcceptRaise(target);
  addOpponentReaction(pickAiDialogue(accepted ? 'acceptRaise' : 'declineRaise', { multiplier: target }), accepted ? '接受加码' : '认输离场');
  resolveRaiseOffer(accepted);
}

// accepted=true：双方从此都在新倍率下继续；accepted=false：认输方立刻结束整局，
// 按加码前的旧倍率把这一局判给提议方。
function resolveRaiseOffer(accepted) {
  const pending = state.match?.pendingRaise;
  if (!pending) return;
  observeAiEvent(accepted ? 'raiseAccepted' : 'raiseDeclined', { multiplier: pending.to });
  if (pending.proposer === 'player') {
    const read = getAiMind().playerRead;
    read.raiseAcceptanceRate = read.raiseAcceptanceRate * .72 + (accepted ? .28 : 0);
  }
  state.match.pendingRaise = null;
  closeRaiseOfferModal();
  if (accepted) {
    state.match.multiplier = pending.to;
    state.match.scoreMultiplier = pending.to;
    if (pending.to >= 5) flashBoardLight('x5');
    const declinerIsPlayer = pending.proposer === 'ai';
    addActivity(declinerIsPlayer ? 'you' : 'ai', `<b>${declinerIsPlayer ? '你' : (opponents[state.opponentId]?.name || '对手')}</b> 接受了 <strong>x${pending.to}</strong>，双方对等承担`, '接受加码');
    showToast(`双方接受 x${pending.to} · 风险与收益从此对等`);
    updateUI();
    if (pending.proposer === 'ai') scheduleOpponentAction(rollOpponentDice, AI_TIMING.firstThink, pending.resumeToken, { kind: 'firstThink' });
  } else {
    const winner = pending.proposer;
    const loserName = winner === 'player' ? (opponents[state.opponentId]?.name || '对手') : '你';
    addActivity(winner === 'player' ? 'ai' : 'you', `<b>${loserName}</b> 认输离场 · 按 <strong>x${pending.from}</strong> 结算`, '认输离场');
    finishGame(winner);
  }
}

function chooseOpponentMultiplier() {
  if (!state.match?.active || state.match.type !== 'stake') return null;
  const next = getNextTableMultiplier();
  if (!next || !isMultiplierStepUnlocked(next)) return null;
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const lead = (state.opponentTotal + state.opponentRoundScore) - state.playerTotal;
  const behind = Math.max(0, -lead);
  const ahead = Math.max(0, lead);
  const risk = estimateFarkleRisk(state.opponentActiveIndices.length ? state.opponentActiveIndices : ALL_DICE_INDICES.slice());
  let chance = 0.12;
  if (state.opponentId === 'milo') chance = 0.18 + (behind >= 300 ? 0.14 : 0) + (risk < 0.28 ? 0.08 : -0.04) - (ahead >= 350 ? 0.12 : 0);
  if (state.opponentId === 'vlad') chance = 0.38 + (behind >= 250 ? 0.18 : 0) + (next >= 3 ? 0.14 : 0) + (risk < 0.4 ? 0.08 : 0);
  if (state.opponentId === 'marta') chance = 0.2 + (behind >= 350 ? 0.2 : 0) + (risk < 0.24 ? 0.08 : -0.04) + (next === 3 ? 0.05 : 0) - (ahead >= 250 ? 0.12 : 0);
  if (state.opponentId === 'musa') chance = 0.25 + (behind >= 300 ? 0.16 : 0) + (risk < 0.26 ? 0.11 : -0.03) + (next === 3 && state.opponentRoundScore >= 300 ? 0.1 : 0) - (ahead >= 350 ? 0.14 : 0);
  chance += mind.greed * tuning.greedyResponse * .18;
  chance += mind.pressure * (behind > 0 ? .12 : .03);
  chance -= mind.caution * tuning.lossAversion * .1;
  chance += mind.playerRead.farkleRate * .12;
  chance -= mind.frustration * tuning.lossAversion * .04;
  if (mind.playerRead.raiseCount >= 2 && mind.playerRead.lastRaise >= next) chance -= .045;
  if (next === 5) chance *= state.opponentId === 'vlad' ? 0.72 : 0.42;
  if (state.opponentId === 'musa' && next === 5) chance *= 0.72;
  chance += (secureRandomFloat() - .5) * 2 * (tuning.decisionNoise * .12 + .025);
  const finalChance = clamp01(chance);
  mind.lastDecision = { action: 'raise', target: next, chance: finalChance, risk };
  rememberAiAction('raise', { target: next, chance: finalChance, risk });
  if (secureRandomFloat() >= finalChance) return null;
  return next;
}

function maybeOpponentRaiseMultiplier(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentPhase !== 'preparing') return false;
  const target = chooseOpponentMultiplier();
  return target ? raiseTableMultiplier(target, 'ai') : false;
}

function renderMultiplierPanel() {
  if (!els.multiplierPanel) return;
  const activeStake = state.match?.active && state.match.type === 'stake' && !state.gameOver;
  const multiplier = getTableMultiplier();
  const next = getNextTableMultiplier();
  const profile = opponents[state.opponentId] || opponents.milo;
  const pending = activeStake ? state.match?.pendingRaise : null;
  const hasChallenge = Boolean(pending);
  const awaitingResponse = pending?.proposer === 'player';
  const incomingChallenge = pending?.proposer === 'ai';
  const playerRaisedThisTurn = state.match?.lastRaisedBy === 'player' && state.match?.lastRaiseRound === state.round;
  els.multiplierPanel.classList.toggle('is-disabled', !activeStake);
  els.multiplierPanel.classList.toggle('practice', !activeStake || state.match?.type !== 'stake');
  els.multiplierPanel.classList.toggle('has-challenge', hasChallenge);
  els.multiplierPanel.classList.toggle('awaiting-response', awaitingResponse);
  els.multiplierPanel.classList.toggle('incoming-challenge', incomingChallenge);
  if (els.multiplierValue) els.multiplierValue.textContent = `x${multiplier}`;
  if (els.multiplierCap) els.multiplierCap.textContent = activeStake ? `最高结算 x${LOSS_MULTIPLIER_CAP}` : state.match?.type === 'practice' ? '练习桌固定 x1' : '等待正式牌局';

  if (els.multiplierChallenge) {
    els.multiplierChallenge.classList.toggle('hidden', !hasChallenge);
    if (pending) {
      if (els.multiplierChallengeLabel) els.multiplierChallengeLabel.textContent = awaitingResponse ? '等待对手回应' : '对手提出加码';
      if (els.multiplierChallengeValue) els.multiplierChallengeValue.textContent = `x${pending.to}`;
      if (els.multiplierChallengeCopy) els.multiplierChallengeCopy.textContent = awaitingResponse ? '对手正在决定 · 接受后进入新倍率。' : '接受后进入新倍率，拒绝则按旧倍率结算。';
      els.multiplierAccept?.classList.toggle('hidden', !incomingChallenge);
      els.multiplierDecline?.classList.toggle('hidden', !incomingChallenge);
    }
  }

  if (els.multiplierHint) {
    if (!activeStake) els.multiplierHint.textContent = state.match?.type === 'practice' ? `练习桌固定 x1 · 胜利 +${PRACTICE_REWARD} 格罗申` : '正式牌局开始后可加码';
    else if (multiplier >= 5) els.multiplierHint.textContent = '牌桌已拉满 x5 · 双方按 x5 结算';
    else if (state.turn === 'ai') els.multiplierHint.textContent = `${profile.name} 正在决定 · 等待回应`;
    else if (state.hasRolled || state.rolling || playerRaisedThisTurn) els.multiplierHint.textContent = playerRaisedThisTurn ? '本回合已加码 · 下一回合可继续加码' : '本回合倍率已锁定 · 下一回合可继续加码';
    else els.multiplierHint.textContent = next ? `投掷前可提升至 x${next}` : '当前倍率已达上限';
  }

  els.multiplierButtons?.forEach((button) => {
    const step = Number(button.dataset.multiplier);
    const label = button.querySelector('b');
    const subcopy = button.querySelector('small');
    const current = step === multiplier;
    const unlocked = isMultiplierStepUnlocked(step);
    const canUse = activeStake && !hasChallenge && state.turn === 'player' && !state.hasRolled && !state.rolling && !playerRaisedThisTurn && step === next && unlocked;
    button.classList.toggle('current', current);
    button.classList.toggle('next-step', step === next && unlocked);
    button.disabled = !canUse;
    button.setAttribute('aria-pressed', String(current));
    if (label) label.textContent = current ? `当前 x${step}` : step === 1 ? '维持 x1' : `加码 x${step}`;
    if (subcopy) subcopy.textContent = current ? '当前' : !unlocked ? (step === 3 ? '先收集一轮' : '后段解锁') : step === 5 ? '风险封顶' : step === 1 ? '不加码' : step === 2 ? '谨慎' : '进取';
    button.title = current ? `当前牌桌倍率 x${step}` : !unlocked ? (step === 3 ? '完成一次收集后解锁' : '进入牌局后段或形成明显分差后解锁') : canUse ? `提升牌桌倍率至 x${step}` : '仅能在自己第一次投掷前加码';
  });
}

// The multiplier UI is an in-panel challenge rather than a separate modal.
// Keep these helpers for the raise flow so both player and AI proposals share
// the same rendering and cleanup path.
function openRaiseOfferModal() { renderMultiplierPanel(); }
function closeRaiseOfferModal() { renderMultiplierPanel(); }

function pipFace(value) {
  return `<span class="pip-grid">${Array.from({ length: 9 }, (_, index) => `<i class="pip ${pipMap[value].includes(index) ? '' : 'hidden'}"></i>`).join('')}</span>`;
}

// 用 crypto.getRandomValues 代替 Math.random 作为“决定点数”的随机源，权重逻辑完全不变，
// 只是把伪随机换成密码学级随机数生成器（CSPRNG），不可预测性更接近真实骰子。
// 没有 crypto.getRandomValues 的极端环境（老旧浏览器 / 非安全上下文）会自动退回 Math.random，保证游戏仍可运行。
function secureRandomFloat() {
  const cryptoObj = window.crypto || window.msCrypto;
  if (!cryptoObj?.getRandomValues) return Math.random();
  const buffer = new Uint32Array(1);
  cryptoObj.getRandomValues(buffer);
  return buffer[0] / 4294967296; // 归一化到 [0, 1)，2**32 种取值
}

function weightedRoll(weights) {
  const total = weights.reduce((sum, weight) => sum + weight, 0); let point = secureRandomFloat() * total;
  for (let i = 0; i < weights.length; i += 1) { point -= weights[i]; if (point <= 0) return i + 1; }
  return 6;
}

function dieById(id) { return diceCatalog.find((die) => die.id === id) || diceCatalog[0]; }
function currentDie(slot = 0) { return dieById(state.loadout[slot]); }

function countValues(values) { return values.reduce((counts, value) => { counts[value] = (counts[value] || 0) + 1; return counts; }, {}); }

function removeSequence(counts, sequence) {
  if (!sequence.every((value) => (counts[value] || 0) > 0)) return false;
  sequence.forEach((value) => { counts[value] -= 1; });
  return true;
}

function scoreSelection(values) {
  if (!values.length) return { score: 0, label: '等待投掷', detail: '1 点 = 100 · 5 点 = 50' };
  const counts = countValues(values);
  const remainingCounts = { ...counts };
  let score = 0;
  const labels = [];
  // 七枚骰子允许“顺子 + 额外得分骰”。先拿走最高级顺子，再结算剩余的 1、5 或三同。
  if (values.length >= 6 && removeSequence(remainingCounts, [1, 2, 3, 4, 5, 6])) {
    score += 1500;
    labels.push('大顺');
  } else if (values.length >= 5 && removeSequence(remainingCounts, [1, 2, 3, 4, 5])) {
    score += 500;
    labels.push('小顺 1–5');
  } else if (values.length >= 5 && removeSequence(remainingCounts, [2, 3, 4, 5, 6])) {
    score += 750;
    labels.push('小顺 2–6');
  }
  Object.entries(remainingCounts).forEach(([rawValue, count]) => {
    if (!count) return;
    const value = Number(rawValue);
    if (count >= 3) {
      const base = value === 1 ? 1000 : value * 100;
      score += base * (2 ** (count - 3));
      labels.push(`${count} 个 ${value}`);
    } else {
      if (value === 1) { score += count * 100; labels.push('1 点'); }
      if (value === 5) { score += count * 50; labels.push('5 点'); }
    }
  });
  return { score, label: score ? labels.join(' + ') : '没有得分组合', detail: score ? `已锁定 ${values.length} 枚骰子` : '当前组合不计分 · 本轮风险由你承担' };
}

// 视觉层的得分拆分：不改变 scoreSelection 的计分规则，只把一次总分拆成
// “1 点 / 5 点 / 三同 / 顺子”等可依次弹出的组成项。1 点和 5 点按点数类型合并，
// 因此同一批里会分别出现一次，而不会把多个同类小数字挤成一团。
function scoreSelectionBreakdown(values) {
  if (!values.length) return [];
  const counts = countValues(values);
  const remainingCounts = { ...counts };
  const entries = [];
  const push = (key, amount, label, tier = 'pip') => {
    if (amount > 0) entries.push({ key, amount, label, tier });
  };

  if (values.length >= 6 && removeSequence(remainingCounts, [1, 2, 3, 4, 5, 6])) {
    push('sequence-123456', 1500, '大顺', 'combo');
  } else if (values.length >= 5 && removeSequence(remainingCounts, [1, 2, 3, 4, 5])) {
    push('sequence-12345', 500, '小顺 1–5', 'combo');
  } else if (values.length >= 5 && removeSequence(remainingCounts, [2, 3, 4, 5, 6])) {
    push('sequence-23456', 750, '小顺 2–6', 'combo');
  }

  Object.entries(remainingCounts).forEach(([rawValue, count]) => {
    if (!count) return;
    const value = Number(rawValue);
    if (count >= 3) {
      const base = value === 1 ? 1000 : value * 100;
      push(`triple-${value}`, base * (2 ** (count - 3)), `${count} 个 ${value}`, 'combo');
      return;
    }
    if (value === 1) push('pip-1', count * 100, '1 点');
    if (value === 5) push('pip-5', count * 50, '5 点');
  });
  return entries;
}

function scoreBreakdownDelta(previousValues, nextValues) {
  const previous = new Map(scoreSelectionBreakdown(previousValues).map((entry) => [entry.key, entry.amount]));
  return scoreSelectionBreakdown(nextValues).map((entry) => ({
    ...entry,
    amount: Math.max(0, entry.amount - (previous.get(entry.key) || 0))
  })).filter((entry) => entry.amount > 0);
}

function scaledScoreBreakdown(entries, targetAmount, owner = 'player') {
  const target = Math.max(0, Math.round(Number(targetAmount) || 0));
  if (!entries.length || !target) return [];
  const growth = getScoreGrowth(owner).total;
  let remaining = target;
  return entries.map((entry, index) => {
    const isLast = index === entries.length - 1;
    const scaled = Math.max(0, Math.round(entry.amount * growth));
    const amount = isLast ? remaining : Math.min(remaining, scaled);
    remaining -= amount;
    return { ...entry, amount };
  }).filter((entry) => entry.amount > 0);
}

function spawnScoreBreakdown(previousValues, nextValues, anchor, targetAmount, owner = 'player') {
  const entries = scoreBreakdownDelta(previousValues, nextValues);
  const scaled = scaledScoreBreakdown(entries, targetAmount, owner);
  if (!scaled.length && targetAmount > 0) {
    spawnScoreFloat(targetAmount, anchor, 'gain', { tier: 'combo', owner });
    return;
  }
  scaled.forEach((entry, index) => {
    spawnScoreFloat(entry.amount, anchor, 'gain', {
      delay: index * 105,
      tier: entry.tier,
      owner,
      label: entry.label
    });
  });
}

function selectedValues() { return [...state.locked].map((index) => state.dice[index]); }
function availableValues() { return state.dice.filter((_, index) => !state.locked.has(index)); }
function activeRollValues() {
  const active = new Set(state.activeRollIndices);
  return [...state.locked].filter((index) => active.has(index)).map((index) => state.dice[index]);
}
function recalculateRoundScore() {
  const rawScore = scoreSelection(activeRollValues()).score;
  state.roundScore = state.rollScoreBase + applyScoreGrowth(rawScore, 'player');
  return state.roundScore;
}

// 判断"这一掷"锁定的骰子是不是每一枚都真的对分数有贡献——不允许混进一颗不计分的
// "垃圾"骰子来单纯凑数字。比如锁了一个 1（计分）又顺手锁了一个 2（不计分），
// scoreSelection 只看总分>0 会放行，但那颗 2 其实是白嫖凑数的，不该被算作"已结算"。
// 这也是热骰判定的地基：只有在每一批锁定都通过这个检查时，才可能达成
// 6/7 的普通热骰或 7/7 的完美热骰，不是随便锁满槽位就行。
function allDiceContribute(values) {
  if (!values.length) return false;
  const remainingCounts = { ...countValues(values) };
  if (values.length >= 6 && removeSequence(remainingCounts, [1, 2, 3, 4, 5, 6])) {
    // 大顺可以与额外的 1/5 或三同骰共同计分。
  } else if (values.length >= 5 && removeSequence(remainingCounts, [1, 2, 3, 4, 5])) {
    // 小顺 1–5。
  } else if (values.length >= 5 && removeSequence(remainingCounts, [2, 3, 4, 5, 6])) {
    // 小顺 2–6。
  }
  return Object.entries(remainingCounts).every(([rawValue, count]) => {
    if (!count) return true;
    const value = Number(rawValue);
    return count >= 3 || value === 1 || value === 5;
  });
}

// KC2 规则：每次投掷落地后，必须从"这一掷"新出现的骰子里锁定一组完整能计分的组合，
// 才允许继续投掷或收集分数——不能不选就再掷一次（"空选"），也不能锁一个计分骰子
// 搭一个不计分的骰子混过去。
// !state.hasRolled：本回合还没掷过，第一掷永远放行。
// 注意：这里不能对 state.locked.size >= HEAT_TRIGGER_DICE 做特殊放行——那样等于允许玩家在同一掷里
// 把垃圾骰子也点亮锁上、凑够热骰门槛来蒙混过关，恰好是热骰漏洞的入口。
// 真正合法的热骰必然是每一批锁定各自都通过了 allDiceContribute，
// 所以只要老老实实检查"这一掷"自己的批次即可，不需要额外开后门。
function hasScoringSelectionThisRoll() {
  if (!state.hasRolled) return true;
  return allDiceContribute(activeRollValues());
}

function selectionIssueMessage(action) {
  return activeRollValues().length ? `这一掷锁定的骰子里混了不计分的点数 · 请调整后再${action}` : `这一掷里还有计分骰子没选 · 请先锁定至少一个再${action}`;
}

function renderDice() {
  // Dice are rendered only by the Three.js canvas. Keep this hook so the
  // state machine can reset cleanly without a second visual dice surface.
}

function renderOpponentDice() {
  // Opponent dice use the same 3D canvas and fixed seven-slot pool.
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
  // 正式牌局和公共倍率共同决定骰子反馈的重量；练习桌保持柔和，避免把所有界面音效都推高。
  const tableMultiplier = Math.max(1, Number(state.match?.multiplier) || 1);
  const tableSfxIntensity = state.match?.active && state.match?.type === 'stake'
    ? Math.min(1.3, 1 + (tableMultiplier - 1) * 0.1)
    : 0.9;
  audio.setSfxIntensity?.(tableSfxIntensity);
  const currentSelection = scoreSelection(activeRollValues());
  const selected = { score: state.roundScore, label: currentSelection.score ? currentSelection.label : state.roundScore ? '本轮暂存' : currentSelection.label, detail: currentSelection.score ? currentSelection.detail : state.roundScore ? `本轮累计 ${state.roundScore} 分` : currentSelection.detail };
  const playerGrowth = getScoreGrowth('player');
  const available = availableValues();
  const opponentCopy = opponentPhaseCopy();
  const opponentRemaining = state.opponentPhase === 'idle' ? DICE_COUNT : state.opponentPhase === 'hotDice' ? DICE_COUNT : state.opponentActiveIndices.length;
  animateNumber(els.playerTotal, state.playerTotal); animateNumber(els.opponentRight, state.opponentTotal); els.bankAmount.textContent = state.roundScore;
  const playerRemaining = state.turn === 'ai' ? DICE_COUNT : available.length;
  if (els.roundNumber) els.roundNumber.textContent = state.suddenDeath ? '加赛' : String(Math.min(state.round, MATCH_ROUNDS)).padStart(2, '0');
  if (els.roundTotal) els.roundTotal.textContent = state.suddenDeath ? '' : `/ ${String(MATCH_ROUNDS).padStart(2, '0')}`;
  if (els.playerRoundScore) els.playerRoundScore.textContent = state.roundScore;
  if (els.playerKeptCount) els.playerKeptCount.textContent = state.locked.size;
  if (els.playerRemainingCount) els.playerRemainingCount.textContent = playerRemaining;
  if (els.playerHotDiceCount) els.playerHotDiceCount.textContent = state.hotDiceCount;
  if (els.opponentRemainingCount) els.opponentRemainingCount.textContent = opponentRemaining;
  if (els.opponentRoundScore) els.opponentRoundScore.textContent = state.opponentRoundScore;
  if (els.opponentKeptCount) els.opponentKeptCount.textContent = state.opponentKept.length;
  if (els.opponentHotDiceCount) els.opponentHotDiceCount.textContent = state.opponentHotDiceCount;
  if (els.remaining) els.remaining.textContent = state.turn === 'ai' ? `对手剩余 ${state.opponentPhase === 'hotDice' ? DICE_COUNT : opponentRemaining} 枚 · 已保留 ${state.opponentKept.length} 枚` : state.hasRolled ? `可投掷 ${available.length} 枚` : `可投掷 ${DICE_COUNT} 枚`;
  els.selectionScore.textContent = selected.score; els.comboName.textContent = state.hasRolled ? selected.label : '等待投掷'; els.comboDetail.textContent = state.hasRolled ? `${selected.detail} · 得分 x${formatScoreGrowth(playerGrowth.total)}` : `1 点 = 100 · 5 点 = 50 · 得分 x${formatScoreGrowth(playerGrowth.total)}`;
  if (els.hotDiceCount) els.hotDiceCount.textContent = state.hotDiceCount ? `热骰 ×${state.hotDiceCount}` : '热骰待点火';
  if (els.scoreGrowthFactor) els.scoreGrowthFactor.textContent = `得分 x${formatScoreGrowth(playerGrowth.total)}`;
  const mustSelectFirst = state.hasRolled && !hasScoringSelectionThisRoll();
  const raisePending = Boolean(state.match?.pendingRaise);
  els.bank.disabled = state.turn !== 'player' || state.rolling || state.roundScore <= 0 || state.gameOver || mustSelectFirst || raisePending;
  els.roll.disabled = state.turn !== 'player' || state.rolling || state.gameOver || mustSelectFirst || raisePending;
  const playerHeatKind = getHeatKind(state.locked.size);
  els.rollLabel.textContent = state.hasRolled ? (playerHeatKind && !mustSelectFirst ? `${playerHeatKind === 'perfect' ? '完美热骰' : '普通热骰'} · 再掷` : '再次投掷') : '投掷骰子';
  els.diceState.textContent = state.rolling ? '翻滚中……' : state.turn === 'ai' ? `${opponentCopy.name} 行动中` : state.gameOver ? '牌局已结束' : mustSelectFirst ? selectionIssueMessage('投掷或收集') : '';
  els.turnLabel.textContent = state.gameOver ? '牌局结束' : state.turn === 'player' ? '你的回合' : '对手回合'; els.turnDetail.textContent = state.gameOver ? '胜负已定' : state.turn === 'player' ? '' : opponentCopy.text; els.opponentStatus.textContent = state.gameOver ? '胜负已定' : state.turn === 'player' ? '等待你的投掷' : opponentCopy.text;
  if (els.playerBoardTurn) els.playerBoardTurn.textContent = '';
  if (els.playerState) { els.playerState.textContent = state.gameOver ? '牌局结束' : state.turn === 'player' ? '你的回合' : '观战中'; els.playerState.classList.toggle('active', state.turn === 'player' && !state.gameOver); }
  if (els.opponentState) { els.opponentState.textContent = state.gameOver ? '牌局结束' : state.turn === 'ai' ? '行动中' : '观战中'; els.opponentState.classList.toggle('active', state.turn === 'ai' && !state.gameOver); }
  if (els.opponentBoardTurn) els.opponentBoardTurn.textContent = state.turn === 'ai' ? opponentCopy.text : '等待你的回合';
  if (els.playerModeCopy) els.playerModeCopy.textContent = matchTypeLabel();
  renderWallet();
  renderRolePanels();
  renderMultiplierPanel();
  renderOpponentDice();
  document.body.classList.toggle('farkle', state.farkle); document.body.classList.toggle('hot-dice', state.hotDice); document.body.classList.toggle('heat-chain', state.turn === 'player' && state.hotDiceCount > 0);
}

function toggleDie(index, source = 'ui') {
  if (!state.hasRolled || state.rolling || state.turn !== 'player' || state.gameOver) return false;
  const previousRoundScore = state.roundScore;
  const previousValues = activeRollValues();
  const next = new Set(state.locked); if (next.has(index)) next.delete(index); else next.add(index);
  safeAudio(next.has(index) ? 'playDiceSelect' : 'playDiceUnselect'); state.locked = next; markPlayerHeatSelection(); recalculateRoundScore();
  if (source !== '3d') dicePhysics3D.setLocked?.('player', index, next.has(index), state.dice[index]);
  renderDice(); updateUI();
  const scoreDelta = state.roundScore - previousRoundScore;
  const scoreAnchor = els.playerRoundScore || els.selectionScore;
  if (scoreDelta > 0) spawnScoreBreakdown(previousValues, activeRollValues(), scoreAnchor, scoreDelta, 'player');
  else if (scoreDelta < 0) spawnScoreFloat(scoreDelta, scoreAnchor, 'loss', { owner: 'player' });
  if (state.roundScore > 0) { addActivity('you', `<b>你</b> 保留骰子，当前本轮 <strong>${state.roundScore}</strong> 分`); }
  return true;
}

function takeScoringDice() {
  if (!state.hasRolled || state.turn !== 'player' || state.rolling || state.gameOver) return;
  const previousRoundScore = state.roundScore;
  const previousValues = activeRollValues();
  const availableIndices = state.dice.map((_, index) => index).filter((index) => !state.locked.has(index)); const picks = chooseScoringIndices(availableValues());
  if (!picks.length) { showToast('这一掷没有可保留的得分骰子'); return; }
  picks.forEach((pick) => {
    const index = availableIndices[pick];
    state.locked.add(index);
    dicePhysics3D.setLocked?.('player', index, true, state.dice[index]);
  });
  markPlayerHeatSelection(); recalculateRoundScore(); renderDice(); updateUI();
  const scoreDelta = state.roundScore - previousRoundScore;
  const scoreAnchor = els.playerRoundScore || els.selectionScore;
  if (scoreDelta > 0) spawnScoreBreakdown(previousValues, activeRollValues(), scoreAnchor, scoreDelta, 'player');
  else if (scoreDelta < 0) spawnScoreFloat(scoreDelta, scoreAnchor, 'loss', { owner: 'player' });
  addActivity('you', `<b>你</b> 快速保留得分骰子，本轮 <strong>${state.roundScore}</strong> 分`);
}

function rollDice(impulse = null) {
  if (state.turn !== 'player' || state.rolling || state.gameOver) return;
  if (!hasScoringSelectionThisRoll()) { safeAudio('playDeny'); showToast(selectionIssueMessage('继续投掷')); return; }
  markPlayerHeatSelection();
  const rollToken = ++playerRollToken;
  const heatKind = getHeatKind(state.locked.size);
  state.rolling = true; state.farkle = false; state.hotDice = false; state.hotDiceType = null; els.ritual?.classList.add('active'); updateUI();
  try { dicePhysics3D.pulse?.('roll'); } catch (error) { console.warn('[dice:pulse]', error); }
  flashBoardLight('roll');
  safeAudio('playShake');
  if (heatKind) {
    try { dicePhysics3D.resetOwner?.('player'); } catch (error) { console.warn('[dice:reset]', error); }
    state.locked.clear(); state.hasRolled = false; state.hotDice = true; state.hotDiceType = heatKind; triggerHotDiceAudio('player', heatKind);
    showToast(`${heatKind === 'perfect' ? '完美热骰' : '普通热骰'}！第 ${state.hotDiceCount} 次连火 · 七枚骰子重新加入投掷`);
  }
  const lockedAtRoll = new Set(state.locked);
  const nextValues = state.dice.map((value, index) => lockedAtRoll.has(index) ? value : weightedRoll(currentDie(index).weights));
  const physicsIndices = nextValues.map((_, index) => index).filter((index) => !lockedAtRoll.has(index));
  const physicsTargets = physicsIndices.map((index) => nextValues[index]);
  state.rollScoreBase = state.roundScore;
  state.activeRollIndices = physicsIndices.slice();
  state.heatSelectionCounted = false;
  let settled = false;
  const finishRoll = () => {
    // The physics layer is authoritative for when the visible dice have
    // actually settled. Ignore a stale callback after reset/forfeit.
    if (settled || rollToken !== playerRollToken || state.gameOver || state.turn !== 'player') return;
    settled = true;
    window.clearTimeout(turnTimer);
    turnTimer = undefined;
    state.dice = nextValues;
    state.hasRolled = true;
    state.rolling = false;
    recalculateRoundScore();
    els.ritual?.classList.remove('active');
    renderDice();
    updateUI();
    safeAudio('playLand');
    flashBoardLight('land');
    addActivity('you', `<b>你</b> 掷出 ${state.dice.join(' · ')} 点`);
    if (availableValues().length && scoreSelection(availableValues()).score === 0) farkleTurn();
    else { showToast(state.hotDice ? '热骰继续，风险与分数一起增加' : '可锁定任意骰子，组合分数按规则计算'); }
  };
  // Recovery path for a blocked WebGL/physics frame. Normal play advances
  // through the physical settle callback above, so the UI never gets ahead of
  // the face that is still visibly changing on the table.
  turnTimer = window.setTimeout(finishRoll, 6000);
  try {
    const started = dicePhysics3D.rollDice(physicsTargets.length, physicsTargets, finishRoll, { owner: 'player', indices: physicsIndices, impulse });
    if (!Array.isArray(started) || started.length !== physicsIndices.length) window.setTimeout(finishRoll, 0);
  } catch (error) {
    // A failed optional 3D layer must never leave the game turn in a rolling state.
    console.warn('[dice:physics]', error);
    window.setTimeout(finishRoll, 0);
  }
}

function settleCompletedRound() {
  if (state.gameOver) return;
  const playerBank = Math.max(0, Number(state.playerRoundBank) || 0);
  const opponentBank = Math.max(0, Number(state.opponentRoundBank) || 0);
  const sudden = Boolean(state.suddenDeath);
  const roundLabel = sudden ? '突然死亡' : `第 ${String(state.round).padStart(2, '0')} 回合`;
  const roundWinner = playerBank === opponentBank ? null : playerBank > opponentBank ? 'player' : 'opponent';
  const roundResult = roundWinner === 'player' ? `你领先 ${playerBank - opponentBank}` : roundWinner === 'opponent' ? `${opponents[state.opponentId]?.name || '对手'}领先 ${opponentBank - playerBank}` : '本轮平分';
  const roundLead = state.opponentTotal - state.playerTotal;
  observeAiEvent('roundEnd', { previousLead: roundLead - (opponentBank - playerBank), lead: roundLead });
  addActivity(roundWinner === 'player' ? 'you' : 'ai', `<b>${roundLabel}</b> · 你 ${playerBank} : ${opponentBank} · ${roundResult}`, '回合结算');
  addOpponentReaction(roundWinner === 'player' ? '这一回合你拿得更高，累计分差已经记下。' : roundWinner === 'opponent' ? '这一回合我先把分数拉开。' : '这一轮平分，最后要看累计总分。', '回合结算');
  if (sudden && roundWinner) {
    const winnerName = roundWinner === 'player' ? '你' : (opponents[state.opponentId]?.name || '对手');
    showToast(`突然死亡 · ${winnerName} 获胜`);
    finishGame(roundWinner);
    return;
  }

  if (sudden) {
    showToast('突然死亡仍然平手 · 继续加赛');
  } else if (state.round >= MATCH_ROUNDS) {
    if (state.playerTotal > state.opponentTotal) {
      finishGame('player');
      return;
    }
    if (state.opponentTotal > state.playerTotal) {
      finishGame('opponent');
      return;
    }
    state.suddenDeath = true;
    addActivity('ai', '<b>六回合累计分平手</b> · 进入突然死亡，下一轮高分者立即获胜', '加赛');
    showToast('六回合累计分平手 · 进入突然死亡');
  }

  scheduleOpponentAction(startPlayerTurn, AI_TIMING.afterBank, opponentTurnToken, { kind: 'afterBank' });
}

function bankScore() {
  if (state.roundScore <= 0 || state.turn !== 'player' || state.rolling || state.gameOver) return;
  if (!hasScoringSelectionThisRoll()) { safeAudio('playDeny'); showToast(selectionIssueMessage('收集')); return; }
  if (markPlayerHeatSelection()) recalculateRoundScore();
  const banked = state.roundScore;
  state.playerRoundBank = banked;
  state.playerTotal += banked;
  spawnScoreFloat(banked, els.playerTotal, 'gain', { tier: 'bank', owner: 'player', label: '本轮收分' });
  state.playerHistory.banks.push(banked);
  if (state.playerHistory.banks.length > 8) state.playerHistory.banks.shift();
  if (state.match?.type === 'stake') state.match.hasSuccessfulBank = true;
  safeAudio('playBank', banked);
  celebrateStage();
  addActivity('you', `<b>你</b> 收集了 <strong>${banked}</strong> 分`, '本轮结算');
  observeAiEvent('playerBank', { score: banked, lead: state.opponentTotal - state.playerTotal });
  addOpponentReaction(pickAiDialogue('playerBank', { score: banked, playerTotal: state.playerTotal }), '对手观察');
  dicePhysics3D.resetOwner?.('player');
  state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.locked.clear(); state.hasRolled = false; state.hotDice = false; state.hotDiceType = null; state.hotDiceCount = 0; state.heatSelectionCounted = false; state.farkle = false;
  renderDice(); updateUI();
  passToOpponent();
}

function farkleTurn() {
  const lostScore = state.roundScore;
  observeAiEvent('playerFarkle', { score: lostScore, lead: state.opponentTotal - state.playerTotal });
  state.farkle = true; state.playerHistory.farkles += 1; state.playerRoundBank = 0; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.hotDiceType = null; state.hotDiceCount = 0; state.heatSelectionCounted = false; updateUI();
  if (lostScore > 0) spawnScoreFloat(-lostScore, els.playerRoundScore || els.selectionScore, 'loss', { owner: 'player' });
  safeAudio('playFarkle'); shakeStage(); addActivity('ai', '<b>爆骰</b>！本轮未掷出任何得分骰子，分数归零', '本轮结束'); addOpponentReaction(pickAiDialogue('playerFarkle', { score: 0, playerTotal: state.playerTotal }), '对手观察'); showToast('爆骰！本轮分数归零');
  window.clearTimeout(turnTimer);
  turnTimer = window.setTimeout(() => { dicePhysics3D.resetOwner?.('player'); state.locked.clear(); state.hasRolled = false; state.farkle = false; passToOpponent(); }, 900);
}

function passToOpponent() {
  window.clearTimeout(turnTimer);
  clearOpponentActionTimer(true);
  dicePhysics3D.resetOwner?.('player');
  dicePhysics3D.resetOwner?.('opponent');
  state.turn = 'ai';
  state.hasRolled = false;
  state.heatSelectionCounted = false;
  state.roundScore = 0;
  state.rollScoreBase = 0;
  state.activeRollIndices = [];
  state.locked.clear();
  state.opponentDice = [];
  state.opponentActiveIndices = ALL_DICE_INDICES.slice();
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRoundBank = 0;
  state.opponentRollScoreBase = 0;
  state.opponentHotDiceCount = 0;
  state.opponentHotDiceType = null;
  state.opponentRolling = false;
  state.opponentPhase = 'preparing';
  resetAiTurnMetrics();
  renderDice();
  renderOpponentDice();
  updateUI();
  const token = opponentTurnToken;
  addOpponentReaction(pickAiDialogue('opening'), '对手回合');
  const raised = maybeOpponentRaiseMultiplier(token);
  // A pending AI raise is a hard pause: do not let the first-think timer
  // start until the player has explicitly accepted or declined it.
  if (!raised) scheduleOpponentAction(rollOpponentDice, AI_TIMING.firstThink, token, { kind: 'firstThink' });
}

function chooseScoringIndices(values) {
  if (!values.length) return [];
  const candidates = generateScoringKeeps(values);
  if (!candidates.length) return [];
  candidates.sort((a, b) => b.score - a.score || b.indices.length - a.indices.length);
  return candidates[0].indices;
}

// AI 不是“看到什么都拿走”：先列出这一掷所有合法保留方案，再按性格和局势评分。
function generateScoringKeeps(values) {
  const candidates = [];
  for (let mask = 1; mask < (1 << values.length); mask += 1) {
    const indices = []; const picked = [];
    for (let index = 0; index < values.length; index += 1) {
      if (mask & (1 << index)) { indices.push(index); picked.push(values[index]); }
    }
    const scored = scoreSelection(picked);
    if (scored.score > 0 && allDiceContribute(picked)) {
      candidates.push({ indices, values: picked, score: scored.score, label: scored.label });
    }
  }
  return candidates;
}

function clamp01(value) { return Math.max(0, Math.min(1, value)); }

function estimateFarkleRisk(slots) {
  if (!slots.length) return 0;
  const samples = slots.length >= 5 ? 110 : 80;
  let farkles = 0;
  for (let sample = 0; sample < samples; sample += 1) {
    const roll = slots.map((slot) => weightedRoll(dieById(state.opponentLoadout?.[slot] || 'ordinary').weights));
    if (scoreSelection(roll).score === 0) farkles += 1;
  }
  return farkles / samples;
}

function estimateExpectedNextScore(slots, samples = 10) {
  if (!slots.length || samples <= 0) return 0;
  let total = 0;
  for (let sample = 0; sample < samples; sample += 1) {
    const roll = slots.map((slot) => weightedRoll(dieById(state.opponentLoadout?.[slot] || 'ordinary').weights));
    total += applyScoreGrowth(scoreSelection(roll).score, 'opponent');
  }
  return total / samples;
}

function chooseOpponentScoringIndices(values) {
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const candidates = generateScoringKeeps(values);
  if (!candidates.length) return [];
  const activeSlots = state.opponentActiveIndices.length ? state.opponentActiveIndices : values.map((_, index) => index);
  const recentBanks = state.playerHistory?.banks || [];
  const playerAverageBank = recentBanks.length ? recentBanks.reduce((sum, value) => sum + value, 0) / recentBanks.length : 0;
  const playerFarkleRate = clamp01((state.playerHistory?.farkles || 0) / Math.max(1, recentBanks.length + (state.playerHistory?.farkles || 0)));
  const playerRead = mind.playerRead || {};
  const observedBankMean = playerRead.bankCount ? playerRead.bankMean : playerAverageBank;
  const observedFarkleRate = playerRead.bankCount ? playerRead.farkleRate : playerFarkleRate;
  const playerLead = state.playerTotal - state.opponentTotal;
  const playerThreat = clamp01(Math.max(0, playerLead) / 1800 * 0.65 + observedBankMean / 1000 * 0.25 + (state.round / MATCH_ROUNDS) * 0.1 - observedFarkleRate * 0.12);
  const scoreGrowth = getScoreGrowth('opponent').total;
  const ranked = candidates.map((candidate) => {
    const remainingSlots = activeSlots.filter((_, index) => !candidate.indices.includes(index));
    const risk = estimateFarkleRisk(remainingSlots);
    // AI 看到的是风险估计，不是上帝视角。高阶角色的误差更小，但仍不是零。
    const believedRisk = clampAi(risk + (secureRandomFloat() - .5) * 2 * tuning.beliefNoise);
    const scaledCandidateScore = applyScoreGrowth(candidate.score, 'opponent');
    const projected = state.opponentRoundScore + scaledCandidateScore;
    const expectedNextScore = profile.lookaheadSamples ? estimateExpectedNextScore(remainingSlots, profile.lookaheadSamples) : 0;
    const hotBonus = remainingSlots.length === 0 ? profile.hotDiceBias * 180 : 0;
    const straightBonus = candidate.label.includes('顺') ? (profile.comboBias?.straight || 0) * 120 : 0;
    const tripleBonus = candidate.label.includes('个') ? (profile.comboBias?.triple || 0) * 90 : 0;
    const continuation = remainingSlots.length * 54 * profile.continuationWeight * scoreGrowth * (1 + mind.greed * tuning.greedyResponse * .2);
    const lookaheadBonus = expectedNextScore * (profile.lookaheadWeight || 0);
    const riskCost = believedRisk * Math.max(projected, 100) * (0.72 + profile.riskTolerance + mind.caution * tuning.lossAversion * .3);
    const finalRoundBonus = (state.suddenDeath || state.round >= MATCH_ROUNDS) && state.opponentTotal + projected > state.playerTotal ? 900 : 0;
    const threatBonus = playerThreat * profile.comebackPressure * 180 + mind.pressure * (playerLead > 0 ? 85 : 38);
    const greedBonus = mind.greed * tuning.greedyResponse * Math.max(0, remainingSlots.length - 1) * 18;
    const cautionBonus = mind.caution * tuning.lossAversion * (remainingSlots.length <= 1 ? 26 : 0);
    const familyMemory = mind.recentActions.some((entry) => entry.action === 'keep' && entry.label === candidate.label) ? -tuning.adaptRate * 10 : 0;
    const humanNoise = (secureRandomFloat() - .5) * 2 * (22 + tuning.decisionNoise * 85);
    return { candidate, risk: believedRisk, utility: scaledCandidateScore + continuation + lookaheadBonus + hotBonus + straightBonus + tripleBonus + finalRoundBonus + threatBonus + greedBonus + cautionBonus + familyMemory + humanNoise };
  }).sort((a, b) => b.utility - a.utility);

  // 失误是“次优选择”而不是作弊：根据情绪从前三个合法方案中选一个。
  const effectiveMistakeRate = clampAi((profile.mistakeRate || 0) + mind.frustration * tuning.tiltGain * .08 + (mind.greed > .72 ? .025 : 0));
  if (ranked.length > 1 && secureRandomFloat() < effectiveMistakeRate) {
    const window = Math.min(3, ranked.length);
    const choice = ranked[1 + Math.floor(secureRandomFloat() * (window - 1))];
    mind.lastDecision = { action: 'keep', mode: 'bounded-mistake', label: choice.candidate.label, score: choice.candidate.score, risk: choice.risk };
    rememberAiAction('keep', { label: choice.candidate.label, score: choice.candidate.score, risk: choice.risk, mistake: true });
    return choice.candidate.indices;
  }
  const choice = ranked[0];
  mind.lastDecision = { action: 'keep', mode: 'best-fit', label: choice.candidate.label, score: choice.candidate.score, risk: choice.risk };
  rememberAiAction('keep', { label: choice.candidate.label, score: choice.candidate.score, risk: choice.risk, mistake: false });
  return choice.candidate.indices;
}

function rollOpponentDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentRolling || state.match?.pendingRaise) return;
  const mind = getAiMind();
  mind.turnRolls = Math.max(0, Number(mind.turnRolls) || 0) + 1;
  rememberAiAction('roll', { turnRolls: mind.turnRolls, round: state.round });
  const activeIndices = state.opponentActiveIndices.length ? [...state.opponentActiveIndices] : ALL_DICE_INDICES.slice();
  const opponentTargets = activeIndices.map((slot) => weightedRoll(dieById(state.opponentLoadout?.[slot] || 'ordinary').weights));
  state.opponentPhase = 'rolling';
  state.opponentRolling = true;
  state.farkle = false;
  state.hotDice = false;
  state.opponentHotDiceType = null;
  els.ritual?.classList.add('active');
  renderOpponentDice();
  updateUI();
   safeAudio('playShake');
   flashBoardLight('roll');
  let settled = false;
  const finishRoll = () => {
    if (settled || !isOpponentTurn(token)) return;
    settled = true;
    window.clearTimeout(opponentRollFallback);
    opponentRollFallback = undefined;
    finishOpponentRoll(token, activeIndices, opponentTargets);
  };
  try {
    dicePhysics3D.pulse?.('roll');
    const started = dicePhysics3D.rollDice(activeIndices.length, opponentTargets, finishRoll, {
      owner: 'opponent',
      indices: activeIndices
    });
    if (!Array.isArray(started) || started.length !== activeIndices.length) {
      window.setTimeout(finishRoll, 0);
      return;
    }
  } catch (error) {
    console.warn('[dice:opponent-physics]', error);
    window.setTimeout(finishRoll, 0);
    return;
  }
  // This is only a recovery path for a blocked WebGL/physics frame. Normal
  // game flow always advances through the physical dice-settle callback.
  opponentRollFallback = window.setTimeout(finishRoll, 6000);
}

function finishOpponentRoll(token, activeIndices, targets) {
  if (!isOpponentTurn(token)) return;
  state.opponentDice = targets;
  state.opponentActiveIndices = activeIndices;
  state.opponentRolling = false;
  state.opponentPhase = 'selecting';
  els.ritual?.classList.remove('active');
  renderOpponentDice();
  updateUI();
   safeAudio('playLand');
   flashBoardLight('land');
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 掷出 ${targets.join(' · ')} 点`, '对手回合');
  const visibleScore = scoreSelection(targets).score;
  const rollReaction = pickAiDialogue(visibleScore >= 750 ? 'rollHigh' : visibleScore > 0 ? 'rollPositive' : 'rollBad', { score: visibleScore, label: scoreSelection(targets).label, remaining: activeIndices.length });
  addOpponentReaction(rollReaction);
  scheduleOpponentAction(selectOpponentDice, AI_TIMING.afterRollThink, token, { kind: 'afterRollThink' });
}

function selectOpponentDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentPhase !== 'selecting') return;
  const pickedPositions = chooseOpponentScoringIndices(state.opponentDice);
  if (!pickedPositions.length) {
    const lostScore = state.opponentRoundScore;
    observeAiEvent('ownFarkle', { score: lostScore, lead: state.opponentTotal - state.playerTotal });
    state.farkle = true;
    state.hotDice = false;
    state.opponentHotDiceCount = 0;
    state.opponentHotDiceType = null;
    state.opponentRoundScore = 0;
    state.opponentRoundBank = 0;
    state.opponentPhase = 'farkle';
    renderOpponentDice();
    updateUI();
    if (lostScore > 0) spawnScoreFloat(-lostScore, els.opponentRoundScore, 'loss', { owner: 'opponent' });
    safeAudio('playFarkle');
    shakeStage();
    addActivity('ai', `<b>${els.opponentName.textContent}</b> 爆骰，本轮分数归零`, '对手回合结束');
    addOpponentReaction(pickAiDialogue('farkle', { score: 0, remaining: state.opponentActiveIndices.length }));
    showToast('对手爆骰，本轮分数归零');
    scheduleOpponentAction(settleCompletedRound, AI_TIMING.afterFarkle, token, { kind: 'afterFarkle' });
    return;
  }

  const pickedSet = new Set(pickedPositions);
  const pickedValues = pickedPositions.map((position) => state.opponentDice[position]);
  const pickedSlots = pickedPositions.map((position) => state.opponentActiveIndices[position]);
  const pickedRawScore = scoreSelection(pickedValues).score;
  const fullHot = pickedSlots.length === state.opponentActiveIndices.length;
  advanceHeatChain('opponent', fullHot);
  const pickedScore = applyScoreGrowth(pickedRawScore, 'opponent');
  observeAiEvent('keep', { score: pickedScore, label: scoreSelection(pickedValues).label, remaining: state.opponentActiveIndices.length - pickedSlots.length });
  state.opponentKept.push(...pickedValues);
  state.opponentKeptIndices.push(...pickedSlots);
  state.opponentDice = state.opponentDice.filter((_, position) => !pickedSet.has(position));
  state.opponentActiveIndices = state.opponentActiveIndices.filter((_, position) => !pickedSet.has(position));
  const previousOpponentRoundScore = state.opponentRoundScore;
  state.opponentRoundScore = state.opponentRollScoreBase + pickedScore;
  pickedSlots.forEach((slot, position) => dicePhysics3D.setLocked?.('opponent', slot, true, pickedValues[position]));
  state.opponentPhase = 'deciding';
  renderOpponentDice();
  updateUI();
  const opponentScoreDelta = state.opponentRoundScore - previousOpponentRoundScore;
  if (opponentScoreDelta > 0) spawnScoreBreakdown([], pickedValues, els.opponentRoundScore, opponentScoreDelta, 'opponent');
  else if (opponentScoreDelta < 0) spawnScoreFloat(opponentScoreDelta, els.opponentRoundScore, 'loss', { owner: 'opponent' });
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 保留 ${pickedValues.join(' · ')}，本轮 <strong>${state.opponentRoundScore}</strong> 分`, '对手回合');
  const keepReaction = pickAiDialogue(pickedRawScore >= 750 ? 'keepBig' : pickedRawScore >= 300 ? 'keepMid' : 'keepSmall', { score: pickedScore, label: scoreSelection(pickedValues).label, remaining: state.opponentActiveIndices.length });
  addOpponentReaction(keepReaction);
  showToast(`${els.opponentName.textContent} 保留 ${pickedValues.join(' · ')} · 暂存 ${state.opponentRoundScore} 分`);

  const heatKind = getHeatKind(state.opponentKeptIndices.length);
  if (heatKind) {
    const mind = getAiMind();
    mind.hotChaseCount = Math.max(0, Number(mind.hotChaseCount) || 0) + 1;
    mind.consecutiveContinues = Math.max(0, Number(mind.consecutiveContinues) || 0) + 1;
    observeAiEvent('ownHotDice', { score: pickedScore, heatKind });
    state.opponentHotDiceType = heatKind;
    state.hotDice = true;
    state.opponentPhase = 'hotDice';
    triggerHotDiceAudio('opponent', heatKind);
    updateUI();
    const discarded = Math.max(0, state.opponentActiveIndices.length);
    const heatLabel = heatKind === 'perfect' ? '完美热骰' : '普通热骰';
    addActivity('ai', `<b>${els.opponentName.textContent}</b> ${heatLabel} · ${heatKind === 'perfect' ? '七枚全部计分' : `六枚计分，舍弃 ${discarded || 1} 枚`} · 第 ${state.opponentHotDiceCount} 次连火`, '对手回合');
    addOpponentReaction(pickAiDialogue('hotDice', { score: state.opponentRoundScore, remaining: state.opponentActiveIndices.length, heatKind }));
    scheduleOpponentAction(resetOpponentHotDice, AI_TIMING.hotDicePause, token, { kind: 'hotDicePause' });
    return;
  }
  scheduleOpponentAction(decideOpponentTurn, AI_TIMING.afterKeepThink, token, { kind: 'afterKeepThink' });
}

function resetOpponentHotDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token)) return;
  const heatKind = state.opponentHotDiceType;
  const mind = getAiMind();
  dicePhysics3D.resetOwner?.('opponent');
  state.opponentDice = [];
  state.opponentActiveIndices = ALL_DICE_INDICES.slice();
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRollScoreBase = state.opponentRoundScore;
  state.hotDice = false;
  state.opponentHotDiceType = null;
  // 热骰之后先给 AI 一个“是否继续追”的思考节点。瓦茨拉夫最多追两次
  // 连火，达到上限后必须重新评估，而不是无条件自动投入下一掷。
  const hotChaseLimit = state.opponentId === 'vlad' ? 2 : 3;
  state.opponentPhase = mind.hotChaseCount >= hotChaseLimit ? 'deciding' : 'preparing';
  renderOpponentDice();
  updateUI();
  addOpponentReaction(pickAiDialogue('hotDice', { score: state.opponentRoundScore, remaining: DICE_COUNT, heatKind }));
  showToast('对手热骰，七枚骰子重新加入骰池');
  scheduleOpponentAction(
    state.opponentPhase === 'deciding' ? decideOpponentTurn : rollOpponentDice,
    state.opponentPhase === 'deciding' ? AI_TIMING.afterKeepThink : AI_TIMING.afterDecision,
    token,
    { kind: state.opponentPhase === 'deciding' ? 'afterKeepThink' : 'afterDecision' }
  );
}

function shouldOpponentBank() {
  const profile = opponents[state.opponentId] || opponents.milo;
  const mind = getAiMind();
  const tuning = aiTuning(state.opponentId);
  const remainingSlots = state.opponentActiveIndices.length;
  const risk = estimateFarkleRisk(state.opponentActiveIndices);
  const believedRisk = clampAi(risk + (secureRandomFloat() - .5) * 2 * tuning.beliefNoise);
  const projected = state.opponentRoundScore;
  const scoreGrowth = getScoreGrowth('opponent').total;
  const scaledBankAt = profile.bankAt * scoreGrowth;
  const playerRoundBank = state.playerRoundBank || 0;
  const totalLeadAfterBank = state.opponentTotal + projected - state.playerTotal;
  const roundLead = projected - playerRoundBank;
  const endgamePressure = state.suddenDeath ? 1 : clamp01(state.round / MATCH_ROUNDS);
  const scoreRatio = clamp01(projected / Math.max(scaledBankAt, 1));
  const turnRolls = Math.max(0, Number(mind.turnRolls) || 0);
  const consecutiveContinues = Math.max(0, Number(mind.consecutiveContinues) || 0);
  const hotChaseCount = Math.max(0, Number(mind.hotChaseCount) || 0);
  const isVlad = state.opponentId === 'vlad';

  // 所有 AI 都有回合级安全阀，防止极端骰面、热骰连火或随机噪声把回合
  // 卡成无限循环。瓦茨拉夫的阈值更宽，但仍然必须在合理时机收分。
  const hardRollLimit = isVlad ? 7 : 6;
  const hardContinueLimit = isVlad ? 4 : 3;
  if (projected > 0 && (turnRolls >= hardRollLimit || consecutiveContinues >= hardContinueLimit)) {
    mind.lastDecision = { action: 'bank', mode: 'turn-safety-limit', probability: 1, risk: believedRisk, projected, turnRolls, consecutiveContinues };
    rememberAiAction('bank-decision', { mode: 'turn-safety-limit', probability: 1, risk: believedRisk, projected, turnRolls, consecutiveContinues });
    return true;
  }

  // 瓦茨拉夫仍然可以在落后时追分，但当暂存分已经达到自己的安全线，
  // 连续两次继续或两次热骰追逐后就要把筹码收回，避免“永不收分”。
  const vladSafetyScore = Math.max(scaledBankAt * 1.35, 850 * scoreGrowth);
  const vladComebackNeed = totalLeadAfterBank < -Math.max(950 * scoreGrowth, scaledBankAt * 1.5)
    && state.round < MATCH_ROUNDS;
  if (isVlad && projected > 0 && !vladComebackNeed) {
    if (consecutiveContinues >= 3 || turnRolls >= 6 || (hotChaseCount >= 2 && projected >= vladSafetyScore)) {
      mind.lastDecision = { action: 'bank', mode: 'vlad-rationality-brake', probability: 1, risk: believedRisk, projected, turnRolls, consecutiveContinues, hotChaseCount };
      rememberAiAction('bank-decision', { mode: 'vlad-rationality-brake', probability: 1, risk: believedRisk, projected, turnRolls, consecutiveContinues, hotChaseCount });
      return true;
    }
  }
  if (state.suddenDeath && projected > playerRoundBank) {
    mind.lastDecision = { action: 'bank', mode: 'sudden-death', probability: 1, risk: believedRisk };
    rememberAiAction('bank-decision', { mode: 'sudden-death', probability: 1, risk: believedRisk });
    return true;
  }
  // A near-empty cup is a meaningful warning, unless the gambler is chasing a comeback.
  const riskLimit = profile.riskLimit ?? (profile.riskTolerance * 0.42 + (1 - clamp01(remainingSlots / DICE_COUNT)) * 0.15);
  const safeEnough = believedRisk <= riskLimit && projected < scaledBankAt * 1.35;
  let bankProbability = 0.16 + scoreRatio * 0.58 + believedRisk * 0.5;
  bankProbability += mind.caution * tuning.lossAversion * .16;
  bankProbability -= mind.greed * tuning.greedyResponse * .12;
  bankProbability -= mind.pressure * profile.comebackPressure * .1;
  bankProbability += mind.frustration * tuning.lossAversion * .06;
  bankProbability += roundLead >= 0 ? 0.1 : -profile.comebackPressure * 0.18;
  bankProbability += totalLeadAfterBank >= 0 ? 0.1 : -profile.comebackPressure * 0.18;
  bankProbability += endgamePressure * 0.16;
  bankProbability += state.opponentId === 'marta' ? 0.12 : state.opponentId === 'vlad' ? -0.18 : 0;
  if (safeEnough && state.opponentId === 'marta') bankProbability += 0.12;
  if (remainingSlots <= 1) bankProbability += 0.24 - profile.riskTolerance * 0.18;
  if (projected >= scaledBankAt && state.opponentId !== 'vlad') bankProbability += 0.18;
  if (state.round >= MATCH_ROUNDS && totalLeadAfterBank > 0) bankProbability += 0.3;
  if (state.round >= MATCH_ROUNDS && totalLeadAfterBank < 0) bankProbability -= 0.12;
  if (state.opponentId === 'marta') {
    const aiLead = totalLeadAfterBank;
    // She protects a lead, but does not blindly bank when she is behind.
    if (aiLead >= 350) bankProbability += 0.14;
    if (aiLead <= -350) bankProbability -= 0.14;
    // With a safe mid-sized turn and enough dice left, let the lookahead
    // model earn one more measured roll instead of always stopping at 220.
    if (projected >= 260 * scoreGrowth && remainingSlots >= 3 && believedRisk < 0.28 && aiLead < 300) bankProbability -= 0.08;
    if (projected >= scaledBankAt * 1.25 && believedRisk < 0.36) bankProbability += 0.1;
  }
  if (state.opponentId === 'musa') {
    if (projected >= 450 * scoreGrowth) bankProbability += 0.12;
    if (projected >= 700 * scoreGrowth && believedRisk < 0.34) bankProbability += 0.1;
    if (projected < 300 * scoreGrowth && remainingSlots >= 4 && believedRisk < 0.28) bankProbability -= 0.12;
  }
  if (isVlad && projected >= vladSafetyScore) {
    bankProbability += .2 + (consecutiveContinues >= 2 ? .16 : 0) + (believedRisk > .28 ? .1 : 0);
  }
  const playerRead = mind.playerRead || {};
  if (playerRead.bankCount >= 2 && playerRead.bankMean > scaledBankAt * 1.15 && totalLeadAfterBank < 0) bankProbability -= tuning.adaptRate * .08;
  if (playerRead.farkleRate > .32 && totalLeadAfterBank < 0) bankProbability -= tuning.adaptRate * .06;
  bankProbability += (secureRandomFloat() - .5) * 2 * (tuning.decisionNoise * .12 + .025);
  const finalProbability = clamp01(bankProbability);
  const decision = finalProbability >= .5 ? 'bank' : 'continue';
  mind.lastDecision = { action: decision, probability: finalProbability, risk: believedRisk, projected, remainingSlots };
  rememberAiAction('bank-decision', { decision, probability: finalProbability, risk: believedRisk, projected, remainingSlots });
  return secureRandomFloat() < finalProbability;
}

function decideOpponentTurn(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentPhase !== 'deciding') return;
  if (shouldOpponentBank()) {
    state.opponentPhase = 'banking';
    updateUI();
    const bankLines = { milo: '米洛 把分数稳稳收进囊中', vlad: '瓦茨拉夫 这次决定见好就收', marta: '玛蒂娜 把账算清后收下分数', musa: '穆萨 完成判断后把分数收进账本' };
    addOpponentReaction(pickAiDialogue('bank', { score: state.opponentRoundScore, remaining: state.opponentActiveIndices.length }));
    showToast(bankLines[state.opponentId] || `${els.opponentName.textContent} 决定收集本轮分数`);
    scheduleOpponentAction(opponentBank, AI_TIMING.afterDecision, token, { kind: 'bank' });
    return;
  }
  const mind = getAiMind();
  mind.consecutiveContinues = Math.max(0, Number(mind.consecutiveContinues) || 0) + 1;
  rememberAiAction('continue', { consecutiveContinues: mind.consecutiveContinues, projected: state.opponentRoundScore, remainingSlots: state.opponentActiveIndices.length });
  state.opponentRollScoreBase = state.opponentRoundScore;
  state.opponentPhase = 'preparing';
  updateUI();
  const rollLines = { milo: '米洛 还想再看一掷', vlad: '瓦茨拉夫 把骰盅推回桌心', marta: '玛蒂娜 认为风险还在可控范围', musa: '穆萨 还要验证一次牌面判断' };
  addOpponentReaction(pickAiDialogue('continue', { score: state.opponentRoundScore, remaining: state.opponentActiveIndices.length }));
  showToast(`${rollLines[state.opponentId] || els.opponentName.textContent} · 继续投掷 ${state.opponentActiveIndices.length} 枚`);
  scheduleOpponentAction(rollOpponentDice, AI_TIMING.afterDecision, token, { kind: 'afterDecision' });
}

function opponentBank(token = opponentTurnToken) {
  if (!isOpponentTurn(token)) return;
  const gain = state.opponentRoundScore;
  const mind = getAiMind();
  mind.lastBankScore = gain;
  mind.consecutiveContinues = 0;
  mind.hotChaseCount = 0;
  observeAiEvent('ownBank', { score: gain, lead: state.opponentTotal - state.playerTotal });
  state.opponentRoundBank = gain;
  state.opponentTotal += gain;
  spawnScoreFloat(gain, els.opponentRight, 'gain', { tier: 'bank', owner: 'opponent', label: '对手收分' });
  if (state.match?.type === 'stake') state.match.hasSuccessfulBank = true;
  safeAudio('playBank', gain);
  celebrateStage();
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 收集了 <strong>${gain}</strong> 分`, '对手回合结算');
  addOpponentReaction(pickAiDialogue('bank', { score: gain, remaining: state.opponentActiveIndices.length }), '对手回合结算');
  // Kept dice remain visible only while the opponent is still considering the
  // turn. Once the score is banked, clear this owner's reusable dice pool now.
  dicePhysics3D.resetOwner?.('opponent');
  state.opponentPhase = 'banking';
  state.opponentHotDiceCount = 0;
  state.opponentHotDiceType = null;
  state.farkle = false;
  renderOpponentDice();
  updateUI();
  settleCompletedRound();
}

function startPlayerTurn() {
  clearOpponentActionTimer(true);
  dicePhysics3D.resetOwner?.('opponent');
  dicePhysics3D.resetOwner?.('player');
  state.round += 1;
  state.turn = 'player';
  state.hasRolled = false;
  state.roundScore = 0;
  state.rollScoreBase = 0;
  state.activeRollIndices = [];
  state.locked.clear();
  state.dice = Array(DICE_COUNT).fill(0);
  state.opponentDice = [];
  state.opponentActiveIndices = [];
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRollScoreBase = 0;
  state.playerRoundBank = 0;
  state.opponentRoundBank = 0;
  state.opponentHotDiceCount = 0;
  state.opponentHotDiceType = null;
  state.opponentRolling = false;
  state.opponentPhase = 'idle';
  state.farkle = false;
  state.hotDice = false;
  state.hotDiceCount = 0;
  state.hotDiceType = null;
  state.heatSelectionCounted = false;
  renderDice();
  renderOpponentDice();
  updateUI();
  showToast(state.suddenDeath ? '突然死亡 · 轮到你' : `第 ${String(state.round).padStart(2, '0')} 回合 · 轮到你`);
}

function settleMatch(winner) {
  if (!state.match?.active || state.match.settled || !state.wallet) return { amount: 0, message: '' };
  const type = state.match.type === 'stake' ? 'stake' : 'practice';
  const stake = Math.max(0, Number(state.match.stake) || 0);
  // 加码现在必须经过"接受/认输离场"的真实选择——接受就是双方对等暴露在同一个
  // 倍率下，认输就是立刻按加码前的旧倍率结束整局。不管走到哪一种，输赢两边
  // 用的都是同一个 getTableMultiplier()，不再需要分别追踪"个人最高加码"。
  const tableMultiplier = type === 'stake' ? getTableMultiplier() : DEFAULT_TABLE_MULTIPLIER;
  let amount = 0;
  let message = '';
  if (winner === 'player') {
    if (type === 'practice') {
      amount = PRACTICE_REWARD;
      state.wallet.groschen += amount;
      state.wallet.lifetimeEarned += amount;
      message = `练习桌奖励 +${formatGroschen(amount)}`;
    } else {
      const profit = stake * tableMultiplier;
      amount = profit;
      state.wallet.groschen += profit;
      state.wallet.lifetimeEarned += profit;
      message = `牌桌倍率 x${tableMultiplier} · 赢得 ${formatGroschen(profit)}`;
    }
  } else if (type === 'stake') {
    const totalLoss = stake * tableMultiplier;
    state.wallet.groschen = Math.max(0, state.wallet.groschen - totalLoss);
    state.wallet.lifetimeSpent += totalLoss;
    amount = -totalLoss;
    message = `牌桌倍率 x${tableMultiplier} · 本局损失 ${formatGroschen(totalLoss)}`;
  } else {
    message = '练习桌不扣除格罗申';
  }
  state.wallet.lastSettlement = { at: new Date().toISOString(), type, opponentId: state.opponentId, winner, amount, tableMultiplier };
  state.match.settled = true;
  state.match.active = false;
  state.match.result = winner;
  state.match.payout = amount;
  saveWallet(); renderWallet();
  return { amount, message };
}

function finishGame(winner) {
  if (state.gameOver) return;
  window.clearTimeout(turnTimer);
  playerRollToken += 1;
  clearOpponentActionTimer(true);
  state.gameOver = true;
  state.turn = 'player';
  state.rolling = false;
  state.match.pendingRaise = null;
  els.ritual?.classList.remove('active');
  state.opponentRolling = false;
  updateUI();
  if (winner === 'player') { safeAudio('playWin'); celebrateStage(); } else { safeAudio('playFarkle'); shakeStage(); }
  const opponentName = opponents[state.opponentId]?.name || '对手';
  const rewardMessage = winner === 'player' ? grantVictoryReward(state.opponentId) : '';
  const settlement = settleMatch(winner);
  const resultCopy = winner === 'player' ? `你赢下这局！${settlement.message ? ` · ${settlement.message}` : ''}${rewardMessage ? ` · ${rewardMessage}` : ''}` : `${opponentName}赢下这局。${settlement.message ? ` · ${settlement.message}` : ''}`;
  showToast(resultCopy);
  addActivity(winner === 'player' ? 'you' : 'ai', winner === 'player' ? '<b>你</b> 赢下墙洞酒馆牌桌' : `<b>${opponentName}</b> 赢下墙洞酒馆牌桌`, '牌局结束');
  if (settlement.message) addActivity(winner === 'player' ? 'you' : 'ai', `<b>账房</b> · ${settlement.message}`, '牌局结算');
  if (winner === 'player' && rewardMessage && !rewardMessage.includes('已拥有')) addActivity('you', `<b>收藏奖励</b> · ${rewardMessage}`, '牌局结束');
}

function resetGame(announce = true) {
  window.clearTimeout(turnTimer);
  playerRollToken += 1;
  clearOpponentActionTimer(true);
  dicePhysics3D.resetOwner?.('player');
  dicePhysics3D.resetOwner?.('opponent');
  const profile = opponents[state.opponentId];
  state.playerTotal = 0;
  state.opponentTotal = 0;
  state.playerRoundBank = 0;
  state.opponentRoundBank = 0;
  state.suddenDeath = false;
  state.roundScore = 0;
  state.rollScoreBase = 0;
  state.activeRollIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRollScoreBase = 0;
  state.round = 1;
  state.dice = Array(DICE_COUNT).fill(0);
  state.opponentDice = [];
  state.opponentActiveIndices = [];
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.locked.clear();
  state.hasRolled = false;
  state.rolling = false;
  state.turn = 'player';
  state.gameOver = false;
  state.farkle = false;
  state.hotDice = false;
  state.hotDiceCount = 0;
  state.hotDiceType = null;
  state.heatSelectionCounted = false;
  state.opponentHotDiceCount = 0;
  state.opponentHotDiceType = null;
  state.opponentRolling = false;
  state.opponentPhase = 'idle';
  state.playerHistory = { banks: [], farkles: 0 };
  state.aiDialogueHistory = [];
  resetAiMind(state.opponentId);
  if (state.match) { state.match.multiplier = DEFAULT_TABLE_MULTIPLIER; state.match.scoreMultiplier = DEFAULT_TABLE_MULTIPLIER; state.match.maxRaiseBy = { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }; state.match.lastRaisedBy = null; state.match.lastRaiseRound = 0; state.match.raiseCount = 0; state.match.hasSuccessfulBank = false; state.match.pendingRaise = null; }
  state.opponentLoadout = profile.loadout;
  if (els.playerModeCopy) els.playerModeCopy.textContent = state.mode === 'online' ? '联机演示' : '本地练习';
  els.opponentName.textContent = profile.name;
  els.opponentStatus.textContent = profile.status;
  if (els.opponentReaction) els.opponentReaction.textContent = '先看看你的起手。';
  els.room.textContent = state.mode === 'online' ? 'DUEL-208' : state.room;
  els.activity.innerHTML = '';
  els.playerTotal.textContent = state.playerTotal;
  els.opponentRight.textContent = state.opponentTotal;
  addActivity('ai', `<b>${profile.name}</b> 把骰盅推到桌边，等你先手`, '刚才');
  addActivity('you', '<b>你</b> 坐上墙洞酒馆牌桌', '刚才');
  renderDice();
  renderOpponentDice();
  renderRolePanels();
  updateEquipped();
  updateUI();
  if (announce) showToast('牌桌已重新开始');
}

function showToast(message) { els.toast.textContent = message; els.toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = window.setTimeout(() => els.toast.classList.remove('show'), 2200); }

function renderProbabilityTable() {
  const header = `<div class="prob-row head"><span>骰子名称</span><span>1点</span><span>2点</span><span>3点</span><span>4点</span><span>5点</span><span>6点</span></div>`;
  els.codexContent.querySelector('#probability-table').innerHTML = header + diceCatalog.map((die) => `<button class="prob-row" data-die-id="${die.id}" type="button"><span>${die.name}</span>${die.weights.map((weight) => `<span>${weight}%</span>`).join('')}</button>`).join('');
  els.codexContent.querySelectorAll('[data-die-id]').forEach((row) => row.addEventListener('click', () => { equipDie(row.dataset.dieId); closeCodex(); }));
}

function setCodexPage(index) {
  currentPage = Math.max(0, Math.min(pages.length - 1, index));
  const page = pages[currentPage];
  els.codexKicker.textContent = page.kicker;
  els.codexPage.textContent = `${currentPage + 1} / ${pages.length}`;
  els.codexTitle.innerHTML = `${page.title} <em>(${currentPage + 1}/${pages.length})</em>`;
  els.codexContent.innerHTML = page.content;
  els.prev.disabled = currentPage === 0;
  els.next.disabled = currentPage === pages.length - 1;
  els.codexDots.innerHTML = pages.map((_, pageIndex) => `<i class="${pageIndex === currentPage ? 'active' : ''}"></i>`).join('');
  if (currentPage === 2) {
    els.codexContent.insertAdjacentHTML('afterbegin', `<p class="codex-intro">正在编辑第 ${state.equipSlot + 1} 个装备槽位 · 点击下方骰子即可替换</p>`);
    renderProbabilityTable();
  }
}

function openCodex(pageIndex = 0) { setCodexPage(pageIndex); els.codexModal.classList.remove('hidden'); }
function closeCodex() { els.codexModal.classList.add('hidden'); }
function equipDie(id) { const die = diceCatalog.find((item) => item.id === id); if (!die) return; state.loadout[state.equipSlot] = id; updateEquipped(); showToast(`槽位 ${state.equipSlot + 1} 已装备：${die.name}`); }

function restoreDefaultLoadout() {
  state.loadout = [...DEFAULT_LOADOUT];
  updateEquipped();
  showToast('已还原为七枚普通骰');
}

function toggleMode() {
  state.mode = state.mode === 'solo' ? 'online' : 'solo';
  const online = state.mode === 'online'; els.modeLabel.textContent = online ? '联机演示' : '本地练习'; els.modeToggle.querySelector('i').style.background = online ? '#6fa76b' : '#83a969';
  if (els.playerModeCopy) els.playerModeCopy.textContent = online ? '联机演示' : '本地练习';
  els.room.textContent = online ? 'DUEL-208' : state.room;
  showToast(online ? '已进入联机演示房间 · 延迟 42ms' : '已返回本地练习');
}

function selectOpponent(id, { reset = false, announce = true } = {}) {
  if (!opponents[id]) return;
  state.opponentId = id;
  state.aiDialogueHistory = [];
  resetAiMind(id);
  document.querySelectorAll('.opponent-card').forEach((card) => card.classList.toggle('selected', card.dataset.opponent === id));
  renderOpponentModal();
  if (reset && !els.arena?.classList.contains('hidden')) resetGame(false);
  if (announce) showToast(`已选择 ${opponents[id].name}`);
}

function setMatchType(type) {
  state.match.type = type === 'stake' ? 'stake' : 'practice';
  state.match.stake = state.match.type === 'stake' ? (OPPONENT_STAKES[state.opponentId] || 0) : 0;
  if (!state.match.active) { state.match.multiplier = DEFAULT_TABLE_MULTIPLIER; state.match.maxRaiseBy = { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }; state.match.lastRaisedBy = null; state.match.lastRaiseRound = 0; state.match.raiseCount = 0; state.match.hasSuccessfulBank = false; state.match.pendingRaise = null; }
  els.matchTypeButtons?.forEach((button) => button.classList.toggle('active', button.dataset.matchType === state.match.type));
  renderOpponentModal();
}

function renderOpponentModal() {
  if (!els.opponentModalCards) return;
  const type = state.match?.type === 'stake' ? 'stake' : 'practice';
  const selectedId = state.opponentId;
  els.matchTypeButtons?.forEach((button) => {
    const active = button.dataset.matchType === type;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  els.opponentModalCards.innerHTML = Object.entries(opponents).map(([id, profile]) => {
    const selected = id === selectedId;
    const stake = OPPONENT_STAKES[id] || 0;
    const priceCopy = type === 'stake'
      ? `赌注 ${formatGroschen(stake)} · 六回合对决`
      : `胜利奖励 +${formatGroschen(PRACTICE_REWARD)} · 六回合对决`;
    return `<button class="opponent-modal-card ${selected ? 'selected' : ''}" data-opponent="${id}" type="button"><span class="opponent-modal-avatar"><img src="${profile.avatar}" alt="${profile.name}头像" /></span><span class="opponent-modal-copy"><b>${profile.name}</b><small>${profile.role} · ${profile.riskLabel}打法</small><em>${priceCopy}</em></span><span class="opponent-modal-check">${selected ? '✓' : ''}</span></button>`;
  }).join('');
  els.opponentModalCards.querySelectorAll('[data-opponent]').forEach((card) => card.addEventListener('click', () => selectOpponent(card.dataset.opponent, { announce: false })));
  const stake = type === 'stake' ? (OPPONENT_STAKES[selectedId] || 0) : 0;
  const balance = state.wallet?.groschen || 0;
  const maxRisk = stake * LOSS_MULTIPLIER_CAP;
  const enough = type !== 'stake' || balance >= maxRisk;
  if (els.opponentModalStatus) els.opponentModalStatus.textContent = type === 'stake' ? (enough ? `入场需准备最高风险 ${formatGroschen(maxRisk)} · 基础赌注 ${formatGroschen(stake)} · 最高倍率 x${LOSS_MULTIPLIER_CAP}` : `余额不足：至少需准备 ${formatGroschen(maxRisk)}，当前仅有 ${formatGroschen(balance)}`) : `不收取赌注 · 倍率固定 x1 · 赢下一局奖励 ${formatGroschen(PRACTICE_REWARD)}`;
  if (els.opponentModalConfirm) { els.opponentModalConfirm.disabled = !enough; els.opponentModalConfirm.textContent = type === 'stake' ? `准备 ${formatGroschen(stake)} 坐下对弈` : '坐下对弈'; }
}

function openOpponentModal({ preserveType = false } = {}) {
  closeBoardMenu(); closeCollection(); closeDiceBoxModal(); closeDetailModal();
  if (!state.match?.active && !preserveType) setMatchType('practice');
  renderOpponentModal();
  els.opponentModal?.classList.remove('hidden');
  document.body.classList.add('hub-modal-open');
}

function closeOpponentModal() {
  els.opponentModal?.classList.add('hidden');
  if (els.diceBoxModal?.classList.contains('hidden')) document.body.classList.remove('hub-modal-open');
}

function renderDiceBox() {
  if (!els.diceBoxContent) return;
  const dice = [
    { name: '原木骰', detail: '朴素耐用 · 酒馆常用', face: 5, className: 'wood' },
    { name: '兽骨骰', detail: '颜色温润 · 手感轻', face: 3, className: 'bone' },
    { name: '黄铜骰', detail: '分量扎实 · 桌面醒目', face: 6, className: 'brass' }
  ];
  els.diceBoxContent.innerHTML = dice.map((die) => `<article class="dice-box-item"><div class="dice-box-die ${die.className}">${pipFace(die.face)}</div><div><b>${die.name}</b><small>${die.detail}</small></div><span>${die.name === '原木骰' ? '当前装备' : '后续接入'}</span></article>`).join('');
}

function openDiceBoxModal() {
  closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDetailModal(); renderDiceBox();
  els.diceBoxModal?.classList.remove('hidden');
  document.body.classList.add('hub-modal-open');
}

function closeDiceBoxModal() {
  els.diceBoxModal?.classList.add('hidden');
  if (els.opponentModal?.classList.contains('hidden')) document.body.classList.remove('hub-modal-open');
}

function renderDetailModal(kind = 'opponent') {
  if (!els.detailModalContent) return;
  const mode = kind === 'player' || kind === 'table' ? kind : 'opponent';
  if (mode === 'player') {
    const playerName = escapeHtml(state.playerName);
    const playerAvatar = normalizePlayerAvatar(state.playerAvatar);
    const playerInitial = escapeHtml(Array.from(state.playerName)[0] || 'L');
    const equippedCard = state.collection?.equippedCard;
    const medals = state.collection?.equippedMedals || [];
    els.detailModalKicker.textContent = 'PLAYER DETAILS';
    els.detailModalTitle.textContent = `${state.playerName} · 旅人档案`;
    els.detailModalSubtitle.textContent = '展示收藏请前往顶部的骰子、名片与勋章入口。';
    els.detailModalContent.innerHTML = `<div class="detail-profile-line"><div class="detail-avatar player-avatar">${playerAvatar ? `<img src="${escapeHtml(playerAvatar)}" alt="玩家头像" />` : `<span>${playerInitial}</span>`}</div><div><b>${playerName}</b><small>${matchTypeLabel()}</small></div><button class="table-info-button detail-avatar-upload" id="upload-player-avatar" type="button">上传头像</button></div><div class="detail-section player-name-editor"><div class="detail-section-title">玩家名称</div><div class="player-name-editor-row"><input id="player-name-input" type="text" maxlength="${MAX_PLAYER_NAME_LENGTH}" value="${playerName}" aria-label="玩家名称" autocomplete="nickname" /><button class="table-info-button" id="save-player-name" type="button">保存名称</button></div><small class="player-name-editor-note">最多 ${MAX_PLAYER_NAME_LENGTH} 个字符，名称只保存在本机。</small></div><div class="detail-section"><div class="detail-section-title">玩家头像</div><div class="player-avatar-controls"><span>${playerAvatar ? '已上传自定义头像' : '当前使用默认头像'}</span><button class="tiny-button" id="reset-player-avatar" type="button" ${playerAvatar ? '' : 'disabled'}>恢复默认</button></div><small class="player-name-editor-note">支持 PNG、JPG、WebP，图片会裁切为方形并保存在本机。</small></div><div class="detail-section"><div class="detail-section-title">已装备名片</div>${equippedCard ? `<img class="detail-card-art" src="${collectionAsset('cards', equippedCard)}" alt="已装备名片" />` : '<div class="detail-empty">尚未装备名片</div>'}</div><div class="detail-section"><div class="detail-section-title">已装备勋章</div><div class="detail-medal-row">${Array.from({ length: 3 }, (_, index) => medals[index] ? `<img src="${collectionAsset('medals', medals[index])}" alt="已装备勋章" />` : '<span>空槽</span>').join('')}</div></div>`;
    els.detailModalContent.querySelector('#upload-player-avatar')?.addEventListener('click', () => els.playerAvatarInput?.click());
    els.detailModalContent.querySelector('#reset-player-avatar')?.addEventListener('click', resetPlayerAvatar);
    const nameInput = els.detailModalContent.querySelector('#player-name-input');
    const saveNameButton = els.detailModalContent.querySelector('#save-player-name');
    const commitPlayerName = () => {
      state.playerName = normalizePlayerName(nameInput?.value);
      savePlayerName();
      renderPlayerNameUI();
      renderPlayerCollection();
      renderDetailModal('player');
      showToast(`玩家名称已更新为「${state.playerName}」`);
    };
    saveNameButton?.addEventListener('click', commitPlayerName);
    nameInput?.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); commitPlayerName(); } });
    return;
  }
  if (mode === 'table') {
    els.detailModalKicker.textContent = 'TABLE DETAILS';
    els.detailModalTitle.textContent = '牌桌详情';
    els.detailModalSubtitle.textContent = '牌桌编号和详细规则不再占用主牌桌空间。';
     els.detailModalContent.innerHTML = `<div class="detail-stat-grid"><div><span>牌桌编号</span><b>${els.room?.textContent || state.room}</b></div><div><span>胜负规则</span><b>六回合比总分</b></div><div><span>对局类型</span><b>${matchTypeLabel()}</b></div><div><span>当前余额</span><b>${formatGroschen(state.wallet?.groschen || 0)}</b></div><div><span>牌桌倍率</span><b>x${getTableMultiplier()}</b></div><div><span>最高结算</span><b>x${LOSS_MULTIPLIER_CAP}</b></div></div><div class="detail-section detail-rules-callout"><div><b>详细规则说明</b><small>点数、顺子、倍率、爆骰与热骰规则保留在规则册中。</small></div><button class="table-info-button" id="detail-open-rules" type="button">打开规则</button></div>`;
    const tableStats = els.detailModalContent.querySelectorAll('.detail-stat-grid > div');
    if (tableStats[5]) { tableStats[5].querySelector('span').textContent = '个人风险'; tableStats[5].querySelector('b').textContent = '按规则结算'; }
    const tableRulesNote = els.detailModalContent.querySelector('.detail-rules-callout small');
    if (tableRulesNote) tableRulesNote.textContent = '点数、顺子、倍率、爆骰与热骰规则保留在规则册中。';
    els.detailModalContent.querySelector('#detail-open-rules')?.addEventListener('click', () => { closeDetailModal(); openCodex(0); });
    return;
  }
  const profile = opponents[state.opponentId] || opponents.milo;
  els.detailModalKicker.textContent = 'OPPONENT DETAILS';
  els.detailModalTitle.textContent = profile.name;
  els.detailModalSubtitle.textContent = '对手骰子组合与性格标签已移出主牌桌。';
  els.detailModalContent.innerHTML = `<div class="detail-profile-line"><div class="detail-avatar opponent-avatar"><img src="${profile.avatar}" alt="${profile.name}头像" /></div><div><b>${profile.role}</b><small>${profile.short} · 六回合总分制</small></div><span class="role-chip">${profile.riskLabel}</span></div><div class="detail-section"><div class="detail-section-title">打法性格</div><div class="detail-trait-row">${profile.traits.map((trait) => `<span>${trait}</span>`).join('')}</div><p class="detail-note">${profile.style}。AI 会根据当前分差、爆骰风险和剩余骰子动态调整决定。</p></div><div class="detail-section"><div class="detail-section-title">对手骰子组合</div><div class="detail-dice-grid">${profile.loadout.map((id, index) => { const die = dieById(id); const max = Math.max(...die.weights); const favored = die.weights.map((weight, value) => weight === max ? value + 1 : null).filter(Boolean).join('、'); return `<div class="detail-die-row"><span>${index + 1}</span><b>${die.name}</b><small>${die.desc} · 偏好 ${favored || '均衡'}</small></div>`; }).join('')}</div></div>`;
}

function openDetailModal(kind = 'opponent') {
  closeOpponentModal(); closeDiceBoxModal(); closeBoardMenu(); closeCollection();
  renderDetailModal(kind);
  els.detailModal?.classList.remove('hidden');
  document.body.classList.add('hub-modal-open');
}

function closeDetailModal() {
  els.detailModal?.classList.add('hidden');
  if (els.opponentModal?.classList.contains('hidden') && els.diceBoxModal?.classList.contains('hidden')) document.body.classList.remove('hub-modal-open');
}

function closeRestartModal() {
  els.restartModal?.classList.add('hidden');
  if (els.opponentModal?.classList.contains('hidden') && els.diceBoxModal?.classList.contains('hidden') && els.detailModal?.classList.contains('hidden')) {
    document.body.classList.remove('hub-modal-open');
  }
}

function renderRestartModal() {
  if (!els.restartModalCopy || !els.restartSettlementPreview) return;
  const active = Boolean(state.match?.active && !state.gameOver);
  const type = state.match?.type === 'stake' ? 'stake' : 'practice';
  const stake = Math.max(0, Number(state.match?.stake) || 0);
  const tableMultiplier = getTableMultiplier();
  const loss = type === 'stake' ? stake * tableMultiplier : 0;
  els.restartModalTitle.textContent = active ? '放弃本局并重新开局？' : '重新开始这张牌桌？';
  if (type === 'stake' && active) {
    els.restartModalCopy.textContent = '正式赌局中途重开会按败局处理，当前牌局不会被无成本取消。';
    els.restartSettlementPreview.innerHTML = `<div><span>基础赌注</span><b>${formatGroschen(stake)}</b></div><div><span>当前牌桌倍率</span><b>x${tableMultiplier}</b></div><div><span>新局起始倍率</span><b>x1</b></div><div class="is-loss"><span>本次放弃扣除</span><b>−${formatGroschen(loss)}</b></div>`;
    els.restartConfirm.textContent = '结算并重开';
  } else if (type === 'practice' && active) {
    els.restartModalCopy.textContent = '练习桌不会扣除格罗申，但当前回合与暂存分数会全部清空。';
    els.restartSettlementPreview.innerHTML = `<div><span>牌桌类型</span><b>免费练习桌</b></div><div><span>当前暂存分数</span><b>${Math.max(0, state.roundScore || 0)} 分</b></div><div class="is-safe"><span>钱包变化</span><b>不扣除格罗申</b></div>`;
    els.restartConfirm.textContent = '清空并重开';
  } else {
    els.restartModalCopy.textContent = '当前牌局已经结算，重新开始不会产生额外费用。';
    els.restartSettlementPreview.innerHTML = `<div><span>对手</span><b>${opponents[state.opponentId]?.name || '对手'}</b></div><div class="is-safe"><span>钱包变化</span><b>不产生额外结算</b></div>`;
    els.restartConfirm.textContent = '重新开局';
  }
}

function openRestartModal() {
  if (!els.restartModal || els.arena?.classList.contains('hidden')) return;
  closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal();
  renderRestartModal();
  els.restartModal.classList.remove('hidden');
  document.body.classList.add('hub-modal-open');
  els.restartCancel?.focus();
}

function confirmRestart() {
  const wasActive = Boolean(state.match?.active && !state.gameOver);
  const type = state.match?.type === 'stake' ? 'stake' : 'practice';
  const opponentId = state.opponentId;
  let settlementMessage = '';
  if (wasActive && type === 'stake') {
    const settlement = settleMatch('opponent');
    settlementMessage = settlement.message || '';
  }
  closeRestartModal();
  // Keep the selected opponent and table type, but create a fresh match record.
  state.opponentId = opponentId;
  state.match.type = type;
  if (!beginMatch()) {
    // The loss is already settled; if the wallet can no longer cover a new game,
    // return to opponent selection instead of leaving an inactive table visible.
    showHome();
    openOpponentModal({ preserveType: true });
    showToast('本局已结算，但余额不足以再次进入该正式牌局');
    return;
  }
  resetGame(false);
  showToast(settlementMessage ? `${settlementMessage} · 已重新开局` : type === 'practice' ? '练习桌已清空并重新开始' : '已重新开局 · 新局从 x1 开始');
}

function beginMatch() {
  const type = state.match.type === 'stake' ? 'stake' : 'practice';
  const stake = type === 'stake' ? (OPPONENT_STAKES[state.opponentId] || 0) : 0;
  const maxRisk = stake * LOSS_MULTIPLIER_CAP;
  if (!state.wallet) state.wallet = loadWallet();
  if (type === 'stake' && state.wallet.groschen < maxRisk) { renderOpponentModal(); showToast(`余额不足：至少需要准备 ${formatGroschen(maxRisk)}（最高倍率 x${LOSS_MULTIPLIER_CAP}）`); return false; }
  state.match = { type, stake, entryPaid: false, settled: false, active: true, result: null, payout: 0, multiplier: DEFAULT_TABLE_MULTIPLIER, scoreMultiplier: DEFAULT_TABLE_MULTIPLIER, maxRaiseBy: { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }, lastRaisedBy: null, lastRaiseRound: 0, raiseCount: 0, hasSuccessfulBank: false, pendingRaise: null, maxRisk };
  return true;
}

function setBoardTheme(id) {
  const theme = BOARD_THEMES[id];
  if (!theme || !theme.enabled) { showToast('该棋盘主题将在后续版本加入'); return; }
  state.boardTheme = id;
  saveBoardTheme(id);
  applyBoardTheme(id);
  els.boardCards?.forEach((card) => card.classList.toggle('selected', card.dataset.boardTheme === id));
  closeBoardMenu();
  showToast(`已装备棋盘：${theme.name}`);
}
function applyBoardTheme(id) {
  const theme = BOARD_THEMES[id] || BOARD_THEMES['tavern-oak'];
  document.body.dataset.boardTheme = id;
  document.documentElement.style.setProperty('--board-base-image', `url("${theme.base}")`);
  document.documentElement.style.setProperty('--board-wear-image', `url("${theme.wear}")`);
  document.documentElement.style.setProperty('--board-ornament-image', theme.ornaments ? `url("${theme.ornaments}")` : 'none');
  document.documentElement.style.setProperty('--board-highlight-image', theme.highlight ? `url("${theme.highlight}")` : 'none');
  document.documentElement.style.setProperty('--board-light-alpha', theme.boardLightAlpha || '.16');
  document.documentElement.style.setProperty('--board-vignette-opacity', theme.boardVignette || '.82');
  document.documentElement.style.setProperty('--board-wear-opacity', theme.wearOpacity || '.52');
  document.documentElement.style.setProperty('--board-light-profile', theme.lightProfile || 'tavern');
  document.documentElement.style.setProperty('--board-accent', theme.accent);
  const hex = theme.accent.replace('#', '');
  if (hex.length === 6) document.documentElement.style.setProperty('--board-accent-rgb', `${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}`);
}
function openBoardMenu() {
  els.boardMenu?.classList.remove('hidden');
  els.boardButton?.setAttribute('aria-expanded', 'true');
  els.boardButton?.classList.add('active');
}
function closeBoardMenu() {
  els.boardMenu?.classList.add('hidden');
  els.boardButton?.setAttribute('aria-expanded', 'false');
  els.boardButton?.classList.remove('active');
  document.querySelector('.nav-item[data-view="game"]')?.classList.add('active');
}
function toggleBoardMenu() {
  if (els.boardMenu?.classList.contains('hidden')) openBoardMenu(); else closeBoardMenu();
}
function showHome() {
  if (!els.arena?.classList.contains('hidden') && state.match?.active && !state.gameOver) finishGame('opponent');
  window.clearTimeout(turnTimer); clearOpponentActionTimer(true); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal(); closeRestartModal(); dicePhysics3D.resetOwner?.('opponent'); els.arena.classList.add('hidden'); els.home.classList.remove('hidden');
}
function startGame() {
  if (!beginMatch()) return;
  safeAudio('startMusic'); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); resetGame(false); els.home.classList.add('hidden'); els.arena.classList.remove('hidden'); window.requestAnimationFrame(() => dicePhysics3D.resize?.()); showToast(`${matchTypeLabel()} · 与 ${opponents[state.opponentId].name} 开始对局`);
}

els.roll.addEventListener('click', rollDice); els.bank.addEventListener('click', bankScore); els.restoreLoadout?.addEventListener('click', restoreDefaultLoadout); $('#reset-button')?.addEventListener('click', openRestartModal); els.restart?.addEventListener('click', openRestartModal); els.homeButton.addEventListener('click', showHome); $('#forfeit-button').addEventListener('click', () => { if (!state.gameOver) finishGame('opponent'); });
els.restartModalClose?.addEventListener('click', closeRestartModal); els.restartCancel?.addEventListener('click', closeRestartModal); els.restartConfirm?.addEventListener('click', confirmRestart); els.restartModal?.addEventListener('click', (event) => { if (event.target === els.restartModal) closeRestartModal(); });
window.addEventListener('keydown', (event) => { if (event.code === 'Space' && !event.repeat) { event.preventDefault(); rollDice(); } if (event.code === 'KeyF' && !event.repeat) { takeScoringDice(); rollDice(); } if (event.code === 'KeyE' && !event.repeat) takeScoringDice(); if (event.code === 'KeyQ' && !event.repeat) bankScore(); if (event.code === 'KeyT' && !event.repeat) openCodex(0); if (event.code === 'KeyR' && !event.repeat) { event.preventDefault(); openRestartModal(); } if (event.code === 'Escape') { closeCodex(); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal(); closeRestartModal(); } });
  els.collectionTabs?.forEach((tab) => tab.addEventListener('click', () => openCollection(tab.dataset.collectionTab))); els.collectionClose?.addEventListener('click', closeCollection); els.openMedalCollection?.addEventListener('click', () => openCollection('medals'));
els.opponentModalClose?.addEventListener('click', closeOpponentModal); els.opponentModal?.addEventListener('click', (event) => { if (event.target === els.opponentModal) closeOpponentModal(); }); els.matchTypeButtons?.forEach((button) => button.addEventListener('click', () => setMatchType(button.dataset.matchType))); els.opponentModalConfirm?.addEventListener('click', startGame);
els.diceBoxClose?.addEventListener('click', closeDiceBoxModal); els.diceBoxModal?.addEventListener('click', (event) => { if (event.target === els.diceBoxModal) closeDiceBoxModal(); });
els.detailModalClose?.addEventListener('click', closeDetailModal); els.detailModal?.addEventListener('click', (event) => { if (event.target === els.detailModal) closeDetailModal(); }); els.playerDetailsButton?.addEventListener('click', () => openDetailModal('player')); els.opponentDetailsButton?.addEventListener('click', () => openDetailModal('opponent')); els.tableInfoButton?.addEventListener('click', () => openDetailModal('table')); els.rulesButton?.addEventListener('click', () => openCodex(0));
els.multiplierButtons?.forEach((button) => button.addEventListener('click', () => raiseTableMultiplier(button.dataset.multiplier, 'player')));
els.multiplierAccept?.addEventListener('click', () => {
  if (state.match?.pendingRaise?.proposer === 'ai') resolveRaiseOffer(true);
});
els.multiplierDecline?.addEventListener('click', () => {
  if (state.match?.pendingRaise?.proposer === 'ai') resolveRaiseOffer(false);
});
$('#guide-button')?.addEventListener('click', () => openCodex(1)); els.homeRulesButton?.addEventListener('click', () => openCodex(0)); $('#open-dice-library')?.addEventListener('click', () => openCodex(2)); $('#modal-close').addEventListener('click', closeCodex); els.codexModal.addEventListener('click', (event) => { if (event.target === els.codexModal) closeCodex(); }); els.prev.addEventListener('click', () => setCodexPage(currentPage - 1)); els.next.addEventListener('click', () => setCodexPage(currentPage + 1));
 document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => { if (item.dataset.view === 'boards') return; if (item.dataset.view === 'collection' || item.dataset.view === 'dice-collection') { openCollection(item.dataset.collectionTab); return; } document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.toggle('active', nav === item)); if (item.dataset.view === 'game') { closeBoardMenu(); closeCollection(); } }));
function toggleSound() {
  const next = !audio.muted;
  audio.setMuted(next);
  els.soundToggle.textContent = next ? '◗' : '◖';
  els.soundToggle.setAttribute('aria-pressed', String(next));
  updateMusicPlaybackUI();
  showToast(next ? '声音已静音' : '声音已开启');
  if (!next) { safeAudio('startMusic'); safeAudio('playClick'); }
}
function updateMusicPlaybackUI() {
  const button = els.musicPlayToggle;
  if (!button) return;
  const available = Boolean(audio.musicAvailable);
  const playing = audio.musicPlaying;
  button.textContent = available ? (playing ? 'Ⅱ' : '▶') : '—';
  button.disabled = !available;
  button.classList.toggle('is-playing', playing);
  button.setAttribute('aria-pressed', String(playing));
  button.setAttribute('aria-label', available ? (playing ? '暂停背景音乐' : '播放背景音乐') : '暂无背景音乐');
  button.title = available ? (playing ? '暂停背景音乐' : '播放背景音乐') : '背景音乐资源已移除';
}
function updateMusicVolumeUI(value) {
  const normalized = audio.setMusicVolume(value);
  if (els.musicVolume) els.musicVolume.value = String(normalized);
  if (els.musicVolume) els.musicVolume.disabled = !audio.musicAvailable;
  if (els.musicVolumeValue) els.musicVolumeValue.textContent = audio.musicAvailable ? `${normalized}%` : '—';
  if (els.musicVolume) els.musicVolume.style.setProperty('--music-progress', `${normalized}%`);
  return normalized;
}
if (els.musicVolume) {
  updateMusicVolumeUI(audio.musicVolume);
  els.musicVolume.addEventListener('input', (event) => updateMusicVolumeUI(event.target.value));
  els.musicVolume.addEventListener('change', (event) => {
    const value = updateMusicVolumeUI(event.target.value);
    showToast(value === 0 ? '背景音乐已关闭' : `背景音乐音量：${value}%`);
  });
}
els.musicPlayToggle?.addEventListener('click', async () => {
  if (!audio.musicAvailable) { showToast('背景音乐资源已移除，骰子音效仍可正常使用'); return; }
  const playing = await audio.toggleMusic();
  updateMusicPlaybackUI();
  showToast(playing ? '背景音乐播放中' : '背景音乐已暂停');
});
updateMusicPlaybackUI();
$('#mode-toggle').addEventListener('click', toggleMode); els.soundToggle.addEventListener('click', toggleSound); $('#profile-button').addEventListener('click', () => openDetailModal('player')); els.playerAvatarInput?.addEventListener('change', handlePlayerAvatarUpload); $('#copy-room').addEventListener('click', async () => { try { await navigator.clipboard.writeText(els.room.textContent); showToast('牌桌编号已复制'); } catch { showToast(`牌桌编号：${els.room.textContent}`); } });
els.boardButton?.addEventListener('click', toggleBoardMenu);
els.boardCards?.forEach((card) => card.addEventListener('click', () => setBoardTheme(card.dataset.boardTheme)));
document.addEventListener('click', (event) => { if (!els.boardMenu || els.boardMenu.classList.contains('hidden')) return; if (!els.boardMenu.contains(event.target) && !els.boardButton?.contains(event.target)) closeBoardMenu(); });
 document.querySelectorAll('.opponent-card').forEach((card) => card.addEventListener('click', () => selectOpponent(card.dataset.opponent, { reset: true }))); document.querySelectorAll('.home-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.home-tab').forEach((item) => item.classList.toggle('active', item === tab)); state.mode = tab.dataset.homeMode; els.modeLabel.textContent = state.mode === 'online' ? '联机演示' : '本地练习'; })); els.startGame.addEventListener('click', openOpponentModal); els.homeLoadout.addEventListener('click', () => openCollection('dice-loadout'));

function onDiceSelected(diceId, value) {
  const parts = String(diceId).split('-');
  if (parts[0] !== 'player') return false;
  const index = Number(parts[1]);
  if (Number.isInteger(index)) return toggleDie(index, '3d');
  return false;
}
dicePhysics3D.onDiceSelected?.(onDiceSelected);
dicePhysics3D.onDragRoll?.((dx, dy) => {
  // 空白牌桌上的拖动不能替代首掷；只有已经完成一掷后，
  // 明确拖动骰子层才允许触发带方向的再次投掷。
  if (state.turn === 'player' && state.hasRolled && !state.rolling && !state.gameOver) rollDice({ x: dx, y: dy });
});

document.addEventListener('pointerdown', (event) => { if (!event.target.closest('#music-play-toggle')) safeAudio('startMusic'); }, { once: true });

state.collection = loadCollection();
state.diceSkinCollection = loadDiceSkinCollection();
state.lottery = loadLottery();
const playerProfile = loadPlayerProfile();
state.playerName = playerProfile.name;
state.playerAvatar = playerProfile.avatar;
state.wallet = loadWallet();
renderPlayerNameUI();
renderWallet();
applyBoardTheme(state.boardTheme);
els.boardCards?.forEach((card) => card.classList.toggle('selected', card.dataset.boardTheme === state.boardTheme));
setCodexPage(0); resetGame(false); showHome();
  try { dicePhysics3D.init(); applyEquippedDiceSkin(); } catch (error) { console.warn('[dice:init]', error); }
