import db from "$lib/db";
import { TChannel } from "./Channel";
import { TCommand } from "./Command";

export type TChannelCommandPair = {
  id: number;
  channel_id: TChannel["id"];
  command_id: TCommand["id"];
  created_at: Date;
};

const ChannelCommandPair = {
  all: async () => {
    try {
      const query = `select * from channel_command_pairs`;

      return (await db.query<TChannelCommandPair>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  allByCommandName: async (command_name: TCommand["name"]) => {
    try {
      const query = `
        select ccp.* from channel_command_pairs ccp
        inner join commands c on c.id = ccp.command_id
        where c.name = $1
      `;

      return (await db.query<TChannelCommandPair>(query, [command_name])).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  get: async ({
    channel_id,
    command_id,
  }: Pick<TChannelCommandPair, "channel_id" | "command_id">) => {
    try {
      const query = `select * from channel_command_pairs where channel_id = $1 and command_id = $2`;

      return (
        await db.query<TChannelCommandPair>(query, [channel_id, command_id])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  insert: async ({
    channel_id,
    command_id,
  }: Omit<TChannelCommandPair, "id" | "created_at">) => {
    try {
      const query = `insert into channel_command_pairs (channel_id, command_id) values ($1, $2) returning *`;

      return (
        await db.query<TChannelCommandPair>(query, [channel_id, command_id])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  upsert: async ({
    channel_id,
    command_id,
  }: Omit<TChannelCommandPair, "id" | "created_at">) => {
    try {
      const query = `
        insert into channel_command_pairs (channel_id, command_id)
        values ($1, $2)
        on conflict (channel_id, command_id) do nothing
        returning *
      `;

      return (
        await db.query<TChannelCommandPair>(query, [channel_id, command_id])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  delete: async ({
    channel_id,
    command_id,
  }: Pick<TChannelCommandPair, "channel_id" | "command_id">) => {
    try {
      const query = `
        delete from channel_command_pairs
        where channel_id = $1 and command_id = $2
        returning *
      `;

      return (
        await db.query<TChannelCommandPair>(query, [channel_id, command_id])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default ChannelCommandPair;
