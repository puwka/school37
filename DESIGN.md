# Дизайн-система «Кирпич и бумага»

Официальный визуальный язык сайта МОАУ «СОШ №37 г. Орска».

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Radix UI (как у shadcn) + CVA
- **Не** стандартный look shadcn: без `rounded-full`, glow, zinc/purple primary

## Токены

| Токен | Значение | Роль |
|---|---|---|
| `--paper` | `#F7F5F0` | Фон страницы |
| `--surface` | `#FFFFFF` | Панели, таблицы |
| `--ink` | `#1A1A18` | Основной текст |
| `--brick` | `#9B3D32` | Единственный акцент |
| `--radius-sm/md/lg` | `4 / 6 / 8 px` | Кнопки / поля / модалки |

Шрифты: **Literata** (заголовки), **Golos Text** (UI).

## Структура

```
src/components/ui/          — примитивы
src/components/layout/      — SiteHeader, SidebarNav, QuickNav
src/components/school/      — Document*, News*, Staff*
src/app/design-system/      — витрина
```

## Типы «карточек» (не один шаблон)

| Компонент | Паттерн | Задача |
|---|---|---|
| `Card` surface / panel / accent | панели | служебные блоки |
| `DocumentRow` | строка реестра | сканирование файлов |
| `DocumentTile` | компактная плитка | боковые блоки |
| `NewsRow` | список с миниатюрой | лента |
| `NewsUrgentBanner` | акцентная полоса | срочное на главной |
| `EventCard` | timeline-строка | мероприятия |
| `StaffRow` | строка каталога | педагоги |
| `StaffHighlight` | горизонтальная панель | директор на главной |
| `QuickNav` | compact nav blocks | быстрые действия |

## Запуск

```bash
cd school37
npm run dev
```

Витрина: [http://localhost:3000/design-system](http://localhost:3000/design-system)
