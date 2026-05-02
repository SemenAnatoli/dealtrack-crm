# DealTrack CRM

Небольшая CRM для управления сделками и быстрой аналитики по воронке. Делал для себя — устал от Excel и не хотел платить за AmoCRM ради простых задач.

**[Demo](https://dealtrack-crm.vercel.app)** · **[GitHub](https://github.com/SemenAnatoli/dealtrack-crm)**

## Что умеет

- BI-дашборд в стиле CRM analytics: метрики, line/bar/donut charts, таблица эффективности агентов
- Глобальные фильтры по владельцу, стадии, pipeline-статусу и поиску
- Kanban-доска со стадиями сделки, drag-and-drop между колонками
- CRUD для сделок и контактов с модальными формами и валидацией
- Оптимистичное обновление стадии сделки через TanStack Query
- Code splitting страниц для аккуратной Vercel-сборки

## Стек

React 19 + TypeScript + Vite

Zustand — для UI-стейта (модалки, активные фильтры)  
TanStack Query — для запросов к Supabase, кэш и оптимистичные обновления  
React Hook Form + Zod — формы, не хотел городить useState на каждый инпут  
@dnd-kit — drag-and-drop  
Supabase — база данных, не хотелось поднимать свой бэкенд  
LocalStorage fallback — демо остается рабочим на Vercel даже без Supabase env  
Tailwind CSS v4  
Vitest — unit-тесты на stores и утилиты бизнес-метрик

## Запуск

```bash
git clone https://github.com/SemenAnatoli/dealtrack-crm
cd dealtrack-crm
npm install
```

Для подключения Supabase нужен `.env` с ключами Supabase (пример в `.env.example`).  
Если переменные не заданы, приложение автоматически работает в demo-режиме на localStorage.
SQL для создания таблиц — в `supabase/schema.sql`.

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Тесты

```bash
npm test
```
