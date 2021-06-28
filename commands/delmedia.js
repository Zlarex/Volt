const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const media = require("../schemas/media");
const { messageRaw, messageError } = require("../utility");

module.exports = {
    name: 'delmedia',
    description: 'Delete the media from the character',
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
        let data = {
            id_character: args[0],
            edition: parseInt(args[1])
        }
        try {
            const chara = await character.findOne({
                id_character: data.id_character
            })
            if (chara)
            {
                const res = await media.findOne(data)
                res.delete()
                message.channel.send(messageRaw(`**${chara.name}** (\`${res.edition}\`) has been unlinked`))
            }
            else message.channel.send(messageError(`The character id isn't valid. Please try another`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to delete the media. Please try another`))
        }
    }
}