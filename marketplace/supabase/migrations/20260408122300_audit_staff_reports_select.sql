-- Journalisation : inclure garage_staff ; signalements — retour INSERT autorisé

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
  if not (
    public.has_role(auth.uid(), 'admin')
    or public.is_moderator(auth.uid())
    or public.has_role(auth.uid(), 'garage_staff')
  ) then
    raise exception 'forbidden';
  end if;
  insert into public.admin_audit_log (actor_id, action, target_type, target_id, metadata)
  values (auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create policy reports_select_reporter on public.listing_reports
  for select using (reporter_id = auth.uid());

drop function if exists public.debug_auth_context();
