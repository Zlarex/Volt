const { Client, Message } = require("discord.js");
const server = require("../schemas/server");
const { messageSuccess, messageError } = require("../utility");

module.exports = {
    name: 'setchannel',
    description: 'Set the active channel as the base of the bot command',
    permission: {
        user: ['MANAGE_GUILD'],
        bot: []
    },
    dev_only: false,
    min_args: 0,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = {
            id_guild: message.guild.id,
            id_channel: message.channel.id,
            prefix: '..',
            timezone: 'Asia/Jakarta'
        }
        try {
            await server.findOneAndUpdate({
                id_guild: message.guild.id
            }, data, {upsert: true})
            message.channel.send(messageSuccess(`Successfully set <#${data.id_channel}> as the command channel`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}