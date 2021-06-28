const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const series = require("../schemas/series")
const { generate, messageError, messageRaw } = require('../utility')

module.exports = {
    name: 'addcharacter',
    description: 'Adds the new character to the database',
    permission: {
        user: [],
        bot: []
    },
    dev_only: true,
    min_args: 4,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = {
            id_series: args[0],
            id_character: generate(),
            isTradable: args[1] == "true"? true : false,
            isSpecial: args[2] == "true"? true : false,
            name: (args.splice(0, 3)? args.join(' ') : ''),
        }
        
        const funIsSeriesExist = async() => {
            const retVal = await series.findOne({
                id_series: data.id_series
            })
            return retVal
        }
        const funIsDuplicate = async() => {
            const retVal = await character.findOne({
                id_series: data.id_series,
                name: data.name
            })
            return retVal
        }
        try {
            let isSeriesExist = await funIsSeriesExist()
            if (!isSeriesExist) return message.channel.send(messageError(`The series id isn't valid. Please try another`))

            let isDuplicate = await funIsDuplicate()
            if (!isDuplicate)
            {
                await character.create(data)
                message.channel.send(messageRaw(`**${data.name}**・\`${data.id_character}\` has been added`))
            }
            else message.channel.send(messageError(`The character is already exist. Please try another`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to add the character. Please try another`))
        }
    }
}