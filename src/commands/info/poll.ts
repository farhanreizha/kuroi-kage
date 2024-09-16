import logger from "@/util/logger"
import type { Command } from "@/util/type"
import {
  ChannelType,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll and send it to a certain channel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(option => option.setName("description").setDescription("Describe the poll.").setRequired(true))
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Where do you want to send the poll to?")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),
  execute: async (interaction, client) => {
    const options = interaction.options as CommandInteractionOptionResolver

    const description = options.getString("description", true)
    const channel = options.getChannel("channel") as TextChannel

    const embed = new EmbedBuilder().setColor("Gold").setDescription(description).setTimestamp()

    try {
      const m = await channel.send({ embeds: [embed] })
      await m.react("✅")
      await m.react("❌")
      await interaction.reply({ content: "Poll was successfully sent to the channel.", ephemeral: true })
    } catch (error) {
      logger.error(`An error occurred: ${error instanceof Error ? error.message : error}`)
      await interaction.reply({ content: "An unexpected error occurred. Please try again later.", ephemeral: true })
    }
  },
}
