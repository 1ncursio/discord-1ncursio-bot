import { ChannelType, ChatInputCommandInteraction } from "discord.js";

const pingHandler = (interaction: ChatInputCommandInteraction) => async () => {
  const { channel, createdTimestamp } = interaction;
  if (channel?.type !== ChannelType.GuildText) {
    await interaction.reply("Cannot delete messages in this channel!");
    return;
  }

  await interaction.reply(`Pong! ${Date.now() - createdTimestamp}ms`);
};

export default pingHandler;
