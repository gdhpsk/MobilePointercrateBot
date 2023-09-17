const { SlashCommandBuilder } = require("discord.js")
const { api_leaderboard, api_levels, api_flags } = require("../config.json")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("this is the leaderboard command.")
  .addStringOption((option) =>
            option
                .setName("profile")
                .setDescription("What profile do you want me to display?")
                .setRequired(false)),
    async execute(interaction, Discord, client) {
        let profile = interaction.options.getString("profile")
      await interaction.deferReply()
      let data = await fetch(api_leaderboard, {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
      let leaderboard = await data.json()
       let dataTwo = await fetch(api_levels, {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
      let levels = await dataTwo.json()
      if(!profile) {
        let array = []
        let page = 10
        let addition = 0
       let arr = []
         for(const key in leaderboard) {
           let point = require("../pointcalculator.js")(leaderboard[key], levels)
           arr.push({
             name: key,
             nationality: leaderboard[key].nationality,
             completions: leaderboard[key].completions,
             progresses: leaderboard[key].progresses,
             points: point
           })
         } 
        arr.sort((a, b) => b.points - a.points)
            if(!Number.isInteger(Object.keys(leaderboard).length/page)) {
          addition = 1
}
        for(let i = 0; i < Math.floor(Object.keys(leaderboard).length/page); i++)         {
          let txt = ""
          for(let j = i*page; j < (i+1)*page; j++) {
            let person = arr[j]
            if(person.nationality) {
        const country_codes = await fetch(api_flags, {
                        method: "get",
                        headers: { "Content-Type": "application/json" }
                    })
              let countries = await country_codes.json()
               let index = countries.findIndex(e => e.name.toUpperCase() == arr[j].nationality.replace(/_/g, " ").toUpperCase())
              txt += `${countries[index].emoji} `
            }
           let point = require("../pointcalculator.js")(person, levels)
            txt += `${j+1}. ${arr[j].name} (${point} points)\n\n`
          }
          array.push(new Discord.EmbedBuilder().setTitle("HRR Mobile List Leaderboard").setDescription(txt).setFooter({text: `Page ${i+1} / ${Math.floor(Object.keys(leaderboard).length/page)+addition}`}))
        }
        if(addition == 1) {
           let txt = ""
          for(let j = Math.floor(Object.keys(leaderboard).length/page)*page; j < Object.keys(leaderboard).length; j++) {
            let person = arr[j]
            if(person.nationality) {
        const country_codes = await fetch(api_flags, {
                        method: "get",
                        headers: { "Content-Type": "application/json" }
                    })
              let countries = await country_codes.json()
               let index = countries.findIndex(e => e.name.toUpperCase() == arr[j].nationality.replace(/_/g, " ").toUpperCase())
              txt += `${countries[index].emoji} `
            }
           let point = require("../pointcalculator.js")(person, levels)
            txt += `${j+1}. ${arr[j].name} (${point} points)\n\n`
          }
          array.push(new Discord.EmbedBuilder().setTitle("HRR Mobile List Leaderboard").setDescription(txt).setFooter({text: `Page ${Math.floor(Object.keys(leaderboard).length/page)+addition} / ${Math.floor(Object.keys(leaderboard).length/page)+addition}`}))
        }
        let bu = new Discord.ActionRowBuilder()
        let emoji = ["Back", "Next", "Skip Forward", "Skip Back"]
            for(let i = 0; i < 4; i++) {
                bu.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(i.toString())
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel(emoji[i])
                )
            }
            let whyudo = 0
       let smt = await interaction.editReply({embeds: [array[0]], components: [bu]})
        client.on("interactionCreate", async(buttonclick) => {
                if(!buttonclick.isButton()) return;
                if(smt.id != buttonclick.message.id) return
                switch (buttonclick.customId) {
                    case "0":
                        whyudo = whyudo > 0 ? --whyudo : array.length - 1;
                        await buttonclick.update({embeds: [array[whyudo]], components: [bu]})
                        break;
                    case "1":
                        whyudo = whyudo + 1 < array.length ? ++whyudo : 0;
                        await buttonclick.update({embeds: [array[whyudo]], components: [bu]})
                        break; 
                    case "2":
                        whyudo = array.length-1
                        await buttonclick.update({embeds: [array[whyudo]], components: [bu]})
                        break;
                     case "3":
                        whyudo = 0
                        await buttonclick.update({embeds: [array[whyudo]], components: [bu]})
                        break;
                }
            })
        return
      }
      if(!leaderboard[profile] && profile != "me") return interaction.editReply("That is not a valid user!")
      if(profile == "me") {
        for(const key in leaderboard) {
          if(leaderboard[key].socials?.[0].discord?.[0] == interaction.user.tag) {
            profile = key
            break;
          } else {
            if(Object.keys(leaderboard).length-1 != Object.keys(leaderboard).indexOf(key)) {
              continue
            } else {
              await interaction.editReply("Your discord tag is not linked to any leaderboard profile!")
              return
            }
          }
        }
      }
      var arrayOfPoints = 200
      let arr = []
      for(const key in leaderboard) {
        let levelPos = Object.keys(levels)
       let person = leaderboard[key]
        
      let point = 0
    if(person.completions[0] != "none") {
    for(let i = 0; i < person.completions.length; i++) {
      let k = levelPos.findIndex(e => e == person.completions[i].name)
      if(Math.round(100*(arrayOfPoints-(1.95*k)))/100 < 6.95) {
        point += 0
      } else {
      point += Math.round(100*(arrayOfPoints-(1.95*k)))/100
}
      if(person.completions[i].remove && Math.round(100*(arrayOfPoints-(1.95*k)))/100 >= 4.8) {
        point -= Math.round(100*(arrayOfPoints-(1.95*k)))/100
      }
    }
      
    }
    if(person.progresses[0] != "none") {
    for(let i = 0; i < person.progresses.length; i++) {
      let k = levelPos.findIndex(e => e == person.progresses[i].name)
      point += Math.round(100*(arrayOfPoints-(1.95*k))/3)/100
      if(Math.round(100*(arrayOfPoints-(1.95*k))/3)/100 >= 34.82 && person.progresses[i].remove) {
        point -= Math.round(100*(arrayOfPoints-(1.95*k))/3)/100
      }
}
    }
        let thing = {
          name: key,
          points: Math.round(1000*point)/1000
        }
        arr.push(thing)
      }
      arr.sort((a, b) => b.points - a.points)
      let txt = ""
      if(leaderboard[profile].nationality) {
        var jk = [""]
        const country_codes = await fetch(api_flags, {
                        method: "get",
                        headers: { "Content-Type": "application/json" }
                    })
                    const countries = await country_codes.json()
        let index = countries.findIndex(e => e.name.toUpperCase() == leaderboard[profile].nationality.replace(/_/g, " ").toUpperCase())
                            if (index != -1) {
                                jk[0] = ` ${countries[index].emoji}`
                            }
        txt += `**NATIONALITY**: ${leaderboard[profile].nationality.replace(/_/g, " ")}${jk[0]}\n\n`
      }
      let txt2 = "**COMPLETIONS**\n\n"
      let txt3 = "\n**LEGACY LIST COMPLETIONS**\n\n"
      let legacycount = 0
      let regularcount = 0
      if(leaderboard[profile].completions[0] != "none") {
        for(let i = 0; i < leaderboard[profile].completions.length; i++) {
          let completion = leaderboard[profile].completions[i]
          let placement = Object.keys(levels).indexOf(completion.name)+1
          if(placement < 101) {
            regularcount += 1
            txt2 += `${regularcount}. ${completion.name} 100% (#${placement}, ${completion.hertz}hz)\n`
          } else {
            legacycount += 1
            txt3 += `${legacycount}. ${completion.name} 100% (#${placement}, ${completion.hertz}hz)\n`
          }
        }
        if(txt2 == "**COMPLETIONS**\n\n") {
          txt2 += "none\n"
        }
        if(txt3 == "\n**LEGACY LIST COMPLETIONS**\n\n") {
          txt3 += "none\n"
        }
      } else {
        txt2 += "none\n"
        txt3 += "none\n"
      }
      
      txt += `${txt2}${txt3}\n**PROGRESSES**\n\n`
      
      if(leaderboard[profile].progresses[0] != "none") {
        for(let i = 0; i < leaderboard[profile].progresses.length; i++) {
          let completion = leaderboard[profile].progresses[i]
          let placement = Object.keys(levels).indexOf(completion.name)+1
          if(placement < 101) {
            txt += `${i+1}. ${completion.name} ${completion.percent}% (#${placement}, ${completion.hertz}hz)\n`
          }
        }
      } else {
        txt += "none\n"
      }
      txt += "\n**SOCIALS**\n\n"
      if(leaderboard[profile].socials) {
        let socials = leaderboard[profile].socials[0]
        if(socials.discord?.[0]) {
          txt += `Discord Tag: ${socials.discord[0]}\n`
        }
        if(socials.discord?.[1]) {
          txt += `Discord Server: [Server](${socials.discord[1]})\n`
        }
        if(socials.twitch) {
          txt += `Twitch Channel: [Channel](${socials.twitch})\n`
        }
        if(socials.youtube) {
          txt += `Youtube Channel: [Channel](${socials.youtube})\n`
        }
        if(socials.twitter) {
          txt += `Twitter Link: [Link](${socials.twitter})\n`
        }
      } else {
        txt += "none"
      }
      let embed = new Discord.EmbedBuilder()
      .setTitle(`#${arr.findIndex(e => e.name == profile)+1} -  ${profile}'s profile (${arr[arr.findIndex(e => e.name == profile)].points} points)`)
      .setDescription(txt)

      
      await interaction.editReply({embeds: [embed]})
    }
}