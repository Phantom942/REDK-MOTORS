-- Journalisation admin + export consentements (admin only)

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles (id),
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;

create policy admin_audit_read on public.admin_audit_log
  for select using (public.has_role(auth.uid(), 'admin'));

create policy admin_audit_insert_service on public.admin_audit_log
  for insert with check (public.has_role(auth.uid(), 'admin'));

create or replace function public.log_admin_action(
  p_action text,
  p_target_type text,
  p_target_id uuid,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.has_role(auth.uid(), 'admin') and not public.is_moderator(auth.uid()) then
    raise exception 'forbidden';
  end if;
  insert into public.admin_audit_log (actor_id, action, target_type, target_id, metadata)
  values (auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

revoke all on function public.log_admin_action(text, text, uuid, jsonb) from public;
grant execute on function public.log_admin_action(text, text, uuid, jsonb) to authenticated;

-- Modérateur : suspendre ; admin : réactiver (déjà en 204)
create policy duplicate_flags_mod_insert on public.duplicate_flags
  for insert with check (public.is_moderator(auth.uid()));

create policy listing_reports_mod_update on public.listing_reports
  for update using (public.is_moderator(auth.uid()));
