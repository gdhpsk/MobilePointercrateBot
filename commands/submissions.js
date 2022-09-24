const { SlashCommandBuilder, SelectMenuBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("submissions")
    .setDescription("View submissions"),
    private: true,
    async execute(interaction, Discord, client) {
      
      await interaction.deferReply()
        let access = await request(`https://mobilepointercrate.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      
      
      let submissions = await request(`https://mobilepointercrate.com/submissions?key=${process.env.APIKey}`)

      let body = await submissions.body.json()
      body.splice(25)
      interaction.editReply(`\`\`\`${body}\`\`\``)
    }
}