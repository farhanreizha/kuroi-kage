import type { Event } from "@/util/type";
import { Events, GuildMemberRoleManager, PermissionFlagsBits, PermissionsBitField, Role } from "discord.js";

export const event: Event = {
  name: Events.InteractionCreate,
  execute: async (client, c) => {
    const { interaction } = c;

    if (!interaction || !interaction.guild || !interaction.member) return;

    const memberRoles = interaction.member.roles as GuildMemberRoleManager;
    const memberPermissions = interaction.member.permissions as PermissionsBitField;

    // Handle Chat Input Command
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply({ content: "Outdated command", ephemeral: true });
        return;
      }

      // Handle Autocomplete
      if (interaction.isAutocomplete() && command.autocomplete) {
        await command.autocomplete(interaction, client);
      }

      await command.execute(interaction, client);

      // Verify command logic
      if (interaction.commandName === "verify") {
        const role = interaction.guild.roles.cache.get(client.config.roles.verificationId) as Role;
        await memberRoles.add(role);
        await interaction.reply({ content: `${role.name} has been assigned to you.`, ephemeral: true });
      }
    }

    // Handle String Select Menu Interaction
    if (interaction.isStringSelectMenu() && interaction.customId === "reaction-role") {
      await Promise.all(
        interaction.values.map(async (roleId) => {
          const hasRole = memberRoles.cache.has(roleId);
          hasRole ? await memberRoles.remove(roleId) : await memberRoles.add(roleId);
        })
      );
      await interaction.reply({ content: "Roles updated.", ephemeral: true });
    }

    // Handle Button Interaction
    if (interaction.isButton()) {
      if (["suggest-accept", "suggest-decline"].includes(interaction.customId)) {
        if (!memberPermissions.has(PermissionFlagsBits.Administrator)) {
          await interaction.reply({ content: "You don't have permissions for that.", ephemeral: true });
        }
      }
    }
  },
};
