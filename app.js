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

// 外观皮肤与功能骰子严格分离：皮肤只改变 3D 材质，不改变点数权重、计分或 AI。
const DICE_SKINS = Object.freeze([
  { id: 'default', name: '普通骰 · 原木', description: '墙洞酒馆默认骰子，朴素耐用。', price: 0, paid: false, collectionGroup: 'default', unlock: '初始拥有', bodyColor: '#c68a4b', pipColor: '#422512', roughness: .82, metalness: 0 },
  { id: 'tavern-oak-brass', name: '墙洞酒馆 · 黑橡木铜箍', description: '深色黑橡木骰体，配以磨旧黄铜点数。', price: 120, paid: true, collectionGroup: 'tavern', unlock: '酒馆商柜：120 格罗申', bodyColor: '#2b1b12', pipColor: '#c59a4e', roughness: .86, metalness: .18 }
]);
const DICE_SKIN_STORAGE_KEY = 'wallhole-dice-skins-v1';
const DEFAULT_DICE_SKIN_COLLECTION = Object.freeze({ ownedSkins: ['default'], purchasedSkins: [], equippedSkin: 'default' });

const opponents = {
  // AI 参数描述的是偏好，不是固定脚本。比分、剩余骰子和爆骰风险会在每回合动态修正它们。
  milo: { name: '米洛 · 老练', role: '老练旅人', short: '稳健型 · 喜欢在第二掷收集', style: '重视小胜 · 偶有失手', riskLabel: '稳健', traits: ['二掷收手', '重视小胜', '偶有失手'], avatar: '米洛.jpg', status: '等待你的投掷', bankAt: 325, riskTolerance: 0.27, continuationWeight: 0.6, mistakeRate: 0.1, hotDiceBias: 0.05, comebackPressure: 0.16, comboBias: { straight: 0.08, triple: 0.03 }, loadout: ['ordinary', 'ordinary', 'careful', 'evil-two', 'odd', 'ordinary'] },
  vlad: { name: '瓦茨拉夫 · 赌徒', role: '高风险赌徒', short: '冒险型 · 追逐热骰与大顺', style: '敢押大注 · 情绪起伏', riskLabel: '冒险', traits: ['追逐热骰', '偏爱大顺', '情绪化'], avatar: '瓦茨拉夫.jpg', status: '准备冒险一掷', bankAt: 620, riskTolerance: 0.78, continuationWeight: 1.12, mistakeRate: 0.16, hotDiceBias: 0.42, comebackPressure: 0.72, comboBias: { straight: 0.26, triple: 0.18 }, loadout: ['lucky', 'odd', 'odd', 'kingdom', 'painted', 'devil'] },
  marta: { name: '玛蒂娜 · 酒馆老板', role: '墙洞酒馆老板', short: '账房型 · 先算风险再收分', style: '领先时封锁分差 · 落后时只追有把握的牌面', riskLabel: '谨慎', traits: ['稳定收集', '领先封锁', '算账追分'], avatar: '酒馆老板娘.jpg', status: '从不贪杯', bankAt: 300, riskTolerance: 0.22, riskLimit: 0.22, continuationWeight: 0.72, mistakeRate: 0.035, hotDiceBias: 0.06, comebackPressure: 0.42, comboBias: { straight: 0.08, triple: 0.04 }, lookaheadSamples: 14, lookaheadWeight: 0.18, loadout: ['careful', 'ordinary', 'careful', 'ordinary', 'loaded', 'ordinary'] },
  musa: { name: '马里的穆萨', role: '宫廷医者 · 学者', short: '读桌型 · 根据局势调整风险', style: '擅长概率判断，偶尔也会被自己的推断误导', riskLabel: '大师', traits: ['读桌判断', '小顺专家', '临场纠错'], avatar: '穆萨.jpg', status: '审视牌面与风险', bankAt: 470, riskTolerance: 0.31, continuationWeight: 0.88, mistakeRate: 0.07, hotDiceBias: 0.22, comebackPressure: 0.48, comboBias: { straight: 0.22, triple: 0.12 }, loadout: ['ordinary', 'wisdom', 'careful', 'ordinary', 'odd', 'wisdom'] }
};
const DEFAULT_LOADOUT = Object.freeze(['ordinary', 'ordinary', 'ordinary', 'ordinary', 'ordinary', 'ordinary']);

const COLLECTION_REWARDS = Object.freeze({
  milo: { card: 'card-portrait-landscape-01.png', medal: 'medal-01-dragon.png', medalName: '赤龙纹章', cardName: '老练旅人的名片' },
  vlad: { card: 'card-portrait-landscape-02.png', medal: 'medal-02-wheat.png', medalName: '三束麦穗', cardName: '赌徒的名片' },
  marta: { card: 'card-portrait-landscape-03.png', medal: 'medal-03-red-sack.png', medalName: '酒囊纹章', cardName: '酒馆老板的名片' }
});
const PAID_NAME_CARDS = Object.freeze([
  { file: 'card-landscape-01.png', name: '晨雾里的拉泰', description: '城墙外的第一缕晨光', price: 60 },
  { file: 'card-landscape-02.png', name: '萨扎瓦河湾', description: '河水绕过旧木桥', price: 75 },
  { file: 'card-landscape-03.png', name: '秋日麦田', description: '收获季的金色田埂', price: 90 },
  { file: 'card-landscape-04.png', name: '林间小路', description: '通往酒馆的土路', price: 105 },
  { file: 'card-landscape-05.png', name: '城堡远眺', description: '山脊上的石墙与钟楼', price: 120 },
  { file: 'card-landscape-06.png', name: '烛火窗台', description: '夜里仍有人守着酒馆', price: 150 },
  { file: 'card-landscape-07.png', name: '旧城集市', description: '商贩收摊前的喧闹', price: 180 },
  { file: 'card-landscape-08.png', name: '葡萄园坡地', description: '晚夏的葡萄藤与石墙', price: 225 }
]);
const OIL_PAINT_DLC_CARDS = Object.freeze([
  { file: 'C1.jpg', name: '油画 DLC · 01', description: '油画系列名片 · 第一幅', price: 500 },
  { file: 'C2.jpg', name: '油画 DLC · 02', description: '油画系列名片 · 第二幅', price: 650 },
  { file: 'C3.jpg', name: '油画 DLC · 03', description: '油画系列名片 · 第三幅', price: 800 },
  { file: 'C4.jpg', name: '油画 DLC · 04', description: '油画系列名片 · 第四幅', price: 950 },
  { file: 'C5.jpg', name: '油画 DLC · 05', description: '油画系列名片 · 第五幅', price: 1100 },
  { file: 'C6.jpg', name: '油画 DLC · 06', description: '油画系列名片 · 第六幅', price: 1250 },
  { file: 'C7.jpg', name: '油画 DLC · 07', description: '油画系列名片 · 第七幅', price: 1400 },
  { file: 'C8.jpg', name: '油画 DLC · 08', description: '油画系列名片 · 第八幅', price: 1500 }
]);
const OIL_PAINT_DLC_FILES = new Set(OIL_PAINT_DLC_CARDS.map((card) => card.file));
const OPPONENT_STAKES = Object.freeze({ milo: 10, vlad: 50, marta: 100, musa: 300 });
// 每位对手拥有独立的获胜目标；牌桌状态、AI 决策和结算都统一读取这里。
const OPPONENT_TARGETS = Object.freeze({ milo: 2000, vlad: 2000, marta: 3000, musa: 4000 });
function getOpponentTarget(opponentId = 'milo') { return OPPONENT_TARGETS[opponentId] || OPPONENT_TARGETS.milo; }
const PRACTICE_REWARD = 5;
const MULTIPLIER_STEPS = Object.freeze([1, 2, 3, 5]);
const LOSS_MULTIPLIER_CAP = 2;
const DEFAULT_TABLE_MULTIPLIER = 1;
const COLLECTION_STORAGE_KEY = 'wallhole-collection-v1';
const DEFAULT_COLLECTION = Object.freeze({ unlockedCards: [], unlockedMedals: [], purchasedCards: [], equippedCard: null, equippedMedals: [] });
const WALLET_STORAGE_KEY = 'wallhole-wallet-v1';
const DEFAULT_WALLET = Object.freeze({ groschen: 100, lifetimeEarned: 0, lifetimeSpent: 0, lastSettlement: null });
const AI_TIMING = Object.freeze({
  firstThink: 1350,
  afterRollThink: 1250,
  afterKeepThink: 1200,
  afterDecision: 1150,
  afterBank: 1450,
  afterFarkle: 1650,
  hotDicePause: 1500
});

