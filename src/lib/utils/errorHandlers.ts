import {
    ChatInputCommandInteraction,
    DiscordAPIError,
    DiscordjsError,
} from "discord.js";

export const handleDiscordjsError =
  (interaction: ChatInputCommandInteraction) => async (error: unknown) => {
    if (!(error instanceof DiscordjsError)) {
      return Promise.reject(error);
    }

    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply("Something went wrong!");
    } else {
      await interaction.reply("Something went wrong!");
    }
  };

export const handleDiscordAPIError =
  (interaction: ChatInputCommandInteraction) => async (error: unknown) => {
    if (!(error instanceof DiscordAPIError)) {
      return Promise.reject(error);
    }

    if (error.code === 50001 /* Missing Access */) {
      if (interaction.deferred && !interaction.replied) {
        await interaction.editReply("I can't access that channel!");
      } else {
        await interaction.reply("I can't access that channel!");
      }
    } else if (error.code === 50013 /* Missing Permissions */) {
      if (interaction.deferred && !interaction.replied) {
        await interaction.editReply("I don't have permission to do that!");
      } else {
        await interaction.reply("I don't have permission to do that!");
      }
    } else if (error.code === 10062 /* Unknown interaction */) {
      if (interaction.deferred && !interaction.replied) {
        await interaction.editReply("This interaction doesn't exist!");
      } else {
        await interaction.reply("This interaction doesn't exist!");
      }
    }
  };
