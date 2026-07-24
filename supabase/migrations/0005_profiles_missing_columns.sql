-- Fix: profiles le faltaban columnas que el código ya usaba hace rato
-- (cantidad_bebes, sexo, onboarding_completed), por eso loadPerfil()/savePerfil()
-- fallaban en silencio y el onboarding volvía a aparecer en cada login.
-- Correr una sola vez en Supabase (Dashboard → SQL Editor → New query → pegar → Run)

alter table profiles
  add column if not exists cantidad_bebes int not null default 1,
  add column if not exists sexo text,
  add column if not exists onboarding_completed boolean not null default false;
