'use client';

import { useState } from 'react';
import { TYPES, PokemonType, TYPE_COLORS, TYPE_LABELS, getEffectiveness } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

type NatureModifier = 'up' | 'neutral' | 'down';

const NATURE_LABELS: Record<NatureModifier, string> = {
  up: '↑ ×1.1',
  neutral: '等倍 ×1.0',
  down: '↓ ×0.9',
};

const NATURE_MULT: Record<NatureModifier, number> = {
  up: 1.1,
  neutral: 1.0,
  down: 0.9,
};

type ItemBonus = 'none' | 'choice' | 'lifeorb' | 'punch' | 'burn' | 'reflect' | 'lightscreen';

const ITEM_LABELS: Record<ItemBonus, string> = {
  none: 'なし',
  choice: 'こだわり系 ×1.5',
  lifeorb: 'いのちのたま ×1.3',
  punch: 'パンチグローブ ×1.1',
  burn: 'やけど（物理） ×0.5',
  reflect: 'リフレクター ×0.5',
  lightscreen: 'ひかりのかべ ×0.5',
};

const ITEM_MULT: Record<ItemBonus, number> = {
  none: 1.0,
  choice: 1.5,
  lifeorb: 1.3,
  punch: 1.1,
  burn: 0.5,
  reflect: 0.5,
  lightscreen: 0.5,
};

