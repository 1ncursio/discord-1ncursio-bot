import {
    ChatInputCommandInteraction,
    DiscordAPIError,
    DiscordjsError,
} from "discord.js";
import { match } from "ts-pattern";

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

    match(error.code)
      .with(50001 /* Missing Access */, async () => {
        if (interaction.deferred && !interaction.replied) {
          await interaction.editReply("I can't access that channel!");
        } else if (
          (interaction.deferred && interaction.replied) ||
          (!interaction.deferred && interaction.replied)
        ) {
          await interaction.followUp("I can't access that channel!");
        } else {
          await interaction.reply("I can't access that channel!");
        }
      })
      .with(50013 /* Missing Permissions */, async () => {
        if (interaction.deferred && !interaction.replied) {
          await interaction.editReply("I don't have permission to do that!");
        } else if (
          (interaction.deferred && interaction.replied) ||
          (!interaction.deferred && interaction.replied)
        ) {
          await interaction.followUp("I don't have permission to do that!");
        } else {
          await interaction.reply("I don't have permission to do that!");
        }
      })
      .with(10062 /* Unknown interaction */, async () => {
        if (interaction.deferred && !interaction.replied) {
          await interaction.editReply("This interaction doesn't exist!");
        } else if (
          (interaction.deferred && interaction.replied) ||
          (!interaction.deferred && interaction.replied)
        ) {
          await interaction.followUp("This interaction doesn't exist!");
        } else {
          await interaction.reply("This interaction doesn't exist!");
        }
      })
      .otherwise(async () => {
        if (interaction.deferred && !interaction.replied) {
          await interaction.editReply("Something went wrong! try again later.");
        } else if (
          (interaction.deferred && interaction.replied) ||
          (!interaction.deferred && interaction.replied)
        ) {
          await interaction.followUp("Something went wrong! try again later.");
        } else {
          await interaction.reply("Something went wrong! try again later.");
        }
      });
  };
