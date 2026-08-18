-- Preferencia de notificación separada para cuando la mamá le manda una nota
-- al partner (distinta de los recordatorios de citas de 0006). Por ahora solo
-- se guarda la preferencia; todavía no hay ningún email que la lea.
-- Correr una sola vez en Supabase (Dashboard → SQL Editor → New query → pegar → Run)

alter table partners
  add column if not exists notif_nota_email boolean not null default true;
