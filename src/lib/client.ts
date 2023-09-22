import { Client, GatewayIntentBits } from "discord.js";
import raise from "./utils/raise";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(
  process.env.TOKEN ?? raise("TOKEN environment variable is required!")
);

export default client;
