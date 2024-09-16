import type { Event } from "@/util/type";
import logger from "../../util/logger";
import { Events } from "discord.js";

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute: (client, _) => {
    try {
      logger.info(`${client.user?.tag} is online!`);
    } catch (error) {
      logger.error(`Failed to log bot status: ${error}`);
    }
  },
};
