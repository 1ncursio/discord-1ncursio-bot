import { Interaction } from "discord.js";
import { match } from "ts-pattern";
import { Commands } from "../../commands/applicationCommands";
import {
  handleDiscordAPIError,
  handleDiscordjsError,
} from "../utils/errorHandlers";
import cleanHandler from "./cleanHandler";
import pingHandler from "./pingHandler";

const handler = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // try {
  match(interaction.commandName)
    .with(Commands.Clean, cleanHandler(interaction))
    .with(Commands.Ping, pingHandler(interaction))
    .otherwise(async () => await interaction.reply("Unknown command!"))
    .catch((error) => console.error(error))
    .catch(handleDiscordjsError(interaction))
    .catch(handleDiscordAPIError(interaction));
};

export default handler;
