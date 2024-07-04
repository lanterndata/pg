# PG Mailing List

## Getting started

- Run `git clone --recurse-submodules lanterndata/pg`

## Populate data

- Use `pgsql-lists-offline` to download the mailing list archives to a local `data` directory. Note the dependencies on `parallel` and `curl`.
- Use `yarn scrape` to process the archives and populate a Postgres database. Note that the database connection string should be populated in `.env.local` as `DATABASE_URL`.
