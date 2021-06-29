const { Client, Message } = require("discord.js");
const character = require("../schemas/character");
const media = require("../schemas/media");
const collection = require("../schemas/collection");
const series = require("../schemas/series");
const wish = require("../schemas/wish");
const { messageError } = require("../utility");

module.exports = {
    name: 'lookup',
    description: 'View the detail of the character',
    permission: {
        bot: [],
        user: []
    },
    dev_only: false,
    min_args: 1,
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        let data = {
            id_character: args[0],
            edition: (args.length > 1)? args[1] : 1
        }
        const funGetChars = async () => {
            const retVal = await character.findOne({
                id_character: data.id_character
            })
            return retVal
        }
        const funGetMedia = async(param) => {
            const retVal = await media.findOne({
                id_character: param.id_character,
                edition: param.edition
            })
            return retVal
        }
        const funGetSeries = async(param) => {
            const retVal = await series.findOne({
                id_series: param.id_series
            })
            return retVal
        }
        const funGetWish = async(param) => {
            const retVal = await wish.find({
                id_character: param.id_character
            })
            return retVal
        }
        const funcGetCollection = async(param) => {
            const retVal = await collection.findOne({
                id_user: message.author.id,
                id_character: param.id_character
            })
            return retVal
        }
        try {
            const chara = await funGetChars()
            if (chara)
            {
                const collection = await funcGetCollection(chara)
                let curEdition = 0
                if (collection)
                {
                    curEdition = collection.edition
                    data.edition = (args.length > 1)? args[1] : collection.edition
                }
                const media = await funGetMedia(data)
                const series = await funGetSeries(chara)
                const wish = await funGetWish(chara)
                
                let wishlister = 0
                let media_url = "https://media.discordapp.net/attachments/858602944752254986/858603018195173376/unknown.png"
                if (media) media_url = media.url
                if (wish) wishlister = wish.length
                let rare = chara.isSpecial? rare = '\n\n**RARE CHARACTER**' : ''

                let userinfo = collection? `✅ You owned this character` : ''
                if (collection)
                {
                    userinfo += `\n\nTotal owned・**${collection.amount}**`
                    userinfo += `\nEdition・**${collection.edition}**`
                    if (collection.price > 0) userinfo += `\nPrice・**${collection.price}** :coin:`
                }
                media_url = `${media_url}?width=193&height=300`.replace('`', '')
                let footer = `Lookup Edition・${media? data.edition : 0}${collection? ' | ✅ Owned' : ''}`
                let color = 3701706
                const embed1 = {
                    "embed": {
                        "title": chara.name,
                        "description": `${series.name}${rare}`,
                        "color": color,
                        "footer": {
                            "text": footer
                        },
                        "image": {
                            "url": media_url
                        }
                    }
                }
                const embed2 = {
                    "embed": {
                        "footer": {
                            "text": footer
                          },
                        "thumbnail": {
                            "url": media_url
                        },
                        "color": color,
                        "fields": [
                        {
                            "name": "Character Info",
                            "value": `Name・**${chara.name}**\nSeries・**${series.name}**\nWishlisted・**${wishlister}**\n\n`
                        },
                        {
                            "name": "Owner Info",
                            "value": `Profile・**<@${message.author.id}>**\nTotal owned・**${collection? collection.amount : 0}**\nEdition owned・**${collection? collection.edition : 0}**\nPrice・**${collection? collection.price : 0}**\n`
                        }
                        ]
                    }
                }
                const msg = await message.channel.send(embed1)
                if (collection)
                {
                    await msg.react('⬅')
                    await msg.react('➡')

                    const filter = (reaction, user) => {
                        return reaction.emoji.name == "⬅" || reaction.emoji.name == "➡" && user.id == message.author.id
                    }

                    let pos = 1
                    let cur = 1
                    const collector = msg.createReactionCollector(filter, {time: 15000})
                    collector.on('collect', (reaction, user) => {
                        if (reaction.emoji.name == "⬅" ) pos--
                        else if (reaction.emoji.name == "➡") pos++
                        if (pos > 2) pos = 2
                        else if (pos < 1) pos = 1

                        if (cur == pos) return
                        else
                        {
                            msg.edit(pos == 1? embed1 : embed2)
                            cur = pos
                        }
                    })
                }
            }
            else message.channel.send(messageError(`The character id isn't valid. Please try another`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to fetch the character information. Please try another`))
        }
    }
}