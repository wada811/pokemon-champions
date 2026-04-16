'use client';

import { useState, useEffect } from 'react';
import { PokemonType, TYPES, getDefensiveMatchups } from '@/data/typeChart';
import TypeBadge from '@/components/TypeBadge';

interface MetaEntry {
  id: string;
  name: string;
  displayName: string;
  types: PokemonType[];
  sprite: string;
  notes: string;
  usageCount: number;
  addedAt: number;
}

const TYPE_API_MAP: Record<string, PokemonType> = {
  normal: 'Normal', fire: 'Fire', water: 'Water', electric: 'Electric',
  grass: 'Grass', ice: 'Ice', fighting: 'Fighting', poison: 'Poison',
  ground: 'Ground', flying: 'Flying', psychic: 'Psychic', bug: 'Bug',
  rock: 'Rock', ghost: 'Ghost', dragon: 'Dragon', dark: 'Dark',
  steel: 'Steel', fairy: 'Fairy',
};

const STORAGE_KEY = 'pokemon-meta-entries';

function loadEntries(): MetaEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: MetaEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function MetaPage() {
  const [entries, setEntries] = useState<MetaEntry[]>([]);
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEntries(loadEntries());
  }, []);

  const updateEntries = (next: MetaEntry[]) => {
    setEntries(next);
    saveEntries(next);
  };

  const addEntry = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase().trim()}`);
      if (!res.ok) throw new Error('ポケモンが見つかりません');
      const data = await res.json();

      const types: PokemonType[] = data.types
        .map((t: { type: { name: string } }) => TYPE_API_MAP[t.type.name])
        .filter(Boolean);

      // Increment count if already exists
      const existing = entries.find((e) => e.name === data.name);
      if (existing) {
        updateEntries(
          entries.map((e) =>
            e.name === data.name ? { ...e, usageCount: e.usageCount + 1, notes: notes || e.notes } : e
          )
        );
      } else {
        const entry: MetaEntry = {
          id: `${data.id}-${Date.now()}`,
          name: data.name,
          displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          types,
          sprite: data.sprites.front_default || '',
          notes,
          usageCount: 1,
          addedAt: Date.now(),
        };
        updateEntries([...entries, entry]);
      }
      setSearch('');
      setNotes('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const removeEntry = (id: string) => {
    updateEntries(entries.filter((e) => e.id !== id));
  };

  const incrementCount = (id: string) => {
    updateEntries(entries.map((e) => (e.id === id ? { ...e, usageCount: e.usageCount + 1 } : e)));
  };

  // Suggest counters: find types that are super effective against most meta pokemon
  const typeScores: Partial<Record<PokemonType, number>> = {};
  for (const entry of entries) {
    for (const attackType of TYPES) {
      const mult = entry.types.reduce(
        (acc, dt) => acc * (getDefensiveMatchups([dt]).weaknesses2x.includes(attackType) ||
          getDefensiveMatchups([dt]).weaknesses4x.includes(attackType) ? 2 : 1),
        1
      );
      if (mult > 1) {
        typeScores[attackType] = (typeScores[attackType] || 0) + entry.usageCount;
      }
    }
  }

  const suggestedTypes = (Object.entries(typeScores) as [PokemonType, number][])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const sortedEntries = [...entries].sort((a, b) => b.usageCount - a.usageCount);

  if (!mounted) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 メタ分析</h1>

      {/* Add entry */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3">使用ポケモンを記録</h2>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEntry()}
              placeholder="ポケモン名（英語）または図鑑番号"
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={addEntry}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '検索中...' : '記録'}
            </button>
          </div>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="メモ（型・技構成など）"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meta list */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              記録済みポケモン ({entries.length}匹)
            </h2>
            {sortedEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-4xl mb-2">📝</p>
                <p>まだ記録がありません</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sortedEntries.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    {entry.sprite && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.sprite} alt={entry.displayName} className="w-12 h-12 object-contain shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{entry.displayName}</span>
                        <div className="flex gap-1">
                          {entry.types.map((t) => (
                            <TypeBadge key={t} type={t} size="sm" />
                          ))}
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{entry.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => incrementCount(entry.id)}
                        className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                      >
                        使用回数: {entry.usageCount}回 +
                      </button>
                      <button
                        onClick={() => removeEntry(entry.id)}
                        className="text-red-400 hover:text-red-600"
                        title="削除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-gray-700 mb-3">💡 対策タイプ提案</h2>
            {entries.length === 0 ? (
              <p className="text-gray-400 text-sm">ポケモンを記録すると対策タイプが提案されます</p>
            ) : suggestedTypes.length === 0 ? (
              <p className="text-gray-400 text-sm">分析できませんでした</p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">使用回数を加味した弱点を突けるタイプ:</p>
                {suggestedTypes.map(([type, score]) => (
                  <div key={type} className="flex items-center gap-3">
                    <TypeBadge type={type} />
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (score / (suggestedTypes[0]?.[1] || 1)) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">スコア: {score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {entries.length > 0 && (
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="text-lg font-bold text-gray-700 mb-3">📈 統計</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">記録ポケモン数</span>
                  <span className="font-semibold">{entries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">総使用回数</span>
                  <span className="font-semibold">{entries.reduce((s, e) => s + e.usageCount, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">最多使用</span>
                  <span className="font-semibold">
                    {sortedEntries[0]?.displayName} ({sortedEntries[0]?.usageCount}回)
                  </span>
                </div>
              </div>
            </div>
          )}

          {entries.length > 0 && (
            <button
              onClick={() => {
                if (confirm('全データを削除しますか？')) updateEntries([]);
              }}
              className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-100 transition-colors"
            >
              全データをリセット
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