// AI 台词不是固定脚本：同一事件会根据角色、当前分数、剩余骰子和领先/落后情况
// 从不同语气池里抽取，连续出现的句子也会被短暂排除，保证牌桌动态更像真人。
const AI_DIALOGUE = Object.freeze({
  milo: {
    opening: ['先看看你的起手，我不急着把好牌全押上。', '慢慢来，桌面上的每个点数都值得算一遍。', '你先掷，我听听骰子落桌的声音。'],
    raise: [({ multiplier }) => `我把牌桌抬到 x${multiplier}，只多走一步。`, ({ multiplier }) => `x${multiplier} 可以，先把风险记在账上。`],
    playerRaise: [({ multiplier }) => `你把倍率推到 x${multiplier} 了？我会按这个数字重新算。`, ({ multiplier }) => `x${multiplier} 不算小，我不会白送下一掷。`],
    rollHigh: ['这组点数有点意思，先别让贪心替我做决定。', '不错，但还没到把账本合上的时候。', '好牌要留余地，我再观察一轮。'],
    rollPositive: ['先拿稳眼前的分数，剩下的再说。', '有得分就不算白掷，关键是别把它浪费掉。', '这桌面还算老实，继续看一眼。'],
    rollBad: ['这一掷不漂亮，我得重新排一遍算盘。', '点数散了，别急，稳住再来。', '骰子今天有自己的脾气。'],
    keepBig: ['这手值得记进账本，不过还不能掉以轻心。', '大组合先收好，接下来只做有把握的事。'],
    keepMid: ['一口一口吃，分数总会堆起来。', '先把中间这块稳住，别让它白白溜走。'],
    keepSmall: ['小分也是分，我宁愿稳稳拿走。', '别小看这几个点，酒馆里常说积少成多。'],
    bank: ['账面已经够好看了，先把它收进袋里。', '风险开始超过收益，见好就收是老手的规矩。', '我先把这笔记下，下一轮再谈更大的。'],
    continue: ['再看一掷，但只走稳路。', '还有余地，我再给骰子一次机会。', '不冒无谓的险，继续。'],
    farkle: ['啧，算盘打错了一格，这轮算我失手。', '骰子不肯给面子，只能把这轮划掉。', '这下确实贪过头了，记住这个教训。'],
    hotDice: ['六枚都收进来了，热骰也得按规矩来。', '好，桌面重新清空；下一轮更要小心。'],
    playerBank: ['你收得很及时，我会按这个分数重新算风险。', '这笔分数拿得干净，看来你不打算白送机会。'],
    playerFarkle: ['爆骰了？那我会把这笔运气记在心里。', '你这一掷没留下分数，桌面暂时对我有利。']
  },
  vlad: {
    opening: ['来，把骰盅推过来！今晚我可不满足于小钱。', '先给我一掷热闹的，安静的牌局没意思。', '你先来，我要看看这桌子愿不愿意站在我这边。'],
    raise: [({ multiplier }) => `x${multiplier}！这才像一张真正的牌桌。`, ({ multiplier }) => `我把筹码推到 x${multiplier}，谁都别想退回去。`],
    playerRaise: [({ multiplier }) => `你敢推到 x${multiplier}？很好，我就等着这一刻。`, ({ multiplier }) => `x${multiplier} 已经点火了，别指望我替你踩刹车。`],
    rollHigh: ['漂亮！这种点数不追一把，回头会后悔。', '这不是收手的信号，这是加注的信号。', '骰子已经开口了，我得听完它要说什么。'],
    rollPositive: ['有分就追，别给机会喘气。', '还行，火候刚起来，再压一次。', '小胜也是风向，继续把势头做大。'],
    rollBad: ['散得难看，但我不信它会一直坏下去。', '这一掷不给面子？那就用下一掷扳回来。', '风险上来了，正合我意。'],
    keepBig: ['这手够硬，先留着，下一掷我要把桌面掀起来。', '大牌到手，当然不能只拿这么一点。'],
    keepMid: ['中等分数？可以，当作下一次加注的筹码。', '先吃进去，等热度起来再狠狠干一把。'],
    keepSmall: ['小分不嫌少，凑够气势就能变大。', '先拿着，别让一颗好骰子白滚。'],
    bank: ['这次先收，但不是因为怕，是为了下一轮押更大的。', '好，利润落袋；下一把我要把差距拉开。', '收下这笔，别以为我就改走保守路线了。'],
    continue: ['还没到极限，再来！', '机会就在下一掷，谁先眨眼谁输。', '继续加压，我要看看它能不能给我一手大的。'],
    farkle: ['哈！这次骰子赢了，但下一轮我会赢回来。', '爆了就爆了，真正的赌徒不会因为一轮皱眉。', '运气暂时站在你那边，别高兴太早。'],
    hotDice: ['热骰！这才像一张真正的牌桌。', '六枚全吃，下一轮我直接把风险拉满。'],
    playerBank: ['收得挺快嘛，是怕我追上来？', '你把分数装进口袋了，那我只好用更大的牌回敬。'],
    playerFarkle: ['爆骰？谢了，这桌面终于轮到我说话。', '你把机会丢了，我可不会替你捡回来。']
  },
  marta: {
    opening: ['先把桌面看清楚，酒馆的账不能算错。', '别急，骰盅会告诉我们今天的运气。', '你先请，我只在值得的时候出手。'],
    raise: [({ multiplier }) => `牌桌倍率到 x${multiplier}，我会把每一步都记清。`, ({ multiplier }) => `x${multiplier} 可以，但风险必须有上限。`],
    playerRaise: [({ multiplier }) => `你把倍率抬到 x${multiplier}，那就别在这一掷上浪费机会。`, ({ multiplier }) => `x${multiplier} 已经写进账本，我会按风险行事。`],
    rollHigh: ['这组牌面够分量，但还要看看风险值不值得。', '好牌不等于好时机，我先把账算完。', '可以，先留出退路，再决定是否继续。'],
    rollPositive: ['有分就先守住，稳妥比漂亮更重要。', '这笔收益合格，接下来只看风险。', '桌面还算安全，我再给它一次机会。'],
    rollBad: ['点数太散，继续硬掷只会把账做坏。', '这一掷不合算，我会把风险记高一些。', '骰子不给分，就不要拿面子去赌。'],
    keepBig: ['这手分数够厚，先放进账本，不让它回桌。', '大分已经到手，接下来要守住它。'],
    keepMid: ['中规中矩，正好。稳稳积累才是长久生意。', '这笔可以，别为了多一点把整轮都赔进去。'],
    keepSmall: ['小分也能垒成墙，先收下。', '先把能拿的拿走，剩下的交给下一轮。'],
    bank: ['账面达到安全线，收。', '风险不再划算，及时结算。', '这轮够用了，我不把利润留给骰子。'],
    continue: ['风险还在可控范围，再掷一次。', '再看一掷，但只要风向变坏就收手。', '可以继续，不过我会盯着每一枚骰子。'],
    farkle: ['爆骰，记账归零。下一轮重新来过。', '这轮没有得分，别让一次失手影响下一轮。', '骰子没给收益，生意就到此为止。'],
    hotDice: ['六枚全都结算，热骰也要留意风险。', '热骰是机会，也是账房最怕的麻烦。'],
    playerBank: ['你把分数收好，做得稳。现在轮到我重新评估。', '及时结算是聪明的选择，但我不会因此放松。'],
    playerFarkle: ['爆骰会让桌面重新平衡，我会利用这点优势。', '这一轮归零，下一轮别再把风险留给骰子。']
  },
  musa: {
    opening: ['先让我看看骰子的分布，再决定该走哪一步。', '每一张桌子都有自己的规律，先别急着替它下结论。', '你先请，我会把点数和风险一起记下来。'],
    raise: [({ multiplier }) => `我把倍率提到 x${multiplier}，这是计算后的选择，不是冲动。`, ({ multiplier }) => `x${multiplier}。风险已经写进账本，接下来只看牌面。`],
    playerRaise: [({ multiplier }) => `你把桌面抬到 x${multiplier}，那我得重新估算这一步的价值。`, ({ multiplier }) => `x${multiplier} 已经改变了收益结构，我不会只凭气势回应。`],
    rollHigh: ['这组点数值得认真看待，但好结果也需要及时收住。', '小顺的轮廓出来了，关键是别为了完整而浪费优势。', '牌面给了提示，我先保留最有价值的部分。'],
    rollPositive: ['有分数，也有继续观察的空间。', '这不是最好的组合，但足够说明骰子暂时站在这边。', '先把确定的收益分离出来，再看剩下的风险。'],
    rollBad: ['这一掷的样本太差，我刚才的判断需要修正。', '点数散开了，继续投掷的代价比刚才更高。', '骰子没有给答案，我不该替它补上结论。'],
    keepBig: ['高价值组合先留下，下一步只追有把握的变化。', '这一组足够改变局势，先把它从风险里拿出来。'],
    keepMid: ['中等收益可以接受，关键是留下足够的选择。', '先拿住这笔分数，剩余骰子仍有形成小顺的空间。'],
    keepSmall: ['小分不是浪费，它能让下一次判断更干净。', '先收下确定的点数，别让不确定性吞掉它。'],
    bank: ['判断已经足够清楚，先把分数收进账本。', '收益超过风险，继续投掷就不再合算。', '我接受这次结果，下一轮再重新观察。'],
    continue: ['还剩足够的选择，我再验证一次判断。', '风险尚未超过收益，再给骰子一次机会。', '继续，但只保留能解释得通的路线。'],
    farkle: ['骰子证明我错了，这一轮归零。', '我把概率看得太乐观，失手也算一种记录。', '没有得分，就没有继续解释的必要。'],
    hotDice: ['六枚骰子都已结算，重新开始一轮观察。', '热骰改变了样本数量，下一步需要重新估算。'],
    playerBank: ['你及时把收益收走了，我会把这个选择记入下一轮判断。', '这笔分数拿得很干净，看来你比刚才更谨慎。'],
    playerFarkle: ['爆骰让局面重新平衡，但不能把它当成必然趋势。', '你这一轮归零，我获得了机会，但还没有获得胜势。']
  }
});

// 棋盘主题配置：第一阶段只启用默认旧橡木，后续主题可直接追加资源和样式。
const BOARD_THEMES = Object.freeze({
  'tavern-oak': { name: '墙洞酒馆 · 旧橡木', status: '默认棋盘', base: 'assets/images/boards/tavern-oak/base.webp', wear: 'assets/images/boards/tavern-oak/wear.png', accent: '#d2b96a' },
  'noble-hall': { name: '贵族大厅 · 胡桃木', status: '后续加入', base: 'assets/images/boards/noble-hall/base.webp', wear: 'assets/images/boards/noble-hall/wear.png', accent: '#c7b59b' },
  'castle-feast': { name: '城堡宴席 · 石木桌', status: '后续加入', base: 'assets/images/boards/castle-feast/base.webp', wear: 'assets/images/boards/castle-feast/wear.png', accent: '#b7a47b' }
});

const state = {
  target: getOpponentTarget('milo'), playerTotal: 0, opponentTotal: 0, roundScore: 0, rollScoreBase: 0, activeRollIndices: [], round: 1, mode: 'solo',
  dice: [0, 0, 0, 0, 0, 0], locked: new Set(), hasRolled: false, rolling: false,
  turn: 'player', gameOver: false, room: 'WHT-731', equipSlot: 0,
  loadout: [...DEFAULT_LOADOUT],
  opponentId: 'milo', opponentLoadout: opponents.milo.loadout, boardTheme: 'tavern-oak',
  opponentDice: [], opponentActiveIndices: [], opponentKept: [], opponentKeptIndices: [],
  opponentRoundScore: 0, opponentRollScoreBase: 0, opponentRolling: false, opponentPhase: 'idle',
  collectionTab: 'cards', collection: null, diceSkinCollection: null, wallet: null,
  match: { type: 'practice', stake: 0, entryPaid: false, settled: false, active: false, result: null, payout: 0, multiplier: DEFAULT_TABLE_MULTIPLIER, maxRaiseBy: { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }, lastRaisedBy: null, lastRaiseOwner: null, lastRaiseRound: 0, raiseCount: 0, hasSuccessfulBank: false },
  aiDialogueHistory: [],
  playerHistory: { banks: [], farkles: 0 }
};

