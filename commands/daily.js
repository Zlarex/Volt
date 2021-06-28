const { Client, Message } = require("discord.js");
const user = require("../schemas/user");
const { messageError, messageSuccess } = require("../utility");

module.exports = {
    name: 'daily',
    description: 'Get the daily rewards',
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
        const funGetUser = async() => {
            const retVal = user.findOne({
                id_user: message.author.id
            })
            return retVal
        }
        try {
            let user = await funGetUser()
            if (user)
            {
                const lastTime = new Date(user.lastDaily * 1000)
                const today = new Date()
                today.setHours(0)
                today.setMinutes(0)
                today.setSeconds(0)
                today.setMilliseconds(0)

                if (lastTime.getDate() == today.getDate()) return message.channel.send(messageError(`You've claimed today's daily reward. Please try again tomorrow`))
                let bonus = (lastTime.getDate() == today.getDate() - 1)?  Math.floor(Math.random() * 50) + 10 : 0
                const gold = Math.floor(Math.random() * 100) + 10 + bonus
                user.gold += gold
                user.lastDaily = today.getTime() / 1000
                user.save()
                message.channel.send(messageSuccess(`Your today's daily reward: ${gold} :coin:`))
            }
            else message.channel.send(messageError(`Your profile is not registered. Please register it with \`start\` command`))
        }
        catch (err) {
            console.log(`Error ${err}`)
            message.channel.send(messageError(`Failed to fetch the user information. Please try again`))
        }
    }
}