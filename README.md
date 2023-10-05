# discord-1ncursio-bot

`discord-1ncursio-bot` is a Discord bot written in TypeScript using the [discord.js](https://discord.js.org/#/) library.

## Commands

`discord-1ncursio-bot` has a number of commands that can be used to interact with the bot.

### Cleaner

`Cleaner` is a command that will delete a specified number of messages in a channel.

```bash
/cleaner <amount>
```

### Auto Cleaner

`Auto Cleaner` is a command that will automatically delete messages in a channel after a specified amount of time.

```bash
/autocleaner set <channel-id> <interval>
/autocleaner remove <channel-id>
```

### Channel Activity

`Channel Activity` is a command that will automatically track the activity of a voice channel when a user joins or leaves the voice channel.

```bash
/channelactivity set <channel-id>
/channelactivity remove <channel-id>
```
