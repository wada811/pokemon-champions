'use client';

import { useState } from 'react';
import { PokemonType, TYPES, TYPE_CHART, getDefensiveMatchups } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

interface PokemonMember {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  stats: { hp: number; attack: number; defense: number; spAtk: number; spDef: number; speed: number };
  sprite: string;
}

const STAT_NAMES: Record<string, string> = {
  hp: 'HP',
  attack: '攻撃',
  defense: '防御',
  spAtk: '特攻',
  spDef: '特防',
  speed: '素早',
};

const TYPE_API_MAP: Record<string, PokemonType> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
  grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
  ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
  rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
  steel: 'Steel', fairy: 'Fairy',
};

const STAT_API_MAP: Record<string, keyof PokemonMember['stats']> = {
  hp: 'hp', attack: 'attack', defense: 'defense',
  'special-attack': 'spAtk', 'special-defense': 'spDef', speed: 'speed',
};

export default function TeamBuilderPage() {
  const [team, setTeam] = useState<PokemonMember[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPokemon = async () => {
    if (!search.trim()) return;
    if (team.length >= 6) { setError('チームは6匹までです'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`);
      if (!res.ok) throw new Error('ポケモンが見つかりません');
      const data = await res.json();

      const types: PokemonType[] = data.types
        .map((t: { type: { name: string } }) => TYPE_API_MAP[t.type.name])
        .filter(Boolean);

      const stats: PokemonMember['stats'] = { hp: 0, attack: 0, defense: 0, spAtk: 0, spDef: 0, speed: 0 };
      for (const s of data.stats) {
        const key = STAT_API_MAP[s.stat.name];
        if (key) stats[key] = s.base_stat;
      }

      const member: PokemonMember = {
        id: data.id,
        name: data.name,
        displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types,
        stats,
        sprite: data.sprites.front_default || '',
      };
      setTeam((prev) => [...prev, member]);
      setSearch('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const removePokemon = (idx: number) => {
    setTeam((prev) => prev.filter((_, i) => i !== idx));
  };

  // Aggregate type weaknesses across team
  const weaknessCounts: Partial<Record<PokemonType, number>> = {};
  const immunityCounts: Partial<Record<PokemonType, number>> = {};

  for (const member of team) {
    const { weaknesses2x, weaknesses4x, immunities } = getDefensiveMatchups(member.types);
    for (const t of [...weaknesses2x, ...weaknesses4x]) {
      weaknessCounts[t] = (weaknessCounts[t] || 0) + 1;
    }
    for (const t of immunities) {
      immunityCounts[t] = (immunityCounts[t] || 0) + 1;
    }
  }

  const sharedWeaknesses = (Object.entries(weaknessCounts) as [PokemonType, number][])
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1]);

  // Type coverage - which types are covered offensively (2x+) by at least one team member
  // A defending type is "covered" if at least one member's type deals super effective damage to it
  const coveredTypes = new Set<PokemonType>();
  for (const member of team) {
    for (const memberType of member.types) {
      for (const defType of TYPES) {
        if (TYPE_CHART[memberType][defType] > 1) {
          coveredTypes.add(defType);
        }
      }
    }
  }
  const uncoveredTypes = TYPES.filter((t) => !coveredTypes.has(t));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">👥 チームビルダー</h1>

      {/* Search */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3">ポケモンを追加（英語名 or 図鑑番号）</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPokemon()}
            placeholder="例: pikachu, charizard, 25"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addPokemon}
            disabled={loading || team.length >= 6}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '検索中...' : '追加'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        <p className="mt-2 text-sm text-gray-400">チーム: {team.length} / 6</p>
      </div>

      {/* Team members */}
      {team.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {team.map((p, idx) => (
            <div key={`${p.name}-${idx}`} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {p.sprite && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.sprite} alt={p.displayName} className="w-12 h-12 object-contain" />
                  )}
                  <div>
                    <p className="font-bold text-gray-800">{p.displayName}</p>
                    <p className="text-xs text-gray-400">No.{p.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => removePokemon(idx)}
                  className="text-red-400 hover:text-red-600 text-lg"
                  title="削除"
                >
                  ✕
                </button>
              </div>
              <div className="flex gap-1 mb-3">
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(p.stats).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <p className="text-xs text-gray-400">{STAT_NAMES[key]}</p>
                    <p className="text-sm font-semibold text-gray-700">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {team.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-3">⚠️ 共通の弱点</h2>
            {sharedWeaknesses.length === 0 ? (
              <p className="text-green-600 text-sm">共通の弱点はありません 👍</p>
            ) : (
              <div className="space-y-2">
                {sharedWeaknesses.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-3">
                    <TypeBadge type={type} size="sm" />
                    <div className="flex gap-1">
                      {Array.from({ length: count }).map((_, i) => (
                        <span key={i} className="text-red-500">🔴</span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{count}体が弱点</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-3">🗺️ タイプカバレッジ</h2>
            {uncoveredTypes.length === 0 ? (
              <p className="text-green-600 text-sm">全タイプをカバーしています 🎉</p>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-2">カバーできていないタイプ:</p>
                <div className="flex flex-wrap gap-2">
                  {uncoveredTypes.map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
            {coveredTypes.size > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">カバー済みタイプ ({coveredTypes.size}/18):</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.filter((t) => coveredTypes.has(t)).map((t) => (
                    <TypeBadge key={t} type={t} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {team.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">🏟️</p>
          <p className="text-lg">ポケモンを追加してチームを作りましょう</p>
        </div>
      )}
    </div>
  );
}
