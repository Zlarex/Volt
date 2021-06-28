const { Client, Message } = require("discord.js")
const server = require("../schemas/server")
const { messageError } = require("../utility")

module.exports = {
    name: 'timezone',
    description: 'Sets the bot\'s timezone on the server.',
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
        isValidTimezone = (tz) => {
            if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) throw new Error('Error: Unable to find the system timezone')
            try {
                Intl.DateTimeFormat(undefined, {timeZone: tz})
                return true
            }
            catch (err) {
                return false
            }
        }
        try {
            let timezone = args[0]
            if (!isValidTimezone(timezone)) return message.channel.send(messageError(`The timezone doesn't exist. Please use the valid javascript timezone format`))
            await server.findOneAndUpdate({
                id_guild: message.guild.id,
                id_channel: message.channel.id
            }, {timezone: timezone}, {upsert: false})
            message.channel.send(`Successfully set the timezone into \`${timezone.toUpperCase()}\``)
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}