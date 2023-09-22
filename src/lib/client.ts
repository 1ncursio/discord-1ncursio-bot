import { Client, GatewayIntentBits } from "discord.js";

if (!process.env.TOKEN) {
  throw new Error("TOKEN environment variable is required!");
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);

export default client;
