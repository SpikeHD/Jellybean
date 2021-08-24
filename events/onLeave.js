module.exports = (bot, guild) => {
  bot.on('guildMemberRemove', (member) => {
    const { leaves } = require('../server.json')
    const channel = guild.channels.cache.get(leaves.value)

    if (!channel) return console.log('Borked leave channel :((');

    channel.send(`Hope to see you again, ${member}!`)
  })
}