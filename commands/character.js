const { Client, Message } = require("discord.js");
const collection = require("../schemas/collection");
const { messageError, messageSuccess } = require("../utility");

module.exports = {
    name: 'character',
    description: 'List the character owned by the user',
    permission: {
        user: [],
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
        const funGetChars = async() => {
            const retVal = collection.find({
                id_user: message.author.id
            })
            return retVal
        }
        try {
            let res = await funGetUser()
            if (res.length > 0)
            {
                message.channel.send(messageSuccess(`Your today's daily reward: ${gold} :coin:`))
            }
            else message.channel.send(messageError(`You don't own any character. Please try another`))
        }
        catch (err) {
            console.log(`Error ${err}`)
            message.channel.send(messageError(`Failed to fetch the character that owned by the user. Please try another`))
        }
    }
}