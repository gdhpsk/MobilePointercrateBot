const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("give_permissions")
    .setDescription("gives editing permissions")
    .addStringOption(option => option
      .setName("id")
      .setDescription("User ID of the person you want to add.")
      .setRequired(true)
    ),
    private: true,
    async execute(interaction, Discord, client) {
      
      await interaction.deferReply()
        let access = await request(`https://mobilepointercrate.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      
      let dic = {
        user: interaction.options.getString("id")
      }
      let submit = await request(`https://mobilepointercrate.com/access?key=${process.env.APIKey}`, {
        method: "PUT",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      let body = await submit.body.text()
      interaction.editReply(`\`\`\`${body}\`\`\``)
    }
}