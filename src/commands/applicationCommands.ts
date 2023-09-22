import { SlashCommandBuilder } from "discord.js";

const applicationCommands = [
  new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Clean up the messages. 1 to 100, default 10.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages to clean up")
        .setRequired(false)
        .setMaxValue(100)
        .setMinValue(1)
        .setAutocomplete(true)
    ),
];

export default applicationCommands;
