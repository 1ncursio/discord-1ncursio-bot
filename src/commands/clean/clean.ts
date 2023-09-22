import client from "$lib/client";
import Channel from "$lib/models/channels";
import Guild from "$lib/models/guild";
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

    const deletedMessages = await fetchedChannel.bulkDelete(
      Number(process.env.DELETE_AMOUNT) ?? 50
    );
    console.log(
      `Deleted ${deletedMessages.size} messages in [${fetchedChannel.name}]`
    );
  }
};

export default clean;
