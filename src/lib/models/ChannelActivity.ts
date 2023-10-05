import db from "$lib/db";
import { TChannel } from "./Channel";
import { TMember } from "./Member";

export type TChannelActivity = {
  id: number;
  channel_id: TChannel["id"];
  member_id: TMember["id"];
  action_type:
    | "join"
    | "leave"
    | "muted"
    | "unmuted"
    | "deafened"
    | "undeafened"
    | "stream_started"
    | "stream_stopped";
  created_at: Date;
};

const ChannelActivity = {
  all: async () => {
    try {
      const query = `select * from channel_activities`;

      return (await db.query<TChannelActivity>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  insert: async ({
    channel_id,
    member_id,
    action_type,
  }: Omit<TChannelActivity, "id" | "created_at">) => {
    try {
      const query = `
        insert into 
          channel_activities (channel_id, member_id, action_type)
        values ($1, $2, $3)
        returning *
      `;

      return (
        await db.query<TChannelActivity>(query, [
          channel_id,
          member_id,
          action_type,
        ])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default ChannelActivity;
