-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Entities table
create table if not exists entities (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  industry text,
  location text,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Finance Managers table
create table if not exists finance_managers (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  entity_id uuid references entities(id) on delete set null,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Training Programs table
create table if not exists training_programs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  duration_hours integer,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enrollments table
create table if not exists enrollments (
  id uuid default gen_random_uuid() primary key,
  manager_id uuid references finance_managers(id) on delete cascade not null,
  program_id uuid references training_programs(id) on delete cascade not null,
  status text default 'enrolled' check (status in ('enrolled', 'in_progress', 'completed', 'failed')),
  enrolled_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  unique(manager_id, program_id)
);

-- Certifications table
create table if not exists certifications (
  id uuid default gen_random_uuid() primary key,
  manager_id uuid references finance_managers(id) on delete cascade not null,
  program_id uuid references training_programs(id) on delete cascade not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()),
  expires_at timestamp with time zone,
  status text default 'valid' check (status in ('valid', 'expired', 'revoked')),
  unique(manager_id, program_id)
);

-- Audits table
create table if not exists audits (
  id uuid default gen_random_uuid() primary key,
  entity_id uuid references entities(id) on delete set null,
  manager_id uuid references finance_managers(id) on delete set null,
  audit_year integer not null,
  status text default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'findings_issued')),
  due_date date,
  completed_at timestamp with time zone,
  findings text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Set up Row Level Security (RLS) policies for authenticated users
alter table entities enable row level security;
alter table finance_managers enable row level security;
alter table training_programs enable row level security;
alter table enrollments enable row level security;
alter table certifications enable row level security;
alter table audits enable row level security;

create policy "Allow all" on entities for all using (true) with check (true);
create policy "Allow all" on finance_managers for all using (true) with check (true);
create policy "Allow all" on training_programs for all using (true) with check (true);
create policy "Allow all" on enrollments for all using (true) with check (true);
create policy "Allow all" on certifications for all using (true) with check (true);
create policy "Allow all" on audits for all using (true) with check (true);

-- Insert sample data
insert into entities (name, industry, location) values
  ('Acme Corporation', 'Manufacturing', 'New York, NY'),
  ('Global Finance Ltd', 'Financial Services', 'London, UK'),
  ('TechStart Inc', 'Technology', 'San Francisco, CA');

insert into training_programs (title, description, duration_hours) values
  ('SOX Compliance Fundamentals', 'Essential SOX compliance training for finance professionals', 16),
  ('Risk Assessment & Management', 'Advanced risk assessment methodologies', 12),
  ('Financial Reporting Standards', 'Latest GAAP and IFRS updates', 20);

insert into finance_managers (full_name, email, phone, entity_id) values
  ('John Smith', 'john.smith@acme.com', '+1-555-0101', (select id from entities where name = 'Acme Corporation')),
  ('Sarah Johnson', 'sarah.j@globalfinance.com', '+44-555-0202', (select id from entities where name = 'Global Finance Ltd')),
  ('Michael Chen', 'mchen@techstart.io', '+1-555-0303', (select id from entities where name = 'TechStart Inc'));

insert into enrollments (manager_id, program_id, status, completed_at)
select 
  fm.id,
  tp.id,
  'completed',
  now() - interval '2 months'
from finance_managers fm
cross join training_programs tp
where fm.full_name = 'John Smith';

insert into certifications (manager_id, program_id, issued_at, expires_at, status)
select 
  fm.id,
  tp.id,
  now() - interval '2 months',
  now() + interval '10 months',
  'valid'
from finance_managers fm
cross join training_programs tp
where fm.full_name = 'John Smith';

insert into audits (entity_id, manager_id, audit_year, status, due_date)
select
  e.id,
  fm.id,
  2025,
  'scheduled',
  '2025-06-30'
from entities e
join finance_managers fm on fm.entity_id = e.id
where fm.full_name = 'John Smith';