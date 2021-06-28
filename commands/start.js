const { Client, Message } = require("discord.js");
const user = require("../schemas/user");
const { messageError, messageSuccess } = require("../utility");

module.exports = {
    name: 'start',
    description: 'Start the journey',
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
        let data = {
            id_user: message.author.id,
            lastDaily: 0,
            lastVote: 0,
            lastWeekly: 0,
            lastDrop: 0,
            gold: 0,
            platinum: 0,
            isPremium: false,
        }
        try {
            await user.create(data)
            message.channel.send(messageSuccess(`Your profile has been created`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to register your profile. Please try again`))
        }
    }
}