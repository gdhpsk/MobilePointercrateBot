
module.exports = {
    name: "messageCreate",
    execute(message) {
        if(message.content == "h") {
            message.reply("i")
        }
    }
}