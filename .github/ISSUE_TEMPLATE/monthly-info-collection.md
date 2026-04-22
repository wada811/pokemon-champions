---
name: 月次情報収集
about: ポケモンチャンピオンズの最新情報を収集するための月次タスク
title: '📊 [月次情報収集] {{ date | date("YYYY年MM月") }} — ポケモンチャンピオンズ最新情報'
labels: monthly-collection, copilot
---

## 🎯 タスク概要

ポケモンチャンピオンズおよび競技ポケモンの最新情報を信頼できる情報源から収集し、
新しい情報や更新された情報があればこのリポジトリに反映してください。

> 📚 **情報源マスター**: [`docs/sources.md`](https://github.com/wada811/pokemon-champions/blob/main/docs/sources.md) — 収集対象URLと信頼区分はこちらを参照
> 📋 **運用方針**: [`docs/operations.md`](https://github.com/wada811/pokemon-champions/blob/main/docs/operations.md) — 変更基準・記録方法はこちらを参照

## 📋 収集・確認項目

### 1. 公式情報の確認
- [ ] ポケモン公式サイト / Pokemon.com の更新情報・新発表を確認
- [ ] VGC 公式ランキングの最新状況を確認
- [ ] 最新パッチ・DLC・シーズン更新の確認

### 2. ゲームデータの確認
- [ ] タイプチャートや技・特性に変更がないか確認（`src/data/typeChart.ts` に影響する可能性）
- [ ] 新ポケモン・新フォルムの追加がないか確認（Serebii / Bulbapedia）
- [ ] PokeAPI のデータ更新状況を確認

### 3. メタゲーム情報の確認
- [ ] Smogon の最新月次使用率統計（Gen / VGC）で上位30匹を確認
- [ ] Pokemon HOME ランクマ統計・VGCStats の最新データを確認
- [ ] 新しく台頭したポケモンや型の確認
- [ ] 環境で減少・引退したポケモンの確認

### 4. VGC大会情報の確認
- [ ] 直近の主要大会（Regional / International）の上位チームを確認（Limitless VGC）
- [ ] 使用率の高いポケモン・型のトレンドを確認

### 5. 情報源の健全性確認
- [ ] `docs/sources.md` に記載された全情報源がアクセス可能か確認
- [ ] 閉鎖・長期停止・信頼性低下した情報源があれば `docs/sources.md` の更新 PR を作成
- [ ] `ポケモンチャンピオンズ 攻略` `ポケモンチャンピオンズ 最新情報` `ポケモンチャンピオンズ 対戦` などで検索し、追加候補の情報源を探す
- [ ] 候補ページがポケモンチャンピオンズを明示的に扱っているか、公式告知や実データに基づく記述があるかを確認する
- [ ] 他タイトルの情報を流用しているだけのページは参考情報として扱い、チャンピオンズ固有情報としては扱わない
- [ ] 採用した情報源は `ポケモンチャンピオンズ固有 / 参考情報` の区分付きで記録する

## 📝 作業内容

上記の情報源を確認した上で、以下を行ってください：

1. **変更が必要な場合**: Pull Request を作成して該当ファイルを更新
   - タイプチャートの変更 → `src/data/typeChart.ts`
   - README のメタ情報・機能説明の更新 → `README.md`
   - 情報源一覧の変更 → `docs/sources.md`
2. **変更不要な場合**: このイシューに収集した情報のサマリーをコメントとして記載
    - 現在の環境トップポケモン（上位10匹程度）
    - 注目すべき変化やトレンド
    - 各情報の情報源区分（ポケモンチャンピオンズ固有 / 参考情報）
    - 次回収集時に確認すべき事項
3. **収集結果をファイルに記録**: `docs/collection-results/YYYY-MM.md` を作成
   - テンプレートは [`docs/collection-results/README.md`](https://github.com/wada811/pokemon-champions/blob/main/docs/collection-results/README.md) を参照

## ✅ 完了条件

- [ ] `docs/sources.md` 記載の全情報源を確認済み
- [ ] 情報源がポケモンチャンピオンズ固有か参考情報かを判別済み
- [ ] 変更が必要なファイルを更新、または変更不要の旨をコメントで報告
- [ ] `docs/collection-results/YYYY-MM.md` に収集日時・確認情報源・サマリーを記録
- [ ] このイシューを Close
