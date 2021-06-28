const { Client, Message } = require("discord.js")
const server = require("../schemas/server")
const { messageSuccess, messageError } = require("../utility")

module.exports = {
    name: 'prefix',
    description: 'Sets the bot\'s prefix on the server. Note that the default prefix can\'t be changed',
    permission: {
        user: ['MANAGE_GUILD'],
        bot: []
    },
    dev_only: false,
    min_args: 1,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {        
        try {
            let prefix = args[0]
            await server.findOneAndUpdate({
                id_guild: message.guild.id,
                id_channel: message.channel.id,
            }, {prefix: prefix}, {upsert: false})
            message.channel.send(messageSuccess(`Successfully set the server prefix into \`${prefix}\` (Note that the default prefix can still be used)`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}