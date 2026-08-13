# Деплой на Vercel — МОАУ СОШ №37

## Что понадобится

1. Аккаунт [GitHub](https://github.com)
2. Аккаунт [Vercel](https://vercel.com)
3. Облачная PostgreSQL — рекомендуем [Neon](https://neon.tech) (бесплатный tier)

---

## Шаг 1. База данных (Neon)

1. Создайте проект на https://neon.tech
2. Скопируйте **Connection string** → **Pooled connection** (важно: `-pooler` в хосте)
3. Добавьте `?sslmode=require` в конец строки, если его нет

Пример:

```
postgres://user:password@ep-xxxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

---

## Шаг 2. Репозиторий GitHub

```powershell
cd school37
git add .
git commit -m "Prepare for Vercel deployment"
git branch -M main
git remote add origin https://github.com/ВАШ_АККАУНТ/school37.git
git push -u origin main
```

Файлы в `public/uploads/` (документы, фото) должны быть в репозитории — они деплоятся вместе с сайтом.

---

## Шаг 3. Проект на Vercel

1. https://vercel.com/new → Import Git Repository
2. Выберите репозиторий `school37`
3. **Framework Preset:** Next.js (определится автоматически)
4. **Build Command** (из `vercel.json`): `npm run db:migrate && npm run db:seed-if-empty && npm run build`
5. **Environment Variables** — добавьте (все обязательны для первого деплоя):

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | Pooled connection string из Neon |
| `CMS_SESSION_SECRET` | Случайная строка ≥32 символов |
| `CMS_ADMIN_EMAIL` | Email администратора |
| `CMS_ADMIN_PASSWORD` | Надёжный пароль (не `changeme`) |
| `NEXT_PUBLIC_SITE_URL` | `https://ваш-проект.vercel.app` (или свой домен) |

6. Deploy

При первом деплое: **migrate → seed (если БД пустая) → build**.

---

## Шаг 4. Seed (обычно не нужен вручную)

При **первом** деплое seed запускается автоматически (`db:seed-if-empty`), если таблица `settings` пустая.

Ручной seed (сброс всех данных):

```powershell
$env:DATABASE_URL="postgres://...neon...?sslmode=require"
npm run db:seed
```

---

## Шаг 5. Проверка

- Главная: `https://ваш-проект.vercel.app/`
- Админка: `https://ваш-проект.vercel.app/admin/login`
- Sitemap: `/sitemap.xml`
- Robots: `/robots.txt`

---

## Свой домен

1. Vercel → Project → Settings → Domains
2. Добавьте домен
3. Обновите DNS у регистратора по инструкции Vercel
4. Измените `NEXT_PUBLIC_SITE_URL` на production URL
5. Redeploy

---

## Ограничения на Vercel

| Функция | Статус |
|---------|--------|
| CMS, страницы, новости (из БД) | ✅ |
| Файлы из `public/uploads/` (в git) | ✅ |
| Загрузка новых файлов через админку | ❌ — нужен Vercel Blob |
| PostgreSQL | ✅ через Neon / Supabase |

---

## Обновление сайта

```powershell
git add .
git commit -m "Update content"
git push
```

Vercel задеploит автоматически. Миграции применятся при сборке.

---

## Troubleshooting

**Build failed: DATABASE_URL**  
→ Задайте `DATABASE_URL` в Environment Variables Vercel (Production + Preview).

**«Настройка school не найдена»**  
→ Выполните `npm run db:seed` с production DATABASE_URL.

**502 / timeout**  
→ Используйте **pooled** connection string Neon.

**Cookie сессии не сохраняется**  
→ `CMS_SESSION_SECRET` ≥16 символов в Production.
