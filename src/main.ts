import {
  ApplicationCommand,
  ApplicationCommandOptionType,
  ChannelType,
  DiscordAPIError,
  DiscordjsError,
  REST,
  Routes,
} from "discord.js";

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

if (!process.env.TOKEN) {
  throw new Error("TOKEN environment variable is required!");
}

if (!process.env.APPLICATION_ID) {
  throw new Error("APPLICATION_ID environment variable is required!");
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("Started refreshing application (/) commands.");

  await rest.put(Routes.applicationCommands(process.env.APPLICATION_ID), {
    body: commands,
  });

  console.log("Successfully reloaded application (/) commands.");
} catch (error) {
  console.error(error);
}

import { Client, GatewayIntentBits } from "discord.js";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "clean") {
      const amount = interaction.options.getNumber("amount") ?? 10;
      const { channel } = interaction;

      if (channel?.type !== ChannelType.GuildText) {
        await interaction.reply("Cannot delete messages in this channel!");
        return;
      }

      if (amount < 1 || amount > 100) {
        await interaction.reply("Amount must be between 1 and 100!");
        return;
      }

      await interaction.deferReply({
        ephemeral: true,
        fetchReply: true,
      });

      const d = await channel.bulkDelete(amount);

      //   d.forEach((message) => {
      //     console.log(message?.author?.username);
      //     console.log(message?.content);
      //   });

      await interaction.editReply(`Deleted ${d.size} messages!`);
    }
  } catch (error) {
    console.error(error);

    if (error instanceof DiscordjsError) {
      if (interaction.deferred) {
        await interaction.editReply("Something went wrong!");
      } else {
        await interaction.reply("Something went wrong!");
      }
    } else if (error instanceof DiscordAPIError) {
      if (error.code === 50001 /* Missing Access */) {
        if (interaction.deferred) {
          await interaction.editReply("I don't have permission to do that!");
        } else {
          await interaction.reply("I don't have permission to do that!");
        }
      }
    }
  }
});

client.login(process.env.TOKEN);
