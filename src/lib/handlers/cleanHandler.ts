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

  const messagesToDelete = await channel.messages.fetch({
    limit: 100,
  });
  const deletedMessages = await channel.bulkDelete(messagesToDelete, true);
  const messagesOlder = messagesToDelete.filter(
    (val) => !deletedMessages.has(val.id)
  );
  deletedMessages.forEach((message) => {
    console.log(message?.author?.username);
    console.log(message?.author?.displayName);
    console.log(message?.author?.globalName);
    console.log(message?.author?.displayAvatarURL({ size: 1024 }));
    // console.log(message?.author);
    console.log(message?.createdTimestamp);
    console.log(message?.nonce);
  });

  if (messagesOlder.size > 0) {
    let count = 0;
    // Delete messages older than 2 weeks
    for await (const [key, message] of messagesOlder) {
      await message.delete();
      count++;
      console.log(
        `Deleted (${count}/${messagesOlder.size}) messages in [${channel.name}] that were older than 2 weeks.`
      );
    }
  }

  await interaction.editReply(`Deleted ${deletedMessages.size} messages!`);
};

export default cleanHandler;
