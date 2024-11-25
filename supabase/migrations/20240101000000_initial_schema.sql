-- Create organizations table
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  name text not null,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create organization_members table
create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade not null,
  user_id text not null,
  role text not null check (role in ('admin', 'member')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Enable Row Level Security
alter table organizations enable row level security;
alter table organization_members enable row level security;

-- Create RLS Policies for organizations
create policy "Users can view their organizations"
  on organizations for select
  using (
    clerk_id in (
      select organization_id::text
      from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Users can update their organizations"
  on organizations for update
  using (
    clerk_id in (
      select organization_id::text
      from organization_members
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Create RLS Policies for organization_members
create policy "Users can view members in their organizations"
  on organization_members for select
  using (
    organization_id in (
      select o.id
      from organizations o
      inner join organization_members om on o.id = om.organization_id
      where om.user_id = auth.uid()
    )
  );

create policy "Only admins can manage organization members"
  on organization_members for all
  using (
    organization_id in (
      select organization_id
      from organization_members
      where user_id = auth.uid()
      and role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_organizations_updated_at
  before update on organizations
  for each row
  execute function update_updated_at_column();

create trigger update_organization_members_updated_at
  before update on organization_members
  for each row
  execute function update_updated_at_column();
