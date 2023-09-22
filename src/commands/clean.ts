import { ChannelType } from "discord.js";
import client from "../lib/client";

const main = async () => {
  if (!process.env.GUILD_ID) {
    throw new Error("GUILD_ID environment variable is required!");
  }

  if (!process.env.CHANNEL_ID) {
    throw new Error("CHANNEL_ID environment variable is required!");
  }

  await client.guilds.fetch(process.env.GUILD_ID /* :TODO fetch from db */);
  const channel = await client.channels.fetch(
    process.env.CHANNEL_ID /* :TODO fetch from db */
  );

  if (!channel) {
    console.log("Channel not found!");
    return;
  }

  if (channel.type !== ChannelType.GuildText) {
    console.log("Cannot delete messages in this channel!");
    return;
  }

  console.log(channel.id, channel?.name);

  const deletedMessages = await channel.bulkDelete(1);
  console.log(`Deleted ${deletedMessages.size} messages!`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
