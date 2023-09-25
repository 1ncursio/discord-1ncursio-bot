import Channel from "$lib/models/Channel";
import Guild from "$lib/models/Guild";
import Member from "$lib/models/Member";
import Message from "$lib/models/Message";
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

  await Promise.all([
    Channel.upsert({
      id: channel.id,
      guild_id: channel.guildId,
      name: channel.name,
    }),
    Guild.upsert({
      id: channel.guild.id,
      name: channel.guild.name,
    }),
    Member.upsert({
      id: interaction.user.id,
      username: interaction.user.username,
      display_name: interaction.user.username,
      global_name: interaction.user.globalName ?? "",
      display_avatar_url: interaction.user.displayAvatarURL({ size: 4096 }),
    }),
  ]);

  const messagesToDelete = await channel.messages.fetch({
    limit: 100,
  });
  const deletedMessages = await channel.bulkDelete(messagesToDelete, true);
  const messagesOlder = messagesToDelete.filter(
    (val) => !deletedMessages.has(val.id)
  );

  await Message.bulkInsert(
    deletedMessages.filter(Boolean).map((message) => ({
      id: message?.id ?? "",
      channel_id: message?.channelId ?? "",
      guild_id: message?.guildId ?? "",
      author_id: message?.author?.id ?? "",
    }))
  );

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
