import type { Event } from "@/util/type"
import { Events } from "discord.js"

export const event: Event = {
  name: Events.MessageCreate,
  execute: async (_, c) => {
    if (!c.message?.guild || c.message.author.bot) return

    // Anti swearing system
    let words = ["anjing", "bangsat"]
    let foundInText = false

    for (let i in words) {
      if (c.message.content.toLowerCase().includes(words[i].toLowerCase())) foundInText = true
    }

    if (foundInText) {
      await c.message.delete()
      if ("send" in c.message.channel) {
        await c.message.channel.send({ content: "Please do not use bad words in this server." })
      }
    }

    //xp system
    // const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
    // const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);

    // if (hasLeveledUp) {
    //   const user = await Levels.fetch(message.author.id, message.guild.id);

    //   const levelEmbed = new EmbedBuilder()
    //     .setTitle("New Level!")
    //     .setDescription(`**GG** ${message.author}, you just leveled up to level **${user.level + 1}**!\n🥳`);

    //   const sendEmbed = await message.channel.send({ embeds: [levelEmbed] });
    //   sendEmbed.react("🥳");
    // }

    // Anti link system
    // if (message.content.includes("https://") || message.content.includes("http://") || message.content.includes("discord.gg")) {
    //    message.delete()

    //    message.channel.send({ content: `${message.author}, don't attempt to send link :(` })
    // }

    // AFK System

    // AFK.findOne({ GuildID: message.guild.id, UserID: message.author.id }).then(async (data, error) => {
    //   if (data.Afk) {
    //     data.Afk = false;
    //     data.save();
    //   }
    //   return;
    // });

    // const taggedMember = message.mentions.users.map((msg) => msg.id);

    // if (taggedMember.length > 0) {
    //   taggedMember.forEach((m) => {
    //     AFK.findOne({ GuildID: message.guild.id, UserID: m }).then(async (data, error) => {
    //       if (data.Afk) {
    //         message.reply("This user is currently **AFK**.");
    //       }
    //       return;
    //     });
    //   });
    // }
  },
}
