-- ศูนย์รวมลิงก์สำหรับนิสิต: โครงสร้างฐานข้อมูลและกฎความปลอดภัย (RLS)
-- วิธีใช้: Supabase > SQL Editor > วางทั้งไฟล์ > Run (รันซ้ำได้โดยไม่เสียข้อมูลเดิม)

create extension if not exists pgcrypto;

-- ---------- ตาราง ----------
create table if not exists public.categories (
  id          text primary key,
  name        text not null check (char_length(name) between 2 and 40),
  description text not null default '' check (char_length(description) <= 100),
  sort_order  int  not null default 0
);

create table if not exists public.sites (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 60),
  description text not null check (char_length(description) between 1 and 200),
  category_id text not null references public.categories(id) on delete restrict,
  url         text not null default '',
  facebook    text not null default '' check (char_length(facebook) <= 300),
  instagram   text not null default '' check (char_length(instagram) <= 300),
  email       text not null default '' check (char_length(email) <= 100),
  phone       text not null default '' check (char_length(phone) <= 30),
  line        text not null default '' check (char_length(line) <= 300),
  logo        text not null default '' check (char_length(logo) <= 150000),
  visible     boolean not null default true,
  featured    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.settings (
  id        int primary key default 1 check (id = 1),
  site_name text not null default 'ศูนย์รวมลิงก์สำหรับนิสิต',
  tagline   text not null default 'รวมช่องทางติดต่อของหน่วยงาน คณะ และองค์กรนิสิตไว้ในที่เดียว',
  about     text not null default 'รวบรวมช่องทางติดต่อ เช่น Facebook Instagram LINE อีเมล เบอร์โทร และเว็บไซต์ ของมหาวิทยาลัย คณะ หน่วยงาน และองค์กรนิสิต',
  contact   text not null default ''
);

create table if not exists public.requests (
  id           uuid primary key default gen_random_uuid(),
  type         text not null check (type in ('add', 'edit')),
  site_id      uuid references public.sites(id) on delete set null,
  name         text not null,
  url          text not null default '',
  description  text not null,
  category_id  text not null,
  facebook     text not null default '',
  instagram    text not null default '',
  email        text not null default '',
  phone        text not null default '',
  line         text not null default '',
  contact      text not null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note   text not null default '',
  client_token text not null,
  created_at   timestamptz not null default now(),
  decided_at   timestamptz
);

-- รายชื่อผู้ดูแล (ไม่มี policy จึงอ่านหรือแก้ตรงๆ จากเว็บไม่ได้)
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- อัปเกรดจากเวอร์ชันเก่า (รันซ้ำได้ ไม่เสียข้อมูล) ----------
alter table public.sites add column if not exists email text not null default '';
alter table public.sites add column if not exists phone text not null default '';
alter table public.sites add column if not exists line  text not null default '';
alter table public.sites alter column url set default '';
alter table public.sites drop constraint if exists sites_url_check;
alter table public.sites add constraint sites_url_check check (url = '' or (url ~* '^https?://' and char_length(url) <= 300));
alter table public.sites drop constraint if exists sites_has_channel;
alter table public.sites add constraint sites_has_channel check (url <> '' or facebook <> '' or instagram <> '' or email <> '' or phone <> '' or line <> '');
alter table public.requests add column if not exists email text not null default '';
alter table public.requests add column if not exists phone text not null default '';
alter table public.requests add column if not exists line  text not null default '';
alter table public.requests alter column url set default '';

-- คอลัมน์ที่โค้ดหน้าเว็บใช้อยู่ (เดิมขาดใน schema)
alter table public.requests add column if not exists logo           text not null default '' check (char_length(logo) <= 150000);
alter table public.requests add column if not exists requester_name text not null default '';
alter table public.settings add column if not exists admin_facebook  text not null default '';
alter table public.settings add column if not exists admin_instagram text not null default '';

-- คำขอลบหน่วยงาน: เพิ่มประเภท 'delete' (เหตุผลเก็บในช่อง description)
alter table public.requests drop constraint if exists requests_type_check;
alter table public.requests add constraint requests_type_check check (type in ('add', 'edit', 'delete'));

