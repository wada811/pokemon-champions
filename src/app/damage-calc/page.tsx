'use client';

import { useState } from 'react';
import { TYPES, PokemonType, TYPE_COLORS, TYPE_LABELS, getEffectiveness } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

export default function DamageCalcPage() {
  const [movePower, setMovePower] = useState(80);
  const [moveType, setMoveType] = useState<PokemonType>('Normal');
  const [category, setCategory] = useState<'physical' | 'special'>('physical');
  const [stab, setStab] = useState(false);
  const [attackStat, setAttackStat] = useState(100);
  const [defenseStat, setDefenseStat] = useState(100);
  const [defenderTypes, setDefenderTypes] = useState<PokemonType[]>(['Normal']);
  const [level, setLevel] = useState(50);

  const toggleDefType = (t: PokemonType) => {
    setDefenderTypes((prev) => {
      if (prev.includes(t)) return prev.length > 1 ? prev.filter((x) => x !== t) : prev;
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  };

  const typeEffectiveness = getEffectiveness(moveType, defenderTypes);
  const stabMult = stab ? 1.5 : 1;

  // Standard damage formula (simplified Gen 6+)
  const baseDamage = Math.floor(
    Math.floor(
      Math.floor((2 * level) / 5 + 2) * movePower * (attackStat / defenseStat) / 50
    ) + 2
  );
  const minDamage = Math.floor(baseDamage * stabMult * typeEffectiveness * 0.85);
  const maxDamage = Math.floor(baseDamage * stabMult * typeEffectiveness * 1.0);

  const defenderHP = defenseStat * 2 + 100 + 10; // estimate HP from Defense with base stat assumption
  const hpForCalc = Math.floor(((defenseStat * 2 + 31 + 5) * level) / 100 + level + 10);

  const hitsToKOMin = maxDamage > 0 ? Math.ceil(hpForCalc / maxDamage) : Infinity;
  const hitsToKOMax = minDamage > 0 ? Math.ceil(hpForCalc / minDamage) : Infinity;

  const pctMin = hpForCalc > 0 ? ((minDamage / hpForCalc) * 100).toFixed(1) : '0';
  const pctMax = hpForCalc > 0 ? ((maxDamage / hpForCalc) * 100).toFixed(1) : '0';

  const multColor = (m: number) => {
    if (m === 0) return 'text-gray-500';
    if (m < 1) return 'text-blue-600';
    if (m > 1) return 'text-red-600';
    return 'text-gray-700';
  };

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {category === 'physical' ? '攻撃' : '特攻'}（実数値）
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={attackStat}
                onChange={(e) => setAttackStat(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {category === 'physical' ? '防御' : '特防'}（実数値）
              </label>
              <input
                type="number"
                min={1}
                max={999}
                value={defenseStat}
                onChange={(e) => setDefenseStat(Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              防御側タイプ（最大2つ）
            </label>
            <div className="flex flex-wrap gap-2">
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

      {/* Results */}
      <div className="mt-6 bg-white rounded-xl shadow p-5">
        <h2 className="text-lg font-bold text-gray-700 mb-4">計算結果</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">タイプ相性</p>
            <p className={`text-2xl font-bold ${multColor(typeEffectiveness)}`}>×{typeEffectiveness}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">STAB倍率</p>
            <p className="text-2xl font-bold text-gray-700">×{stabMult}</p>
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
          <p className="text-blue-800 font-semibold text-lg">
            KO に必要なヒット数:{' '}
            {hitsToKOMin === hitsToKOMax
              ? `${hitsToKOMin}回`
              : `${hitsToKOMin}〜${hitsToKOMax}回`}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            ※ 相手のHPを防御の実数値から推定（Lv.{level} 種族値100換算）
          </p>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
          <p>計算式: floor(floor(floor((Lv×2÷5+2) × 威力 × 攻撃÷防御 ÷ 50) + 2) × STAB × タイプ相性 × 乱数(0.85～1.0))</p>
          <p>攻撃: {attackStat} / 防御: {defenseStat} / 威力: {movePower} / 倍率: ×{(stabMult * typeEffectiveness).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
