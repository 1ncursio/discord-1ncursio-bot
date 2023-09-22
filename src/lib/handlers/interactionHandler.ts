import {
    ChannelType,
    DiscordAPIError,
    DiscordjsError,
    Interaction,
} from "discord.js";
import { Commands } from "../commands";

const interactionHandler = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === Commands.Clean) {
      const amount = interaction.options.getInteger("amount") ?? 10;
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
    } else {
        await interaction.reply("Unknown command!");
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
          await interaction.editReply("I can't access that channel!");
        } else {
          await interaction.reply("I can't access that channel!");
        }
      } else if (error.code === 50013 /* Missing Permissions */) {
        if (interaction.deferred) {
          await interaction.editReply("I don't have permission to do that!");
        } else {
          await interaction.reply("I don't have permission to do that!");
        }
      }
    }
  }
};

export default interactionHandler;
