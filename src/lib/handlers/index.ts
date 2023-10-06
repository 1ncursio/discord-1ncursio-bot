import { Commands } from "$commands/applicationCommands";
import {
  handleDiscordAPIError,
  handleDiscordjsError,
} from "$lib/utils/errorHandlers";
import { Interaction } from "discord.js";
import { match } from "ts-pattern";
import autocleanerHandler from "./autocleanerHandler";
import channelActivityHandler from "./channelActivityHandler";
import cleanHandler from "./cleanHandler";
import pingHandler from "./pingHandler";

const handler = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;

  match(interaction.commandName)
    .with(Commands.Ping, () =>
      pingHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
        .catch(Promise.reject)
    )
    .with(Commands.Cleaner, () =>
      cleanHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
        .catch(Promise.reject)
    )
    .with(Commands.AutoCleaner, () =>
      autocleanerHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
        .catch(Promise.reject)
    )
    .with(Commands.ChannelActivity, () =>
      channelActivityHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
        .catch(Promise.reject)
    )
    .with(Commands.Add, () =>
      pingHandler(interaction)()
        .catch(handleDiscordjsError(interaction))
        .catch(handleDiscordAPIError(interaction))
        .catch(Promise.reject)
    )
    .otherwise(async () => await interaction.reply("Unknown command!"))
    .catch((error) => console.error(error));
};

export default handler;
