// Ragebait Classifier Bot for Discord
// Detects ragebait messages and labels them

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

class RagebaitClassifier {
  constructor() {
    // Ragebait patterns with weights: [regex, weight, reason]
    this.patterns = [
      [/^[^a-z]*[A-Z\s\d\W]{10,}[^a-z]*$/, 0.3, "ALL CAPS yelling"],
      [/!{3,}/g, 0.2, "Exclamation spam"],
      [/\?{3,}/g, 0.15, "Question spam"],
      [/\b(outraged|disgusting|pathetic|horrible|terrible|awful|unbelievable|shocking|appalling)\b/gi, 0.25, "Outrage language"],
      [/\b(you won't believe|this is why|the real reason|what they don't want you to know|mind blown)\b/gi, 0.35, "Clickbait phrase"],
      [/\b(liberals|conservatives|democrats|republicans|leftists|right-wingers|snowflakes|nazis)\b.*\b(are|all|always|never)\b/gi, 0.3, "Divisive generalization"],
      [/\b(worst|best|always|never|everyone|no one|destroy|ruin|kill)\b/gi, 0.15, "Extreme language"],
      [/\b(idiot|stupid|moron|dumb|ignorant)\b/gi, 0.25, "Direct insult"],
      [/^(why do|how can|explain why).*\?/gi, 0.2, "Bait question"],
      [/[🔥💀😂🤡🤬😡🤮💩]{3,}/g, 0.15, "Emoji spam"],
    ];
  }

  classify(text) {
    let score = 0;
    const reasons = [];
    const textLower = text.toLowerCase();

    for (const [pattern, weight, reason] of this.patterns) {
      if (pattern.test(text)) {
        score += weight;
        if (!reasons.includes(reason)) {
          reasons.push(reason);
        }
      }
    }

    const words = text.split(/\s+/);
    
    // Short angry messages
    if (words.length <= 5 && score > 0.2) {
      score += 0.1;
      if (!reasons.includes("Short + angry")) reasons.push("Short + angry");
    }

    // Very long rant
    if (words.length > 100 && score > 0.3) {
      score += 0.1;
      if (!reasons.includes("Long rant")) reasons.push("Long rant");
    }

    // Cap at 1.0
    score = Math.min(score, 1.0);

    // Determine category
    let category;
    if (score < 0.2) category = "none";
    else if (score < 0.4) category = "low";
    else if (score < 0.6) category = "medium";
    else category = "high";

    return { score, reasons, category };
  }
}

// Bot setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const classifier = new RagebaitClassifier();
const monitoredChannels = new Set();

client.on('ready', () => {
  console.log(`🤖 ${client.user.tag} is online and monitoring for ragebait`);
  console.log(`📊 Monitoring ${monitoredChannels.size} channels`);
});

client.on('messageCreate', async (message) => {
  // Ignore bots
  if (message.author.bot) return;

  // Check for commands
  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).split(/\s+/);
    const command = args.shift().toLowerCase();

    // !monitor - Start monitoring this channel
    if (command === 'monitor') {
      monitoredChannels.add(message.channel.id);
      await message.reply(`🔍 Now monitoring ${message.channel} for ragebait`);
      return;
    }

    // !unmonitor - Stop monitoring this channel
    if (command === 'unmonitor') {
      monitoredChannels.delete(message.channel.id);
      await message.reply(`🛑 Stopped monitoring ${message.channel}`);
      return;
    }

    // !check <text> - Check if text is ragebait
    if (command === 'check') {
      const text = args.join(' ');
      if (!text) {
        await message.reply('❌ Provide text to check: `!check <text>`');
        return;
      }
      
      const result = classifier.classify(text);
      
      let color = 0x00ff00; // Green
      if (result.category === 'medium') color = 0xffa500; // Orange
      else if (result.category === 'high') color = 0xff0000; // Red

      const embed = new EmbedBuilder()
        .setTitle('Ragebait Analysis')
        .setDescription(`Score: ${result.score.toFixed(2)}/1.0`)
        .setColor(color)
        .addFields(
          { name: 'Indicators', value: result.reasons.join('\n• ') || 'None detected', inline: false },
          { name: 'Verdict', value: result.category.toUpperCase(), inline: true }
        );
      
      await message.reply({ embeds: [embed] });
      return;
    }

    // !stats - Show monitoring stats
    if (command === 'stats') {
      const channels = Array.from(monitoredChannels).map(id => `<#${id}>`);
      const embed = new EmbedBuilder()
        .setTitle('Ragebait Monitor Status')
        .addFields({
          name: 'Monitored Channels',
          value: channels.join('\n') || 'None',
          inline: false
        });
      await message.reply({ embeds: [embed] });
      return;
    }

    return;
  }

  // Only process monitored channels
  if (!monitoredChannels.has(message.channel.id)) return;

  // Classify the message
  const result = classifier.classify(message.content);

  // React based on score
  if (result.category === 'high') {
    await message.react('🚩');
    // Optionally send analysis
    // await sendAnalysis(message, result);
  } else if (result.category === 'medium') {
    await message.react('⚠️');
  } else if (result.category === 'low') {
    await message.react('🤔');
  }
});

async function sendAnalysis(message, result) {
  const embed = new EmbedBuilder()
    .setTitle('🚩 Ragebait Detected')
    .setDescription(`Score: ${result.score.toFixed(2)}/1.0`)
    .setColor(0xff0000)
    .addFields(
      { name: 'Indicators', value: result.reasons.slice(0, 5).join('\n• '), inline: false },
      { name: 'Category', value: result.category.toUpperCase(), inline: true }
    );
  
  // Option 1: Reply to message
  // await message.reply({ embeds: [embed] });
  
  // Option 2: Send to log channel (replace LOG_CHANNEL_ID)
  // const logChannel = await client.channels.fetch('LOG_CHANNEL_ID');
  // if (logChannel) await logChannel.send({ embeds: [embed] });
}

// Error handling
client.on('error', console.error);
process.on('unhandledRejection', console.error);

// Login
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error('❌ Error: Set DISCORD_TOKEN environment variable');
  process.exit(1);
}

client.login(TOKEN);
