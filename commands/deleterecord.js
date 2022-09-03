const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete_record")
    .setDescription("removes a record")
    .addStringOption(option => option
      .setName("level")
      .setDescription("Input a level name!")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("name")
      .setDescription("Name of the player you want to remove the record from.")
      .setRequired(true)
    ),
    private: true,
    async execute(interaction, Discord, client) {
       await interaction.deferReply()
        let access = await request(`https://hrrmobilelist.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      let dic = {
        level: interaction.options.getString("level"),
        name: interaction.options.getString("name")
      }
      let submit = await request(`https://hrrmobilelist.com/records?key=${process.env.APIKey}`, {
        method: "DELETE",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      if(submit.statusCode != 204) {
        let body = await submit.body.text()
        interaction.editReply(`\`\`\`${body}\`\`\``)
      } else {
        interaction.editReply(`\`\`\`Record has been deleted.\`\`\``)
      }
    }
}