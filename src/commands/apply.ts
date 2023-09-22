import {
    ApplicationCommand,
    ApplicationCommandOptionType,
    REST,
    Routes,
} from "discord.js";

const main = async () => {
  if (!process.env.TOKEN) {
    throw new Error("TOKEN environment variable is required!");
  }

  if (!process.env.APPLICATION_ID) {
    throw new Error("APPLICATION_ID environment variable is required!");
  }

  const commands: ApplicationCommand[] = [
    {
      name: "clean",
      description: "Clean up the messages",
      options: [
        {
          type: ApplicationCommandOptionType.Integer,
          name: "amount",
          description: "The amount of messages to clean up",
          required: false,
          maxValue: 100,
          minValue: 1,
          autocomplete: true,
        },
      ],
    },
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
