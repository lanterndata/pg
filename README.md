# PG Mailing List

This project provides scripts for retrieving Postgres mailing list archives, populating a Postgres database with them, and rendering the archives with NextJS.

## Getting started

- Run `git clone --recurse-submodules lanterndata/pg`

## Populate data

- Use `./scripts/scrape.sh` to download the mailing list archives and populate a Postgres database. Note that `DATABASE_URL` should be set in the environment.
- Use `pgsql-lists-offline` to download the mailing list archives to a local `data` directory. Note the dependencies on `parallel` and `curl`. See more below.
- Use `yarn scrape` to process the archives and populate a Postgres database. Note that `DATABASE_URL` should be set in the environment.

## Create migration

```bash
yarn dbmate new <migration-name>
```

## Run migrations

With `DATABASE_URL` set in the environment:

```bash
yarn dbmate up
```

## Notes for local development

The `body_dense_vector` column in `messages` was added and populated using the Lantern dashboard, and is not in the migration files.

## pgsql-lists-offline

Source: <https://github.com/wsdookadr/pgsql-lists-offline>

Downloads mailing list archives for PostgreSQL, PostGIS and pgRouting.

The mailing list archives that will be downloaded are in the [mbox format](https://en.wikipedia.org/wiki/Mbox) and can be read
using any mbox-aware email client (for example [mutt](http://www.mutt.org/) ).

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
