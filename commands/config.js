const embed = require('../common/Embed')
const fs = require('fs')
const { MessageEmbed } = require('discord.js')

module.exports.run = async (bot, message, args) => {
  if (!message.member.permissions.has('ADMINISTRATOR')) return

  const server = JSON.parse(fs.readFileSync('./server.json'))
  const subcommand = args[1]
  const evtArgs = [server, args[2], args[3] || null]

  let response = 'An error occurred </3';

  switch(subcommand) {
    case 'set':
      response = set(...evtArgs, message.channel.id)
      break
    
    case 'clear':
      response = clear(...evtArgs)
      break

    case 'list':
    default:
      response = list(server)
      break
  }

  if (response instanceof MessageEmbed) {
    return message.channel.send({ embeds: [response] })
  }

  message.channel.send(response).then(m => {
    m.delete(10000)
  })

  message.delete(10000)
}

function set(server, field, value, channel) {
  if (!field) return `Incorrect usage! Specify the field and value you would like to change it to.`
  if (!server[field]) return `The field: "${field}", does not exist!`

  if (server[field].type === 'channel' && !value) value = channel
  
  // Set value
  server[field].value = value

  // write back to file
  fs.writeFileSync('./server.json', JSON.stringify(server), 'utf-8')

  return `Field "${field}" was set to "${value}"!`
}

function clear(server, field, value) {
  if (!field) return `Incorrect usage! Specify the field and value you would like to change it to.`
  if (!server[field]) return `The field: "${field}", does not exist!`
  
  // Set value
  server[field].value = ''

  // write back to file
  fs.writeFileSync('./server.json', JSON.stringify(server), 'utf-8')

  return `Field "${field}" was cleared!`
}

function list(server) {
  const resp = embed()
    .setTitle('Server Configuration List')

  Object.keys(server).forEach(key => {
    const value = server[key]
    let input = value.value

    if (value.type === 'channel') input = `<#${input}>`

    resp.addField(key, input || 'Empty', true)
  })

  return resp
}