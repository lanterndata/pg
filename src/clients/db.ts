import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { DB } from './db-types';
import { Pool } from 'pg';

interface DBWithMaterializedViews extends DB {
  threads: {
    messageId: string;
    threadId: string;
  };
}

const db = new Kysely<DBWithMaterializedViews>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});

export default db;
