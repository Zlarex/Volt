const { Client, Message } = require("discord.js");
const series = require("../schemas/series");
const { messageRaw, messageError } = require("../utility");

module.exports = {
    name: 'delseries',
    description: 'Deletes the new series from the database',
    permission: {
        user: [],
        bot: []
    },
    dev_only: true,
    min_args: 1,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let id_series = args[0]
        try {
            const data = await series.findOne({
                id_series: id_series
            });
            data.delete()
            message.channel.send(messageRaw(`**${data.name}**・\`${data.id_series}\` has been deleted`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to delete the series. Please try another`))
        }
    }
}