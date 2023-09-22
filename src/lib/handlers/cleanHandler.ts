import { ChannelType, ChatInputCommandInteraction } from "discord.js";

const cleanHandler = (interaction: ChatInputCommandInteraction) => async () => {
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

  const deletedMessages = await channel.bulkDelete(amount);

  await interaction.editReply(`Deleted ${deletedMessages.size} messages!`);
};

export default cleanHandler;
