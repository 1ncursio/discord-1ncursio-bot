import db from "$lib/db";
import { TGuild } from "./Guild";

export type TChannel = {
  id: string;
  guild_id: TGuild["id"];
  name: string;
};

const Channel = {
  all: async () => {
    try {
      const query = `select * from channels`;

      return (await db.query<TChannel>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  get: async (id: TChannel["id"]) => {
    try {
      const query = `select * from channels where id = $1`;

      return (await db.query<TChannel>(query, [id])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  add: async ({ id, guild_id }: TChannel) => {
    try {
      const query = `insert into channels (id, guild_id) values ($1, $2) returning *`;

      return (await db.query<TChannel>(query, [id, guild_id])).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Channel;