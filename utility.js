module.exports = {
    /**
     * Generate random six characters from a-z and 0-9
     * @returns {String}
     */
    generate: () => {
        const randChar = "abcdefghijklmnopqrstuvwxyz0123456789"
        let retVal = ''
        for (let i = 0; i < 6; i++)
        {
            retVal += randChar.charAt(Math.floor(Math.random() * randChar.length))
        }
        return retVal
    },
    /**
     * Create error embed
     * @param {String} str
     * @returns {String}
     */
    messageError: (str) => {
        return data = {
            "content": '',
            "embed": {
                "description": str,
                "color": 16711680
            }
        };
    },
    messageDefault: (str) => {
        return data = {
            "content": '',
            "embed": {
                "description": str,
                "color": 3701706
            }
        };
    },
    messageSuccess: (str) => {
        return data = {
            "content": '',
            "embed": {
                "description": str,
                "color": 3009625
            }
        };
    },
    messageRaw: (str) => {
        return data = {
            "content": '',
            "embed": {
                "description": str
            }
        };
    }
}