const $ = (selector) => document.querySelector(selector);
const els = {
  home: $('#home-screen'), arena: document.querySelector('.arena'), startGame: $('#start-game'), homeLoadout: $('#home-loadout'), homeCards: $('#opponent-cards'), homeTabs: document.querySelectorAll('.home-tab'), homeButton: $('#home-button'), restart: $('#restart-button'), ritual: $('#roll-ritual'), boardButton: $('#board-button'), boardMenu: $('#board-menu'), boardCards: document.querySelectorAll('.board-card'),
  walletBalance: $('#wallet-balance'), walletSubcopy: $('#wallet-subcopy'),
  opponentModal: $('#opponent-modal-backdrop'), opponentModalCards: $('#opponent-modal-cards'), opponentModalStatus: $('#opponent-modal-status'), opponentModalConfirm: $('#confirm-opponent'), opponentModalClose: $('#opponent-modal-close'), matchTypeButtons: document.querySelectorAll('[data-match-type]'),
  diceBoxModal: $('#dice-box-modal-backdrop'), diceBoxContent: $('#dice-box-content'), diceBoxClose: $('#dice-box-close'),
  detailModal: $('#detail-modal-backdrop'), detailModalKicker: $('#detail-modal-kicker'), detailModalTitle: $('#detail-modal-title'), detailModalSubtitle: $('#detail-modal-subtitle'), detailModalContent: $('#detail-modal-content'), detailModalClose: $('#detail-modal-close'), playerDetailsButton: $('#open-player-details'), opponentDetailsButton: $('#open-opponent-details'), tableInfoButton: $('#open-table-info'), rulesButton: $('#rules-button'),
  collectionScreen: $('#collection-screen'), collectionTitle: $('#collection-title'), collectionDescription: $('#collection-description'), collectionContent: $('#collection-content'), collectionSummary: $('#collection-summary'), collectionClose: $('#collection-close'), collectionTabs: document.querySelectorAll('.collection-tab'), cardsButton: $('#cards-button'), medalsButton: $('#medals-button'), diceSkinsButton: $('#dice-skins-button'), openMedalCollection: $('#open-medal-collection'),
  diceState: $('#dice-state'), roll: $('#roll-button'), rollLabel: $('#roll-label'),
  bank: $('#bank-button'), bankAmount: $('#bank-amount'), playerTotal: $('#player-total'),
  opponentRight: $('#opponent-total-right'), targetScore: $('#target-score'), targetScoreInline: document.querySelectorAll('.target-score-inline'), remaining: $('#remaining-dice'), comboName: $('#combo-name'),
  comboDetail: $('#combo-detail'), selectionScore: $('#selection-score'), turnLabel: $('#turn-label'), turnDetail: $('#turn-detail'), multiplierPanel: $('#multiplier-panel'), multiplierValue: $('#multiplier-value'), multiplierCap: $('#multiplier-cap'), multiplierHint: $('#multiplier-hint'), multiplierButtons: document.querySelectorAll('[data-multiplier]'),
  opponentName: $('#opponent-name'), opponentStatus: $('#opponent-status'), opponentAvatar: $('#opponent-avatar'), opponentRoleCopy: $('#opponent-role-copy'), opponentStyleCopy: $('#opponent-style-copy'), opponentRiskLabel: $('#opponent-risk-label'), opponentTraits: $('#opponent-traits'), opponentLoadoutSlots: $('#opponent-loadout-slots'), opponentState: $('#opponent-state'), opponentReaction: $('#opponent-reaction'), opponentRoundScore: $('#opponent-round-score'), opponentKeptCount: $('#opponent-kept-count'), opponentRemainingCount: $('#opponent-remaining-count'), opponentProgress: $('#opponent-progress'), opponentTargetCaption: $('#opponent-target-caption'), activity: $('#activity-list'),
  playerBoardTurn: $('#player-board-turn'), playerState: $('#player-state'), playerModeCopy: $('#player-mode-copy'), playerCardDisplay: $('#player-card-display'), playerMedalsDisplay: $('#player-medals-display'), playerRoundScore: $('#player-round-score'), playerKeptCount: $('#player-kept-count'), playerRemainingCount: $('#player-remaining-count'), playerProgress: $('#player-progress'), playerTargetCaption: $('#player-target-caption'),
  room: $('#room-code'), toast: $('#toast'), modeToggle: $('#mode-toggle'), modeLabel: $('#mode-label'),
  loadoutSlots: $('#loadout-slots'), restoreLoadout: $('#reset-loadout'),
  codexModal: $('#modal-backdrop'), codexTitle: $('#codex-title'), codexKicker: $('#codex-kicker'),
  codexPage: $('#codex-page'), codexContent: $('#codex-content'), codexDots: $('#page-dots'), prev: $('#page-prev'), next: $('#page-next'),
  tableStage: document.querySelector('.table-stage'), soundToggle: $('#sound-toggle'),
  musicVolume: $('#music-volume'), musicVolumeValue: $('#music-volume-value'),
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
  return `<span class="collection-art dice-skin-art dice-skin-art-${skin.id}" aria-hidden="true"><span class="dice-skin-preview">${faces.map((face) => `<span class="skin-preview-die">${pipFace(face)}</span>`).join('')}</span></span>`;
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
    opponent: opponents[opponentId].name,
    unlock: `击败 ${opponents[opponentId].name.split(' · ')[0]} 后解锁`,
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
      price: card.price,
      paid: true,
      collectionGroup: 'legacy',
      unlock: `画师费：${formatGroschen(card.price)}`
    })))
    .concat(OIL_PAINT_DLC_CARDS.map((card) => ({
      file: card.file,
      name: card.name,
      opponent: '油画 DLC 系列',
      description: card.description,
      price: card.price,
      paid: true,
      collectionGroup: 'oil-paint-dlc',
      unlock: `DLC 画作：${formatGroschen(card.price)}`
    })));
}

