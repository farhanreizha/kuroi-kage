import logger from "@/util/logger"
import type { Command } from "@/util/type"
import {
  CommandInteractionOptionResolver,
  GuildMemberRoleManager,
  PermissionFlagsBits,
  SlashCommandBuilder,
  User,
} from "discord.js"

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("addrole")
    .setDescription("Add custom reaction role.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option => option.setName("role").setDescription("Role to be assigned.").setRequired(true))
    .addStringOption(option =>
      option.setName("description").setDescription("Description of the role.").setRequired(false)
    )
    .addStringOption(option => option.setName("emoji").setDescription("Emoji for the role.").setRequired(false)),
  execute: async (interaction, client) => {
    const { member, guild } = interaction
    const options = interaction.options as CommandInteractionOptionResolver

    const role = options.getRole("role")
    const description = options.getString("description")
    const emoji = options.getString("emoji")

    if (!role || !guild || !member) return

    const roles = member.roles as GuildMemberRoleManager
    const user = member.user as User

    try {
      if (role.position >= roles.highest.position)
        await interaction.reply({ content: "I don't have permissions for that.", ephemeral: true })

      // const data = await ReactionRole.findOne({ GuildID: guildId });

      // const newRole = {
      //   roleId: role.id,
      //   roleDescription: description || "No description",
      //   roleEmoji: emoji || "",
      // };

      // if (data) {
      //   let roleData = data.Roles.find((x) => x.roleId === role.id);
      //   if (roleData) {
      //     roleData = newRole;
      //   } else {
      //     data.Roles = [...data.Roles, newRole];
      //   }

      //   await data.save();
      // } else {
      //   await ReactionRole.create({
      //     GuildID: guildId,
      //     Roles: newRole,
      //   });
      // }

      await interaction.reply({ content: `Created new role **${role.name}**` })
    } catch (error) {
      logger.error(`An error occurred while creating a new role: ${error instanceof Error ? error.message : error}`)
      await interaction.reply({ content: "An unexpected error occurred. Please try again later.", ephemeral: true })
    }
  },
}
