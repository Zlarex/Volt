const { Client } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Client} client 
     */
    run: async(client) => {
        try {
            let guildSize = client.guilds.cache.size
            await client.user.setStatus('online')
            await client.user.setActivity({
                name: `${client.prefix}help | ${guildSize} server${guildSize > 1? 's' : ''}`,
                type: 'WATCHING'
            })
            console.log(`[INFO] ${client.user.tag} is online!`)
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}