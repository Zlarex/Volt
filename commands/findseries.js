const { Client, Message } = require("discord.js")
const series = require("../schemas/series")
const { messageError } = require("../utility")

module.exports = {
    name: 'findseries',
    description: 'Find the series or the series',
    permission: {
        user: [],
        bot: []
    },
    dev_only: false,
    min_args: 1,
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let data = args.join(' ').toString().trim()
        let retVal = []

        const funGetChars = async() => {
            const retVal = await series.find({
                name: {
                    $regex: data,
                    $options: 'i'
                },
            })
            .sort({'name': 1})
            .limit(25)
            return retVal
        }
        try {
            const data = await funGetChars()
            if (data.length > 0)
            {
                let str = []
                let max = data.length
                for (let i = 0; i < max; i++)
                {
                    str.push(`${i+1}. **${data[i].name}**・\`${data[i].id_series}\``)
                }
                const embed = {
                    "embed": {
                        "title": "Series Result",
                        "description": "Please use \`seek\` command to view the detail of the series",
                        "color": 3701706,
                        "fields": [
                            {
                                "name": `Showing the result of first ${max} series`,
                                "value": str.join('\n')
                            }
                        ]
                    }
                }
                message.channel.send(embed)
            }
            else message.channel.send(messageError(`The series doesn't exist. Please try another`))
        }
        catch (err) {
            console.log(`Error: ${err}`)
            message.channel.send(messageError(`Failed to fetch the series. Please try another`))
        }
    }
}