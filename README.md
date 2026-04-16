# ⚡ Pokemon Champions

ポケモンバトルサポートツール集 — A Next.js 14+ web application providing five battle support tools for competitive Pokemon players.

## Features

### ⚔️ タイプ相性チェッカー (Type Compatibility Checker)
- Select an attacking type and up to two defending types
- Displays damage multiplier (×0 / ×0.5 / ×1 / ×2 / ×4)
- Lists weaknesses, resistances, and immunities for any type combination
- Full Gen 6+ 18×18 type chart stored as static data (no network required)

### 💥 ダメージ計算機 (Damage Calculator)
- Input move power, type, category (physical/special), STAB, and stat values
- Calculates damage range using the standard Gen 6+ formula
- Shows damage percentage and estimated number of hits to KO

### 👥 チームビルダー (Team Builder)
- Search Pokemon by English name or Pokedex number (via PokeAPI)
- Build a team of up to 6 Pokemon
- Visualizes type coverage (which defending types your team covers offensively)
- Warns about shared weaknesses among team members

### 📖 ポケモンデータベース (Pokemon Database)
- Search Pokemon by English name or Pokedex number
- Displays base stats with visual bar chart
- Shows abilities (including hidden abilities) and all learnable moves

### 📊 メタ分析 (Meta Analysis)
- Record commonly seen Pokemon and their usage frequency
- Persisted in localStorage (survives page refresh)
- Suggests counter attack types based on recorded usage counts
- Usage statistics (total recorded, most-used Pokemon)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **PokeAPI** (`https://pokeapi.co`) for Pokemon data (team builder, Pokedex, meta analysis)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build

```bash
npm run build
npm start
```

## Notes

- Type chart data is fully static (Gen 6+) — no network required for type-checker or damage calculator
- PokeAPI calls are made client-side for Pokemon search features; a network connection is required for those features
- Meta analysis data is persisted in `localStorage` (no backend required)