-- ---------- กันหน่วยงานซ้ำระดับฐานข้อมูล ----------
-- ทำลิงก์ให้เป็นรูปแบบกลาง: ตัวพิมพ์เล็ก ตัด http(s):// www. m. และ / ท้าย
create or replace function public.norm_social(v text)
returns text language sql immutable as $$
  select nullif(regexp_replace(regexp_replace(lower(btrim(coalesce(v, ''))), '^https?://((www|m)\.)?', ''), '[/?#]+$', ''), '');
$$;

-- หมายเหตุ: ถ้าในตารางมีข้อมูลซ้ำอยู่แล้ว คำสั่งสร้าง index ด้านล่างจะ error
-- ให้ลบหรือแก้รายการซ้ำก่อน แล้วรันใหม่
create unique index if not exists sites_name_unique      on public.sites (lower(btrim(name)));
create unique index if not exists sites_facebook_unique  on public.sites (public.norm_social(facebook)) where facebook <> '';
create unique index if not exists sites_instagram_unique on public.sites (public.norm_social(instagram)) where instagram <> '';

-- ---------- ฟังก์ชัน ----------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ผู้ส่งคำขอดูสถานะคำขอของตัวเองได้ด้วยโทเคนลับที่เก็บในเบราว์เซอร์ ไม่ต้องล็อกอิน
drop function if exists public.my_requests(text);
create function public.my_requests(token text)
returns table (
  id uuid, type text, site_id uuid, name text, url text, description text, category_id text,
  facebook text, instagram text, email text, phone text, line text,
  contact text, status text, admin_note text, created_at timestamptz
)
language sql security definer stable set search_path = public as $$
  select r.id, r.type, r.site_id, r.name, r.url, r.description, r.category_id,
         r.facebook, r.instagram, r.email, r.phone, r.line,
         r.contact, r.status, r.admin_note, r.created_at
  from public.requests r
  where char_length(token) >= 20 and r.client_token = token
  order by r.created_at desc
  limit 40;
$$;

-- กันสแปม: ผู้ส่งแต่ละคนรอได้ไม่เกิน 10 คำขอ และทั้งระบบไม่เกิน 100 คำขอต่อชั่วโมง
create or replace function public.limit_requests()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.requests where client_token = new.client_token and status = 'pending') >= 10 then
    raise exception 'too_many_pending';
  end if;
  if (select count(*) from public.requests where created_at > now() - interval '1 hour') >= 100 then
    raise exception 'rate_limited';
  end if;
  return new;
end;
$$;

drop trigger if exists requests_limit on public.requests;
create trigger requests_limit before insert on public.requests
  for each row execute function public.limit_requests();

-- ---------- ขอลบได้เฉพาะผู้ที่เป็นคนเพิ่มรายการ (ขอแก้ได้ทุกคน) ----------
-- ผูกผู้เพิ่มกับรายการผ่านคำขอ 'add' ที่อนุมัติแล้ว (requests.site_id + client_token)
-- ข้อมูลเดิม: เติม site_id ให้คำขอ add ที่อนุมัติไปแล้ว โดยจับคู่จากชื่อ (ชื่อไม่ซ้ำกันแล้ว)
update public.requests r set site_id = s.id
  from public.sites s
 where r.type = 'add' and r.status = 'approved' and r.site_id is null
   and lower(btrim(r.name)) = lower(btrim(s.name));

-- ทำชื่อ/ช่องทางติดต่อให้เป็นรูปแบบกลางก่อนเทียบ (ไม่สนตัวพิมพ์ ช่องว่าง - ( ) .)
create or replace function public.norm_person(v text)
returns text language sql immutable as $$
  select regexp_replace(lower(btrim(coalesce(v, ''))), '\s+', ' ', 'g');
$$;
create or replace function public.norm_contact(v text)
returns text language sql immutable as $$
  select regexp_replace(lower(btrim(coalesce(v, ''))), '[\s\-().]', '', 'g');
$$;

