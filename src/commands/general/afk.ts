import type { Command } from "@/util/type"
import { SlashCommandBuilder } from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder().setName("afk").setDescription("Toggle for your afk status."),
  execute: async (interaction, client) => {
    const { guildId, user } = interaction
  },
}
