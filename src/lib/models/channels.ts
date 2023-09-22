import db from "$lib/db";
import { TGuild } from "./guild";

export type TChannel = {
  id: string;
  guild_id: TGuild["id"];
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
