const fs = require('fs');
const { Client, Collection, GatewayIntentBits: Intents, Partials } = require('discord.js');

const client = new Client({ partials: [Partials.Channel, Partials.Message, Partials.Reaction], intents: [Intents.Guilds, Intents.GuildMessages, Intents.DirectMessages, Intents.GuildMembers, Intents.GuildPresences]}); 

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

const commands = [];

client.commands = new Collection() 

for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command);
	client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"))
for(const file of eventFiles) {
	const events = require(`./events/${file}`)
	if(events.once) {
		client.once(events.name, (...args) => events.execute(...args, commands))
	} else {
		client.on(events.name, (...args) => events.execute(...args, commands))
	}
}

/*client.on("interactionCreate", message => {
	message.member.id
})*/
client.login(process.env.token)