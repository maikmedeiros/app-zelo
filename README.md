# Zelo — front-end

Interface da plataforma Zelo (comunicação escola-família na educação infantil), em
Next.js 16 (App Router). Consome a API em [`../zelo`](../zelo).

O plano de construção, fase a fase, está em [plano.md](plano.md).

## Rodar em desenvolvimento

A API precisa estar no ar primeiro:

```bash
cd ../zelo && npm run db:up && npm run db:seed && npm run dev   # API em :3003
```

Depois:

```bash
cp .env.example .env.local   # ajuste API_URL e SESSION_COOKIE_NAME se necessário
npm install
npm run dev                  # front em :3000
```

## Scripts

| Script                      | O que faz                                      |
| --------------------------- | ---------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento                    |
| `npm run build` / `start`   | Build de produção e execução                   |
| `npm run typecheck`         | `next typegen` + `tsc --noEmit`                |
| `npm run lint`              | Typecheck + ESLint + Prettier (o gate da fase) |
| `npm run lint:eslint:fix`   | Corrige o que o ESLint sabe corrigir           |
| `npm run lint:prettier:fix` | Formata                                        |

O navegador nunca fala com a API direto: o Next atua como BFF. Ver §3.1 do `plano.md`.
