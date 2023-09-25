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
  insert: async ({
    id,
    channel_id,
    guild_id,
    author_id,
  }: Omit<TMessage, "deleted_at">) => {
    try {
      const query = `
        insert into
          messages (id, channel_id, guild_id, author_id)
        values ($1, $2, $3, $4)
        returning *
      `;

      return (
        await db.query<TMessage>(query, [id, channel_id, guild_id, author_id])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  bulkInsert: async (messages: Omit<TMessage, "deleted_at">[]) => {
    try {
      const query = `
        insert into
          messages (id, channel_id, guild_id, author_id)
        values ${messages
          .map(
            (_, index) =>
              `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${
                index * 4 + 4
              })`
          )
          .join(", ")}
        returning *
      `;

      return (
        await db.query<TMessage>(
          query,
          messages.flatMap(({ id, channel_id, guild_id, author_id }) => [
            id,
            channel_id,
            guild_id,
            author_id,
          ])
        )
      ).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

export default Message;
