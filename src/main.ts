import client from "./lib/client";
import interactionHandler from "./lib/handlers/interactionHandler";

client.on("interactionCreate", interactionHandler);
