# 概要

1. Notion とウェブサイトを提携する
1. Notion のデータベースを引っ張ってきてサイトに登録する
1. スタートボタンを押してフラッシュカード開始
1. このときドラッグ、フリックでカードを動かせたら最高
1. 結果を表示
1. Notion データベースのそれぞれの単語のチェックボックス欄に結果を反映

# 使用予定技術

## フレームワーク

- Next.js
  いろいろ準備するのめんどくさいから

## UI フレームワーク

- Material UI
  スタイル組むのめんどいから
  （特にこだわりないため要相談、時間が許すなら Tailwind, Sass, CSS Modules を検討したい）

## アニメーションライブラリ

- Framer Motion
  多分使う

## 開発環境

- TypeScript
- Prettier

## デプロイ先

- Vercel

# 分担

一方が Notion 提携
もう一方がフラッシュカード

# データモデル

入力

```json
{
  [
    {
      "Checkbox": {
        "id": "hogeid",
        "checkbox": false,
      },
    },
    {
      "Checkbox": {
        "id": "fugaid",
        "checkbox": false,
      },
    }
  ...
  ]
}
```

出力

```json
{
  [
    {
      "Checkbox": {
        "id": "hogeid",
        "checkbox": true,
      },
    },
    {
      "Checkbox": {
        "id": "fugaid",
        "checkbox": false,
      },
    }
  ...
  ]
}
```
