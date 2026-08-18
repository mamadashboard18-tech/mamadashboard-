-- Perfil del partner: nombre editable ya existe, se suma preferencia de
-- notificaciones por email (recordatorios de citas).
-- Correr una sola vez en Supabase (Dashboard → SQL Editor → New query → pegar → Run)

alter table partners
  add column if not exists notif_recordatorios_email boolean not null default true;
