<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Copilot / エージェント向け運用ルール

- 応答は常に日本語で行う。
- 実装や変更を始める前に、依頼の意図・対象・完了条件を十分に理解する。
- 意図が曖昧な場合は、理解できるまで確認質問を繰り返し、推測で進めない。
- 作業は「理解 → 計画 → 実装 → テスト → PR → デプロイ」の流れを基本とする。
- まず最小変更で目的を満たす案を考え、不要な変更や無関係な修正を加えない。
- 実装後は、影響範囲に応じて既存の lint / build / test を実行して結果を確認する。
- PR では、依頼内容に対して何を変更したか・何を確認したかを簡潔に共有する。
- デプロイや公開系の操作は、明示的に求められた場合のみ行う。
