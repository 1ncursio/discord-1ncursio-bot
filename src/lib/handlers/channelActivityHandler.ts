import { Commands, SubCommands } from "$commands/applicationCommands";
import Channel from "$lib/models/Channel";
import ChannelCommandPair from "$lib/models/ChannelCommandPair";
import Command from "$lib/models/Command";
import raise from "$lib/utils/raise";
import { ChannelType, ChatInputCommandInteraction } from "discord.js";
import { match } from "ts-pattern";

const channelActivityHandler =
  (interaction: ChatInputCommandInteraction) => async () => {
    const command = await Command.get({ name: Commands.ChannelActivity });

    if (!command) {
      await interaction.reply("Unknown command!");
      return;
    }

    const { channel } = interaction;
    if (channel?.type !== ChannelType.GuildText) {
      await interaction.reply("Cannot set channel activity in this channel!");
      return;
    }

    const targetChannel = interaction.options.getChannel("channel");
    const subcommand = interaction.options.getSubcommand();

    const isVoiceChannel = targetChannel?.type === ChannelType.GuildVoice;

    if (!isVoiceChannel) {
      await interaction.reply("Cannot set channel activity in this channel!");
      return;
    }

    match(subcommand)
      .with(SubCommands.Set, async () => {
        await Channel.upsert({
          id: targetChannel.id,
          guild_id: channel.guildId,
          name: targetChannel.name ?? raise("Channel name is null!"),
        });

        await ChannelCommandPair.upsert({
          channel_id: targetChannel.id,
          command_id: command.id,
        });

        await interaction.reply(
          `Set channel activity for ${targetChannel.name} channel! 🎉`
        );
      })
      .with(SubCommands.Remove, async () => {
        // check if channel command pair exists
        const channelCommandPair = await ChannelCommandPair.get({
          channel_id: targetChannel.id,
          command_id: command.id,
        });

        if (!channelCommandPair) {
          await interaction.reply(
            `Channel activity for ${targetChannel.name} channel does not exist!`
          );
          return;
        }

        await ChannelCommandPair.delete({
          channel_id: targetChannel.id,
          command_id: command.id,
        });

        await interaction.reply(
          `Removed channel activity for ${targetChannel.name} channel! 🎉`
        );
      })
      .otherwise(async () => await interaction.reply("Unknown subcommand!"));
  };

export default channelActivityHandler;
