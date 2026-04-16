'use client';

import { useState } from 'react';
import { TYPES, PokemonType, TYPE_COLORS, TYPE_LABELS, getEffectiveness, getDefensiveMatchups } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

export default function TypeCheckerPage() {
  const [attackingType, setAttackingType] = useState<PokemonType | null>(null);
  const [defendingTypes, setDefendingTypes] = useState<PokemonType[]>([]);

  const toggleDefending = (t: PokemonType) => {
    setDefendingTypes((prev) => {
      if (prev.includes(t)) return prev.filter((x) => x !== t);
      if (prev.length >= 2) return [prev[1], t];
      return [...prev, t];
    });
  };

  const effectiveness =
    attackingType && defendingTypes.length > 0
      ? getEffectiveness(attackingType, defendingTypes)
      : null;

  const matchups = defendingTypes.length > 0 ? getDefensiveMatchups(defendingTypes) : null;

  const multColor = (m: number) => {
    if (m === 0) return 'bg-gray-200 text-gray-600';
    if (m === 0.25) return 'bg-blue-200 text-blue-800';
    if (m === 0.5) return 'bg-blue-100 text-blue-700';
    if (m === 2) return 'bg-red-100 text-red-700';
    if (m === 4) return 'bg-red-200 text-red-800';
    return 'bg-gray-100 text-gray-600';
  };

  const multLabel = (m: number) => {
    if (m === 0) return '×0 無効';
    if (m === 0.25) return '×¼ 1/4倍';
    if (m === 0.5) return '×½ 半減';
    if (m === 1) return '×1 等倍';
    if (m === 2) return '×2 2倍';
    if (m === 4) return '×4 4倍';
    return `×${m}`;
  };

  const bigMultColor = (m: number) => {
    if (m === 0) return 'text-gray-500';
    if (m <= 0.5) return 'text-blue-600';
    if (m >= 4) return 'text-red-700';
    if (m >= 2) return 'text-red-500';
    return 'text-gray-700';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">⚔️ タイプ相性チェッカー</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold mb-3 text-gray-700">攻撃タイプを選択</h2>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setAttackingType(attackingType === t ? null : t)}
                className={`px-3 py-1 rounded-full text-white text-sm font-semibold transition-all ${
                  attackingType === t ? 'ring-4 ring-yellow-400 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: TYPE_COLORS[t] }}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-bold mb-3 text-gray-700">防御タイプを選択（最大2つ）</h2>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => toggleDefending(t)}
                className={`px-3 py-1 rounded-full text-white text-sm font-semibold transition-all ${
                  defendingTypes.includes(t) ? 'ring-4 ring-yellow-400 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: TYPE_COLORS[t] }}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          {defendingTypes.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">選択中:</span>
              {defendingTypes.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>

      {effectiveness !== null && attackingType && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-lg font-bold mb-3 text-gray-700">ダメージ倍率</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <TypeBadge type={attackingType} />
            <span className="text-gray-400 text-xl">→</span>
            <div className="flex gap-2">
              {defendingTypes.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
            <span className={`text-3xl font-bold ${bigMultColor(effectiveness)}`}>
              {multLabel(effectiveness)}
            </span>
          </div>
        </div>
      )}

      {matchups && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h2 className="text-lg font-bold mb-4 text-gray-700 flex items-center gap-2">
            防御タイプの相性一覧
            <span className="flex gap-1">
              {defendingTypes.map((t) => (
                <TypeBadge key={t} type={t} size="sm" />
              ))}
            </span>
          </h2>

          <div className="space-y-4">
            {matchups.weaknesses4x.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-700 mb-2">4倍弱点 🔴🔴</h3>
                <div className="flex flex-wrap gap-2">
                  {matchups.weaknesses4x.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {matchups.weaknesses2x.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-500 mb-2">2倍弱点 🔴</h3>
                <div className="flex flex-wrap gap-2">
                  {matchups.weaknesses2x.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {matchups.resistances.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-500 mb-2">半減 🔵</h3>
                <div className="flex flex-wrap gap-2">
                  {matchups.resistances.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {matchups.resistances4x.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">1/4倍 🔵🔵</h3>
                <div className="flex flex-wrap gap-2">
                  {matchups.resistances4x.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {matchups.immunities.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-500 mb-2">無効 ⚫</h3>
                <div className="flex flex-wrap gap-2">
                  {matchups.immunities.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full type chart grid */}
      {attackingType && (
        <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
          <h2 className="text-lg font-bold mb-4 text-gray-700">
            <TypeBadge type={attackingType} /> の攻撃効果一覧
          </h2>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((defType) => {
              const mult = getEffectiveness(attackingType, [defType]);
              return (
                <div
                  key={defType}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold ${multColor(mult)}`}
                >
                  <TypeBadge type={defType} size="sm" />
                  <span>{multLabel(mult)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
