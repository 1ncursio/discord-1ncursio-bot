import { ChannelType } from "discord.js";
import { guilds } from "../../../data.json";
import client from "../../lib/client";

const clean = async () => {
  for await (const guild of guilds) {
    await client.guilds.fetch(guild.id);
  }

  const channels = guilds.flatMap((guild) => guild.channels);

  for await (const channel of channels) {
    const fetchedChannel = await client.channels.fetch(channel.id);

    if (!fetchedChannel) {
      throw new Error("Channel not found!");
    }

    if (fetchedChannel.type !== ChannelType.GuildText) {
      throw new Error("Cannot delete messages in this channel!");
    }

    const deletedMessages = await fetchedChannel.bulkDelete(1);
    console.log(
      `Deleted ${deletedMessages.size} messages in [${fetchedChannel.name}]`
    );
  }
};

export default clean;
