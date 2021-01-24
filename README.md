# node-express-lesson

## Mysql、phpMyAdminコンテナの起動（docker）

``` bash
## 初回実行時のみ --build が必要
docker-compose up --build -d

## 2回目以降は --buildは必要なし
docker-compose up -d
```

## Mysql、phpMyAdminコンテナの終了（docker）

``` bash
docker-compose down --volumes
```
## 開発環境用で実行

``` bash
npm run dev
```

下記にアクセスして結果が返却されたらOK  
http://localhost:4000/api/todos
