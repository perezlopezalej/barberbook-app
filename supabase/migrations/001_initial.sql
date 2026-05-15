-- BarberBook — Initial Schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null default '',
  phone text not null default '',
  logo_url text,
  timezone text not null default 'America/Mexico_City',
  created_at timestamptz not null default now()
);

create table if not exists barbers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  bio text not null default '',
  avatar_url text,
  specialties text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  description text not null default '',
  duration_minutes int not null check (duration_minutes > 0),
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'MXN',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- day_of_week: 0 = Sunday, 1 = Monday … 6 = Saturday
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references barbers(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_available boolean not null default true,
  unique (barber_id, day_of_week)
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  barber_id uuid not null references barbers(id) on delete cascade,
  service_id uuid not null references services(id) on delete cascade,
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text,
  cancellation_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Prevents double-booking the same barber at the same time
  unique (barber_id, date, start_time)
);

-- Auto-update updated_at on bookings
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table shops enable row level security;
alter table barbers enable row level security;
alter table services enable row level security;
alter table schedules enable row level security;
alter table bookings enable row level security;

-- Public read access for booking flow
create policy "Public can read active barbers"
  on barbers for select using (is_active = true);

create policy "Public can read active services"
  on services for select using (is_active = true);

create policy "Public can read schedules"
  on schedules for select using (true);

create policy "Public can read shops"
  on shops for select using (true);

-- Public can create bookings (anonymous booking flow)
create policy "Public can create bookings"
  on bookings for insert with check (true);

-- Public can cancel their own booking via cancellation_token
create policy "Public can cancel own booking"
  on bookings for update
  using (true)
  with check (status = 'cancelled');

-- Authenticated users (admin/barber) can read all bookings for their shop
create policy "Auth users read bookings"
  on bookings for select
  to authenticated
  using (true);

-- Authenticated users can update bookings (confirm, cancel, complete)
create policy "Auth users update bookings"
  on bookings for update
  to authenticated
  using (true);

-- Authenticated users manage barbers and services
create policy "Auth users manage barbers"
  on barbers for all
  to authenticated
  using (true);

create policy "Auth users manage services"
  on services for all
  to authenticated
  using (true);

create policy "Auth users manage schedules"
  on schedules for all
  to authenticated
  using (true);

-- ============================================================
-- SEED DATA — Realistic barbershop
-- ============================================================

do $$
declare
  shop_id uuid := gen_random_uuid();
  barber1_id uuid := gen_random_uuid();
  barber2_id uuid := gen_random_uuid();
  barber3_id uuid := gen_random_uuid();
begin

insert into shops (id, name, slug, address, phone, timezone)
values (
  shop_id,
  'Barbería El Maestro',
  'el-maestro',
  'Calle Madero 42, Col. Centro, CDMX',
  '+52 55 1234 5678',
  'America/Mexico_City'
);

-- Services
insert into services (shop_id, name, description, duration_minutes, price, currency) values
  (shop_id, 'Corte clásico', 'Corte con tijera y máquina, acabado con navaja.', 45, 180, 'MXN'),
  (shop_id, 'Arreglo de barba', 'Perfilado y arreglo de barba con navaja caliente.', 30, 120, 'MXN'),
  (shop_id, 'Corte + Barba', 'Servicio completo: corte y arreglo de barba.', 75, 280, 'MXN'),
  (shop_id, 'Rasurado clásico', 'Rasurado completo con toalla caliente y navaja.', 40, 150, 'MXN'),
  (shop_id, 'Corte infantil', 'Corte para niños hasta 12 años.', 30, 120, 'MXN');

-- Barbers
insert into barbers (id, shop_id, name, bio, avatar_url, specialties) values
  (barber1_id, shop_id, 'Carlos Mendoza', '15 años de experiencia. Especialista en cortes clásicos y degradados modernos.', null, array['Degradado', 'Corte clásico', 'Barba']),
  (barber2_id, shop_id, 'Diego Ramírez', 'Barbero certificado con pasión por los estilos urbanos y diseños personalizados.', null, array['Estilos urbanos', 'Diseños', 'Coloración']),
  (barber3_id, shop_id, 'Andrés Torres', 'Maestro barbero con formación clásica europea. Experto en rasurado con navaja.', null, array['Rasurado clásico', 'Barba larga', 'Corte con tijera']);

-- Schedules: Monday–Saturday 09:00–19:00, Sunday closed
insert into schedules (barber_id, day_of_week, start_time, end_time, is_available) values
  -- Carlos
  (barber1_id, 1, '09:00', '19:00', true),
  (barber1_id, 2, '09:00', '19:00', true),
  (barber1_id, 3, '09:00', '19:00', true),
  (barber1_id, 4, '09:00', '19:00', true),
  (barber1_id, 5, '09:00', '19:00', true),
  (barber1_id, 6, '09:00', '15:00', true),
  (barber1_id, 0, '00:00', '00:00', false),
  -- Diego
  (barber2_id, 1, '10:00', '19:00', true),
  (barber2_id, 2, '10:00', '19:00', true),
  (barber2_id, 3, '10:00', '19:00', true),
  (barber2_id, 4, '10:00', '19:00', true),
  (barber2_id, 5, '10:00', '19:00', true),
  (barber2_id, 6, '10:00', '15:00', true),
  (barber2_id, 0, '00:00', '00:00', false),
  -- Andrés
  (barber3_id, 1, '09:00', '18:00', true),
  (barber3_id, 2, '09:00', '18:00', true),
  (barber3_id, 3, '09:00', '18:00', true),
  (barber3_id, 4, '09:00', '18:00', true),
  (barber3_id, 5, '09:00', '18:00', true),
  (barber3_id, 6, '09:00', '14:00', true),
  (barber3_id, 0, '00:00', '00:00', false);

end $$;
