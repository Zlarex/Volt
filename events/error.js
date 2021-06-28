const { Client } = require("discord.js")

module.exports = {
    name: 'error',
    /**
     * @param {Client} client 
     * @param {Error} error 
     */
    run: async(client, error) => {
        console.log(`Error: ${error}`)
    }
}