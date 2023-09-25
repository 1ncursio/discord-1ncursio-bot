import db from "$lib/db";
import { TChannel } from "./Channel";
import { TGuild } from "./Guild";
import { TMember } from "./Member";

export type TMessage = {
  id: string;
  channel_id: TChannel["id"];
  guild_id: TGuild["id"];
  author_id: TMember["id"];
  deleted_at: Date;
};

const Message = {
  all: async () => {
    try {
      const query = `select * from messages`;

      return (await db.query<TMessage>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  add: async ({ id }: TMessage) => {
    try {
      const query = `insert into messages (id) values ($1) returning *`;

      return (await db.query<TMessage>(query, [id])).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Message;
