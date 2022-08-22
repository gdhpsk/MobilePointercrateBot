const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("delete_level")
    .setDescription("deletes a level")
    .addStringOption(option => option
      .setName("name")
      .setDescription("Name of the level you want to delete.")
      .setRequired(true)
    ),
    private: true,
    async execute(interaction, Discord, client) {
      
      await interaction.deferReply()
        let access = await request(`https://www.hrrmobilelist.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      
      let dic = {
        name: interaction.options.getString("name")
      }
      let submit = await request(`https://www.hrrmobilelist.com/levels?key=${process.env.APIKey}`, {
        method: "DELETE",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      let body = await submit.body.text()
      interaction.editReply(`\`\`\`${body}\`\`\``)
    }
}