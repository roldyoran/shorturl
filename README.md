# Instalation

## Hono API

```
pnpm install
pnpm run dev
```

## D1DATABASE

```
pnpx wrangler d1 create prod-d1-shorturl

pnpx wrangler d1 execute prod-d1-shorturl --local --file=./schema.sql

pnpx wrangler d1 execute prod-d1-shorturl --local --command="SELECT * FROM URLS"
```

```
pnpx wrangler d1 execute prod-d1-shorturl --remote --file=./schema.sql

pnpx wrangler d1 execute prod-d1-shorturl --remote --command="SELECT * FROM URLS"

pnpm run deploy
```
