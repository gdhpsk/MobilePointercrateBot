const { SlashCommandBuilder } = require("discord.js")
const {request} = require("undici")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("edit_record")
    .setDescription("edits a submission")
    .addStringOption(option => option
      .setName("level")
      .setDescription("Input a level name!")
      .setRequired(true)
    )
    .addStringOption(option => option
      .setName("name")
      .setDescription("Name of the player you want to add.")
      .setRequired(true)
    )
  .addIntegerOption(option => option
      .setName("percent")
      .setDescription("Input the percentage the player got.")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("milliseconds")
      .setDescription("Input the ms amount of the screen.")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("date")
      .setDescription("When was this record recorded? mm/dd/yy format.")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("link")
      .setDescription("Video of the submission.")
      .setRequired(false)
    )
  .addStringOption(option => option
      .setName("hertz")
      .setDescription("Hertz of submission")
      .setRequired(false)
    )
  .addBooleanOption(option => option
      .setName("removed")
      .setDescription("Should the record be removed by default?")
      .setRequired(false)
    ),
    private: true,
    async execute(interaction, Discord, client) {
       await interaction.deferReply()
        let access = await request(`https://www.hrrmobilelist.com/access?key=${process.env.APIKey}`)
      let access_body = await access.body.json()
       if(!access_body.includes(interaction.user.id)) return interaction.editReply(`You do not have permission to run this command.`)
      let dic = {
        level: interaction.options.getString("level"),
        name: interaction.options.getString("name")
      }
      for(let item of interaction.options._hoistedOptions) {
        dic[item.name] = item.value
      }
      let submit = await request(`https://www.hrrmobilelist.com/records?key=${process.env.APIKey}`, {
        method: "PATCH",
        body: JSON.stringify(dic),
        headers: {
          'content-type': "application/json"
        }
      })

      if(submit.statusCode != 204) {
        let body = await submit.body.text()
        interaction.editReply(`\`\`\`${body}\`\`\``)
      } else {
        interaction.editReply(`\`\`\`Record has been edited.\`\`\``)
      }
    }
}