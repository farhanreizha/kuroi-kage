import logger from "@/util/logger"
import { REST, Routes } from "discord.js"

export default async function uploadCommands(commands: any): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(Bun.env.token as string)
  const guildId = Bun.env.guild_id as string

  try {
    const currentUser = (await rest.get(Routes.user())) as { id: string }
    const endpoint =
      process.env.NODE_ENV === "production"
        ? Routes.applicationCommands(currentUser.id)
        : Routes.applicationGuildCommands(currentUser.id, guildId)
    const response =
      process.env.NODE_ENV === "production"
        ? "Successfully registered commands in production"
        : "Successfully registered commands for development"
    await rest.put(endpoint, { body: commands })
    logger.info(response)
  } catch (error) {
    logger.error(`Failed to register commands: ${error instanceof Error ? error.message : error}`)
  }
}
