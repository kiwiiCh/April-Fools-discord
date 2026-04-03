const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

// 🔧 CONFIG
const CLIENT_ID = process.env.CLIENT_ID;
const BOT_TOKEN = process.env.BOT_TOKEN;
const PRANK_URL = process.env.PRANK_URL || 'https://your-hosted-page.com/april-fools'; // Replace with your hosted link

// 🤖 CLIENT SETUP
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 📝 REGISTER SLASH COMMAND
const command = new SlashCommandBuilder()
  .setName('april-fools-ban')
  .setDescription('April Fools account prank (harmless)')
  .addUserOption(opt => opt.setName('target').setDescription('User to prank').setRequired(true));

const commands = [command.toJSON()];

// 🚀 READY
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// 💬 INTERACTION HANDLER
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'april-fools-ban') {
    const target = interaction.options.getUser('target');

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🚨 ACCOUNT STATUS: SUSPENDED?')
      .setDescription(`**${target.tag}**, our systems detected a minor anomaly with your account.\n\n🔗 Please click below to verify it's really you!`)
      .setFooter({ text: 'April Fools Prank • No real action taken • Made by Kii Akira' })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setLabel('🔐 Verify Account Now')
      .setStyle(ButtonStyle.Link)
      .setURL(PRANK_URL);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  }
});

// 📡 COMMAND REGISTRATION (Run once, or on startup)
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
(async () => {
  try {
    console.log('🔄 Registering commands...');
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID || undefined), // Remove process.env.GUILD_ID for global commands (takes ~1hr to update)
      { body: commands }
    );
    console.log('✅ Commands registered!');
  } catch (error) {
    console.error('❌ Command registration failed:', error);
  }
})();

client.login(BOT_TOKEN);
