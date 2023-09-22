import { Client, GatewayIntentBits } from "discord.js";
import interactionHandler from "./lib/handlers/interactionHandler";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", interactionHandler);

client.login(process.env.TOKEN);
