import pool from "../db";
import { TGuild } from "./guild";

export type TChannel = {
  id: string;
  guild_id: TGuild["id"];
};

const Channel = {
  all: async () => {
    try {
      const query = `select * from channels`;

      return (await pool.query<TChannel>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default Channel;
