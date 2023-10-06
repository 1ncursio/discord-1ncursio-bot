import { ChannelType, SlashCommandBuilder } from "discord.js";

export enum Commands {
  Cleaner = "cleaner",
  AutoCleaner = "autocleaner",
  ChannelActivity = "channelactivity",
  Ping = "ping",
  Add = "add",
}

export enum SubCommands {
  Set = "set",
  Remove = "remove",
}

const applicationCommands = [
  new SlashCommandBuilder()
    .setName(Commands.Ping)
    .setDescription("Send a ping message")
    .setDescriptionLocalizations({
      ko: "핑 메시지를 보냅니다.",
    }),
  new SlashCommandBuilder()
    .setName(Commands.Cleaner)
    .setDescription("Clean up the messages. 1 to 100, default 10.")
    .setDescriptionLocalizations({
      ko: "메시지를 청소합니다. 1에서 100까지, 기본값은 10입니다.",
    })
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clean up")
        .setDescriptionLocalizations({
          ko: "청소할 메시지의 개수",
        })
        .setRequired(false)
        .setMaxValue(100)
        .setMinValue(1)
        .setAutocomplete(true)
    ),
  new SlashCommandBuilder()
    .setName(Commands.AutoCleaner)
    .setDescription("Set the text channel to automatically clean up.")
    .addSubcommand((subcommand) => {
      return subcommand
        .setName(SubCommands.Set)
        .setDescription("Set the text channel to automatically clean up.")
        .setDescriptionLocalizations({
          ko: "자동으로 청소할 텍스트 채널을 설정합니다.",
        })
        .addChannelOption((option) => {
          return option
            .setName("channel")
            .setDescription("The text channel to automatically clean up.")
            .setDescriptionLocalizations({
              ko: "자동으로 청소할 텍스트 채널",
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true);
        });
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName(SubCommands.Remove)
        .setDescription(
          "Remove the text channel from automatically cleaning up."
        )
        .setDescriptionLocalizations({
          ko: "자동 청소 중인 텍스트 채널을 제거합니다.",
        })
        .addChannelOption((option) => {
          return option
            .setName("channel")
            .setDescription(
              "The text channel to remove from automatically cleaning up."
            )
            .setDescriptionLocalizations({
              ko: "자동 청소 중인 텍스트 채널",
            })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true);
        });
    }),
  new SlashCommandBuilder()
    .setName(Commands.ChannelActivity)
    .setDescription("Set the voice channel to record.")
    .addSubcommand((subcommand) => {
      return subcommand
        .setName(SubCommands.Set)
        .setDescription("Set the voice channel to record.")
        .setDescriptionLocalizations({
          ko: "기록할 음성 채널을 설정합니다.",
        })
        .addChannelOption((option) => {
          return option
            .setName("channel")
            .setDescription("The voice channel to record")
            .setDescriptionLocalizations({
              ko: "기록할 음성 채널",
            })
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true);
        });
    })
    .addSubcommand((subcommand) => {
      return subcommand
        .setName(SubCommands.Remove)
        .setDescription("Remove the voice channel from recording.")
        .setDescriptionLocalizations({
          ko: "기록 중인 음성 채널을 제거합니다.",
        })
        .addChannelOption((option) => {
          return option
            .setName("channel")
            .setDescription("The voice channel to record")
            .setDescriptionLocalizations({
              ko: "기록할 음성 채널",
            })
            .addChannelTypes(ChannelType.GuildVoice)
            .setRequired(true);
        });
    }),
  new SlashCommandBuilder()
    .setName(Commands.Add)
    .setDescription("Add a subcommand")
    .addSubcommand((subcommand) => {
      return subcommand.setName("test").setDescription("test description");
    })
    .addSubcommand((subcommand) => {
      return subcommand.setName("test2").setDescription("test description22");
    }),
];

export default applicationCommands;
