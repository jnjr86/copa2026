# Copa do Mundo 2026

App web para acompanhar todos os 104 jogos da Copa do Mundo 2026.

## Instalação

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

Acesse: http://localhost:3000

## Páginas

- `/` — Dashboard com countdown para o próximo jogo do Brasil
- `/grupos` — Tabelas de classificação dos 12 grupos
- `/jogos` — Todos os 104 jogos com filtros e registro de placares
- `/matamata` — Chaveamento completo do mata-mata
- `/brasil` — Página dedicada ao Brasil (Grupo C)
