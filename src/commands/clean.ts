import client from "../lib/client";

const main = async () => {
  console.log("Started refreshing application (/) commands.");
  await client.guilds.fetch("1084199270254649444");
  client.guilds.cache.forEach(async (guild) => {
    console.log(guild.name);
  });
  client.fetchGuildPreview;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
