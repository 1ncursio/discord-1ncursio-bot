import cron from "node-cron";
import clean from "./commands/clean/clean";
import client from "./lib/client";
import interactionHandler from "./lib/handlers/interactionHandler";

client.on("interactionCreate", interactionHandler);

// every 5 minutes
cron.schedule("*/5 * * * *", clean);
