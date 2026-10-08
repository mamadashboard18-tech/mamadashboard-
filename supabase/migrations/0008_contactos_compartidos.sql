-- Contactos del equipo médico que la mamá decide compartir con el partner
-- (espejo liviano de los contactos en localStorage; id = mismo string que ya genera ContactosMedicos).
-- Correr una sola vez en Supabase (Dashboard → SQL Editor → New query → pegar → Run)

create table if not exists contactos_compartidos (
  id text not null,
  mother_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  rol text,
  telefono text,
  updated_at timestamptz not null default now(),
  primary key (mother_id, id)
);

alter table contactos_compartidos enable row level security;

drop policy if exists "la mamá gestiona sus propios contactos compartidos" on contactos_compartidos;
create policy "la mamá gestiona sus propios contactos compartidos"
  on contactos_compartidos for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());
