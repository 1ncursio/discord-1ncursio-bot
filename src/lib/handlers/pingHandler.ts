import { ChannelType, Interaction } from "discord.js";

const pingHandler = (interaction: Interaction) => async () => {
  if (!interaction.isChatInputCommand()) return;

  const { channel, createdTimestamp } = interaction;
  if (channel?.type !== ChannelType.GuildText) {
    await interaction.reply("Cannot delete messages in this channel!");
    return;
  }

  await interaction.reply(`Pong! ${Date.now() - createdTimestamp}ms`);
};

export default pingHandler;
