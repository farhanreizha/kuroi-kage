import type { Command } from "@/util/type"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteractionOptionResolver,
  EmbedBuilder,
  NewsChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("createverify")
    .setDescription("Set your verification channel")
    .addChannelOption(option =>
      option.setName("channel").setDescription("Send verification embed in this channel").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const options = interaction.options as CommandInteractionOptionResolver
    const channel = options.getChannel("channel")

    if (!(channel instanceof TextChannel || channel instanceof NewsChannel)) {
      await interaction.reply({ content: "Please select a valid text or news channel.", ephemeral: true })
      return
    }
    const verifyEmbed = new EmbedBuilder()
      .setTitle("Verification")
      .setDescription("Click the button to verify your account and get access to the channels.")
      .setColor(0x5fb041)

    try {
      await channel?.send({
        embeds: [verifyEmbed],
        components: [
          new ActionRowBuilder<ButtonBuilder>().setComponents(
            new ButtonBuilder().setCustomId("verify").setLabel("Verify").setStyle(ButtonStyle.Success)
          ),
        ],
      })

      await interaction.reply({ content: "There was an error! Try again letter.", ephemeral: true })
    } catch (error) {
      await interaction.reply({ content: "Verification channel was Successfully set!", ephemeral: true })
    }
  },
}
