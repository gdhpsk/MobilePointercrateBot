const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("add_level")
    .setDescription("adds a level")
    .addIntegerOption(option => option
      .setName("position")
      .setDescription("Input the level placement.")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("name")
      .setDescription("Name of the level you want to add.")
      .setRequired(true)
    )
  .addIntegerOption(option => option
      .setName("levelid")
      .setDescription("Input the ID of the level.")
      .setRequired(true)
    )
  .addStringOption(option => option
      .setName("ytcode")
      .setDescription("Input the YT code of the level")
      .setRequired(true)
    )
  .addStringOption(option => option
      .setName("host")
      .setDescription("Who was the host/creator of this level?")
      .setRequired(true)
    )
  .addStringOption(option => option
      .setName("verifier")
      .setDescription("Verifier of the level.")
      .setRequired(true)
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
        position: interaction.options.getInteger("position"),
        name: interaction.options.getString("name"),
        levelID: interaction.options.getInteger("levelid"),
        ytcode: interaction.options.getString("ytcode"),
        host: interaction.options.getString("host"),
        verifier: interaction.options.getString("verifier"),
       listpercentage: interaction.options.getInteger("listpercentage"),
      }
      let submit = await request(`https://hrrmobilelist.com/levels?key=${process.env.APIKey}`, {
        method: "POST",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      let body = await submit.body.text()
      interaction.editReply(`\`\`\`${body}\`\`\``)
    }
}