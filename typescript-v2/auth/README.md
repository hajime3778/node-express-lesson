# 環境構築

## パッケージインストール

```
npm install
```

## .env ファイル作成(ローカル用)

プロジェクトフォルダ直下に、下記内容の.env ファイルを作成します

```
PORT=4000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=user
MYSQL_PASS=password
MYSQL_DB=todo_lesson
```

コンテナでアプリを起動する場合、MYSQL_HOST を以下のように変更してください。

```
MYSQL_HOST=mysql
```

# デバッグ環境実行

## DB コンテナ起動

```
docker-compose up --build mysql
```

## アプリケーション実行

```
npm run dev
```
