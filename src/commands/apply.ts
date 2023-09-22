import { REST, Routes } from "discord.js";
import applicationCommands from "./applicationCommands";

const main = async () => {
  if (!process.env.TOKEN) {
    throw new Error("TOKEN environment variable is required!");
  }

  if (!process.env.APPLICATION_ID) {
    throw new Error("APPLICATION_ID environment variable is required!");
  }

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
    body: applicationCommands.map((command) => command.toJSON()),
  });

  console.log("Successfully reloaded application (/) commands.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
