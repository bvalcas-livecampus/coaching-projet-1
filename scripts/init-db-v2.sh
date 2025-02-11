createdb wow -U postgres -h 127.0.0.1 -p 5432

psql -U postgres -h 127.0.0.1 -p 5432 wow < dump_default-v2.sql
