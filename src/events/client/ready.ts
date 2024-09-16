import type { Event } from "@/util/type"
import { Events } from "discord.js"
import logger from "../../util/logger"

export const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute: (client, _) => {
    try {
      logger.info(`${client.user?.tag} is online!`)
    } catch (error) {
      logger.error(`Failed to log bot status: ${error}`)
    }
  },
}
