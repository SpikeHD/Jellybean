const { Client, Collection, Intents} = require('discord.js')
const bot = new Client({
  intents: [
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
})
const fs = require('fs')
const { token, prefix } = require('./config.json')

bot.commands = new Collection()
bot.login(token)

bot.on('ready', () => {
  // Load commands
  fs.readdirSync('./commands/').forEach(command => {
    console.log(`Loading command: ${command}`)
  
    let props = require(`./commands/${command}`)
    bot.commands.set(command.replace('.js', ''), props)
  })

  // Register event handlers
  fs.readdirSync('./events/').forEach(event => {
    console.log(`Loading event: ${event}`)

    require(`./events/${event}`)(bot)
  })

  console.log('Up and running!')
})

bot.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const args = message.content.split(' '),
    command = bot.commands.get(args[0].split(prefix)[1])

  if(command) command.run(bot, message, args)
})
