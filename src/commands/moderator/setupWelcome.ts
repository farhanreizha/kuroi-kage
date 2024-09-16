import { db } from "@/config/db";
import type { Command } from "@/util/type";
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, CommandInteractionOptionResolver, Role, TextChannel } from "discord.js";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("setupwelcome")
    .setDescription("Setup your welcome message for the discord bot.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Channel for welcome messages.").setRequired(true).addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) => option.setName("welcome-message").setDescription("Enter your welcome message.").setRequired(true))
    .addRoleOption((option) => option.setName("welcome-role").setDescription("Enter your welcome role.").setRequired(false)),
  execute: async (interaction, client) => {
    const options = interaction.options as CommandInteractionOptionResolver;

    if (!interaction.guild || !interaction.guild.members.me) return;

    const welcomeChannel = options.getChannel("channel") as TextChannel;
    const welcomeMessage = options.getString("welcome-message") as string;
    const role = options.getRole("welcome-role") as Role | null;

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
      interaction.reply({ content: "I don't have permissions for this.", ephemeral: true });
    }

    const data = await db.welcome.findFirst({ where: { guildId: interaction.guild.id } });

    if (!data) {
      await db.welcome.create({
        data: {
          guildId: interaction.guild.id,
          channelId: welcomeChannel.id,
          message: welcomeMessage,
          roleId: role?.id,
        },
      });
      interaction.reply({ content: "Welcome message setup successfully.", ephemeral: true });
    } else {
      interaction.reply({ content: "Welcome message has been setup.", ephemeral: true });
    }
  },
};
