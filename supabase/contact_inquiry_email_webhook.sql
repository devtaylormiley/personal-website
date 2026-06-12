-- Contact form email webhook — fires send-contact-email Edge Function on INSERT.
-- Requires: pg_net extension, deployed send-contact-email function.
-- Safe to re-run.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_contact_inquiry_email()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  payload jsonb;
begin
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', to_jsonb(NEW),
    'old_record', null
  );

  perform net.http_post(
    url := 'https://haalhagsofqacverufpp.supabase.co/functions/v1/send-contact-email',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload
  );

  return NEW;
end;
$$;

drop trigger if exists contact_inquiry_email on public.contact_inquiries;

create trigger contact_inquiry_email
  after insert on public.contact_inquiries
  for each row
  execute function public.notify_contact_inquiry_email();
