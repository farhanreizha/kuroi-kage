import type { Command } from "@/util/type"

import {
  ActionRowBuilder,
  ComponentType,
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get a list of all the commands from the discord bot."),
  async execute(interaction, client): Promise<void> {
    const emojis: { [key: string]: string } = {
      info: "📄",
      moderation: "🛠",
      general: "⚙",
      ticket: "🎟",
    }

    const directories: string[] = [...new Set(client.commands.map(command => command.folder))]

    const formatString = (str: string): string => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`

    const categories: { directory: string; command: { name: string; description: string }[] }[] = directories.map(
      (directory: string) => {
        const getCommands = client.commands
          .filter(command => command.folder === directory)
          .map(command => ({
            name: command.data.name,
            description: command.data.description || "There is no description for this command.",
          }))

        return {
          directory: formatString(directory),
          command: getCommands,
        }
      }
    )

    const embed: EmbedBuilder = new EmbedBuilder().setDescription("Please choose a category in the dropdown menu")

    const components = (state: boolean) => [
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category")
          .setDisabled(state)
          .setOptions(
            categories.map(category => ({
              label: category.directory,
              value: category.directory.toLowerCase(),
              description: `Commands from ${category.directory} category.`,
              emoji: emojis[category.directory.toLowerCase()] || undefined,
            }))
          )
      ),
    ]

    const initialMessage = await interaction.reply({
      embeds: [embed],
      components: components(false),
      fetchReply: true,
    })

    const filter = (i: StringSelectMenuInteraction) => i.user.id === interaction.user.id

    const collector = initialMessage.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 60000, // Collector time (60 seconds)
    })

    collector?.on("collect", async i => {
      const [directory] = i.values
      const category = categories.find(x => x.directory.toLowerCase() === directory)
      const categoryEmbed: EmbedBuilder = new EmbedBuilder()
        .setTitle(`${formatString(directory)} commands`)
        .setDescription(`A list of all the commands categorized under ${directory}`)
        .addFields(
          category?.command.map(command => ({
            name: `\`${command.name}\``,
            value: command.description,
            inline: true,
          })) || []
        )
      await i.update({ embeds: [categoryEmbed] })
    })

    collector?.on("end", () => {
      initialMessage.edit({ components: components(true) })
    })
  },
}
