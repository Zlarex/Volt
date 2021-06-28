const { Client, Message } = require("discord.js")
const { messageDefault } = require("../utility")

module.exports = {
    name: 'ping',
    description: 'Check the bot latency',
    permission: {
        user: [],
        bot: []
    },
    dev_only: false,
    min_args: 0,
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async(client, message) => {
        try {
            message.channel.send('Receiving...').then(msg => {
                let createdAt = msg.createdAt - message.createdAt
                let websocketAt = client.ws.ping
                let editedMessage =  `:signal_strength: API: \`${createdAt}\` ms | WebSocket: \`${websocketAt}\` ms`
                msg.edit(messageDefault(editedMessage))
            })            
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}