
const Discord = require('discord.js')
const fs = require('fs')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_ADDR}/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
.then(() => console.log('[INFO] Database connected'))
.catch(e => console.log(`Error: ${e}`))

const client = new Discord.Client()
client.commands = new Discord.Collection()
client.prefix = '..'
client.dev_id = process.env.DEV_ID

loadEvents = () => {
    console.log(`[INFO] Loading event files ...`)
    const eventFiles = fs.readdirSync('./events').filter(f => f.endsWith('.js'))
    for (const eventFile of eventFiles)
    {
        const event = require(`./events/${eventFile}`)
        if (event.once) client.once(event.name, event.run.bind(undefined, client))
        else client.on(event.name, event.run.bind(undefined, client))
        console.log(`[INFO] Event ready: ${event.name}`)
    }
}

loadCommands = () => {
    console.log(`[INFO] Loading command files ...`)
    const commandFiles = fs.readdirSync(`./commands`).filter(f => f.endsWith('.js'))
    for (const commandFile of commandFiles)
    {
        const command = require(`./commands/${commandFile}`)
        client.commands.set(command.name, command)
        console.log(`[INFO] Command ready: ${commandFile}`)
    }
}

loadEvents();
loadCommands();

client.login(process.env.BOT_TOKEN)
.then(() => console.log(`[INFO] Login success ...`))
.catch(e => console.log(e))