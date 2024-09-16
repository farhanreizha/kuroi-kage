import { db } from "@/config/db"
import logger from "@/util/logger"
import type { Event } from "@/util/type"
import { EmbedBuilder, Events, TextChannel } from "discord.js"

export const event: Event = {
  name: Events.MessageCreate,
  execute: async (_, { message }) => {
    if (!message || !message.guild || message.author.bot) return

    const channel = message.channel as TextChannel

    // Anti swearing system
    let words = ["anjing", "bangsat"]
    let foundInText = false

    for (let i in words) {
      if (message.content.toLowerCase().includes(words[i].toLowerCase())) foundInText = true
    }

    if (foundInText) {
      await message.delete()
      await channel.send({ content: "Please do not use bad words in this server." })
    }

    //xp system
    const randomAmountOfXp = Math.floor(Math.random() * 29) + 1 // Min 1, Max 30
    let user = await db.level.findFirst({
      where: { userId: message.author.id, guildId: message.guild.id },
    })

    if (!user) {
      user = await db.level.create({
        data: {
          userId: message.author.id,
          guildId: message.guild.id,
          xp: randomAmountOfXp,
          level: 1,
        },
      })
    } else {
      user = await db.level.update({
        where: { id: user.id },
        data: {
          xp: user.xp + randomAmountOfXp,
        },
      })
    }

    const expLevelUp = 100
    const levelUp = user!.xp >= expLevelUp

    if (levelUp) {
      user = await db.level.update({
        where: { id: user.id },
        data: {
          level: user.level + 1,
          xp: user.xp - expLevelUp,
        },
      })
      const levelEmbed = new EmbedBuilder()
        .setTitle("New Level!")
        .setDescription(`**GG** <@${message.author}>, you just leveled up to level **${user.level}**!\n🥳`)
      const sendEmbed = await channel.send({ embeds: [levelEmbed] })
      sendEmbed.react("🥳")
    }

    // Anti link system
    if (
      message.content.includes("https://") ||
      message.content.includes("http://") ||
      message.content.includes("discord.gg")
    ) {
      message.delete()

      channel.send({ content: `${message.author}, don't attempt to send link :(` })
    }

    // AFK System
    try {
      const afkUser = await db.afk.findFirst({
        where: { userId: message.author.id, guildId: message.guild.id },
      })

      if (afkUser?.afk) {
        message.delete()
        message.author.send("You are currently AFK and cannot send messages in the server.")
      }

      const taggedMember = message.mentions.users.map(msg => msg.id)
      if (taggedMember.length > 0) {
        taggedMember.forEach(async member => {
          const data = await db.afk.findFirst({ where: { userId: member, guildId: message.guild?.id } })
          const user = message.mentions.users.find(user => user.id === member)
          if (message.mentions.users.has(data!.userId)) {
            await message.reply(`${user?.username} is currently AFK and cannot be tagged.`)
            return
          }
        })
      }
    } catch (error) {
      logger.error(`Failed to check AFK status: ${error instanceof Error ? error.message : error}`)
    }
  },
}