export default function DamageCalcPage() {
  const [movePower, setMovePower] = useState(80);
  const [moveType, setMoveType] = useState<PokemonType>('Normal');
  const [category, setCategory] = useState<'physical' | 'special'>('physical');
  const [stab, setStab] = useState(false);
  const [attackStat, setAttackStat] = useState(100);
  const [attackNature, setAttackNature] = useState<NatureModifier>('neutral');
  const [attackItem, setAttackItem] = useState<ItemBonus>('none');
  const [defenseStat, setDefenseStat] = useState(100);
  const [defenseNature, setDefenseNature] = useState<NatureModifier>('neutral');
  const [defenseItem, setDefenseItem] = useState<ItemBonus>('none');
  const [hpStat, setHpStat] = useState(155);
  const [defenderTypes, setDefenderTypes] = useState<PokemonType[]>(['Normal']);
  const [level, setLevel] = useState(50);
  // Speed comparison
  const [attackerSpeed, setAttackerSpeed] = useState(100);
  const [defenderSpeed, setDefenderSpeed] = useState(100);
  const [attackerPriority, setAttackerPriority] = useState(0);
  const [defenderPriority, setDefenderPriority] = useState(0);

  const toggleDefType = (t: PokemonType) => {
    setDefenderTypes((prev) => {
      if (prev.includes(t)) return prev.length > 1 ? prev.filter((x) => x !== t) : prev;
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  };

  const typeEffectiveness = getEffectiveness(moveType, defenderTypes);
  const stabMult = stab ? 1.5 : 1;

  const effectiveAttack = Math.floor(attackStat * NATURE_MULT[attackNature]);
  const effectiveDefense = Math.floor(defenseStat * NATURE_MULT[defenseNature]);
  const attackItemMult = ITEM_MULT[attackItem];
  const defenseItemMult = ITEM_MULT[defenseItem];

  // Standard damage formula Gen 6+:
  // floor(floor(floor(floor(2*L/5+2) * Power * A / D) / 50) + 2) * Mods * random(0.85..1.0)
  const step1 = Math.floor((2 * level) / 5 + 2);
  const step2 = Math.floor(step1 * movePower * effectiveAttack / effectiveDefense / 50);
  const baseDamage = step2 + 2;
  const totalMult = stabMult * typeEffectiveness * attackItemMult * defenseItemMult;
  const minDamage = Math.floor(baseDamage * totalMult * 0.85);
  const maxDamage = Math.floor(baseDamage * totalMult * 1.0);

  const hitsToKOMin = maxDamage > 0 ? Math.ceil(hpStat / maxDamage) : Infinity;
  const hitsToKOMax = minDamage > 0 ? Math.ceil(hpStat / minDamage) : Infinity;

  const pctMin = hpStat > 0 ? ((minDamage / hpStat) * 100).toFixed(1) : '0';
  const pctMax = hpStat > 0 ? ((maxDamage / hpStat) * 100).toFixed(1) : '0';

  const multColor = (m: number) => {
    if (m === 0) return 'text-gray-500';
    if (m < 1) return 'text-blue-600';
    if (m > 1) return 'text-red-600';
    return 'text-gray-700';
  };

  // Speed comparison
  const attackerGoesFirst =
    attackerPriority > defenderPriority ||
    (attackerPriority === defenderPriority && attackerSpeed > defenderSpeed);
  const speedTie = attackerPriority === defenderPriority && attackerSpeed === defenderSpeed;

  const koResult = () => {
    const pctMaxNum = parseFloat(pctMax);
    if (pctMaxNum >= 100) return { label: '確定1発', color: 'text-red-700' };
    if (pctMinNum >= 100) return { label: '乱数1発', color: 'text-red-500' };
    if (hitsToKOMin <= 2) return { label: `確定${hitsToKOMin}発`, color: 'text-orange-600' };
    return { label: `${hitsToKOMin}〜${hitsToKOMax}発`, color: 'text-gray-700' };
  };
  const pctMinNum = parseFloat(pctMin);
  const ko = koResult();

  const ATTACK_ITEMS: ItemBonus[] = ['none', 'choice', 'lifeorb', 'punch', 'burn'];
  const DEFENSE_ITEMS: ItemBonus[] = ['none', 'reflect', 'lightscreen'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💥 ダメージ計算機</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Move settings */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <h2 className="text-lg font-bold text-gray-700">技の設定</h2>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">技タイプ</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setMoveType(t)}
                  className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold transition-all ${
                    moveType === t ? 'ring-4 ring-yellow-400 scale-110' : 'opacity-60 hover:opacity-90'
                  }`}
                  style={{ backgroundColor: TYPE_COLORS[t] }}
                >
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">威力</label>
              <input
                type="number"
                min={1}
                max={250}
                value={movePower}
                onChange={(e) => setMovePower(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">レベル</label>
              <input
                type="number"
                min={1}
                max={100}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">分類</label>
            <div className="flex gap-3">
              {(['physical', 'special'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    category === c
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c === 'physical' ? '物理' : '特殊'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="stab"
              checked={stab}
              onChange={(e) => setStab(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="stab" className="text-sm font-medium text-gray-600">
              STAB（タイプ一致）×1.5
            </label>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <h2 className="text-lg font-bold text-gray-700">ステータス設定</h2>

          {/* Attacker */}
          <div className="border rounded-lg p-3 space-y-3">
            <p className="text-sm font-semibold text-gray-600">攻撃側</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {category === 'physical' ? '攻撃' : '特攻'}（実数値）
                </label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={attackStat}
                  onChange={(e) => setAttackStat(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">性格補正</label>
                <div className="flex gap-1">
                  {(['up', 'neutral', 'down'] as NatureModifier[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setAttackNature(n)}
                      className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                        attackNature === n
                          ? n === 'up' ? 'bg-red-500 text-white'
                            : n === 'down' ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {n === 'up' ? '↑' : n === 'down' ? '↓' : '－'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{NATURE_LABELS[attackNature]}</p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">道具・状態補正（攻撃側）</label>
              <div className="flex flex-wrap gap-1">
                {ATTACK_ITEMS.map((item) => (
                  <button
                    key={item}
                    onClick={() => setAttackItem(item)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      attackItem === item
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {ITEM_LABELS[item]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Defender */}
          <div className="border rounded-lg p-3 space-y-3">
            <p className="text-sm font-semibold text-gray-600">防御側</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  {category === 'physical' ? '防御' : '特防'}（実数値）
                </label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={defenseStat}
                  onChange={(e) => setDefenseStat(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">性格補正</label>
                <div className="flex gap-1">
                  {(['up', 'neutral', 'down'] as NatureModifier[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setDefenseNature(n)}
                      className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                        defenseNature === n
                          ? n === 'up' ? 'bg-red-500 text-white'
                            : n === 'down' ? 'bg-blue-500 text-white'
                            : 'bg-gray-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {n === 'up' ? '↑' : n === 'down' ? '↓' : '－'}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{NATURE_LABELS[defenseNature]}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">HP（実数値）</label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={hpStat}
                  onChange={(e) => setHpStat(Number(e.target.value))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">防御側補正</label>
                <div className="flex flex-wrap gap-1">
                  {DEFENSE_ITEMS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setDefenseItem(item)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        defenseItem === item
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {ITEM_LABELS[item]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">防御側タイプ（最大2つ）</label>
              <div className="flex flex-wrap gap-1">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleDefType(t)}
                    className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold transition-all ${
                      defenderTypes.includes(t) ? 'ring-4 ring-yellow-400 scale-110' : 'opacity-60 hover:opacity-90'
                    }`}
                    style={{ backgroundColor: TYPE_COLORS[t] }}
                  >
                    {TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex gap-2">
                {defenderTypes.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold text-gray-700 mb-4">計算結果</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">タイプ相性</p>
            <p className={`text-2xl font-bold ${multColor(typeEffectiveness)}`}>×{typeEffectiveness}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">総合倍率</p>
            <p className="text-2xl font-bold text-gray-700">×{totalMult.toFixed(2)}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">ダメージ範囲</p>
            <p className="text-xl font-bold text-orange-600">
              {minDamage} ～ {maxDamage}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">割合ダメージ</p>
            <p className="text-xl font-bold text-red-600">
              {pctMin}% ～ {pctMax}%
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className={`font-semibold text-2xl ${ko.color}`}>
            {ko.label} — {pctMin}%〜{pctMax}%
          </p>
          <p className="text-sm text-blue-600 mt-1">
            相手HP: {hpStat} / ダメージ: {minDamage}〜{maxDamage}
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p>計算式: floor(floor(floor((Lv×2÷5+2) × 威力 × 攻撃÷防御 ÷ 50) + 2) × STAB × タイプ相性 × 道具補正 × 乱数(0.85～1.0))</p>
          <p>実数攻撃: {effectiveAttack} / 実数防御: {effectiveDefense} / 威力: {movePower} / 総合倍率: ×{totalMult.toFixed(3)}</p>
        </div>
      </div>

      {/* Speed comparison */}
      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold text-gray-700 mb-4">⚡ 素早さ比較</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600">自分のポケモン</p>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">素早さ（実数値）</label>
              <input
                type="number"
                min={1}
                max={999}
                value={attackerSpeed}
                onChange={(e) => setAttackerSpeed(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">優先度</label>
              <div className="flex gap-2">
                {[-1, 0, 1, 2].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAttackerPriority(p)}
                    className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                      attackerPriority === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p > 0 ? `+${p}` : p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-600">相手のポケモン</p>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">素早さ（実数値）</label>
              <input
                type="number"
                min={1}
                max={999}
                value={defenderSpeed}
                onChange={(e) => setDefenderSpeed(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">優先度</label>
              <div className="flex gap-2">
                {[-1, 0, 1, 2].map((p) => (
                  <button
                    key={p}
                    onClick={() => setDefenderPriority(p)}
                    className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors ${
                      defenderPriority === p ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p > 0 ? `+${p}` : p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-4 p-4 rounded-lg text-center ${
          speedTie ? 'bg-yellow-50' : attackerGoesFirst ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {speedTie ? (
            <p className="text-yellow-700 font-bold text-xl">⚖️ 同速（ランダム）</p>
          ) : attackerGoesFirst ? (
            <p className="text-green-700 font-bold text-xl">✅ 自分が先攻（{attackerSpeed} vs {defenderSpeed}）</p>
          ) : (
            <p className="text-red-700 font-bold text-xl">❌ 相手が先攻（{defenderSpeed} vs {attackerSpeed}）</p>
          )}
          {!speedTie && attackerPriority !== defenderPriority && (
            <p className="text-sm mt-1 text-gray-500">優先度の差により決定（自: {attackerPriority > 0 ? `+${attackerPriority}` : attackerPriority} / 相: {defenderPriority > 0 ? `+${defenderPriority}` : defenderPriority}）</p>
          )}
        </div>
      </div>
    </div>
  );
}
