# Ragebait Classifier Bot

Discord bot that automatically detects and flags ragebait messages.

## Features

- 🤖 Real-time message classification
- 📊 Scoring system (0-1.0 scale)
- 🏷️ Categories: none, low (🤔), medium (⚠️), high (🚩)
- 🔧 Per-channel monitoring
- 📈 Built-in analysis commands

## Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up Discord bot:**
   - Go to https://discord.com/developers/applications
   - Click "New Application" → name it → "Bot" tab → "Add Bot"
   - Enable "Message Content Intent" (IMPORTANT!)
   - Copy the token

3. **Configure:**
```bash
cp .env.example .env
# Edit .env and paste your token:
# DISCORD_TOKEN=your_token_here
```

4. **Invite bot to server:**
   - OAuth2 → URL Generator
   - Scopes: `bot`
   - Bot Permissions: `Send Messages`, `Add Reactions`, `Read Message History`
   - Copy URL, paste in browser, select server

5. **Run:**
```bash
npm start
```

## Commands

| Command | Description |
|---------|-------------|
| `!monitor` | Start monitoring current channel |
| `!unmonitor` | Stop monitoring current channel |
| `!check <text>` | Analyze specific text |
| `!stats` | Show monitoring status |

## Ragebait Detection

The bot detects:
- **ALL CAPS** yelling
- **Excessive punctuation** (!!!, ???)
- **Outrage keywords** (disgusting, pathetic, horrible)
- **Clickbait phrases** ("you won't believe", etc.)
- **Divisive generalizations** ("all X are Y")
- **Extreme language** (always, never, worst)
- **Direct insults**
- **Bait questions**
- **Emoji spam** (🔥💀😂)

## Scoring

| Score | Category | Reaction |
|-------|----------|----------|
| 0.0-0.2 | None | None |
| 0.2-0.4 | Low | 🤔 |
| 0.4-0.6 | Medium | ⚠️ |
| 0.6+ | High | 🚩 |

## Development

```bash
npm run dev  # Run with nodemon (auto-restart)
```

## License

MIT
