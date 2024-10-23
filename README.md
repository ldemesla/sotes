# 🚀 SOTES

## Getting Started

### Add your OpenAI API key

```bash
touch apps/relay-server/.env
echo "OPENAI_API_KEY=<your-openai-api-key>" >> apps/relay-server/.env
```

### Install dependencies

```bash
pnpm install
```

### Start the database

```bash
pnpm db:start
```

### Run the migrations

```bash
pnpm db:migrate
```

### Run the development server

```bash
pnpm dev
```
