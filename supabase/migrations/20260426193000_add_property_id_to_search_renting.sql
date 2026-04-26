alter table public.search_renting
add column if not exists property_id bigint null;

create index if not exists search_renting_property_id_idx
  on public.search_renting (property_id);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'property'
  ) then
    if not exists (
      select 1
      from information_schema.table_constraints
      where table_schema = 'public'
        and table_name = 'search_renting'
        and constraint_name = 'search_renting_property_id_fkey'
    ) then
      alter table public.search_renting
      add constraint search_renting_property_id_fkey
      foreign key (property_id)
      references public.property (id)
      on delete set null;
    end if;
  elsif exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'properties'
  ) then
    if not exists (
      select 1
      from information_schema.table_constraints
      where table_schema = 'public'
        and table_name = 'search_renting'
        and constraint_name = 'search_renting_property_id_fkey'
    ) then
      alter table public.search_renting
      add constraint search_renting_property_id_fkey
      foreign key (property_id)
      references public.properties (id)
      on delete set null;
    end if;
  else
    raise notice 'Skipped search_renting.property_id foreign key creation because no public.property or public.properties table was found.';
  end if;
end $$;
