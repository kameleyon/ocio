-- Disable Row Level Security (RLS) for the storage.buckets table
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Re-enable Row Level Security (RLS) after bucket creation
-- Uncomment the line below after running the bucket creation script
-- ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;