# Ragebait Classifier Bot v2.0

Discord bot that automatically detects and flags ragebait messages using 30+ detection features.

## Features

- 🤖 **30+ ragebait detectors** across 10 categories
- 📊 **Scoring system** (0-1.0 scale with multipliers)
- 🏷️ **5 categories**: none, low (🤔), medium (⚠️), high (🚩), extreme (🔥)
- 🔧 **Per-channel monitoring**
- 📈 **Statistics tracking**
- 🎯 **Detailed analysis** with breakdown

## Quick Start

```bash
git clone https://github.com/jackpopenclaw/ragebait-classifier.git
cd ragebait-classifier
npm install
# Create .env with your DISCORD_TOKEN
npm start
```

## Discord Bot Setup

1. Go to https://discord.com/developers/applications
2. New Application → Bot tab → Add Bot
3. **Enable "Message Content Intent"** (required!)
4. Copy token → paste in `.env`
5. OAuth2 → URL Generator → `bot` scope → permissions: `Send Messages`, `Add Reactions`, `Read Message History`
6. Invite to your server

## Commands

| Command | Description |
|---------|-------------|
| `!monitor` | Start monitoring current channel |
| `!unmonitor` | Stop monitoring current channel |
| `!check <text>` | Analyze specific text with breakdown |
| `!stats` | Show monitoring statistics |
| `!highscore` | Show current ragebait high score champion |
| `!features` | List all 50+ detection features |

## Detection Categories (50+ Features)

### 1. Formatting-Based
- ALL CAPS screaming
- Exclamation/question spam
- Dramatic ellipsis abuse
- Mixed punctuation chaos
- Forced emphasis

### 2. Emotional Manipulation
- Outrage vocabulary
- Victim framing
- Moral superiority
- Guilt tripping
- Fear mongering

### 3. Divisive Content
- Partisan triggers
- Identity attacks
- Generation bashing
- Us vs them framing

### 4. Clickbait Patterns
- Curiosity gaps ("you won't believe")
- Listicle bait
- False urgency
- Sensational numbers

### 5. Conspiracy/Rhetoric
- Conspiracy keywords
- Censorship claims
- Source dismissal
- Whataboutism

### 6. Aggressive Engagement
- Callout bait ("tag someone")
- Challenge bait ("prove me wrong")
- Superiority bait ("only real fans")

### 7. Direct Attacks
- Ad hominem attacks
- Dismissive slang (cope, seethe, L+bozo)
- Dehumanizing language

### 8. Emotional Punctuation
- Emoji spam
- Laughing at someone

### 9. Questionable Assertions
- Absolute statements ("literally all")
- Unverifiable claims

### 10. Drama Indicators
- Vaguebooking
- Subtweet style
- Martyrdom complex

### 11. Platform-Specific (NEW)
- LinkedIn humble brags
- Reddit awards bait
- YouTube comment spam
- TikTok speak
- Stan culture language

### 12. Crypto/NFT Culture (NEW)
- Crypto bro speak (to the moon, diamond hands)
- NFT hype language (WL, mint, utility)

### 13. Gaming Toxicity (NEW)
- Gaming toxicity (ggez, git gud, kys)
- Rage quit energy

### 14. Corporate Speak (NEW)
- Corporate buzzwords (synergy, leverage, paradigm)
- Hustle culture (grind, sigma, alpha)

### 15. Fake News Indicators (NEW)
- Fake news flags ("trust me bro", "big pharma")
- Anecdote presented as data

### 16. Bad Faith Engagement (NEW)
- Sealioning ("just asking questions")
- Bad faith debate tactics

### 17. Self-Promotion Spam (NEW)
- Self promotion spam
- Engagement farming

### 18. Callout Culture (NEW)
- Repost shaming
- Gatekeeping ("fake fan", "real ones know")

### 19. Historical Revisionism (NEW)
- History rewrite attempts
- Lost cause rhetoric

### 20. Threat Indicators (NEW)
- Veiled threats
- Doxxing hints

### Bonus Heuristics
- Message length analysis (short angry vs long rant)
- Repetition detection (agitation indicator)
- Intensifier multipliers (literally, actually, seriously)

## Scoring System

| Score | Category | Reaction |
|-------|----------|----------|
| 0.00-0.15 | none | — |
| 0.15-0.35 | low | 🤔 |
| 0.35-0.55 | medium | ⚠️ |
| 0.55-0.75 | high | 🚩 |
| 0.75+ | extreme | 🔥 |

Weights stack additively, then intensifier multipliers apply.

## Example Outputs

**Low:**
```
Score: 0.234 / 1.0
Category: LOW
Indicators:
• Exclamation spam
• Short + angry
```

**Extreme:**
```
Score: 0.891 / 1.0  
Category: EXTREME
Indicators:
• Partisan trigger (x1.2)
• ALL CAPS screaming
• Fear mongering
• Ad hominem attack
• Dehumanizing language
```

## Special Features

### 🐱 ASCII Art Responses
When high or extreme ragebait is detected, the bot replies with a giant ASCII cat!

### 🏆 High Score Tracking
The bot tracks the highest ragebait score ever achieved:
- Use `!highscore` to see the current champion
- Beat the high score and get **TRIPLE ASCII ART** as a reward
- High scores persist between restarts (saved to `highscore.json`)

**New High Score Notification:**
```
🏆 NEW RAGEBAIT HIGH SCORE! 🏆
Score: 0.987/1.0 (Previous: 0.923)

🐱 TRIPLE ASCII ART FOR THE CHAMPION:
[ASCII art x3]

👑 Congratulations @User! You've achieved the most ragebait message ever recorded!
```

## Development

```bash
npm run dev  # Auto-restart on changes
```

## License

MIT
