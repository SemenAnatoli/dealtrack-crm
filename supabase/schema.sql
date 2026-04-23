-- Contacts
create table contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  created_at timestamptz default now()
);

-- Deals
create table deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric not null default 0,
  stage text not null default 'lead'
    check (stage in ('lead','contact','proposal','negotiation','won','lost')),
  contact_id uuid references contacts(id) on delete set null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger deals_updated_at
  before update on deals
  for each row execute function update_updated_at();

-- RLS
alter table contacts enable row level security;
alter table deals enable row level security;

create policy "public_contacts" on contacts
  for all to anon using (true) with check (true);

create policy "public_deals" on deals
  for all to anon using (true) with check (true);

-- Grants
grant usage on schema public to anon;
grant select, insert, update, delete on contacts to anon;
grant select, insert, update, delete on deals to anon;

-- Seed data
insert into contacts (name, email, phone, company) values
  ('Алексей Петров', 'alexey@mail.ru', '+7 900 123-45-67', 'ООО Ромашка'),
  ('Мария Сидорова', 'maria@gmail.com', '+7 911 234-56-78', 'ИП Сидорова'),
  ('Дмитрий Козлов', 'kozlov@yandex.ru', null, 'Козлов и партнёры');

insert into deals (title, amount, stage, contact_id) values
  ('Разработка сайта', 150000, 'lead',
    (select id from contacts where name='Алексей Петров' limit 1)),
  ('SEO продвижение', 80000, 'contact',
    (select id from contacts where name='Мария Сидорова' limit 1)),
  ('CRM интеграция', 220000, 'proposal',
    (select id from contacts where name='Дмитрий Козлов' limit 1)),
  ('Мобильное приложение', 350000, 'negotiation',
    (select id from contacts where name='Алексей Петров' limit 1)),
  ('Лендинг', 45000, 'won',
    (select id from contacts where name='Мария Сидорова' limit 1)),
  ('Редизайн', 95000, 'lost', null);
