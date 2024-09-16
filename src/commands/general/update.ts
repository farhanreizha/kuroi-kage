import type { Command } from "@/util/type";
import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteractionOptionResolver,
  ActivityType,
  type PresenceStatusData,
  EmbedBuilder,
} from "discord.js";

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Update the bot presences")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("activity")
        .setDescription("Update the bot's activity.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Pick an activity type.")
            .setRequired(true)
            .addChoices(
              { name: "Playing", value: "Playing" },
              { name: "Streaming", value: "Streaming" },
              { name: "Listening", value: "Listening" },
              { name: "Watching", value: "Watching" },
              { name: "Competing", value: "Competing" }
            )
        )
        .addStringOption((option) => option.setName("activity").setDescription("Enter the activity description.").setRequired(true))
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("status")
        .setDescription("Update the bot's status.")
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Pick a status.")
            .setRequired(true)
            .addChoices(
              { name: "Online", value: "online" },
              { name: "Idle", value: "idle" },
              { name: "Do not disturb", value: "dnd" },
              { name: "Invisible", value: "invisible" }
            )
        )
    ),
  execute: async (interaction, client) => {
    const options = interaction.options as CommandInteractionOptionResolver;

    if (!client.user) {
      interaction.reply({ content: "Bot user is unavailable.", ephemeral: true });
      return;
    }

    const sub = options.getSubcommand();
    const type = options.getString("type");
    const activity = options.getString("activity");

    try {
      switch (sub) {
        case "activity":
          if (activity && type) {
            const activityType = ActivityType[type as keyof typeof ActivityType];
            client.user.setActivity(activity, { type: activityType });
          }
          break;
        case "status":
          if (type) {
            client.user.setPresence({ status: type as PresenceStatusData });
          }
          break;
      }

      const embed = new EmbedBuilder().setDescription(`Successfully updated your ${sub} to **${type}**.`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error updating presence:", error);
      await interaction.reply({ content: "There was an error updating the bot's presence.", ephemeral: true });
    }
  },
};
