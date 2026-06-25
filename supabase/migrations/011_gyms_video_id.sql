-- Gyms: optional YouTube video ID for a gym tour / promo clip.
-- Run in Supabase SQL Editor.

alter table public.gyms
  add column if not exists video_id text;

comment on column public.gyms.video_id is
  'Optional YouTube video ID (not full URL), e.g. dQw4w9WgXcQ from youtube.com/watch?v=dQw4w9WgXcQ.';
