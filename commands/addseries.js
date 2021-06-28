const { Client, Message } = require("discord.js");
const series = require("../schemas/series");
const { generate, messageError, messageRaw } = require('../utility')

module.exports = {
    name: 'addseries',
    description: 'Adds the new series to the database',
    permission: {
        user: [],
        bot: []
    },
    dev_only: true,
    min_args: 2,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        if (!args.includes('|')) return message.channel.send('').catch(err => { return console.log(`Error: ${err}`)})
        let data = {
            id_series: generate(),
            name: args.join(' ').toString().split('|')[0].trim(),
            source: args.join(' ').toString().split('|')[1].trim()
        }
        try {
            await series.create(data)
            message.channel.send(messageRaw(`**${data.name}**・\`${data.id_series}\` has been added`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to add the series. Please try another`))
        }

        // let retVal = ''
        // let loop = true
        // while (loop)
        // {
        //     data.id_series = generate()
        //     await series.findOne({id_series: data.id_series}, async (err, res) => {
        //         if (err) return
        //         else if (!res)
        //         {
        //             loop = false
        //             await series.findOne({name: data.name}, async (err, res) => {
        //                 if (err) return message.channel.send(`:no_entry: Error: ${e}`).catch(err => { return console.log(`Error: ${err}`)})
        //                 else if (!res)
        //                 {
        //                     await series.create(data, (err, res) => {
        //                         if (err) retVal = `:no_entry: Error: ${err}`
        //                         else retVal = `:ballot_box_with_check: Added: ${data.name}・\`${data.id_series}\``
        //                         return message.channel.send(retVal).catch(err => { return console.log(`Error: ${err}`)})
        //                     })
        //                 }
        //             })
        //         }
        //     })
        // }
    }
}