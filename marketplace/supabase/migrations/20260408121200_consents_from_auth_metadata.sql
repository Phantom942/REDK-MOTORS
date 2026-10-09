-- Consentements : enregistrement serveur depuis métadonnées Auth à la création du compte (horodatage serveur)

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
begin
  mc := p_meta->'marketing_consents';
  ver := coalesce(p_meta->>'consent_text_version', 'unknown');
  if mc is null then
    return;
  end if;

  foreach ch in array channels loop
    granted := coalesce((mc->>ch)::boolean, false);
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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, city, postal_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'city', ''),
    nullif(new.raw_user_meta_data->>'postal_code', '')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');

  perform public.sync_consents_from_auth_metadata(new.id, coalesce(new.raw_user_meta_data, '{}'::jsonb));

  return new;
end;
$$;
