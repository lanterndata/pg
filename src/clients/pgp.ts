import PgPromise from 'pg-promise';

declare global {
  var pgp: PgPromise.IDatabase<any>;
}

let pgp: PgPromise.IDatabase<any>;
if (global.pgp) {
  pgp = global.pgp;
} else {
  pgp = PgPromise({
    // Camelcase columns
    receive({ data }) {
      const tmp = data[0];
      for (const prop in tmp) {
        const camel = PgPromise.utils.camelize(prop);
        if (!(camel in tmp)) {
          for (let i = 0; i < data.length; i++) {
            const d = data[i];
            d[camel] = d[prop];
            delete d[prop];
          }
        }
      }
    },
    // Error
    error(err, e) {
      if (e.query) {
        console.log('Error query:', e.query);
        if (e.params) {
          console.log('Error params:', e.params);
        }
      }
    },
  })({
    connectionString: process.env.DATABASE_URL,
  });
  global.pgp = pgp;
}

export default pgp;
