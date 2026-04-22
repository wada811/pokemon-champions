import Link from 'next/link';

const features = [
  {
    href: '/type-checker',
    title: 'タイプ相性チェッカー',
    description: '攻撃タイプと防御タイプを選択して、ダメージ倍率を確認。弱点・耐性・無効を表示します。',
    emoji: '⚔️',
    color: 'bg-red-50 border-red-300 hover:border-red-400',
  },
  {
    href: '/damage-calc',
    title: 'ダメージ計算機',
    description: '技の威力・タイプ・攻撃側/防御側のステータスから実際のダメージを計算します。',
    emoji: '💥',
    color: 'bg-orange-50 border-orange-300 hover:border-orange-400',
  },
  {
    href: '/team-builder',
    title: 'チームビルダー',
    description: '最大6匹のポケモンでチームを構築。タイプカバレッジと共通の弱点を可視化します。',
    emoji: '👥',
    color: 'bg-blue-50 border-blue-300 hover:border-blue-400',
  },
  {
    href: '/pokedex',
    title: 'ポケモンデータベース',
    description: '名前でポケモンを検索。種族値・特性・覚える技を確認できます。',
    emoji: '📖',
    color: 'bg-green-50 border-green-300 hover:border-green-400',
  },
  {
    href: '/meta',
    title: 'メタ分析',
    description: 'よく使われるポケモン/型を記録し、対策となるポケモンを提案します。',
    emoji: '📊',
    color: 'bg-purple-50 border-purple-300 hover:border-purple-400',
  },
];

export default function Home() {
  return (
    <div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">⚡ ポケモンチャンピオンズ</h1>
        <p className="text-gray-500 text-lg">ポケモンバトルサポートツール集</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className={`block p-6 rounded-xl border-2 ${f.color} hover:shadow-lg transition-all`}
          >
            <div className="text-4xl mb-3">{f.emoji}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{f.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
