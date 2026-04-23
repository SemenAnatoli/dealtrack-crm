# DealTrack CRM

Небольшая CRM для управления сделками. Делал для себя — устал от Excel и не хотел платить за AmoCRM ради простых задач.

**[Demo](https://dealtrack-crm.vercel.app)** · **[GitHub](https://github.com/SemenAnatoli/dealtrack-crm)**

## Что умеет

- Kanban-доска со стадиями сделки, drag-and-drop между колонками
- Список контактов с привязкой к сделкам
- Дашборд с суммами по стадиям (Recharts)
- Создание и редактирование через модальные формы с валидацией

## Стек

React 18 + TypeScript + Vite

Zustand — для UI-стейта (открыта ли модалка, активные фильтры)  
TanStack Query — для запросов к Supabase, кэш и оптимистичные обновления  
React Hook Form + Zod — формы, не хотел городить useState на каждый инпут  
@dnd-kit — drag-and-drop  
Supabase — база данных, не хотелось поднимать свой бэкенд  
Tailwind CSS v4  
Vitest — unit-тесты на stores и утилиты

## Запуск

```bash
git clone https://github.com/SemenAnatoli/dealtrack-crm
cd dealtrack-crm
npm install
```

Нужен `.env` с ключами Supabase (пример в `.env.example`).  
SQL для создания таблиц — в `supabase/schema.sql`.

```bash
npm run dev
```

## Тесты

```bash
npm test
```