function renderCollection() {
  if (!els.collectionContent || !els.collectionSummary) return;
  const validTypes = ['cards', 'medals', 'dice-skins', 'dice-loadout'];
  const type = validTypes.includes(state.collectionTab) ? state.collectionTab : 'cards';
  if (!state.diceSkinCollection) state.diceSkinCollection = loadDiceSkinCollection();
  const viewMeta = {
    cards: { title: '名片', description: '胜利奖励名片免费解锁，风景名片与油画 DLC 可用格罗申购买；全部只用于展示。' },
    medals: { title: '勋章', description: '装备勋章会显示在玩家左侧角色面板中，最多同时展示三枚。' },
    'dice-skins': { title: '骰子皮肤', description: '购买或解锁骰子外观；皮肤只改变材质，不影响点数概率与计分。' },
    'dice-loadout': { title: '我的骰盒', description: '配置六个功能骰子槽位；不同骰子会改变对应点数的出现概率。' }
  }[type];
  if (els.collectionTitle) els.collectionTitle.textContent = viewMeta.title;
  if (els.collectionDescription) els.collectionDescription.textContent = viewMeta.description;
  const unlocked = type === 'cards' ? state.collection.unlockedCards : type === 'medals' ? state.collection.unlockedMedals : state.diceSkinCollection.ownedSkins;
  const equipped = type === 'cards' ? state.collection.equippedCard : type === 'medals' ? state.collection.equippedMedals : state.diceSkinCollection.equippedSkin;
  const items = collectionItems(type);
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
    const itemKey = type === 'dice-skins' ? item.itemId : item.file;
    const isEquipped = type === 'cards' ? state.collection.equippedCard === item.file : type === 'medals' ? state.collection.equippedMedals.includes(item.file) : state.diceSkinCollection.equippedSkin === item.itemId;
    const action = isUnlocked ? (isEquipped ? '已装备' : '装备') : item.paid ? (state.wallet?.groschen >= item.price ? '购买' : '余额不足') : '未解锁';
    const status = isUnlocked ? (isEquipped ? '当前装备' : '已解锁 · 点击装备') : item.unlock;
    const actionLabel = item.paid && !isUnlocked && state.wallet?.groschen >= item.price ? `购买 · ${formatGroschen(item.price)}` : action;
    const art = type === 'dice-skins' ? renderDiceSkinPreview(item) : `<span class="collection-art"><img src="${collectionAsset(type, item.file)}" alt="${item.name}" loading="lazy" /></span>`;
    const keyAttribute = type === 'dice-skins' ? `data-collection-skin="${itemKey}"` : `data-collection-file="${itemKey}"`;
    return `<button class="collection-item ${type === 'dice-skins' ? 'dice-skin-item' : ''} ${isUnlocked ? '' : 'is-locked'} ${item.paid ? 'is-paid' : 'is-reward'} ${isEquipped ? 'is-equipped' : ''}" data-collection-type="${type}" ${keyAttribute} type="button" aria-label="${item.name} · ${actionLabel}" ${isUnlocked || item.paid ? '' : 'aria-disabled="true"'}>${art}<span class="collection-copy"><b>${item.name}</b><small>${item.description || item.opponent}</small><em>${status}</em></span><strong class="collection-action">${actionLabel}</strong></button>`;
  };
  if (type === 'cards') {
    const groups = [
      { key: 'legacy', title: '基础名片', subtitle: '原有 11 张 · 对手胜利奖励与风景收藏' },
      { key: 'oil-paint-dlc', title: '油画 DLC', subtitle: '全新系列 · 8 张付费名片 · 500–1500 格罗申' }
    ];
    els.collectionContent.innerHTML = groups.map((group) => {
      const groupItems = items.filter((item) => item.collectionGroup === group.key);
      return `<section class="collection-group" data-collection-group="${group.key}"><div class="collection-group-heading"><div><b>${group.title}</b><small>${group.subtitle}</small></div><span>${groupItems.length} 张</span></div><div class="collection-group-grid">${groupItems.map(renderItem).join('')}</div></section>`;
    }).join('');
  } else if (type === 'dice-skins') {
    els.collectionContent.innerHTML = `<section class="collection-group collection-group-single"><div class="collection-group-heading"><div><b>酒馆皮肤</b><small>当前首发 · 未来可加入胜利奖励与 DLC 系列</small></div><span>${items.length} 套</span></div><div class="collection-group-grid">${items.map(renderItem).join('')}</div></section>`;
  } else {
    els.collectionContent.innerHTML = `<section class="collection-group collection-group-single"><div class="collection-group-grid">${items.map(renderItem).join('')}</div></section>`;
  }
  els.collectionContent.querySelectorAll('.collection-item').forEach((item) => item.addEventListener('click', () => {
    const key = type === 'dice-skins' ? item.dataset.collectionSkin : item.dataset.collectionFile;
    const file = key;
    const catalogItem = items.find((entry) => (type === 'dice-skins' ? entry.itemId === key : entry.file === key));
    if (type === 'dice-skins') {
      if (catalogItem?.paid && !purchasedSkins.includes(key)) { purchaseDiceSkin(catalogItem); return; }
      if (item.classList.contains('is-locked')) { showToast(item.querySelector('em')?.textContent || '尚未解锁'); return; }
      state.diceSkinCollection.equippedSkin = state.diceSkinCollection.equippedSkin === key ? 'default' : key;
      saveDiceSkinCollection(); applyEquippedDiceSkin(); renderCollection(); safeAudio('playClick');
      showToast(`已装备骰子皮肤：${diceSkinById(state.diceSkinCollection.equippedSkin).name}`);
      return;
    }
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
  els.collectionContent.innerHTML = `<section class="dice-loadout-page"><div class="collection-group-heading"><div><b>六个功能骰子槽位</b><small>点击槽位后打开概率库；这些骰子决定实际投掷权重。</small></div><button class="collection-reset-loadout" id="collection-reset-loadout" type="button">还原普通骰</button></div><div class="loadout-slots dice-loadout-grid">${slots}</div><p class="dice-loadout-note">骰子皮肤只改变外观，请前往“骰子皮肤”标签购买与装备。</p></section>`;
  els.collectionContent.querySelectorAll('[data-dice-loadout-slot]').forEach((slot) => slot.addEventListener('click', () => { state.equipSlot = Number(slot.dataset.diceLoadoutSlot); openCodex(2); }));
  els.collectionContent.querySelector('#collection-reset-loadout')?.addEventListener('click', () => { restoreDefaultLoadout(); renderCollection(); });
}

function purchaseNameCard(card) {
  if (!card || !state.wallet) return;
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
  const validTabs = ['cards', 'medals', 'dice-skins', 'dice-loadout'];
  state.collectionTab = validTabs.includes(tab) ? tab : 'cards';
  renderCollection();
  els.collectionScreen?.classList.remove('hidden');
  document.body.classList.add('collection-open');
  const activeView = state.collectionTab.startsWith('dice-') ? 'dice-collection' : 'collection';
  document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.toggle('active', nav.dataset.view === activeView));
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
  if (!state.collection.unlockedCards.includes(reward.card)) { state.collection.unlockedCards.push(reward.card); newlyUnlocked.push(reward.cardName); }
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
  const equippedCard = state.collection.equippedCard;
  if (els.playerCardDisplay) {
    els.playerCardDisplay.classList.toggle('is-equipped', Boolean(equippedCard));
    els.playerCardDisplay.innerHTML = equippedCard
      ? `<button class="equipped-card-button" type="button" title="打开名片收藏"><img src="${collectionAsset('cards', equippedCard)}" alt="已装备名片" /><span class="player-card-name">LIORA</span></button>`
      : '<div class="player-name-fallback">LIORA</div><button class="equipped-card-empty" type="button" title="打开名片收藏">未装备名片</button>';
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
  const music = els.backgroundMusic;
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
  async function startMusic() {
    if (!music || muted) return false;
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
  return {
    playShake, playLand, playClick, playDeny, playBank, playFarkle, playWin, startMusic,
    setMusicVolume: (value) => {
      musicVolume = clampVolume(value);
      if (music) music.volume = musicVolume / 100;
      try { window.localStorage.setItem(MUSIC_VOLUME_KEY, String(musicVolume)); } catch { /* storage may be unavailable for file:// pages */ }
      return musicVolume;
    },
    get musicVolume() { return musicVolume; },
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
  { kicker: '骰子：基本规则', title: '骰子：基本规则', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die">${pipFace(1)}</div><div class="codex-die">${pipFace(5)}</div><div class="codex-die">${pipFace(6)}</div><div class="codex-die">${pipFace(3)}</div><div class="codex-caption">任意选择骰子 · 继续投掷剩余骰子</div></div><div class="codex-copy"><h3>骰子游戏</h3><p>如果你对赌博感兴趣，在任何一家体面的酒馆里都可以进行骰子游戏。</p><h4>选择骰子</h4><p>如果你的物品栏中有骰子，你可以在开始赌局之前选择使用他。大多数骰子都有自身特性，可以阅读它们的描述来了解相关信息。</p><h4>游戏进程</h4><p>游戏开始时，你将投掷全部六枚骰子。你可以标记任意骰子保留，接着继续投掷剩余的骰子；最终组合是否计分由点数规则决定。</p><p>每次投掷落地后，必须从这一掷里锁定至少一个计分骰子（1、5 或三同等组合），才能继续投掷或收集分数；如果这一掷剩余骰子里没有任何计分骰子，则会触发爆骰，本轮分数归零并结束本轮。</p></div></div>` },
  { kicker: '骰子：点数组合', title: '骰子：点数组合', content: `<div class="codex-copy"><p>以下为所有骰子组合及其点数值。</p></div><table class="rule-table"><thead><tr><th>组合</th><th>点数</th><th>说明</th></tr></thead><tbody><tr><td>单个 1</td><td>100</td><td>可单独保留</td></tr><tr><td>单个 5</td><td>50</td><td>可单独保留</td></tr><tr><td>三个相同</td><td>1000 / 200–600</td><td>1 点为 1000，其余点数 × 100</td></tr><tr><td>四个相同</td><td>三同的 2 倍</td><td>三个骰子后每增加一个骰子，点数翻倍</td></tr><tr><td>五个、六个相同</td><td>继续翻倍</td><td>全部骰子得分时触发热骰</td></tr><tr><td>小顺 1–5 / 2–6</td><td>750</td><td>连续五个点数</td></tr><tr><td>大顺 1–6</td><td>1500</td><td>六个点数全部出现</td></tr><tr><td>三对</td><td>1500</td><td>三组相同点数</td></tr></tbody></table>` },
  { kicker: '骰子：属性与概率', title: '骰子：属性与概率', content: `<p class="codex-intro">不同骰子会改变各点数出现的概率。装备后，投掷将使用对应权重。</p><div class="prob-table" id="probability-table"></div>` },
  { kicker: '骰子：保留与爆骰', title: '骰子：保留与爆骰', content: `<div class="codex-columns"><div class="codex-illustration"><div class="codex-die locked-demo">${pipFace(1)}</div><div class="codex-die locked-demo">${pipFace(5)}</div><div class="codex-die">${pipFace(2)}</div></div><div class="codex-copy"><h3>把握时机</h3><p>点击任意骰子都可以将它保留。保留的骰子会从下一次投掷中移出，并按当前组合计入本轮暂存分数。每次投掷落地后，必须先锁定这一掷里至少一个计分骰子，才能继续投掷或收集分数——不能空手跳过。</p><p>如果这一掷剩余骰子里没有任何计分组合，则直接触发爆骰：本轮暂存分数归零，回合立刻交给对手。</p></div></div>` },
  { kicker: '骰子：获胜条件', title: '骰子：获胜条件', content: `<div class="codex-columns"><div class="codex-copy"><h3>先到目标分数者获胜</h3><p>目标分数取决于你选择的牌友：米洛·老练与瓦茨拉夫·赌徒为 2000 分；玛蒂娜·酒馆老板为 3000 分；马里的穆萨为 4000 分。牌桌两侧的进度条、胜负判断与 AI 决策都会使用当前对手的目标。</p><h4>收集分数</h4><p>点击“收集”把本轮已保留的点数计入你的总分，然后交给对手回合。</p></div><div class="codex-illustration"><div class="codex-score">当前目标 <span id="codex-target-preview">/ 2000</span></div><div class="codex-score opponent-score-demo">穆萨目标 <span>/ 4000</span></div></div></div>` },
  { kicker: '骰子：牌桌提示', title: '骰子：牌桌提示', content: `<div class="codex-copy"><h3>旅人的三条忠告</h3><p>一、先保留稳定的 1 和 5，再考虑高风险的三同与顺子。</p><p>二、当本轮分数足够接近目标时，及时收集，不要把胜利交给下一掷。</p><p>三、装备骰子会改变概率。打开骰子库，查看每一面真实的出现机会。</p></div>` }
];

pages.push({ kicker: '牌桌：倍率与承担', title: '牌桌：倍率与承担', content: `<div class="codex-columns"><div class="codex-copy"><h3>共享倍率，分别记账</h3><p>正式赌局使用公共牌桌倍率：x1、x2、x3、x5。任一方在自己第一次投掷前加码后，双方立即同步看到新的倍率；同一回合每方最多主动提升一次。</p><h4>胜利收益</h4><p>赢家始终按照牌局结束时的公共牌桌倍率获得收益。你把牌桌推到 x5 后获胜，就按基础赌注 ×5 获得格罗申，不会因为对手只加到 x3 而降档。</p><h4>败局承担</h4><p>败局扣款查看败方自己在本局主动选择过的最高倍率。没有主动推过 x2，最多按 x2 承担；主动推到 x3 或 x5 后落败，则分别按 x3 或 x5 承担。</p><p>例如：对手把公共牌桌推到 x5，而你没有主动推过 x2。你获胜时按公共 x5 获得收益；你落败时仍只按自己的 x2 风险扣款。</p></div><div class="codex-illustration"><div class="codex-score">x1 <span>→ x2 → x3 → x5</span></div><div class="codex-caption">胜利看公共倍率 · 败局看个人风险</div></div></div>` });
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

function scheduleOpponentAction(callback, delay, token = opponentTurnToken) {
  clearOpponentActionTimer();
  opponentActionTimer = window.setTimeout(() => {
    opponentActionTimer = undefined;
    if (state.turn !== 'ai' || state.gameOver || token !== opponentTurnToken) return;
    callback(token);
  }, delay);
}

function isOpponentTurn(token) {
  return state.turn === 'ai' && !state.gameOver && token === opponentTurnToken;
}

function opponentPhaseCopy() {
  const remaining = state.opponentActiveIndices.length;
  const opponentName = opponents[state.opponentId]?.name || '对手';
  const copies = {
    idle: '等待你的投掷',
    preparing: `正在掂量骰盅 · 剩余 ${remaining || 6} 枚`,
    rolling: `正在投掷剩余 ${remaining || 6} 枚`,
    selecting: '观察落点，挑选可计分骰子',
    deciding: `暂存 ${state.opponentRoundScore} 分，正在权衡`,
    banking: `收集 ${state.opponentRoundScore} 分`,
    farkle: '爆骰 · 本轮分数归零',
    hotDice: `热骰 · 保留 ${state.opponentRoundScore} 分后重掷六枚`
  };
  return { name: opponentName, text: copies[state.opponentPhase] || copies.idle };
}

function pickAiDialogue(event, extra = {}) {
  const profile = opponents[state.opponentId] || opponents.milo;
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
    ...extra
  };
  const line = typeof selected === 'function' ? selected(context) : selected;
  state.aiDialogueHistory.push(line);
  if (state.aiDialogueHistory.length > 12) state.aiDialogueHistory.shift();
  return line;
}

function getTableMultiplier() {
  if (state.match?.type !== 'stake') return DEFAULT_TABLE_MULTIPLIER;
  const multiplier = Number(state.match.multiplier);
  return MULTIPLIER_STEPS.includes(multiplier) ? multiplier : DEFAULT_TABLE_MULTIPLIER;
}

// Each side pays according to its own highest raise. A side that never pushes
// beyond x2 keeps the protected loss cap even when the shared table reaches x3/x5.
function getActorLossMultiplier(actor) {
  if (state.match?.type !== 'stake') return DEFAULT_TABLE_MULTIPLIER;
  const tableMultiplier = getTableMultiplier();
  const maxRaise = Number(state.match?.maxRaiseBy?.[actor]) || DEFAULT_TABLE_MULTIPLIER;
  return maxRaise > LOSS_MULTIPLIER_CAP
    ? Math.min(maxRaise, tableMultiplier)
    : Math.min(tableMultiplier, LOSS_MULTIPLIER_CAP);
}

function getNextTableMultiplier() {
  const index = MULTIPLIER_STEPS.indexOf(getTableMultiplier());
  return index >= 0 && index < MULTIPLIER_STEPS.length - 1 ? MULTIPLIER_STEPS[index + 1] : null;
}

function isMultiplierStepUnlocked(step) {
  if (step <= 2) return true;
  if (!state.match?.hasSuccessfulBank) return false;
  if (step === 3) return true;
  const scoreGap = Math.abs(state.playerTotal - state.opponentTotal);
  const lateRound = state.round >= 6;
  const endgameScore = Math.max(state.playerTotal, state.opponentTotal) >= 1000;
  return lateRound || scoreGap >= 300 || endgameScore;
}

function raiseTableMultiplier(target, actor = 'player') {
  if (!state.match?.active || state.match.type !== 'stake' || state.gameOver) return false;
  const requested = Number(target);
  const current = getTableMultiplier();
  const next = getNextTableMultiplier();
  if (!next || requested !== next || !isMultiplierStepUnlocked(requested)) return false;
  if (state.match.lastRaiseOwner === actor && state.match.lastRaiseRound === state.round) {
    if (actor === 'player') showToast('本回合已经加码，下一回合再提升倍率');
    return false;
  }
  const canRaise = actor === 'ai'
    ? state.turn === 'ai' && state.opponentPhase === 'preparing' && !state.opponentRolling
    : state.turn === 'player' && !state.hasRolled && !state.rolling;
  if (!canRaise) {
    if (actor === 'player') showToast('倍率只能在本回合第一次投掷前提升');
    return false;
  }

  state.match.multiplier = requested;
  state.match.maxRaiseBy = state.match.maxRaiseBy || { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER };
  state.match.maxRaiseBy[actor] = Math.max(Number(state.match.maxRaiseBy[actor]) || DEFAULT_TABLE_MULTIPLIER, requested);
  state.match.lastRaisedBy = actor;
  state.match.lastRaiseOwner = actor;
  state.match.lastRaiseRound = state.round;
  state.match.raiseCount = (state.match.raiseCount || 0) + 1;
  const profile = opponents[state.opponentId] || opponents.milo;
  const actorName = actor === 'ai' ? profile.name : '你';
  addActivity(actor === 'ai' ? 'ai' : 'you', `<b>${actorName}</b> 将牌桌倍率提升至 <strong>x${requested}</strong>`, '牌桌加码');
  if (actor === 'ai') {
    addOpponentReaction(pickAiDialogue('raise', { multiplier: requested }), 'AI 加码');
    safeAudio('playShake');
  } else {
    addOpponentReaction(pickAiDialogue('playerRaise', { multiplier: requested }), '对手观察');
    safeAudio('playClick');
    showToast(`牌桌倍率已提升至 x${requested} · 双方同步`);
  }
  updateUI();
  return true;
}

function chooseOpponentMultiplier() {
  if (!state.match?.active || state.match.type !== 'stake') return null;
  const next = getNextTableMultiplier();
  if (!next || !isMultiplierStepUnlocked(next)) return null;
  const profile = opponents[state.opponentId] || opponents.milo;
  const lead = state.opponentTotal - state.playerTotal;
  const behind = Math.max(0, -lead);
  const ahead = Math.max(0, lead);
  const risk = estimateFarkleRisk(state.opponentActiveIndices.length ? state.opponentActiveIndices : [0, 1, 2, 3, 4, 5]);
  let chance = 0.12;
  if (state.opponentId === 'milo') chance = 0.18 + (behind >= 300 ? 0.14 : 0) + (risk < 0.28 ? 0.08 : -0.04) - (ahead >= 350 ? 0.12 : 0);
  if (state.opponentId === 'vlad') chance = 0.38 + (behind >= 250 ? 0.18 : 0) + (next >= 3 ? 0.14 : 0) + (risk < 0.4 ? 0.08 : 0);
  if (state.opponentId === 'marta') chance = 0.2 + (behind >= 350 ? 0.2 : 0) + (risk < 0.24 ? 0.08 : -0.04) + (next === 3 ? 0.05 : 0) - (ahead >= 250 ? 0.12 : 0);
  if (state.opponentId === 'musa') chance = 0.25 + (behind >= 300 ? 0.16 : 0) + (risk < 0.26 ? 0.11 : -0.03) + (next === 3 && state.opponentRoundScore >= 300 ? 0.1 : 0) - (ahead >= 350 ? 0.14 : 0);
  if (next === 5) chance *= state.opponentId === 'vlad' ? 0.72 : 0.42;
  if (state.opponentId === 'musa' && next === 5) chance *= 0.72;
  if (secureRandomFloat() >= clamp01(chance)) return null;
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
  const playerRaisedThisTurn = state.match?.lastRaiseOwner === 'player' && state.match?.lastRaiseRound === state.round;
  els.multiplierPanel.classList.toggle('is-disabled', !activeStake);
  els.multiplierPanel.classList.toggle('practice', !activeStake || state.match?.type !== 'stake');
  if (els.multiplierValue) els.multiplierValue.textContent = `x${multiplier}`;
  if (els.multiplierCap) els.multiplierCap.textContent = activeStake ? `败局封顶 x${LOSS_MULTIPLIER_CAP}` : state.match?.type === 'practice' ? '练习桌固定 x1' : '等待正式牌局';

  if (els.multiplierHint) {
    if (!activeStake) els.multiplierHint.textContent = state.match?.type === 'practice' ? `练习桌固定 x1 · 胜利 +${PRACTICE_REWARD} 格罗申` : '正式牌局开始后可加码';
    else if (multiplier >= 5) els.multiplierHint.textContent = '牌桌已拉满 x5 · 双方同步 · 败局按 x2 封顶';
    else if (state.turn === 'ai') els.multiplierHint.textContent = `${profile.name} 正在决定 · 牌桌倍率双方同步`;
    else if (state.hasRolled || state.rolling || playerRaisedThisTurn) els.multiplierHint.textContent = playerRaisedThisTurn ? '本回合已加码 · 下一回合可继续加码' : '本回合倍率已锁定 · 下一回合可继续加码';
    else els.multiplierHint.textContent = next ? `投掷前可提升至 x${next} · 提升后双方同步` : '当前倍率已达上限';
  }

  els.multiplierButtons?.forEach((button) => {
    const step = Number(button.dataset.multiplier);
    const label = button.querySelector('b');
    const subcopy = button.querySelector('small');
    const current = step === multiplier;
    const unlocked = isMultiplierStepUnlocked(step);
    const canUse = activeStake && state.turn === 'player' && !state.hasRolled && !state.rolling && !playerRaisedThisTurn && step === next && unlocked;
    button.classList.toggle('current', current);
    button.classList.toggle('next-step', step === next && unlocked);
    button.disabled = !canUse;
    button.setAttribute('aria-pressed', String(current));
    if (label) label.textContent = current ? `当前 x${step}` : step === 1 ? '维持 x1' : `加码 x${step}`;
    if (subcopy) subcopy.textContent = current ? '双方同步' : !unlocked ? (step === 3 ? '先收集一轮' : '后段解锁') : step === 5 ? '风险封顶' : step === 1 ? '不加码' : step === 2 ? '谨慎' : '进取';
    button.title = current ? `当前牌桌倍率 x${step}` : !unlocked ? (step === 3 ? '完成一次收集后解锁' : '进入牌局后段或形成明显分差后解锁') : canUse ? `提升牌桌倍率至 x${step}` : '仅能在自己第一次投掷前加码';
  });
}

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

function scoreSelection(values) {
  if (!values.length) return { score: 0, label: '等待投掷', detail: '1 点 = 100 · 5 点 = 50' };
  const counts = countValues(values); const unique = Object.keys(counts).map(Number).sort((a, b) => a - b).join('');
  // 小顺只需要 5 个不同点数，如果这批骰子有 6 颗，很可能是"顺子 + 1 颗重复的"，
  // 那颗多余的骰子不该被一起算进顺子分里——必须限定正好锁了 5 颗才算小顺。
  // （大顺覆盖 1-6 共六个点数，游戏最多也就六颗骰子，天然不会有多余的重复骰子可钻，
  // 这条长度限制理论上不是必需的，但留着更清楚、也防着以后骰子数上限被改动。）
  if (values.length === 6 && unique === '123456') return { score: 1500, label: '大顺', detail: '1 至 6 全部出现 · +1500' };
  if (values.length === 5 && unique === '12345') return { score: 500, label: '小顺 1–5', detail: '1 至 5 连续点数 · +500' };
  if (values.length === 5 && unique === '23456') return { score: 750, label: '小顺 2–6', detail: '2 至 6 连续点数 · +750' };
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

// 判断"这一掷"锁定的骰子是不是每一枚都真的对分数有贡献——不允许混进一颗不计分的
// "垃圾"骰子来单纯凑数字。比如锁了一个 1（计分）又顺手锁了一个 2（不计分），
// scoreSelection 只看总分>0 会放行，但那颗 2 其实是白嫖凑数的，不该被算作"已结算"。
// 这也是热骰判定的地基：state.locked.size === 6 只有在每一批锁定都通过这个检查时
// 才可能达成，从根上保证热骰必须六枚骰子全部计分结算，不是随便锁满六个槽位就行。
function allDiceContribute(values) {
  if (!values.length) return false;
  const counts = countValues(values); const unique = Object.keys(counts).map(Number).sort((a, b) => a - b).join('');
  if (values.length === 6 && unique === '123456') return true;
  if (values.length === 5 && (unique === '12345' || unique === '23456')) return true;
  return Object.entries(counts).every(([rawValue, count]) => { const value = Number(rawValue); return count >= 3 || value === 1 || value === 5; });
}

// KC2 规则：每次投掷落地后，必须从"这一掷"新出现的骰子里锁定一组完整能计分的组合，
// 才允许继续投掷或收集分数——不能不选就再掷一次（"空选"），也不能锁一个计分骰子
// 搭一个不计分的骰子混过去。
// !state.hasRolled：本回合还没掷过，第一掷永远放行。
// 注意：这里不能对 state.locked.size === 6 做特殊放行——那样等于允许玩家在同一掷里
// 把垃圾骰子也点亮锁上、凑够六个格子来蒙混过关，恰好是热骰漏洞的入口。
// 真正合法的"六枚全锁"必然是每一批锁定各自都通过了 allDiceContribute，
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
  const opponentCopy = opponentPhaseCopy();
  const opponentRemaining = state.opponentPhase === 'idle' ? 6 : state.opponentPhase === 'hotDice' ? 6 : state.opponentActiveIndices.length;
  animateNumber(els.playerTotal, state.playerTotal); animateNumber(els.opponentRight, state.opponentTotal); els.bankAmount.textContent = state.roundScore;
  if (els.targetScore) els.targetScore.textContent = state.target;
  els.targetScoreInline?.forEach((node) => { node.textContent = state.target; });
  const playerRemaining = state.turn === 'ai' ? 6 : available.length;
  const playerProgress = Math.min(100, state.playerTotal / state.target * 100);
  const opponentProgress = Math.min(100, state.opponentTotal / state.target * 100);
  if (els.playerRoundScore) els.playerRoundScore.textContent = state.roundScore;
  if (els.playerKeptCount) els.playerKeptCount.textContent = state.locked.size;
  if (els.playerRemainingCount) els.playerRemainingCount.textContent = playerRemaining;
  if (els.playerProgress) els.playerProgress.style.width = `${playerProgress}%`;
  if (els.playerTargetCaption) els.playerTargetCaption.textContent = Math.max(0, state.target - state.playerTotal);
  if (els.opponentRemainingCount) els.opponentRemainingCount.textContent = opponentRemaining;
  if (els.opponentProgress) els.opponentProgress.style.width = `${opponentProgress}%`;
  if (els.opponentTargetCaption) els.opponentTargetCaption.textContent = Math.max(0, state.target - state.opponentTotal);
  if (els.opponentRoundScore) els.opponentRoundScore.textContent = state.opponentRoundScore;
  if (els.opponentKeptCount) els.opponentKeptCount.textContent = state.opponentKept.length;
  els.remaining.textContent = state.turn === 'ai' ? `对手剩余 ${state.opponentPhase === 'hotDice' ? 6 : opponentRemaining} 枚 · 已保留 ${state.opponentKept.length} 枚` : state.hasRolled ? `可投掷 ${available.length} 枚` : '可投掷 6 枚';
  els.selectionScore.textContent = selected.score; els.comboName.textContent = state.hasRolled ? selected.label : '等待投掷'; els.comboDetail.textContent = state.hasRolled ? selected.detail : '1 点 = 100 · 5 点 = 50';
  const mustSelectFirst = state.hasRolled && !hasScoringSelectionThisRoll();
  els.bank.disabled = state.turn !== 'player' || state.rolling || state.roundScore <= 0 || state.gameOver || mustSelectFirst; els.roll.disabled = state.turn !== 'player' || state.rolling || state.gameOver || mustSelectFirst;
  els.rollLabel.textContent = state.hasRolled ? (state.locked.size === 6 && !mustSelectFirst ? '热骰 · 再掷' : '再次投掷') : '投掷骰子';
  els.diceState.textContent = state.rolling ? '骰子在桌面上翻滚……' : state.turn === 'ai' ? `${opponentCopy.name}${opponentCopy.text} · 已保留骰子会在结算后离开棋盘` : state.gameOver ? '牌局已结束 · 点击重新开始' : !state.hasRolled ? '投掷六枚骰子，点击 3D 骰子锁定任意点数' : mustSelectFirst ? selectionIssueMessage('投掷或收集') : available.length === 0 ? '六枚骰子均已锁定 · 可以继续投掷（热骰）或收集' : state.locked.size ? `已锁定 ${state.locked.size} 枚骰子 · 剩余骰子可以继续投掷或收集` : '点击 3D 骰子锁定任意点数';
  els.turnLabel.textContent = state.gameOver ? '牌局结束' : state.turn === 'player' ? '你的回合' : '对手回合'; els.turnDetail.textContent = state.gameOver ? '胜负已定' : state.turn === 'player' ? '选择任意骰子并保留' : opponentCopy.text; els.opponentStatus.textContent = state.gameOver ? '胜负已定' : state.turn === 'player' ? '等待你的投掷' : opponentCopy.text;
  if (els.playerBoardTurn) els.playerBoardTurn.textContent = state.gameOver ? '牌局已结束' : state.turn === 'player' ? '选择任意骰子并保留' : '暂时观战';
  if (els.playerState) { els.playerState.textContent = state.gameOver ? '牌局结束' : state.turn === 'player' ? '你的回合' : '观战中'; els.playerState.classList.toggle('active', state.turn === 'player' && !state.gameOver); }
  if (els.opponentState) { els.opponentState.textContent = state.gameOver ? '牌局结束' : state.turn === 'ai' ? '行动中' : '观战中'; els.opponentState.classList.toggle('active', state.turn === 'ai' && !state.gameOver); }
  if (els.opponentBoardTurn) els.opponentBoardTurn.textContent = state.turn === 'ai' ? opponentCopy.text : '等待你的回合';
  if (els.playerModeCopy) els.playerModeCopy.textContent = matchTypeLabel();
  renderWallet();
  renderRolePanels();
  renderMultiplierPanel();
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
  if (!hasScoringSelectionThisRoll()) { safeAudio('playDeny'); showToast(selectionIssueMessage('继续投掷')); return; }
  const rollToken = ++playerRollToken;
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

function bankScore() {
  if (state.roundScore <= 0 || state.turn !== 'player' || state.rolling || state.gameOver) return;
  if (!hasScoringSelectionThisRoll()) { safeAudio('playDeny'); showToast(selectionIssueMessage('收集')); return; }
  const banked = state.roundScore; state.playerTotal += banked; state.playerHistory.banks.push(banked); if (state.playerHistory.banks.length > 8) state.playerHistory.banks.shift(); if (state.match?.type === 'stake') state.match.hasSuccessfulBank = true; safeAudio('playBank'); celebrateStage(); addActivity('you', `<b>你</b> 收集了 <strong>${banked}</strong> 分`, '本轮结算'); addOpponentReaction(pickAiDialogue('playerBank', { score: banked, playerTotal: state.playerTotal }), '对手观察'); dicePhysics3D.resetOwner?.('player'); state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; state.locked.clear(); state.hasRolled = false; state.hotDice = false; state.farkle = false; renderDice(); updateUI();
  if (state.playerTotal >= state.target) { finishGame('player'); return; }
  passToOpponent();
}

function farkleTurn() {
  state.farkle = true; state.playerHistory.farkles += 1; state.roundScore = 0; state.rollScoreBase = 0; state.activeRollIndices = []; updateUI(); safeAudio('playFarkle'); shakeStage(); addActivity('ai', '<b>爆骰</b>！本轮未掷出任何得分骰子，分数归零', '本轮结束'); addOpponentReaction(pickAiDialogue('playerFarkle', { score: 0, playerTotal: state.playerTotal }), '对手观察'); showToast('爆骰！本轮分数归零');
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
  state.roundScore = 0;
  state.rollScoreBase = 0;
  state.activeRollIndices = [];
  state.locked.clear();
  state.opponentDice = [];
  state.opponentActiveIndices = [0, 1, 2, 3, 4, 5];
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRollScoreBase = 0;
  state.opponentRolling = false;
  state.opponentPhase = 'preparing';
  renderDice();
  renderOpponentDice();
  updateUI();
  const token = opponentTurnToken;
  maybeOpponentRaiseMultiplier(token);
  addOpponentReaction(pickAiDialogue('opening'), '对手回合');
  scheduleOpponentAction(rollOpponentDice, AI_TIMING.firstThink, token);
}

function chooseScoringIndices(values) {
  if (!values.length) return [];
  const counts = countValues(values); const unique = Object.keys(counts).map(Number).sort((a, b) => a - b).join('');
  if (values.length === 6 && unique === '123456') return values.map((_, index) => index);
  if (values.length === 5 && (unique === '12345' || unique === '23456')) {
    const straight = unique === '12345' ? [1, 2, 3, 4, 5] : [2, 3, 4, 5, 6];
    return straight.map((value) => values.findIndex((entry) => entry === value));
  }
  const picked = [];
  Object.entries(counts).forEach(([raw, count]) => { const value = Number(raw); if (count >= 3) values.forEach((entry, index) => { if (entry === value) picked.push(index); }); });
  values.forEach((value, index) => { if ((value === 1 || value === 5) && !picked.includes(index)) picked.push(index); });
  return picked;
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
    total += scoreSelection(roll).score;
  }
  return total / samples;
}

function chooseOpponentScoringIndices(values) {
  const profile = opponents[state.opponentId] || opponents.milo;
  const candidates = generateScoringKeeps(values);
  if (!candidates.length) return [];
  const activeSlots = state.opponentActiveIndices.length ? state.opponentActiveIndices : values.map((_, index) => index);
  const pointsToWin = Math.max(0, state.target - state.opponentTotal);
  const recentBanks = state.playerHistory?.banks || [];
  const playerAverageBank = recentBanks.length ? recentBanks.reduce((sum, value) => sum + value, 0) / recentBanks.length : 0;
  const playerFarkleRate = clamp01((state.playerHistory?.farkles || 0) / Math.max(1, recentBanks.length + (state.playerHistory?.farkles || 0)));
  const playerThreat = clamp01(state.playerTotal / state.target * 0.7 + playerAverageBank / 1000 * 0.3 - playerFarkleRate * 0.12);
  const ranked = candidates.map((candidate) => {
    const remainingSlots = activeSlots.filter((_, index) => !candidate.indices.includes(index));
    const risk = estimateFarkleRisk(remainingSlots);
    const projected = state.opponentRoundScore + candidate.score;
    const expectedNextScore = profile.lookaheadSamples ? estimateExpectedNextScore(remainingSlots, profile.lookaheadSamples) : 0;
    const hotBonus = remainingSlots.length === 0 ? profile.hotDiceBias * 180 : 0;
    const straightBonus = candidate.label.includes('顺') ? (profile.comboBias?.straight || 0) * 120 : 0;
    const tripleBonus = candidate.label.includes('个') ? (profile.comboBias?.triple || 0) * 90 : 0;
    const continuation = remainingSlots.length * 54 * profile.continuationWeight;
    const lookaheadBonus = expectedNextScore * (profile.lookaheadWeight || 0);
    const riskCost = risk * Math.max(projected, 100) * (0.72 + profile.riskTolerance);
    const finishBonus = projected >= pointsToWin ? 1200 : 0;
    const threatBonus = playerThreat * profile.comebackPressure * 180;
    return { candidate, utility: candidate.score + continuation + lookaheadBonus + hotBonus + straightBonus + tripleBonus + finishBonus + threatBonus - riskCost };
  }).sort((a, b) => b.utility - a.utility);

  // 失误是“次优选择”而不是作弊：偶尔从前三个方案中选一个。
  if (ranked.length > 1 && secureRandomFloat() < profile.mistakeRate) {
    const window = Math.min(3, ranked.length);
    return ranked[1 + Math.floor(secureRandomFloat() * (window - 1))].candidate.indices;
  }
  return ranked[0].candidate.indices;
}

function rollOpponentDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentRolling) return;
  const activeIndices = state.opponentActiveIndices.length ? [...state.opponentActiveIndices] : [0, 1, 2, 3, 4, 5];
  const opponentTargets = activeIndices.map((slot) => weightedRoll(dieById(state.opponentLoadout?.[slot] || 'ordinary').weights));
  state.opponentPhase = 'rolling';
  state.opponentRolling = true;
  state.farkle = false;
  state.hotDice = false;
  els.ritual?.classList.add('active');
  renderOpponentDice();
  updateUI();
  safeAudio('playShake');
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
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 掷出 ${targets.join(' · ')} 点`, '对手回合');
  const visibleScore = scoreSelection(targets).score;
  const rollReaction = pickAiDialogue(visibleScore >= 750 ? 'rollHigh' : visibleScore > 0 ? 'rollPositive' : 'rollBad', { score: visibleScore, label: scoreSelection(targets).label, remaining: activeIndices.length });
  addOpponentReaction(rollReaction);
  scheduleOpponentAction(selectOpponentDice, AI_TIMING.afterRollThink, token);
}

function selectOpponentDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentPhase !== 'selecting') return;
  const pickedPositions = chooseOpponentScoringIndices(state.opponentDice);
  if (!pickedPositions.length) {
    state.farkle = true;
    state.hotDice = false;
    state.opponentRoundScore = 0;
    state.opponentPhase = 'farkle';
    renderOpponentDice();
    updateUI();
    safeAudio('playFarkle');
    shakeStage();
    addActivity('ai', `<b>${els.opponentName.textContent}</b> 爆骰，本轮分数归零`, '对手回合结束');
    addOpponentReaction(pickAiDialogue('farkle', { score: 0, remaining: state.opponentActiveIndices.length }));
    showToast('对手爆骰，本轮分数归零');
    scheduleOpponentAction(startPlayerTurn, AI_TIMING.afterFarkle, token);
    return;
  }

  const pickedSet = new Set(pickedPositions);
  const pickedValues = pickedPositions.map((position) => state.opponentDice[position]);
  const pickedSlots = pickedPositions.map((position) => state.opponentActiveIndices[position]);
  const pickedScore = scoreSelection(pickedValues).score;
  state.opponentKept.push(...pickedValues);
  state.opponentKeptIndices.push(...pickedSlots);
  state.opponentDice = state.opponentDice.filter((_, position) => !pickedSet.has(position));
  state.opponentActiveIndices = state.opponentActiveIndices.filter((_, position) => !pickedSet.has(position));
  state.opponentRoundScore = state.opponentRollScoreBase + pickedScore;
  pickedSlots.forEach((slot, position) => dicePhysics3D.setLocked?.('opponent', slot, true, pickedValues[position]));
  state.opponentPhase = 'deciding';
  renderOpponentDice();
  updateUI();
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 保留 ${pickedValues.join(' · ')}，本轮 <strong>${state.opponentRoundScore}</strong> 分`, '对手回合');
  const keepReaction = pickAiDialogue(pickedScore >= 750 ? 'keepBig' : pickedScore >= 300 ? 'keepMid' : 'keepSmall', { score: pickedScore, label: scoreSelection(pickedValues).label, remaining: state.opponentActiveIndices.length });
  addOpponentReaction(keepReaction);
  showToast(`${els.opponentName.textContent} 保留 ${pickedValues.join(' · ')} · 暂存 ${state.opponentRoundScore} 分`);

  if (!state.opponentActiveIndices.length) {
    state.hotDice = true;
    state.opponentPhase = 'hotDice';
    updateUI();
    addActivity('ai', `<b>${els.opponentName.textContent}</b> 用尽六枚骰子，触发热骰`, '对手回合');
    addOpponentReaction(pickAiDialogue('hotDice', { score: state.opponentRoundScore, remaining: 6 }));
    scheduleOpponentAction(resetOpponentHotDice, AI_TIMING.hotDicePause, token);
    return;
  }
  scheduleOpponentAction(decideOpponentTurn, AI_TIMING.afterKeepThink, token);
}

function resetOpponentHotDice(token = opponentTurnToken) {
  if (!isOpponentTurn(token)) return;
  dicePhysics3D.resetOwner?.('opponent');
  state.opponentDice = [];
  state.opponentActiveIndices = [0, 1, 2, 3, 4, 5];
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRollScoreBase = state.opponentRoundScore;
  state.hotDice = false;
  state.opponentPhase = 'preparing';
  renderOpponentDice();
  updateUI();
  addOpponentReaction(pickAiDialogue('hotDice', { score: state.opponentRoundScore, remaining: 6 }));
  showToast('对手热骰，六枚骰子重新加入骰池');
  scheduleOpponentAction(rollOpponentDice, AI_TIMING.afterDecision, token);
}

function shouldOpponentBank() {
  const profile = opponents[state.opponentId] || opponents.milo;
  const pointsToWin = state.target - state.opponentTotal;
  const remainingSlots = state.opponentActiveIndices.length;
  const risk = estimateFarkleRisk(state.opponentActiveIndices);
  const projected = state.opponentRoundScore;
  const playerLead = state.playerTotal - state.opponentTotal;
  const endgamePressure = clamp01((state.playerTotal - state.opponentTotal + 220) / state.target);
  const scoreRatio = clamp01(projected / Math.max(profile.bankAt, 1));
  if (projected >= pointsToWin) return true;
  // A near-empty cup is a meaningful warning, unless the gambler is chasing a comeback.
  const riskLimit = profile.riskLimit ?? (profile.riskTolerance * 0.42 + (1 - clamp01(remainingSlots / 6)) * 0.15);
  const safeEnough = risk <= riskLimit && projected < profile.bankAt * 1.35;
  let bankProbability = 0.16 + scoreRatio * 0.58 + risk * 0.5;
  bankProbability += (playerLead < -350 ? -profile.comebackPressure * 0.42 : endgamePressure * 0.16);
  bankProbability += state.opponentId === 'marta' ? 0.12 : state.opponentId === 'vlad' ? -0.18 : 0;
  if (safeEnough && state.opponentId === 'marta') bankProbability += 0.12;
  if (remainingSlots <= 1) bankProbability += 0.24 - profile.riskTolerance * 0.18;
  if (projected >= profile.bankAt && state.opponentId !== 'vlad') bankProbability += 0.18;
  if (state.opponentId === 'marta') {
    const aiLead = state.opponentTotal - state.playerTotal;
    // She protects a lead, but does not blindly bank when she is behind.
    if (aiLead >= 350) bankProbability += 0.14;
    if (aiLead <= -350) bankProbability -= 0.14;
    // With a safe mid-sized turn and enough dice left, let the lookahead
    // model earn one more measured roll instead of always stopping at 220.
    if (projected >= 260 && remainingSlots >= 3 && risk < 0.28 && aiLead < 300) bankProbability -= 0.08;
    if (projected >= profile.bankAt * 1.25 && risk < 0.36) bankProbability += 0.1;
  }
  if (state.opponentId === 'musa') {
    if (projected >= 450) bankProbability += 0.12;
    if (projected >= 700 && risk < 0.34) bankProbability += 0.1;
    if (projected < 300 && remainingSlots >= 4 && risk < 0.28) bankProbability -= 0.12;
  }
  return secureRandomFloat() < clamp01(bankProbability);
}

function decideOpponentTurn(token = opponentTurnToken) {
  if (!isOpponentTurn(token) || state.opponentPhase !== 'deciding') return;
  if (shouldOpponentBank()) {
    state.opponentPhase = 'banking';
    updateUI();
    const bankLines = { milo: '米洛 把分数稳稳收进囊中', vlad: '瓦茨拉夫 这次决定见好就收', marta: '玛蒂娜 把账算清后收下分数', musa: '穆萨 完成判断后把分数收进账本' };
    addOpponentReaction(pickAiDialogue('bank', { score: state.opponentRoundScore, remaining: state.opponentActiveIndices.length }));
    showToast(bankLines[state.opponentId] || `${els.opponentName.textContent} 决定收集本轮分数`);
    scheduleOpponentAction(opponentBank, AI_TIMING.afterDecision, token);
    return;
  }
  state.opponentRollScoreBase = state.opponentRoundScore;
  state.opponentPhase = 'preparing';
  updateUI();
  const rollLines = { milo: '米洛 还想再看一掷', vlad: '瓦茨拉夫 把骰盅推回桌心', marta: '玛蒂娜 认为风险还在可控范围', musa: '穆萨 还要验证一次牌面判断' };
  addOpponentReaction(pickAiDialogue('continue', { score: state.opponentRoundScore, remaining: state.opponentActiveIndices.length }));
  showToast(`${rollLines[state.opponentId] || els.opponentName.textContent} · 继续投掷 ${state.opponentActiveIndices.length} 枚`);
  scheduleOpponentAction(rollOpponentDice, AI_TIMING.afterDecision, token);
}

function opponentBank(token = opponentTurnToken) {
  if (!isOpponentTurn(token)) return;
  const gain = state.opponentRoundScore;
  state.opponentTotal += gain;
  if (state.match?.type === 'stake') state.match.hasSuccessfulBank = true;
  safeAudio('playBank');
  celebrateStage();
  addActivity('ai', `<b>${els.opponentName.textContent}</b> 收集了 <strong>${gain}</strong> 分`, '对手回合结算');
  addOpponentReaction(pickAiDialogue('bank', { score: gain, remaining: state.opponentActiveIndices.length }), '对手回合结算');
  // Kept dice remain visible only while the opponent is still considering the
  // turn. Once the score is banked, clear this owner's reusable dice pool now.
  dicePhysics3D.resetOwner?.('opponent');
  state.opponentPhase = 'banking';
  state.farkle = false;
  renderOpponentDice();
  updateUI();
  if (state.opponentTotal >= state.target) { finishGame('opponent'); return; }
  scheduleOpponentAction(startPlayerTurn, AI_TIMING.afterBank, token);
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
  state.dice = [0, 0, 0, 0, 0, 0];
  state.opponentDice = [];
  state.opponentActiveIndices = [];
  state.opponentKept = [];
  state.opponentKeptIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRollScoreBase = 0;
  state.opponentRolling = false;
  state.opponentPhase = 'idle';
  state.farkle = false;
  state.hotDice = false;
  renderDice();
  renderOpponentDice();
  updateUI();
  showToast(`第 ${String(state.round).padStart(2, '0')} 回合 · 轮到你`);
}

function settleMatch(winner) {
  if (!state.match?.active || state.match.settled || !state.wallet) return { amount: 0, message: '' };
  const type = state.match.type === 'stake' ? 'stake' : 'practice';
  const stake = Math.max(0, Number(state.match.stake) || 0);
  const tableMultiplier = type === 'stake' ? getTableMultiplier() : DEFAULT_TABLE_MULTIPLIER;
  const losingActor = winner === 'player' ? 'ai' : 'player';
  const losingMultiplier = type === 'stake' ? getActorLossMultiplier(losingActor) : DEFAULT_TABLE_MULTIPLIER;
  // 胜利收益按最终共享牌桌倍率结算；只有玩家败局扣款才读取个人最高加码风险。
  // 例如玩家把牌桌推到 x5 并获胜，即使 AI 最高只主动加到 x3，也应获得 x5 收益。
  const settlementMultiplier = winner === 'player' ? tableMultiplier : losingMultiplier;
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
    const lossMultiplier = losingMultiplier;
    const totalLoss = stake * lossMultiplier;
    state.wallet.groschen = Math.max(0, state.wallet.groschen - totalLoss);
    state.wallet.lifetimeSpent += totalLoss;
    amount = -totalLoss;
    message = `个人风险倍率 x${lossMultiplier} · 本局损失 ${formatGroschen(totalLoss)}`;
  } else {
    message = '练习桌不扣除格罗申';
  }
  if (type === 'stake') {
    message = winner === 'player'
      ? `结算倍率 x${tableMultiplier} · 按最终牌桌倍率赢得 ${formatGroschen(amount)}`
      : `结算倍率 x${losingMultiplier} · 你败局承担 · 本局损失 ${formatGroschen(Math.abs(amount))}`;
  }
  state.wallet.lastSettlement = { at: new Date().toISOString(), type, opponentId: state.opponentId, winner, amount, tableMultiplier, settlementMultiplier };
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
  els.ritual?.classList.remove('active');
  state.opponentRolling = false;
  updateUI();
  if (winner === 'player') { safeAudio('playWin'); celebrateStage(); } else { safeAudio('playFarkle'); shakeStage(); }
  const opponentName = opponents[state.opponentId]?.name || '对手';
  const rewardMessage = winner === 'player' ? grantVictoryReward(state.opponentId) : '';
  const settlement = settleMatch(winner);
  const resultCopy = winner === 'player' ? `你赢下这局！${settlement.message ? ` · ${settlement.message}` : ''}${rewardMessage ? ` · ${rewardMessage}` : ''}` : `${opponentName}先到达目标分数，这局归他。${settlement.message ? ` · ${settlement.message}` : ''}`;
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
  state.target = getOpponentTarget(state.opponentId);
  const profile = opponents[state.opponentId];
  state.playerTotal = 0;
  state.opponentTotal = 0;
  state.roundScore = 0;
  state.rollScoreBase = 0;
  state.activeRollIndices = [];
  state.opponentRoundScore = 0;
  state.opponentRollScoreBase = 0;
  state.round = 1;
  state.dice = [0, 0, 0, 0, 0, 0];
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
  state.opponentRolling = false;
  state.opponentPhase = 'idle';
  state.playerHistory = { banks: [], farkles: 0 };
  if (state.match) { state.match.multiplier = DEFAULT_TABLE_MULTIPLIER; state.match.maxRaiseBy = { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }; state.match.lastRaisedBy = null; state.match.lastRaiseOwner = null; state.match.lastRaiseRound = 0; state.match.raiseCount = 0; state.match.hasSuccessfulBank = false; }
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
  if (currentPage === 4) {
    const targetPreview = els.codexContent.querySelector('#codex-target-preview');
    if (targetPreview) targetPreview.textContent = `/ ${state.target}`;
  }
}

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
  if (els.playerModeCopy) els.playerModeCopy.textContent = online ? '联机演示' : '本地练习';
  els.room.textContent = online ? 'DUEL-208' : state.room;
  showToast(online ? '已进入联机演示房间 · 延迟 42ms' : '已返回本地练习');
}

