-- Partner: invitación, citas compartidas, síntomas compartidos, notas para el partner
-- Correr una sola vez en Supabase (Dashboard → SQL Editor → New query → pegar → Run)

-- ============================================================
-- 1. Invitaciones (token que la mamá genera y comparte a mano)
-- ============================================================
create table if not exists partner_invites (
  id uuid primary key default gen_random_uuid(),
  mother_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

alter table partner_invites enable row level security;

drop policy if exists "la mamá gestiona sus propias invitaciones" on partner_invites;
create policy "la mamá gestiona sus propias invitaciones"
  on partner_invites for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());

-- ============================================================
-- 2. Vínculo mamá-partner (uno solo por mamá)
-- ============================================================
create table if not exists partners (
  mother_id uuid primary key references auth.users(id) on delete cascade,
  partner_user_id uuid not null unique references auth.users(id) on delete cascade,
  nombre text,
  email text,
  accepted_at timestamptz not null default now()
);

alter table partners enable row level security;

drop policy if exists "la mamá ve y gestiona su propio partner" on partners;
create policy "la mamá ve y gestiona su propio partner"
  on partners for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());

-- El partner puede ver su propia fila (para saber a qué mamá está vinculado);
-- el resto de los datos de la mamá los lee solo a través de /api/partner/* (service role).
drop policy if exists "el partner ve su propio vínculo" on partners;
create policy "el partner ve su propio vínculo"
  on partners for select
  to authenticated
  using (partner_user_id = auth.uid());

-- ============================================================
-- 3. Citas compartidas (espejo liviano de las citas en localStorage
--    que la mamá decide compartir; id = mismo string que ya genera citas.js)
-- ============================================================
create table if not exists citas_compartidas (
  id text primary key,
  mother_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  hora text,
  tipo text not null,
  medico text,
  lugar text,
  partner_rsvp text check (partner_rsvp in ('puede', 'no_puede')),
  partner_rsvp_at timestamptz,
  reminder_sent_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table citas_compartidas enable row level security;

drop policy if exists "la mamá gestiona sus propias citas compartidas" on citas_compartidas;
create policy "la mamá gestiona sus propias citas compartidas"
  on citas_compartidas for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());

-- ============================================================
-- 4. Síntomas compartidos (solo la lista de síntomas del día,
--    nunca ánimo/energía/sueño/nota/archivos, que siguen privados)
-- ============================================================
create table if not exists sintomas_compartidos (
  mother_id uuid not null references auth.users(id) on delete cascade,
  fecha date not null,
  sintomas jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (mother_id, fecha)
);

alter table sintomas_compartidos enable row level security;

drop policy if exists "la mamá gestiona sus propios síntomas compartidos" on sintomas_compartidos;
create policy "la mamá gestiona sus propios síntomas compartidos"
  on sintomas_compartidos for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());

-- ============================================================
-- 5. Notas puntuales de la mamá para el partner (100% opt-in)
-- ============================================================
create table if not exists partner_notes (
  id uuid primary key default gen_random_uuid(),
  mother_id uuid not null references auth.users(id) on delete cascade,
  texto text not null,
  created_at timestamptz not null default now(),
  leida_at timestamptz
);

alter table partner_notes enable row level security;

drop policy if exists "la mamá gestiona sus propias notas al partner" on partner_notes;
create policy "la mamá gestiona sus propias notas al partner"
  on partner_notes for all
  to authenticated
  using (mother_id = auth.uid())
  with check (mother_id = auth.uid());
