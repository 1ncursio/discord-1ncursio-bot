import client from "$lib/client";
import Channel from "$lib/models/Channel";
import Guild from "$lib/models/Guild";
import raise from "$lib/utils/raise";
import { ChannelType } from "discord.js";

const clean = async () => {
  const guilds = await Guild.all();
  for await (const guild of guilds) {
    await client.guilds.fetch(guild.id);
  }

  const channels = await Channel.all();

  for await (const channel of channels) {
    const fetchedChannel =
      (await client.channels.fetch(channel.id)) ?? raise("Channel not found!");

    if (fetchedChannel.type !== ChannelType.GuildText) {
      throw new Error("Cannot delete messages in this channel!");
    }

    const messagesToDelete = await fetchedChannel.messages.fetch({
      limit: 100,
    });
    const deletedMessages = await fetchedChannel.bulkDelete(
      messagesToDelete,
      true
    );
    const messagesOlder = messagesToDelete.filter(
      (val) => !deletedMessages.has(val.id)
    );

    if (messagesOlder.size > 0) {
      let count = 0;
      // Delete messages older than 2 weeks
      for await (const [key, message] of messagesOlder) {
        await message.delete();
        count++;
        console.log(
          `Deleted (${count}/${messagesOlder.size}) messages in [${fetchedChannel.name}] that were older than 2 weeks.`
        );
      }
    }
    console.log(
      `Deleted ${deletedMessages.size} messages in [${fetchedChannel.name}]`
    );
  }
};

export default clean;
