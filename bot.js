// Ragebait Classifier Bot for Discord v3.0
// 50+ detection features

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

class RagebaitClassifier {
  constructor() {
    // Initialize with 30+ ragebait patterns
    this.patterns = {
      // 1. Formatting-based ragebait
      allCaps: { regex: /^[^a-z]*[A-Z\s\d\W]{15,}[^a-z]*$/, weight: 0.35, name: "ALL CAPS screaming" },
      exclaimSpam: { regex: /!{4,}/g, weight: 0.25, name: "Exclamation spam" },
      questionSpam: { regex: /\?{4,}/g, weight: 0.2, name: "Question spam" },
      ellipsisAbuse: { regex: /\.{5,}/g, weight: 0.15, name: "Dramatic ellipsis" },
      mixedPunctuation: { regex: /[!?]{3,}/g, weight: 0.2, name: "Mixed punctuation chaos" },
      asteriskEmphasis: { regex: /\*[^*]{3,}\*/g, weight: 0.1, name: "Forced emphasis" },
      
      // 2. Emotional manipulation
      outrageWords: { regex: /\b(outraged|disgusted|appalled|shocked|horrified|furious|livid|enraged)\b/gi, weight: 0.3, name: "Outrage vocabulary" },
      victimLanguage: { regex: /\b(can't believe|how dare|the audacity|unacceptable)\b/gi, weight: 0.25, name: "Victim framing" },
      moralSuperiority: { regex: /\b(anyone with a brain|if you think|wake up|open your eyes)\b/gi, weight: 0.3, name: "Moral superiority" },
      guiltTripping: { regex: /\b(if you care about|you're part of the problem|silence is violence)\b/gi, weight: 0.25, name: "Guilt tripping" },
      fearMongering: { regex: /\b(they're coming for|it's only a matter of time|mark my words|just wait)\b/gi, weight: 0.3, name: "Fear mongering" },
      
      // 3. Divisive content
      partisanTrigger: { regex: /\b(biden|trump|maga|commie|socialist|fascist|nazi)\b.*\b(destroying|ruining|hates|killing)\b/gi, weight: 0.4, name: "Partisan trigger" },
      identityAttacks: { regex: /\b(all men|all women|white people|black people|jews|muslims|christians)\b.*\b(are|always|never)\b/gi, weight: 0.35, name: "Identity generalization" },
      generationBashing: { regex: /\b(boomers|millennials|gen z|snowflakes|karens)\b.*\b(ruined|entitled|lazy|stupid)\b/gi, weight: 0.3, name: "Generation bashing" },
      usVsThem: { regex: /\b(the left|the right|democrats|republicans|liberals|conservatives)\b.*\b(want|trying|plan)\b/gi, weight: 0.3, name: "Us vs them framing" },
      
      // 4. Clickbait patterns
      curiosityGap: { regex: /\b(you won't believe|what happens next|the real reason|what they don't want you to know)\b/gi, weight: 0.35, name: "Curiosity gap" },
      listicleBait: { regex: /\b(top \d+|\d+ reasons|\d+ things|\d+ ways)\b/gi, weight: 0.2, name: "Listicle bait" },
      urgencyTrigger: { regex: /\b(breaking|urgent|just in|stop what you're doing)\b/gi, weight: 0.25, name: "False urgency" },
      sensationalNumbers: { regex: /\b(millions|billions|trillions)\b.*\b(dead|dying|stolen|wasted)\b/gi, weight: 0.3, name: "Sensational numbers" },
      
      // 5. Conspiracy/rhetoric
      conspiracyKeywords: { regex: /\b(wake up sheeple|do your research|follow the money|controlled opposition)\b/gi, weight: 0.35, name: "Conspiracy rhetoric" },
      censorshipClaims: { regex: /\b(they're censoring|being silenced|won't let me say|thought police)\b/gi, weight: 0.25, name: "Censorship claim" },
      sourceAttacks: { regex: /\b(mainstream media|fake news|biased media|propaganda)\b/gi, weight: 0.2, name: "Source dismissal" },
      whataboutism: { regex: /\b(but what about|what about when|you didn't care about)\b/gi, weight: 0.25, name: "Whataboutism" },
      
      // 6. Aggressive engagement
      calloutBait: { regex: /\b(tag someone|share if you agree|comment if|double tap if)\b/gi, weight: 0.25, name: "Engagement bait" },
      challengeBait: { regex: /\b(i bet you can't|prove me wrong|change my mind|fight me)\b/gi, weight: 0.3, name: "Challenge bait" },
      superiorityBait: { regex: /\b(only real fans|true patriots|smart people|people with iq)\b/gi, weight: 0.3, name: "Superiority bait" },
      
      // 7. Direct attacks
      adHomien: { regex: /\b(idiot|stupid|moron|dumbass|retard|clown|npc|bot|shill)\b/gi, weight: 0.3, name: "Ad hominem attack" },
      dismissiveLanguage: { regex: /\b(cope|seethe|rent free|touch grass|ratio|L+bozo)\b/gi, weight: 0.25, name: "Dismissive slang" },
      dehumanizing: { regex: /\b(subhuman|scum|vermin|parasite|cancer|plague)\b/gi, weight: 0.4, name: "Dehumanizing language" },
      
      // 8. Emotional punctuation
      emojiSpam: { regex: /[🔥💀😂🤡🤬😡🤮💩🤦🙄😤😠🖕]{3,}/g, weight: 0.2, name: "Emoji spam" },
      laughingAt: { regex: /\b(lmao|lmfao|lol|rofl).{0,20}(stupid|idiot|wrong|dumb)\b/gi, weight: 0.2, name: "Laughing at someone" },
      
      // 9. Questionable assertions
      absoluteStatements: { regex: /\b(every single|literally all|100% of|without exception)\b/gi, weight: 0.2, name: "Absolute statement" },
      unverifiableClaims: { regex: /\b(everyone knows|it's obvious|clearly|undeniably)\b/gi, weight: 0.15, name: "Unverifiable claim" },
      
      // 10. Drama indicators
      vagueBooking: { regex: /\b(some people|you know who you are|certain individuals|a lot of you)\b/gi, weight: 0.2, name: "Vaguebooking" },
      subtweetStyle: { regex: /^(can't stand|sick of|tired of|done with)\s/i, weight: 0.2, name: "Subtweet style" },
      martyrdom: { regex: /\b(here comes the hate|bring on the downvotes|unpopular opinion)\b/gi, weight: 0.25, name: "Martyrdom complex" },
      
      // 11. Platform-specific ragebait (NEW)
      linkedInHumbleBrag: { regex: /\b(grateful|honored|humbled|blessed).*\b(announce|share|thrilled)\b/gi, weight: 0.2, name: "LinkedIn humble brag" },
      redditAwardsBait: { regex: /\b(edit:|thanks for the gold|obligatory|first time posting)\b/gi, weight: 0.15, name: "Reddit awards bait" },
      youtubeComment: { regex: /\b(who's watching|first comment|notification squad|anyone here from)\b/gi, weight: 0.2, name: "YouTube comment spam" },
      tikTokSpeak: { regex: /\b(no because|not me|the way that|POV:|storytime)\b/gi, weight: 0.15, name: "TikTok speak" },
      stanCulture: { regex: /\b(mother|queen|king|slay|ate that|serving|periodt)\b/gi, weight: 0.1, name: "Stan culture" },
      
      // 12. Crypto/NFT bro language (NEW)
      cryptoBro: { regex: /\b(to the moon|hodl|diamond hands|paper hands|buy the dip|ngmi|wagmi|few understand)\b/gi, weight: 0.25, name: "Crypto bro speak" },
      nftHype: { regex: /\b(discord|WL|mint|roadmap|utility|community|gm|ser)\b.*\b(dropping|launching)\b/gi, weight: 0.2, name: "NFT hype language" },
      
      // 13. Gaming toxicity (NEW)
      gamingToxic: { regex: /\b(ggez|git gud|trash|garbage|uninstall|kys|kill yourself|ez pz)\b/gi, weight: 0.35, name: "Gaming toxicity" },
      rageQuitVibe: { regex: /\b(this game is rigged|broken|devs are|unplayable|refund)\b/gi, weight: 0.25, name: "Rage quit energy" },
      
      // 14. Corporate speak (NEW)
      corporateNonsense: { regex: /\b(synergy|leverage|paradigm|circle back|moving forward|touch base|best practice)\b/gi, weight: 0.15, name: "Corporate buzzwords" },
      hustleCulture: { regex: /\b(grind|hustle|5am|sigma|alpha|rise and grind|boss mindset)\b/gi, weight: 0.2, name: "Hustle culture" },
      
      // 15. Fake news indicators (NEW)
      fakeNewsFlags: { regex: /\b(my cousin's friend|trust me bro|do your own research|big pharma|mainstream)\b/gi, weight: 0.3, name: "Fake news indicators" },
      anecdoteAsData: { regex: /\b(i know someone|my friend's|happened to me|i've seen)\b.*\b(proves|shows|means)\b/gi, weight: 0.25, name: "Anecdote as data" },
      
      // 16. Sealioning/persistence (NEW)
      sealioning: { regex: /\b(sources\?|got any proof|evidence\?|just asking|simply curious|devil's advocate)\b/gi, weight: 0.2, name: "Sealioning" },
      badFaithDebate: { regex: /\b(but technically|actually|to be fair|not all|what about)\b.*\?/gi, weight: 0.15, name: "Bad faith debate" },
      
      // 17. Self-promotion spam (NEW)
      selfPromo: { regex: /\b(check out my|subscribe|follow me|link in bio|promo code|use my code)\b/gi, weight: 0.2, name: "Self promotion" },
      engagementFarming: { regex: /\b(drop a|comment your|reply with|let's see)\b.*\b(below|in comments)\b/gi, weight: 0.25, name: "Engagement farming" },
      
      // 18. Repost/callout culture (NEW)
      repostShaming: { regex: /\b(repost|seen this|posted yesterday|original content|stealing)\b/gi, weight: 0.15, name: "Repost shaming" },
      gatekeeping: { regex: /\b(not a real|fake fan|only true|if you really|real ones know)\b/gi, weight: 0.25, name: "Gatekeeping" },
      
      // 19. Historical revisionism (NEW)
      historyRewrite: { regex: /\b(actually happened|the truth about|history books won't|they don't teach)\b/gi, weight: 0.3, name: "Historical revisionism" },
      lostCause: { regex: /\b(state's rights|heritage not hate|different times|both sides)\b/gi, weight: 0.35, name: "Lost cause rhetoric" },
      
      // 20. Threats/doxxing hints (NEW)
      veiledThreats: { regex: /\b(watch your back|better hope|would be a shame|someone should|i know where)\b/gi, weight: 0.4, name: "Veiled threats" },
      doxxingHints: { regex: /\b(found your|i know|your address|where you live|your workplace)\b/gi, weight: 0.45, name: "Doxxing indicators" },
    };
    
    // Sentiment intensifiers that multiply scores
    this.intensifiers = {
      literally: { regex: /\bliterally\b/gi, multiplier: 1.2 },
      actually: { regex: /\bactually\b/gi, multiplier: 1.1 },
      honestly: { regex: /\bhonestly\b/gi, multiplier: 1.1 },
      seriously: { regex: /\bseriously\b/gi, multiplier: 1.15 },
    };
  }

  classify(text) {
    let score = 0;
    const reasons = [];
    const details = [];
    
    // Check each pattern
    for (const [key, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern.regex);
      if (matches) {
        score += pattern.weight;
        if (!reasons.includes(pattern.name)) {
          reasons.push(pattern.name);
          details.push({ pattern: pattern.name, weight: pattern.weight, matches: matches.length });
        }
      }
    }
    
    // Apply intensifiers
    let multiplier = 1.0;
    for (const [key, intensifier] of Object.entries(this.intensifiers)) {
      if (intensifier.regex.test(text)) {
        multiplier *= intensifier.multiplier;
      }
    }
    score *= multiplier;
    
    const words = text.split(/\s+/).filter(w => w.length > 0);
    
    // Message length heuristics
    if (words.length <= 3 && score > 0.15) {
      score += 0.15;
      reasons.push("Very short + charged");
    } else if (words.length <= 8 && score > 0.2) {
      score += 0.1;
      reasons.push("Short + angry");
    }
    
    // Long rant detection
    if (words.length > 150 && score > 0.25) {
      score += 0.15;
      reasons.push("Extended rant");
    } else if (words.length > 80 && score > 0.3) {
      score += 0.1;
      reasons.push("Long rant");
    }
    
    // Repetition detection
    const wordFreq = {};
    words.forEach(w => {
      const lower = w.toLowerCase().replace(/[^a-z]/g, '');
      if (lower.length > 3) {
        wordFreq[lower] = (wordFreq[lower] || 0) + 1;
      }
    });
    const repeatedWords = Object.entries(wordFreq).filter(([w, c]) => c > 2);
    if (repeatedWords.length > 0 && score > 0.2) {
      score += 0.1;
      reasons.push("Repetition (agitation)");
    }
    
    // Cap at 1.0
    score = Math.min(score, 1.0);
    
    // Determine category with nuanced thresholds
    let category;
    if (score < 0.15) category = "none";
    else if (score < 0.35) category = "low";
    else if (score < 0.55) category = "medium";
    else if (score < 0.75) category = "high";
    else category = "extreme";
    
    return { 
      score, 
      reasons, 
      category,
      details,
      wordCount: words.length,
      intensifier: multiplier > 1.0 ? `x${multiplier.toFixed(2)}` : null
    };
  }
  
  // Get breakdown for detailed analysis
  getBreakdown(text) {
    const result = this.classify(text);
    return {
      ...result,
      patterns: result.details,
      topTriggers: result.reasons.slice(0, 5),
    };
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
const messageStats = { total: 0, flagged: { low: 0, medium: 0, high: 0, extreme: 0 } };

client.on('ready', () => {
  console.log(`🤖 ${client.user.tag} is online with 30+ ragebait detectors`);
  console.log(`📊 Monitoring ${monitoredChannels.size} channels`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Command handling
  if (message.content.startsWith('!')) {
    const args = message.content.slice(1).split(/\s+/);
    const command = args.shift().toLowerCase();

    if (command === 'monitor') {
      monitoredChannels.add(message.channel.id);
      await message.reply(`🔍 Now monitoring ${message.channel} for ragebait (30+ features)`);
      return;
    }

    if (command === 'unmonitor') {
      monitoredChannels.delete(message.channel.id);
      await message.reply(`🛑 Stopped monitoring ${message.channel}`);
      return;
    }

    if (command === 'check') {
      const text = args.join(' ');
      if (!text) {
        await message.reply('❌ Provide text: `!check <text>`');
        return;
      }
      
      const result = classifier.getBreakdown(text);
      
      let color = 0x00ff00;
      if (result.category === 'medium') color = 0xffa500;
      else if (result.category === 'high') color = 0xff0000;
      else if (result.category === 'extreme') color = 0x8b0000;

      const embed = new EmbedBuilder()
        .setTitle('🎯 Ragebait Analysis v2.0')
        .setDescription(`Score: **${result.score.toFixed(3)}** / 1.0`)
        .setColor(color)
        .addFields(
          { name: 'Category', value: result.category.toUpperCase(), inline: true },
          { name: 'Words', value: String(result.wordCount), inline: true },
          { name: 'Triggers', value: String(result.reasons.length), inline: true }
        );
      
      if (result.topTriggers.length > 0) {
        embed.addFields({
          name: 'Top Indicators',
          value: result.topTriggers.map((r, i) => `${i+1}. ${r}`).join('\n'),
          inline: false
        });
      }
      
      if (result.intensifier) {
        embed.addFields({ name: 'Intensifier', value: result.intensifier, inline: true });
      }
      
      await message.reply({ embeds: [embed] });
      return;
    }

    if (command === 'stats') {
      const channels = Array.from(monitoredChannels).map(id => `<#${id}>`);
      const embed = new EmbedBuilder()
        .setTitle('📊 Ragebait Monitor Stats')
        .addFields(
          { name: 'Monitored Channels', value: channels.join('\n') || 'None', inline: false },
          { name: 'Messages Processed', value: String(messageStats.total), inline: true },
          { name: 'Flagged Messages', value: String(
            messageStats.flagged.low + 
            messageStats.flagged.medium + 
            messageStats.flagged.high +
            messageStats.flagged.extreme
          ), inline: true }
        );
      await message.reply({ embeds: [embed] });
      return;
    }
    
    if (command === 'features') {
      const embed = new EmbedBuilder()
        .setTitle('🔧 Ragebait Detection Features (30+)')
        .setDescription('Categories of ragebait detection')
        .addFields(
          { name: '1. Formatting', value: 'ALL CAPS, punctuation spam, ellipsis abuse, emphasis', inline: true },
          { name: '2. Emotional', value: 'Outrage words, victim framing, guilt tripping, fear mongering', inline: true },
          { name: '3. Divisive', value: 'Partisan triggers, identity attacks, generation bashing', inline: true },
          { name: '4. Clickbait', value: 'Curiosity gaps, listicles, false urgency, sensational numbers', inline: true },
          { name: '5. Conspiracy', value: 'Rhetoric, censorship claims, source attacks, whataboutism', inline: true },
          { name: '6. Engagement', value: 'Callout bait, challenge bait, superiority bait', inline: true },
          { name: '7. Attacks', value: 'Ad hominem, dismissive slang, dehumanizing', inline: true },
          { name: '8. Punctuation', value: 'Emoji spam, laughing at others', inline: true },
          { name: '9. Assertions', value: 'Absolute statements, unverifiable claims', inline: true },
          { name: '10. Drama', value: 'Vaguebooking, subtweets, martyrdom', inline: true }
        )
        .setFooter({ text: 'Plus: length heuristics, repetition detection, intensifier multipliers' });
      await message.reply({ embeds: [embed] });
      return;
    }

    return;
  }

  // Monitoring
  if (!monitoredChannels.has(message.channel.id)) return;

  messageStats.total++;
  const result = classifier.classify(message.content);

  // React based on category
  const reactions = {
    none: null,
    low: '🤔',
    medium: '⚠️',
    high: '🚩',
    extreme: '🔥'
  };

  if (reactions[result.category]) {
    await message.react(reactions[result.category]);
    messageStats.flagged[result.category]++;
  }
  
  // Optional: DM for extreme cases
  // if (result.category === 'extreme') {
  //   await sendAnalysis(message, result);
  // }
});

async function sendAnalysis(message, result) {
  const embed = new EmbedBuilder()
    .setTitle('🔥 Extreme Ragebait Detected')
    .setDescription(`Score: ${result.score.toFixed(3)} / 1.0`)
    .setColor(0x8b0000)
    .addFields(
      { name: 'Author', value: message.author.tag, inline: true },
      { name: 'Channel', value: message.channel.name, inline: true },
      { name: 'Indicators', value: result.reasons.slice(0, 5).join('\n• '), inline: false }
    );
  
  // Could log to a mod channel
  console.log('EXTREME:', message.content.substring(0, 100));
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
