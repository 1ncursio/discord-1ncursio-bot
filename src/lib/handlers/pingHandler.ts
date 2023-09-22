import client from "$lib/client";
import { ChannelType, ChatInputCommandInteraction } from "discord.js";

const pingHandler = (interaction: ChatInputCommandInteraction) => async () => {
  const { channel } = interaction;
  if (channel?.type !== ChannelType.GuildText) {
    await interaction.reply("Cannot delete messages in this channel!");
    return;
  }

  await interaction.reply(`Pong! ${client.ws.ping}ms`);
};

export default pingHandler;
