@echo off
echo Setting up OptimusCode.io database in Supabase...

REM Load environment variables from .env file
for /f "tokens=*" %%a in ('type .env ^| findstr /v "^#" ^| findstr /v "^$"') do set "%%a"

REM Execute SQL script using Supabase CLI
npx supabase db execute --file setup_database.sql --password %SUPABASE_DB_PASSWORD% --db-url %SUPABASE_URL%/postgres

echo Database setup completed!
