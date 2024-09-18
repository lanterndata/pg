# PG Mailing List

## Getting started

- Run `git clone --recurse-submodules lanterndata/pg`

## Populate data

- Use `pgsql-lists-offline` to download the mailing list archives to a local `data` directory. Note the dependencies on `parallel` and `curl`.
- Use `yarn scrape` to process the archives and populate a Postgres database. Note that the database connection string should be populated in `.env.local` as `DATABASE_URL`.

## Create migration

```bash
yarn dbmate new <migration-name>
```

## Run migrations

With `DATABASE_URL` set in the environment:

```bash
yarn dbmate up
```

## pgsql-lists-offline

Source: <https://github.com/wsdookadr/pgsql-lists-offline>

Downloads mailing list archives for PostgreSQL, PostGIS and pgRouting.

The mailing list archives that will be downloaded are in the [[https://en.wikipedia.org/wiki/Mbox][mbox format]] and can be read
using any mbox-aware email client (for example [[http://www.mutt.org/][mutt]] ).

### Dependencies

```sh
sudo apt-get install parallel curl
```

### Usage

```sh
./pgsql-lists-offline.sh -l
```

To download a list (for example pgsql-general):

```sh
./pgsql-lists-offline.sh -g pgsql-general
```

To download a list for a particular month:

```sh
./pgsql-lists-offline.sh -g pgsql-general -m 202403
```
