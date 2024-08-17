# このアプリについて

## 概要

### Breazingly Fast

### Cool UI

### Gold UX

以上をモットーにクローンを作成しました。

chat_GPTのクローン版を目指して作成（途中）しました。

クライエント側はvite環境のreactで開発。

サーバー側はrust言語でwebフレームワークはactix-webで開発。

UIをreactで開発しbuildしたものをdistフォルダとして

## 開発版の起動方法

### client側の開発版の起動方法

```powershell
cd client
npm run dev
```

### サーバー側の起動方法

```powershell
cd server
cargo run
```

## 動作させるには

os:windows10,11
以下の３つの構成が必要となる。

1. distフォルダ
2. APIキーの内容が保存している.envファイル
3. chat_gpt_assistant.exe

### buidしてdistフォルダを作成

```powershell

npm run build

```

### 「.envファイル」

```env
OPENAI_API_KEY="API_KEY"
```

### chat_gpt_assistant.exe