function selectOpponent(id, { reset = false, announce = true } = {}) {
  if (!opponents[id]) return;
  state.opponentId = id;
  state.target = getOpponentTarget(id);
  document.querySelectorAll('.opponent-card').forEach((card) => card.classList.toggle('selected', card.dataset.opponent === id));
  renderOpponentModal();
  if (reset && !els.arena?.classList.contains('hidden')) resetGame(false);
  if (announce) showToast(`已选择 ${opponents[id].name}`);
}

function setMatchType(type) {
  state.match.type = type === 'stake' ? 'stake' : 'practice';
  state.match.stake = state.match.type === 'stake' ? (OPPONENT_STAKES[state.opponentId] || 0) : 0;
  if (!state.match.active) { state.match.multiplier = DEFAULT_TABLE_MULTIPLIER; state.match.maxRaiseBy = { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }; state.match.lastRaisedBy = null; state.match.lastRaiseOwner = null; state.match.lastRaiseRound = 0; state.match.raiseCount = 0; state.match.hasSuccessfulBank = false; }
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
      ? `赌注 ${formatGroschen(stake)} · 目标 ${getOpponentTarget(id)} 分`
      : `胜利奖励 +${formatGroschen(PRACTICE_REWARD)} · 目标 ${getOpponentTarget(id)} 分`;
    return `<button class="opponent-modal-card ${selected ? 'selected' : ''}" data-opponent="${id}" type="button"><span class="opponent-modal-avatar"><img src="${profile.avatar}" alt="${profile.name}头像" /></span><span class="opponent-modal-copy"><b>${profile.name}</b><small>${profile.role} · ${profile.riskLabel}打法</small><em>${priceCopy}</em></span><span class="opponent-modal-check">${selected ? '✓' : ''}</span></button>`;
  }).join('');
  els.opponentModalCards.querySelectorAll('[data-opponent]').forEach((card) => card.addEventListener('click', () => selectOpponent(card.dataset.opponent, { announce: false })));
  const stake = type === 'stake' ? (OPPONENT_STAKES[selectedId] || 0) : 0;
  const balance = state.wallet?.groschen || 0;
  const maxRisk = stake * LOSS_MULTIPLIER_CAP;
  const enough = type !== 'stake' || balance >= maxRisk;
  if (els.opponentModalStatus) els.opponentModalStatus.textContent = type === 'stake' ? (enough ? `入场需准备最高风险 ${formatGroschen(maxRisk)} · 基础赌注 ${formatGroschen(stake)} · 败局封顶 x${LOSS_MULTIPLIER_CAP}` : `余额不足：至少需准备 ${formatGroschen(maxRisk)}，当前仅有 ${formatGroschen(balance)}`) : `不收取赌注 · 倍率固定 x1 · 赢下一局奖励 ${formatGroschen(PRACTICE_REWARD)}`;
  if (els.opponentModalConfirm) { els.opponentModalConfirm.disabled = !enough; els.opponentModalConfirm.textContent = type === 'stake' ? `准备 ${formatGroschen(stake)} 坐下对弈` : '坐下对弈'; }
}

