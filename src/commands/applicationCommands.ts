import { SlashCommandBuilder } from "discord.js";

const applicationCommands = [
  new SlashCommandBuilder()
    .setName("clean")
    .setNameLocalizations({
      ko: "청소",
    })
    .setDescription("Clean up the messages. 1 to 100, default 10.")
    .setDescriptionLocalizations({
      ko: "메시지를 청소합니다. 1에서 100까지, 기본값은 10입니다.",
    })
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setNameLocalizations({
          ko: "개수",
        })
        .setDescription("The amount of messages to clean up")
        .setDescriptionLocalizations({
          ko: "청소할 메시지의 개수",
        })
        .setRequired(false)
        .setMaxValue(100)
        .setMinValue(1)
        .setAutocomplete(true)
    ),
];

export default applicationCommands;
