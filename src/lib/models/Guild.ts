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
  add: async ({ id, name }: TGuild) => {
    try {
      const query = `insert into guilds (id, name) values ($1, $2) returning *`;

      return (await db.query<TGuild>(query, [id, name])).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Guild;
