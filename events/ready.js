
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const { guildId } = require("../config.json")
const token = process.env.token
module.exports = {
    name: "ready",
    once: true,
    execute(client, commands) {
        console.log('Ready!');

	const CLIENT_ID = client.user.id
	const rest = new REST({
		version: "9"
	}).setToken(token);
	(async () => {
		try {
		
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands.filter(e => !e.private).map(e => e = e.data.toJSON())
				})
				console.log("IT WORKED (globally)");
			
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
					body: commands.filter(e => e.private).map(e => e = e.data.toJSON())
				})

      
				console.log("IT WORKED (locally)");
		} catch (err) {
			if(err) console.log(err)
		}
	})()
    }
}