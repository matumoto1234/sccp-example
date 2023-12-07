# with-error-handling

動かし方

1. DBのテーブル構造を初期化する

```bash
$ sqlite3 messages.db

sqlite> .read init.sql

sqlite> .exit
```

2. サーバーを動かす

```bash
cd lec07/with-error-handling

go run .
```

3. リクエストを送って確認する

```bash
curl http://localhost:8080

curl http://localhost:8080 -X POST -H "Content-Type: application/json" -d '{
  "message": "ここに保存したいメッセージ"
}'
```
