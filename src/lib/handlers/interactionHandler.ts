import { DiscordAPIError, DiscordjsError, Interaction } from "discord.js";
import { match } from "ts-pattern";
import { Commands } from "../../commands/applicationCommands";
import cleanHandler from "./cleanHandler";
import pingHandler from "./pingHandler";

const interactionHandler = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    match(interaction.commandName)
      .with(Commands.Clean, cleanHandler(interaction))
      .with(Commands.Ping, pingHandler(interaction))
      .otherwise(async () => await interaction.reply("Unknown command!"));
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
