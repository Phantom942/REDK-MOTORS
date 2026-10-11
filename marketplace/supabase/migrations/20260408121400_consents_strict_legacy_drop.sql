-- Consentements : booléen JSON strict ; pas de ré-application depuis métadonnées Auth

create or replace function public.jsonb_bool_strict(obj jsonb, key text)
returns boolean
language sql
immutable
as $$
  select case
    when obj is null or obj->key is null then false
    when jsonb_typeof(obj->key) <> 'boolean' then false
    else (obj->key)::boolean
  end;
$$;

create or replace function public.sync_consents_from_auth_metadata(p_user_id uuid, p_meta jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  mc jsonb;
  ver text;
  channels text[] := array['email_marketing', 'sms_marketing', 'whatsapp_marketing'];
  ch text;
  granted boolean;
  snap text;
  existing int;
begin
  select count(*) into existing from public.consent_records where user_id = p_user_id;
  if existing > 0 then
    return;
  end if;

  mc := p_meta->'marketing_consents';
  ver := coalesce(nullif(p_meta->>'consent_text_version', ''), 'unknown');
  if mc is null or jsonb_typeof(mc) <> 'object' then
    return;
  end if;

  foreach ch in array channels loop
    granted := public.jsonb_bool_strict(mc, ch);
    snap := case ch
      when 'email_marketing' then 'J''accepte de recevoir des offres commerciales par email de RED-K MOTORS (facultatif, révocable).'
      when 'sms_marketing' then 'J''accepte de recevoir des offres commerciales par SMS de RED-K MOTORS (facultatif, révocable).'
      when 'whatsapp_marketing' then 'J''accepte de recevoir des offres commerciales par WhatsApp de RED-K MOTORS (facultatif, révocable).'
      else ch
    end;
    insert into public.consent_records (user_id, channel, granted, consent_text_version, consent_text_snapshot)
    values (p_user_id, ch::public.consent_channel, granted, ver, snap);
  end loop;
end;
$$;

-- Anciennes RPC photo client (contournables)
drop function if exists public.register_listing_photo(uuid, text, text, int, int, int, int);

-- Bucket public legacy : plus utilisé pour publication (nettoyage manuel storage si déjà déployé)
