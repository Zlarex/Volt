const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const { messageRaw } = require("../utility");

module.exports = {
    name: 'delcharacter',
    description: 'Delete the character from the database',
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
        let id_character = args[0]
        try {
            const data = await character.findOne({
                id_character: id_character
            })
            data.delete()
            return message.channel.send(messageRaw(`**${data.name}**・\`${data.id_character}\` has been deleted`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}