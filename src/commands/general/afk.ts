import { db } from "@/config/db"
import logger from "@/util/logger"
import type { Command } from "@/util/type"
import { SlashCommandBuilder } from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder().setName("afk").setDescription("Toggle your AFK status."),
  execute: async (interaction, client) => {
    const { guildId, user } = interaction

    try {
      const data = await db.afk.findFirst({
        where: { userId: user.id, guildId: guildId as string },
      })

      if (!data) {
        await db.afk.create({
          data: { userId: user.id, guildId: guildId as string, afk: true },
        })
        await interaction.reply({
          content: "You are now set as **AFK**. If you need assistance, someone will be notified when you return.",
          ephemeral: true,
        })
      } else {
        const newAfkStatus = !data.afk
        await db.afk.update({
          where: { id: data.id },
          data: { afk: newAfkStatus },
        })

        const replyMessage = newAfkStatus
          ? "You are now set as **AFK**. If you need assistance, someone will be notified when you return."
          : "You are no longer marked as AFK."

        await interaction.reply({ content: replyMessage, ephemeral: true })
      }
    } catch (error) {
      logger.error(
        `An error occurred while processing the AFK status: ${error instanceof Error ? error.message : error}`
      )
      await interaction.reply({ content: "An unexpected error occurred. Please try again later.", ephemeral: true })
    }
  },
}
