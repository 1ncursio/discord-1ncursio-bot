import { Commands } from "$commands/applicationCommands";
import {
  handleDiscordAPIError,
  handleDiscordjsError,
} from "$lib/utils/errorHandlers";
import { Interaction } from "discord.js";
import { match } from "ts-pattern";
import cleanHandler from "./cleanHandler";
import pingHandler from "./pingHandler";

const handler = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  match(interaction.commandName)
    .with(Commands.Clean, () =>
      cleanHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
    )
    .with(Commands.Ping, () =>
      pingHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
    )
    .otherwise(async () => await interaction.reply("Unknown command!"))
    .catch((error) => console.error(error));
};

export default handler;
