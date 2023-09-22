import clean from "$commands/clean/clean";
import client from "$lib/client";
import handler from "$lib/handlers";
import cron from "node-cron";

client.on("interactionCreate", handler);

// every 5 minutes
cron.schedule("*/5 * * * *", clean);
