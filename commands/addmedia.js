const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const media = require("../schemas/media");
const { messageError, messageRaw } = require("../utility");

module.exports = {
    name: 'addmedia',
    description: 'Link the media into the character',
    permission: {
        user: [],
        bot: []
    },
    dev_only: true,
    min_args: 3,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = {
            id_character: args[0],
            edition: parseInt(args[1]),
            url: args[2].replace('`', '')
        }
        const funIsExist = async() => {
            const retVal = await character.findOne({
                id_character: data.id_character
            })
            return retVal
        }
        try {
            let isExist = await funIsExist()
            if (isExist)
            {
                await media.findOneAndUpdate({
                    id_character: data.id_character,
                    edition: data.edition
                }, data, {upsert: true})
                message.channel.send(messageRaw(`**${isExist.name}** (\`#${data.edition}\`) has been linked with the media`))
            }
            else message.channel.send(messageError(`The character is not valid. Please try another`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to link the media into the character. Please try another`))
        }
    }
}