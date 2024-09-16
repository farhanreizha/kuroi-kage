import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";
import { createRequire } from "node:module";
import type { CustomClient } from "./util/type";
import Handlers from "./handler";

const require = createRequire(import.meta.url);

const client = new Client({
  intents: Object.values(GatewayIntentBits) as GatewayIntentBits[],
  partials: Object.values(Partials) as Partials[],
}) as CustomClient;

client.commands = new Collection<string, any>();
client.config = require("../config.json");

const handler = new Handlers(client);

await handler.init();

client.login(Bun.env.token);
