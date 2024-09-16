import logger from "@/util/logger"
import type { Command } from "@/util/type"
import { ChannelType, CommandInteractionOptionResolver, PermissionFlagsBits, SlashCommandBuilder } from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear messages from a channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption(option =>
      option.setName("amount").setDescription("The number of messages to clear.").setRequired(false)
    ),
  async execute(interaction, client) {
    const options = interaction.options as CommandInteractionOptionResolver

    const amount = options.getInteger("amount") as number

    const channel = interaction.channel
    if (!channel || channel.type !== ChannelType.GuildText) {
      await interaction.reply({ content: "This command can only be used in a text channel.", ephemeral: true })
      return
    }

    let messageToDelete = amount ? amount : 100

    try {
      const fetchMessage = await channel.messages.fetch({ limit: messageToDelete })
      await channel.bulkDelete(fetchMessage)
      await interaction.reply({ content: "Messages have been removed from the channel.", ephemeral: true })
    } catch (error) {
      logger.error(`Failed to delete messages: ${error instanceof Error ? error.message : error}`)
    }
  },
}
