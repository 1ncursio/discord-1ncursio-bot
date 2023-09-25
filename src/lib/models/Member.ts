import db from "$lib/db";

export type TMember = {
  id: string;
  username: string;
  global_name: string;
  display_name: string;
  display_avatar_url: string;
};

const Member = {
  all: async () => {
    try {
      const query = `select * from members`;

      return (await db.query<TMember>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  insert: async ({
    id,
    username,
    global_name,
    display_name,
    display_avatar_url,
  }: TMember) => {
    try {
      const query = `
        insert into 
          members (id, username, global_name, display_name, display_avatar_url)
        values ($1, $2, $3, $4, $5)
        returning *
      `;

      return (
        await db.query<TMember>(query, [
          id,
          username,
          global_name,
          display_name,
          display_avatar_url,
        ])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  bulkInsert: async (members: TMember[]) => {
    try {
      const query = `
        insert into 
          members (id, username, global_name, display_name, display_avatar_url)
        values ${members
          .map(
            (_, index) =>
              `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
                index * 5 + 4
              }, $${index * 5 + 5})`
          )
          .join(", ")}
        on conflict (id) do nothing
        returning *
      `;

      return (
        await db.query<TMember>(
          query,
          members.flatMap((member) => [
            member.id,
            member.username,
            member.global_name,
            member.display_name,
            member.display_avatar_url,
          ])
        )
      ).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  upsert: async ({
    id,
    username,
    global_name,
    display_name,
    display_avatar_url,
  }: TMember) => {
    try {
      const query = `
        insert into members (id, username, global_name, display_name, display_avatar_url)
        values ($1, $2, $3, $4, $5)
        on conflict (id) do update set
          username = $2,
          global_name = $3,
          display_name = $4,
          display_avatar_url = $5
        returning *
      `;

      return (
        await db.query<TMember>(query, [
          id,
          username,
          global_name,
          display_name,
          display_avatar_url,
        ])
      ).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Member;