function openOpponentModal() {
  closeBoardMenu(); closeCollection(); closeDiceBoxModal(); closeDetailModal();
  if (!state.match?.active) setMatchType('practice');
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
    const equippedCard = state.collection?.equippedCard;
    const medals = state.collection?.equippedMedals || [];
    els.detailModalKicker.textContent = 'PLAYER DETAILS';
    els.detailModalTitle.textContent = 'LIORA · 旅人档案';
    els.detailModalSubtitle.textContent = '展示收藏请前往顶部的骰子、名片与勋章入口。';
    els.detailModalContent.innerHTML = `<div class="detail-profile-line"><div class="detail-avatar player-avatar"><span>L</span></div><div><b>LIORA</b><small>${matchTypeLabel()}</small></div></div><div class="detail-section"><div class="detail-section-title">已装备名片</div>${equippedCard ? `<img class="detail-card-art" src="${collectionAsset('cards', equippedCard)}" alt="已装备名片" />` : '<div class="detail-empty">尚未装备名片</div>'}</div><div class="detail-section"><div class="detail-section-title">已装备勋章</div><div class="detail-medal-row">${Array.from({ length: 3 }, (_, index) => medals[index] ? `<img src="${collectionAsset('medals', medals[index])}" alt="已装备勋章" />` : '<span>空槽</span>').join('')}</div></div>`;
    return;
  }
  if (mode === 'table') {
    els.detailModalKicker.textContent = 'TABLE DETAILS';
    els.detailModalTitle.textContent = '牌桌详情';
    els.detailModalSubtitle.textContent = '牌桌编号和详细规则不再占用主牌桌空间。';
    els.detailModalContent.innerHTML = `<div class="detail-stat-grid"><div><span>牌桌编号</span><b>${els.room?.textContent || state.room}</b></div><div><span>目标分数</span><b>${state.target} PTS</b></div><div><span>对局类型</span><b>${matchTypeLabel()}</b></div><div><span>当前余额</span><b>${formatGroschen(state.wallet?.groschen || 0)}</b></div><div><span>牌桌倍率</span><b>x${getTableMultiplier()}</b></div><div><span>败局封顶</span><b>x${LOSS_MULTIPLIER_CAP}</b></div></div><div class="detail-section detail-rules-callout"><div><b>详细规则说明</b><small>点数、顺子、爆骰与热骰规则保留在规则册中。</small></div><button class="table-info-button" id="detail-open-rules" type="button">打开规则</button></div>`;
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
  els.detailModalContent.innerHTML = `<div class="detail-profile-line"><div class="detail-avatar opponent-avatar"><img src="${profile.avatar}" alt="${profile.name}头像" /></div><div><b>${profile.role}</b><small>${profile.short} · 目标 ${getOpponentTarget(state.opponentId)} 分</small></div><span class="role-chip">${profile.riskLabel}</span></div><div class="detail-section"><div class="detail-section-title">打法性格</div><div class="detail-trait-row">${profile.traits.map((trait) => `<span>${trait}</span>`).join('')}</div><p class="detail-note">${profile.style}。AI 会根据当前分差、爆骰风险和剩余骰子动态调整决定。</p></div><div class="detail-section"><div class="detail-section-title">对手骰子组合</div><div class="detail-dice-grid">${profile.loadout.map((id, index) => { const die = dieById(id); const max = Math.max(...die.weights); const favored = die.weights.map((weight, value) => weight === max ? value + 1 : null).filter(Boolean).join('、'); return `<div class="detail-die-row"><span>${index + 1}</span><b>${die.name}</b><small>${die.desc} · 偏好 ${favored || '均衡'}</small></div>`; }).join('')}</div></div>`;
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

function beginMatch() {
  state.target = getOpponentTarget(state.opponentId);
  const type = state.match.type === 'stake' ? 'stake' : 'practice';
  const stake = type === 'stake' ? (OPPONENT_STAKES[state.opponentId] || 0) : 0;
  const maxRisk = stake * LOSS_MULTIPLIER_CAP;
  if (!state.wallet) state.wallet = loadWallet();
  if (type === 'stake' && state.wallet.groschen < maxRisk) { renderOpponentModal(); showToast(`余额不足：至少需要准备 ${formatGroschen(maxRisk)}（败局封顶 x${LOSS_MULTIPLIER_CAP}）`); return false; }
  state.match = { type, stake, entryPaid: false, settled: false, active: true, result: null, payout: 0, multiplier: DEFAULT_TABLE_MULTIPLIER, maxRaiseBy: { player: DEFAULT_TABLE_MULTIPLIER, ai: DEFAULT_TABLE_MULTIPLIER }, lastRaisedBy: null, lastRaiseOwner: null, lastRaiseRound: 0, raiseCount: 0, hasSuccessfulBank: false, maxRisk };
  return true;
}

function setBoardTheme(id) {
  const theme = BOARD_THEMES[id];
  if (!theme || id !== 'tavern-oak') { showToast('该棋盘主题将在后续版本加入'); return; }
  state.boardTheme = id;
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
  window.clearTimeout(turnTimer); clearOpponentActionTimer(true); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal(); dicePhysics3D.resetOwner?.('opponent'); els.arena.classList.add('hidden'); els.home.classList.remove('hidden');
}
function startGame() {
  if (!beginMatch()) return;
  safeAudio('startMusic'); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); resetGame(false); els.home.classList.add('hidden'); els.arena.classList.remove('hidden'); window.requestAnimationFrame(() => dicePhysics3D.resize?.()); showToast(`${matchTypeLabel()} · 与 ${opponents[state.opponentId].name} 开始对局`);
}

