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
  add: async ({
    id,
    channel_id,
    guild_id,
    author_id,
    deleted_at,
  }: TMessage) => {
    try {
      const query = `
        insert into
          messages (id, channel_id, guild_id, author_id, deleted_at)
        values ($1, $2, $3, $4, $5)
        returning *
      `;

      return (
        await db.query<TMessage>(query, [
          id,
          channel_id,
          guild_id,
          author_id,
          deleted_at,
        ])
      ).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Message;
