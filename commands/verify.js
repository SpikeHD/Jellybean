const got = require('got')

module.exports.run = async (bot, message, args) => {
  const id = args[1]
  
  if (!id || !Number(id)) return message.channel.send('You must provide your Roblox ID in the command!')

  const resp = await got.get(`https://users.roblox.com/v1/users/${id}`)
  const data = JSON.parse(resp.body)

  message.member.setNickname(`${data.displayName} | @${message.author.username}`)

  message.channel.send('Successfully changed your nickname to match your Roblox display name!')
}