const { Client, Partials, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const db = require('./db/manager');
require('dotenv').config();

const client = new Client({
  partials: [
    Partials.GuildMember,
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.Reaction,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
  ],
});

client.on('ready', async () => {
  console.log('Bot is now online!');

  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB Client has been successfully connected.'));

  const webPortal = require('./server');
  webPortal.load(client);
});

client.on('guildCreate', async (guild) => {
  if (!guild.available) return;

  await db.createServer(guild.id);
});

client.login(process.env.TOKEN);
