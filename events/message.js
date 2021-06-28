const { Client, Message } = require("discord.js")
const server = require("../schemas/server")
const { messageError } = require('../utility')

module.exports = {
    name: 'message',
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    run: async(client, message) => {        
        const funGetPrefix = async () => {
            res = {
                default_prefix: client.prefix,
                guild_prefix: '..',
                guild_channel: ''
            }
            const prefix = await server.findOne({
                id_guild: message.guild.id
            })
            if (prefix)
            {
                res.guild_prefix = prefix.prefix
                res.guild_channel = prefix.id_channel
            }
            return res
        }
        
        try {
            // validating the request
            if (!message.author.client || !message.guild) return

            // fetching the prefix information
            let data = await funGetPrefix()
            let prefixLength = 0

            if (message.content.toLowerCase().startsWith(data.default_prefix)) prefixLength = data.default_prefix.length
            else if (message.content.toLowerCase().startsWith(data.guild_prefix)) prefixLength = data.guild_prefix.length
            if (prefixLength == 0) return
            
            // checking the avaibility of the command
            let [cmd, ...args] = message.content.slice(prefixLength).trim().split(/ +/g)
            let command = client.commands.get(cmd.toLowerCase())
            if (!command) return
            if (command.min_args > args.length) return message.channel.send(messageError(`You didn't provide command argument${command.min_args > 1? 's' : ''}, please try again`))
            if (
                command.permission.user.length == 0 ||
                command.permission.bot.length == 0 ||
                message.member.hasPermission(command.permission.user) ||
                message.guild.me.hasPermission(command.permission.bot)
            )
            {
                if (command.dev_only && message.author.id != client.dev_id) return
                if (message.channel.id != data.guild_channel && command.name != 'setchannel' && command.name != 'ping') return
                if (command.dev_only) console.log(`[WARN] Developer command (${command.name}) has been used!`)
                return command.run(client, message, args)
            }
            else
            {
                // Invalid permission
                let permUser = []
                let messageUser = `You don't have the following permission`
                command.permission.user.forEach(perm => {
                    if (!message.member.permissions.has(perm)) permUser.push(`\`${perm}\``)
                })
                if (permUser.length > 0)
                {
                    messageUser += `${(permUser.length == 1) ? '' : 's'}: ${permUser.join(', ')}`
                    return message.channel.send(messageError(messageUser))
                }

                let permBot = []
                let messageBot = `I don't have the following permission`
                command.permission.bot.forEach((perm) => {
                    if (!message.guild.me.permissions.has(perm)) permBot.push(`\`${perm}\``)
                })
                if (permBot.length > 0)
                {
                    messageBot += `${(permBot.length == 1) ? '' : 's'}: ${permBot.join(', ')}`
                    return message.channel.send(messageError(messageBot))
                }
            }
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}