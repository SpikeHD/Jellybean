module.exports = (bot, guild) => {
  bot.on('guildMemberAdd', (member) => {
    const { joins } = require('../server.json')
    const channel = guild.channels.cache.get(joins.value)

    if (!channel) return console.log('Borked join channel :((');

    channel.send(`Welcome, ${member}, to ${guild.name}!`)
  })
}