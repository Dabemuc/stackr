ALTER TABLE components
  ALTER COLUMN links
  TYPE jsonb
  USING to_jsonb(links::text);
