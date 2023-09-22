import applicationCommands from "$commands/applicationCommands";
import raise from "$lib/utils/raise";
import { REST, Routes } from "discord.js";

const apply = async () => {
  const rest = new REST({ version: "10" }).setToken(
    process.env.TOKEN ?? raise("TOKEN environment variable is required!")
  );

  console.log("Started refreshing application (/) commands.");

  await rest.put(
    Routes.applicationCommands(
      process.env.APPLICATION_ID ??
        raise("APPLICATION_ID environment variable is required!")
    ),
    {
      body: applicationCommands.map((command) => command.toJSON()),
    }
  );

  console.log("Successfully reloaded application (/) commands.");
};

export default apply;
