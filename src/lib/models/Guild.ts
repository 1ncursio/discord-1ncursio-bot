import db from "$lib/db";

export type TGuild = {
  id: string;
  name: string;
};

const Guild = {
  all: async () => {
    try {
      const query = `select * from guilds`;

      return (await db.query<TGuild>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  get: async (id: TGuild["id"]) => {
    try {
      const query = `select * from guilds where id = $1`;

      return (await db.query<TGuild>(query, [id])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  insert: async ({ id, name }: TGuild) => {
    try {
      const query = `insert into guilds (id, name) values ($1, $2) returning *`;

      return (await db.query<TGuild>(query, [id, name])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  upsert: async ({ id, name }: TGuild) => {
    try {
      const query = `
        insert into guilds (id, name)
        values ($1, $2)
        on conflict (id) do update set name = $2
        returning *
      `;

      return (await db.query<TGuild>(query, [id, name])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Guild;
