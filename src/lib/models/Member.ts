import db from "$lib/db";

export type TMember = {
  id: string;
  username: string;
  display_name: string;
  display_avatar_url: string;
};

const Message = {
  all: async () => {
    try {
      const query = `select * from members`;

      return (await db.query<TMember>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  add: async ({ ...fields }: TMember) => {
    try {
      const query = `
        insert into 
          members (id, username, display_name, display_avatar_url)
        values ($1, $2, $3, $4)
        returning *
      `;

      return (await db.query<TMember>(query, [fields])).rows;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Message;
