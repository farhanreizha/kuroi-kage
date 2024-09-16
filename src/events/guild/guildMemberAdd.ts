import { db } from "@/config/db"
import type { Event } from "@/util/type"
import { EmbedBuilder, Events, TextChannel } from "discord.js"

export const event: Event = {
  name: Events.GuildMemberAdd,
  async execute(_, { member }) {
    if (!member || !member.guild) return
    const data = await db.welcome.findFirst({ where: { guildId: member.guild.id } })
    if (!data) return

    const channelId = data.channelId
    const message = data.message || " "
    const roleId = data.roleId as string

    const welcomeChannel = member.guild.channels.cache.get(channelId) as TextChannel

    const welcomeEmbed = new EmbedBuilder()
      .setTitle(`**${member.user.username}**`)
      .setDescription(`${message} <@${member.id}>`)
      .setColor(0x037821)
      .setThumbnail(member.user.avatarURL() as string)
      .addFields({ name: "Total member", value: `${member.guild.memberCount}` })
      .setTimestamp()

    await welcomeChannel.send({ embeds: [welcomeEmbed] })
    await member.roles.add(roleId)
  },
}
