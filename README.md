# ⚡ Pokemon Champions

ポケモンチャンピオンズ向けバトルサポートツール集 — A Next.js 16 web application providing five battle support tools for Pokémon Champions players.

## Features

### ⚔️ タイプ相性チェッカー (Type Compatibility Checker)
- Select an attacking type and up to two defending types
- Displays damage multiplier (×0 / ×0.5 / ×1 / ×2 / ×4)
- Lists weaknesses, resistances, and immunities for any type combination
- Uses the current 18×18 type chart assumed for Pokémon Champions and modern mainline games (no network required)

### 💥 ダメージ計算機 (Damage Calculator)
- Input move power, type, category (physical/special), STAB, and stat values
- Calculates damage range using the standard damage formula currently assumed for Pokémon Champions
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

- This project explicitly targets Pokémon Champions
- Type chart and damage calculations currently assume Pokémon Champions uses the same 18-type chart and standard battle formula as modern mainline games
- PokeAPI calls are made client-side for Pokemon search features; a network connection is required for those features
- Meta analysis data is persisted in `localStorage` (no backend required)

## 信頼できる情報源の管理 (Trusted Sources)

このリポジトリは毎月1日に GitHub Actions で月次収集 Issue を自動作成し、信頼できる情報源の最新性を保ちます。

- [📚 信頼できる情報源マスター](docs/sources.md) — 収集対象サイト一覧・採用基準・信頼区分・見直しルール
- [📋 運用方針](docs/operations.md) — 月次収集の流れ・変更基準・記録方法
- [📂 収集結果アーカイブ](docs/collection-results/) — 月次収集の記録
