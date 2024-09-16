import type { Command } from "@/util/type"
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replied pong!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (interaction, client) => {
    await interaction.reply({ content: "Pong!" })
  },
}
