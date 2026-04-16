'use client';

import { useState } from 'react';
import { PokemonType } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

interface PokemonData {
  id: number;
  name: string;
  displayName: string;
  types: PokemonType[];
  stats: { name: string; value: number }[];
  abilities: { name: string; isHidden: boolean }[];
  moves: string[];
  sprite: string;
  height: number;
  weight: number;
}

const TYPE_API_MAP: Record<string, PokemonType> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
  grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
  ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
  rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
  steel: 'Steel', fairy: 'Fairy',
};

const STAT_JP: Record<string, string> = {
  hp: 'HP',
  attack: '攻撃',
  defense: '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  speed: '素早さ',
};

const STAT_COLOR: Record<string, string> = {
  hp: 'bg-red-400',
  attack: 'bg-orange-400',
  defense: 'bg-yellow-400',
  'special-attack': 'bg-blue-400',
  'special-defense': 'bg-green-400',
  speed: 'bg-pink-400',
};

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAllMoves, setShowAllMoves] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setPokemon(null);
    setShowAllMoves(false);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase().trim()}`);
      if (!res.ok) throw new Error('ポケモンが見つかりません。英語名か図鑑番号を入力してください。');
      const data = await res.json();

      const types: PokemonType[] = data.types
        .map((t: { type: { name: string } }) => TYPE_API_MAP[t.type.name])
        .filter(Boolean);

      const stats = data.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        value: s.base_stat,
      }));

      const abilities = data.abilities.map((a: { ability: { name: string }; is_hidden: boolean }) => ({
        name: a.ability.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        isHidden: a.is_hidden,
      }));

      const moves = data.moves
        .map((m: { move: { name: string } }) =>
          m.move.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
        )
        .sort();

      setPokemon({
        id: data.id,
        name: data.name,
        displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        types,
        stats,
        abilities,
        moves,
        sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default || '',
        height: data.height,
        weight: data.weight,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const totalStats = pokemon?.stats.reduce((sum, s) => sum + s.value, 0) || 0;
  const displayedMoves = showAllMoves ? pokemon?.moves : pokemon?.moves.slice(0, 20);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📖 ポケモンデータベース</h1>

      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3">ポケモンを検索（英語名 or 図鑑番号）</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
            placeholder="例: pikachu, charizard, bulbasaur, 25"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={search}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      {pokemon && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex items-start gap-6 flex-wrap">
              {pokemon.sprite && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pokemon.sprite}
                  alt={pokemon.displayName}
                  className="w-32 h-32 object-contain"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{pokemon.displayName}</h2>
                  <span className="text-gray-400 text-lg">No.{pokemon.id}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  {pokemon.types.map((t) => (
                    <TypeBadge key={t} type={t} size="lg" />
                  ))}
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span>身長: {(pokemon.height / 10).toFixed(1)}m</span>
                  <span>体重: {(pokemon.weight / 10).toFixed(1)}kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              種族値 <span className="text-gray-400 font-normal text-base">合計: {totalStats}</span>
            </h3>
            <div className="space-y-3">
              {pokemon.stats.map((s) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-16 shrink-0">{STAT_JP[s.name] || s.name}</span>
                  <span className="text-sm font-semibold text-gray-700 w-8 text-right shrink-0">{s.value}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${STAT_COLOR[s.name] || 'bg-gray-400'}`}
                      style={{ width: `${Math.min(100, (s.value / 255) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold text-gray-700 mb-3">特性</h3>
            <div className="flex flex-wrap gap-3">
              {pokemon.abilities.map((a) => (
                <div
                  key={a.name}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    a.isHidden
                      ? 'bg-purple-100 text-purple-700 border border-purple-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {a.name}
                  {a.isHidden && <span className="ml-1 text-xs">(夢特性)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Moves */}
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-bold text-gray-700 mb-3">
              覚える技 <span className="text-gray-400 font-normal text-base">({pokemon.moves.length}種)</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {displayedMoves?.map((move) => (
                <span key={move} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                  {move}
                </span>
              ))}
            </div>
            {pokemon.moves.length > 20 && (
              <button
                onClick={() => setShowAllMoves((v) => !v)}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                {showAllMoves ? '一部のみ表示' : `全${pokemon.moves.length}種表示`}
              </button>
            )}
          </div>
        </div>
      )}

      {!pokemon && !loading && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-lg">ポケモン名を入力して検索してください</p>
          <p className="text-sm mt-2">例: pikachu, charizard, mewtwo</p>
        </div>
      )}
    </div>
  );
}
