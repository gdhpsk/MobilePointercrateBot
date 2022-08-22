const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pings"),
    async execute(interaction, Discord, client) {
        interaction.reply("sup m8")
    }
}