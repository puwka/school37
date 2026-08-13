# МОАУ «СОШ №37 г. Орска» — официальный сайт

Next.js 16 · PostgreSQL · Drizzle ORM · CMS с block-редактором.

## Быстрый старт (локально)

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Откройте http://localhost:3000 · Админка: `/admin/login`

## Деплой на Vercel

Подробная инструкция: **[DEPLOY.md](./DEPLOY.md)**

Кратко:

1. PostgreSQL на [Neon](https://neon.tech) (pooled connection string)
2. Репозиторий на GitHub → Import в Vercel
3. Environment variables: `DATABASE_URL`, `CMS_SESSION_SECRET`, `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
4. После первого деплоя: `npm run db:seed` с production `DATABASE_URL`

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер |
| `npm run build` | Production-сборка |
| `npm run db:migrate` | Миграции Drizzle |
| `npm run db:seed` | Заполнение БД контентом |
| `npm run db:studio` | Drizzle Studio |

## Структура

- `src/app/` — страницы (App Router)
- `src/components/` — UI и layout
- `src/server/` — auth, CRUD, queries
- `src/db/` — схема, seed, миграции
- `public/uploads/` — документы и изображения (деплоятся в git)
