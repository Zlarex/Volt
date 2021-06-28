const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const collection = require("../schemas/collection");
const series = require("../schemas/series");
const user = require("../schemas/user")
const { messageError } = require("../utility");

module.exports = {
    name: 'drop',
    description: 'Spawn the card',
    permission: {
        bot: [],
        user: []
    },
    dev_only: false,
    min_args: 0,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const funGetRandom = async() => {
            const retVal = await character.aggregate([{$sample: {size: 3}}])
            return retVal
        }
        const funGetSeries = async(param) => {
            const retVal = await series.findOne({
                id_series: param.id_series
            })
            return retVal
        }
        try {
            const ret = await funGetRandom()
            if (ret.length > 0)
            {
                let str = []
                
                let series = await funGetSeries(ret[0])
                let series_name = ret[0].id_series.toUpperCase()
                if (series) series_name = series.name
                str.push(`1️⃣ **${ret[0].name}**・\`${ret[0].id_character}\`・${series_name}`)

                series_name = ret[1].id_series.toUpperCase()
                series = await funGetSeries(ret[1])
                if (series) series_name = series.name
                str.push(`2️⃣ **${ret[1].name}**・\`${ret[1].id_character}\`・${series_name}`)

                series_name = ret[2].id_series.toUpperCase()
                series = await funGetSeries(ret[2])
                if (series) series_name = series.name
                str.push(`3️⃣ **${ret[2].name}**・\`${ret[2].id_character}\`・${series_name}`)

                let embed = {
                    "embed": {
                        "title": "Character Drop",
                        "description": `Pick the character below using the existing reaction\n\n${str.join('\n')}`,
                    }
                }
                const msg = await message.channel.send(embed)
                await msg.react(`1️⃣`)
                await msg.react(`2️⃣`)
                await msg.react(`3️⃣`)

                const filter = (reaction, user) => {
                    return reaction.emoji.name == "1️⃣" || reaction.emoji.name == "2️⃣" || reaction.emoji.name == "3️⃣"
                }

                let available = true
                const collector = msg.createReactionCollector(filter, { time: 30000 })
                let embed2 = {
                    "embed": {
                        "title": "Character Drop",
                        "description": `_This drop has been expired_\n\n${str.join('\n')}`,
                    }
                }
                collector.on('collect', async (reaction, userdata) => {
                    if (available)
                    {
                        let val = -1
                        if (reaction.emoji.name == "1️⃣") val = 0
                        else if (reaction.emoji.name == "2️⃣") val = 1
                        else val = 2
                        const userExist = await user.findOne({
                            id_user: userdata.id
                        })
                        if (!userExist) return
                        const data = await collection.findOne({
                            id_character: ret[val].id_character,
                            id_user: userdata.id
                        })
                        if (data)
                        {
                            data.amount += 1
                            data.save()
                        }
                        else
                        {
                            await collection.create({
                                id_user: userdata.id,
                                id_character: ret[val].id_character,
                                edition: 1,
                                level: 1,
                                amount: 1,
                                price: 0,
                                tag: ''
                            })
                        }
                        await message.channel.send(`<@${userdata.id}> has claimed **${ret[val].name}**・\`${ret[val].id_character}\``)
                        msg.edit(embed2)
                        available = false
                    }
                })

                collector.on('end', (collected) => {
                    msg.edit(embed2)
                })
            }
            else message.channel.send(messageError(`No characters found in the database. Please contact my creator`))
        }
        catch (err) {
            message.channel.send(messageError(`Failed to fetch random characters. Please try again`))
            console.log(`Error: ${err}`)
        }
    }
}