-- ขอลบได้เมื่อ: เบราว์เซอร์เดียวกับที่ขอเพิ่ม (token ตรง) หรือกรอกชื่อ-นามสกุลและช่องทางติดต่อ
-- ตรงกับที่ใช้ตอนขอเพิ่มรายการนี้ (ใช้ข้ามเครื่องได้)
create or replace function public.check_delete_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.type = 'delete' and not exists (
    select 1 from public.requests r
     where r.type = 'add' and r.status = 'approved' and r.site_id = new.site_id
       and (
         r.client_token = new.client_token
         or (
           public.norm_person(new.requester_name) <> '' and public.norm_contact(new.contact) <> ''
           and public.norm_person(r.requester_name) = public.norm_person(new.requester_name)
           and public.norm_contact(r.contact) = public.norm_contact(new.contact)
         )
       )
  ) then
    raise exception 'not_owner';
  end if;
  return new;
end;
$$;

drop trigger if exists requests_owner on public.requests;
create trigger requests_owner before insert on public.requests
  for each row execute function public.check_delete_owner();

-- ---------- สิทธิ์ ----------
revoke all on public.admins from anon, authenticated;
grant select on public.categories, public.sites, public.settings to anon, authenticated;
grant insert, update, delete on public.categories, public.sites to authenticated;
grant update on public.settings to authenticated;
grant insert on public.requests to anon, authenticated;
grant select, update, delete on public.requests to authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.my_requests(text) to anon, authenticated;

-- ---------- กฎรายแถว (RLS) ----------
alter table public.categories enable row level security;
alter table public.sites      enable row level security;
alter table public.settings   enable row level security;
alter table public.requests   enable row level security;
alter table public.admins     enable row level security;

drop policy if exists categories_read  on public.categories;
drop policy if exists categories_admin on public.categories;
create policy categories_read  on public.categories for select using (true);
create policy categories_admin on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists sites_read  on public.sites;
drop policy if exists sites_admin on public.sites;
create policy sites_read  on public.sites for select using (visible or public.is_admin());
create policy sites_admin on public.sites for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists settings_read  on public.settings;
drop policy if exists settings_admin on public.settings;
create policy settings_read  on public.settings for select using (true);
create policy settings_admin on public.settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists requests_insert on public.requests;
drop policy if exists requests_admin  on public.requests;
create policy requests_insert on public.requests for insert to anon, authenticated
  with check (
    status = 'pending' and admin_note = '' and decided_at is null
    and char_length(name) between 2 and 60
    and char_length(description) between 10 and 200
    and char_length(contact) between 1 and 80
    and char_length(client_token) >= 20
    and (url = '' or (url ~* '^https?://' and char_length(url) <= 300))
    and char_length(facebook) <= 300 and char_length(instagram) <= 300
    and char_length(email) <= 100 and char_length(phone) <= 30 and char_length(line) <= 300
    and char_length(logo) <= 150000 and char_length(requester_name) <= 80
    and (
      (type = 'delete' and site_id is not null)
      or (type in ('add', 'edit') and (url <> '' or facebook <> '' or instagram <> '' or email <> '' or phone <> '' or line <> ''))
    )
  );
create policy requests_admin on public.requests for all using (public.is_admin()) with check (public.is_admin());

-- ---------- ข้อมูลเริ่มต้น ----------
insert into public.settings (id) values (1) on conflict (id) do nothing;

insert into public.categories (id, name, description, sort_order) values
  ('university',     'มหาวิทยาลัย',  'เว็บไซต์หลักและหน่วยงานกลางของมหาวิทยาลัย', 0),
  ('faculty',        'คณะ / สาขา',   'เว็บไซต์และช่องทางของแต่ละคณะและสาขาวิชา', 1),
  ('org',            'องค์กรนิสิต',  'สโมสรนิสิต ชมรม และกลุ่มกิจกรรม', 2),
  ('news',           'ข่าวสาร',      'ประกาศ ข่าวกิจกรรม และข่าวประชาสัมพันธ์', 3),
  ('student-system', 'ระบบนิสิต',    'ระบบลงทะเบียน ผลการเรียน และบริการสำหรับนิสิต', 4),
  ('study',          'การเรียน',     'ห้องสมุด สื่อการเรียน และแหล่งเรียนรู้ออนไลน์', 5),
  ('service',        'บริการ',       'สุขภาพ หอพัก ทุนการศึกษา และสวัสดิการ', 6)
on conflict (id) do nothing;