# AI Starter - Joro AI

## Prerequisites

Install [Cursor](https://cursor.com) and add [Vue - Official](https://marketplace.cursorapi.com/items?itemName=Vue.volar) extension

## Setup

Add cursor Rules
Add indexing for these docs
Supabase, shadcn, stunning ui

#### Steps

Create [Email](https://gmail.com)
Create [Github](https://github.com)
Create [Supabase](https://supabase.com)

Update nuxt.config.ts with Supabase credentials (Project Settings -> Data API) with URL, public key and service key ( we have demo credentials there )

## npm install

## Go to Run and Debug Panel and click Run

Setup the URLs for redirecting in Supabase
Go to **Authenitcation** -> **URL Configuration**
Add http://localhost/** as url
if you already have domain add https://yourdomain.com/**

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  email text,
  full_name text,
  image text,
);
-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

```

Now you have login working
Go to **/login**

## Storage

We can use the default storage solution of supabase

**Create a bucket** called `files`