els.roll.addEventListener('click', rollDice); els.bank.addEventListener('click', bankScore); els.restoreLoadout?.addEventListener('click', restoreDefaultLoadout); $('#reset-button').addEventListener('click', () => resetGame()); els.restart.addEventListener('click', () => resetGame()); els.homeButton.addEventListener('click', showHome); $('#forfeit-button').addEventListener('click', () => { if (!state.gameOver) finishGame('opponent'); });
window.addEventListener('keydown', (event) => { if (event.code === 'Space' && !event.repeat) { event.preventDefault(); rollDice(); } if (event.code === 'KeyF' && !event.repeat) { takeScoringDice(); rollDice(); } if (event.code === 'KeyE' && !event.repeat) takeScoringDice(); if (event.code === 'KeyQ' && !event.repeat) bankScore(); if (event.code === 'KeyT' && !event.repeat) openCodex(0); if (event.code === 'KeyR' && !event.repeat) resetGame(); if (event.code === 'Escape') { closeCodex(); closeBoardMenu(); closeCollection(); closeOpponentModal(); closeDiceBoxModal(); closeDetailModal(); } });
  els.collectionTabs?.forEach((tab) => tab.addEventListener('click', () => openCollection(tab.dataset.collectionTab))); els.collectionClose?.addEventListener('click', closeCollection); els.openMedalCollection?.addEventListener('click', () => openCollection('medals'));
