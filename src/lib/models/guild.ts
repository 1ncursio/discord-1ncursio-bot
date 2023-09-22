import db from "$lib/db";

export type TGuild = {
  id: string;
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
  add: async ({ id }: TGuild) => {
    try {
      const query = `insert into guilds (id) values ($1) returning *`;

      return (await db.query<TGuild>(query, [id])).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Guild;
