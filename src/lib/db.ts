import { Pool, QueryResultRow } from "pg";
import raise from "./utils/raise";

const pool = new Pool({
  host: process.env.PGHOST ?? raise("PGHOST environment variable is required!"),
  port: Number(
    process.env.PGPORT ?? raise("PGPORT environment variable is required!")
  ),
  database:
    process.env.PGDATABASE ??
    raise("PGDATABASE environment variable is required!"),
  user: process.env.PGUSER ?? raise("PGUSER environment variable is required!"),
  password:
    process.env.PGPASSWORD ??
    raise("PGPASSWORD environment variable is required!"),
});

const db = {
  query: <R extends QueryResultRow = any, I extends any[] = any[]>(
    text: string,
    values?: I
  ) => {
    return pool.query<R>(text, values);
  },
};

export default db;
