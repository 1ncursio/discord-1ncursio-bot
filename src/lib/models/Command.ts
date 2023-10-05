import db from "$lib/db";

export type TCommand = {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
};

const Command = {
  all: async () => {
    try {
      const query = `select * from commands`;

      return (await db.query<TCommand>(query)).rows;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
  get: async ({ name }: Pick<TCommand, "name">) => {
    try {
      const query = `select * from commands where name = $1`;

      return (await db.query<TCommand>(query, [name])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  insert: async ({
    name,
  }: Omit<TCommand, "id" | "created_at" | "updated_at">) => {
    try {
      const query = `
        insert into 
          commands (name)
        values ($1)
        returning *
      `;

      return (await db.query<TCommand>(query, [name])).rows[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};

export default Command;
