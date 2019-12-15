const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!bday') {
    msg.reply('Test');
	msg.reply(message.member.user.tag);
  }
});

// !bday help
// Explains how to set birthday

// !bday set
// Sets a user's birthday

// !bday

client.login(process.env.BOT_TOKEN);

console.log('is running')