els.opponentModalClose?.addEventListener('click', closeOpponentModal); els.opponentModal?.addEventListener('click', (event) => { if (event.target === els.opponentModal) closeOpponentModal(); }); els.matchTypeButtons?.forEach((button) => button.addEventListener('click', () => setMatchType(button.dataset.matchType))); els.opponentModalConfirm?.addEventListener('click', startGame);
els.diceBoxClose?.addEventListener('click', closeDiceBoxModal); els.diceBoxModal?.addEventListener('click', (event) => { if (event.target === els.diceBoxModal) closeDiceBoxModal(); });
els.detailModalClose?.addEventListener('click', closeDetailModal); els.detailModal?.addEventListener('click', (event) => { if (event.target === els.detailModal) closeDetailModal(); }); els.playerDetailsButton?.addEventListener('click', () => openDetailModal('player')); els.opponentDetailsButton?.addEventListener('click', () => openDetailModal('opponent')); els.tableInfoButton?.addEventListener('click', () => openDetailModal('table')); els.rulesButton?.addEventListener('click', () => openCodex(0));
els.multiplierButtons?.forEach((button) => button.addEventListener('click', () => raiseTableMultiplier(button.dataset.multiplier, 'player')));
$('#guide-button')?.addEventListener('click', () => openCodex(1)); $('#open-dice-library')?.addEventListener('click', () => openCodex(2)); $('#modal-close').addEventListener('click', closeCodex); els.codexModal.addEventListener('click', (event) => { if (event.target === els.codexModal) closeCodex(); }); els.prev.addEventListener('click', () => setCodexPage(currentPage - 1)); els.next.addEventListener('click', () => setCodexPage(currentPage + 1));
 document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => { if (item.dataset.view === 'boards') return; if (item.dataset.view === 'collection' || item.dataset.view === 'dice-collection') { openCollection(item.dataset.collectionTab); return; } document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.toggle('active', nav === item)); if (item.dataset.view === 'game') { closeBoardMenu(); closeCollection(); } }));
function toggleSound() {
  const next = !audio.muted;
  audio.setMuted(next);
  els.soundToggle.textContent = next ? '◗' : '◖';
  els.soundToggle.setAttribute('aria-pressed', String(next));
  showToast(next ? '声音已静音' : '声音已开启');
  if (!next) { safeAudio('startMusic'); safeAudio('playClick'); }
}
function updateMusicVolumeUI(value) {
  const normalized = audio.setMusicVolume(value);
  if (els.musicVolume) els.musicVolume.value = String(normalized);
  if (els.musicVolumeValue) els.musicVolumeValue.textContent = `${normalized}%`;
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
$('#mode-toggle').addEventListener('click', toggleMode); els.soundToggle.addEventListener('click', toggleSound); $('#profile-button').addEventListener('click', () => showToast('旅人档案：LIORA')); $('#copy-room').addEventListener('click', async () => { try { await navigator.clipboard.writeText(els.room.textContent); showToast('牌桌编号已复制'); } catch { showToast(`牌桌编号：${els.room.textContent}`); } });
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

document.addEventListener('pointerdown', () => safeAudio('startMusic'), { once: true });

state.collection = loadCollection();
state.diceSkinCollection = loadDiceSkinCollection();
state.wallet = loadWallet();
renderWallet();
applyBoardTheme(state.boardTheme);
els.boardCards?.forEach((card) => card.classList.toggle('selected', card.dataset.boardTheme === state.boardTheme));
setCodexPage(0); resetGame(false); showHome();
  try { dicePhysics3D.init(); applyEquippedDiceSkin(); } catch (error) { console.warn('[dice:init]', error); }
