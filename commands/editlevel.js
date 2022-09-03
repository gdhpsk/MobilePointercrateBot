const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("edit_level")
    .setDescription("edits a level")
      .addStringOption(option => option
      .setName("name")
      .setDescription("Name of the level you want to add.")
      .setRequired(true)
    )
    .addIntegerOption(option => option
      .setName("position")
      .setDescription("Input the level placement.")
      .setRequired(false)
    )
  .addIntegerOption(option => option
      .setName("levelid")
      .setDescription("Input the ID of the level.")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("ytcode")
      .setDescription("Input the YT code of the level")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("host")
      .setDescription("Who was the host/creator of this level?")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("verifier")
      .setDescription("Verifier of the level.")
      .setRequired(false)
    )
  .addIntegerOption(option => option
      .setName("listpercentage")
      .setDescription("List% of the level")
      .setRequired(false)
    ),
    private: true,
    async execute(interaction, Discord, client) {
       await interaction.deferReply()
        let access = await request(`https://hrrmobilelist.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      let dic = {
        name: interaction.options.getString("name"),
      }
      for(const item of interaction.options._hoistedOptions) {
        if(item.name == "levelid") {
          item.name = "levelID"
        }
        dic[item.name] = item.value
      }
      let submit = await request(`https://hrrmobilelist.com/levels?key=${process.env.APIKey}`, {
        method: "PATCH",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      let body = await submit.body.text()
      interaction.editReply(`\`\`\`${body}\`\`\``)
    }
}