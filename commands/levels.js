const { SlashCommandBuilder } = require("discord.js")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { api_levels, api_additions, api_flags } = require("../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("This is the levels command.")
        .addStringOption((option) =>
            option
                .setName("level")
                .setDescription("What level do you want me to display?")
                .setRequired(false)),
    async execute(interaction, Discord, client) {
      let points = 200
        let level = interaction.options.getString("level")
        await interaction.deferReply()
        if (level) {
            let data = await fetch(api_levels, {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
            let levels = await data.json()
            if (!levels[level] && level != "generate") return interaction.editReply("Please input a valid level!")
          if(level == "generate") {
            level = Object.keys(levels)[Math.floor(Math.random() * Object.keys(levels).length-1)]
          }
            let txt = "**COMPLETIONS**\n\n"
            if (levels[level].list.filter(e => !e.remove).length == 0) {
                txt += "Since this level has been added, the victors have been deleted."
            } else {
                let thing = levels[level].list.filter(e => !e.remove)
                const country_codes = await fetch(api_flags, {
                    method: "get",
                    headers: { "Content-Type": "application/json" }
                })
                const countries = await country_codes.json()
                const extras = await fetch(api_additions, {
                    method: "get",
                    headers: { "Content-Type": "application/json" }
                })
                const additions = await extras.json()
                for (let i = 0; i < thing.length; i++) {
                    let list = thing[i]
                    var arr = [""]
                    if (additions[list.name]?.nationality) {
                        let index = countries.findIndex(e => e.name.toUpperCase() == additions[list.name].nationality.replace(/_/g, " ").toUpperCase())
                        if (index != -1) {
                            arr[0] = ` :flag_${countries[index].code.toLowerCase()}:`
                        }
                    }
                    txt += `-${arr[0]} ${list.name} [beat ${levels[level].name} on ${list.hertz}hz](${list.link}), with ${list.milliseconds}ms delay.\n\n`
                }
            }
          if(Object.keys(levels).indexOf(level) < 25 && levels[level].listpercentage) {
             txt += `**PROGRESSES (${levels[level].listpercentage}%)**\n\n`
          }
            if (levels[level].progresses && Object.keys(levels).indexOf(level) < 25) {
                if (levels[level].progresses.filter(e => !e.remove).length > 0) {
                    let thing = levels[level].progresses.filter(e => !e.remove)

                    const country_codes = await fetch(api_flags, {
                        method: "get",
                        headers: { "Content-Type": "application/json" }
                    })
                    const countries = await country_codes.json()
                    const extras = await fetch(api_additions, {
                        method: "get",
                        headers: { "Content-Type": "application/json" }
                    })
                    const additions = await extras.json()
                    for (let i = 0; i < thing.length; i++) {
                        let list = thing[i]
                        var arr = [""]
                        if (additions[list.name]?.nationality) {
                            let index = countries.findIndex(e => e.name.toUpperCase() == additions[list.name].nationality.replace(/_/g, " ").toUpperCase())
                            if (index != -1) {
                                arr[0] = ` ${countries[index].emoji}`
                            }
                        }
                        txt += `-${arr[0]} ${list.name} [got ${list.percent}% on  ${levels[level].name} on ${list.hertz}hz](${list.link}), with ${list.milliseconds}ms delay.\n\n`
                    }
                }
            }
          if(Object.keys(levels).indexOf(level) < 25 && levels[level].listpercentage && !levels[level].progresses) {
            txt += "none"
          }
          
let counter = Object.keys(levels).indexOf(level)+1
            let embed = new Discord.MessageEmbed()
                .setTitle(`#${Object.keys(levels).indexOf(level) + 1} - ${levels[level].name} by ${levels[level].host} and verified by ${levels[level].verifier}`)
                .setURL(`https://www.youtube.com/watch?v=${levels[level].ytcode}`)
                .setDescription(txt)
                .setImage(`https://i.ytimg.com/vi/${levels[level].ytcode}/mqdefault.jpg`)
      if(levels[level].listpercentage && Object.keys(levels).indexOf(level) < 25) {
        embed.setFooter({text: `Points given(completion): ${counter < 101 ? Math.round(100*(points-(1.95*(counter-1))))/100: "0"}\nPoints given(progress): ${Math.round(100*(points-(1.95*(counter-1)))/3)/100}`})
      } else {
        embed.setFooter({text: `Points given(completion): ${counter < 101 ?Math.round(100*(points-(1.95*(counter-1))))/100: "0"}`})
      }
            await interaction.editReply({ embeds: [embed] })
        } else {
            let data = await fetch(api_levels, {
                method: "get",
                headers: { "Content-Type": "application/json" }
            })
            let levels = await data.json()
          let page = 10
          let addition = 0
          if(!Number.isInteger(Object.keys(levels).length/page)) {
            addition = 1
          }
          let amount = Math.floor(Object.keys(levels).length/page)
          let array = []
          for(let i = 0; i < amount; i++) {
            let txt = ""
            for(let j = i*page; j < (i+1)*page; j++) {
              let level = Object.keys(levels)[j]
              txt += `${j+1}. ${level} by ${Object.values(levels)[j].host} and verified by ${Object.values(levels)[j].verifier}\n\n`
            }
            array.push(new Discord.MessageEmbed().setTitle("HRR Mobile List Levels").setDescription(txt).setFooter({text: `Page ${i+1} / ${amount+addition}`}))
          }
          if(addition == 1) {
            for(let i = amount; i < amount+1; i++) {
            let txt = ""
            for(let j = amount*page; j < Object.keys(levels).length; j++) {
              let level = Object.keys(levels)[j]
              txt += `${j+1}. ${level} by ${Object.values(levels)[j].host} and verified by ${Object.values(levels)[j].verifier}\n\n`
            }
            array.push(new Discord.MessageEmbed().setTitle("HRR Mobile List Levels").setDescription(txt).setFooter({text: `Page ${i+1} / ${amount+addition}`}))
          }
          }
                  let bu = new Discord.MessageActionRow()
        let emoji = ["Back", "Next", "Skip Forward", "Skip Back"]
            for(let i = 0; i < 4; i++) {
                bu.addComponents(
                    new Discord.MessageButton()
                    .setCustomId(i.toString())
                    .setStyle("PRIMARY")
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
        }
    }
}