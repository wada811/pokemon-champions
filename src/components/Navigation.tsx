'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'ホーム', emoji: '🏠' },
  { href: '/type-checker', label: 'タイプ相性', emoji: '⚔️' },
  { href: '/damage-calc', label: 'ダメージ計算', emoji: '💥' },
  { href: '/team-builder', label: 'チームビルダー', emoji: '👥' },
  { href: '/pokedex', label: 'ポケモン図鑑', emoji: '📖' },
  { href: '/meta', label: 'メタ分析', emoji: '📊' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-red-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl shrink-0">
            <span>⚡</span>
            <span className="hidden sm:block">ポケモンチャンピオンズ</span>
          </Link>
          <div className="flex gap-1 flex-wrap justify-end">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-white text-red-600'
                    : 'text-white hover:bg-red-500'
                }`}
              >
                <span>{item.emoji}</span>
                <span className="hidden md:block">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
