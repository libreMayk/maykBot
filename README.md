# maykBot v1.1.0

Please notice that this bot is still in development, so it may not work as expected. If you want to contribute, please feel free to fork the repository and make a pull request.

## Purpose

The purpose of this bot is to provide information about the school like weather, info about buses and food menu. If you have any questions, feel free to open an issue!

## Usage and commands

Some commands are available to the bot. You can use the following commands:

- `m!hsl`: Returns available bus stops around the school.
- `m!ruoka`: Returns the food menu this week.
- `m!covid`: Returns the latest COVID-19 statistics in Finland.
- `m!yle`: Returns latest news from Yle.
- `m!weather`: Returns the weather in Maunula.
- `m!help`: Returns information about commands.

## Installation

To use the bot, you need to add the `.env` file:

```dotenv
WEATHER_API_KEY=<your-openweathermap-api-key>
HSL_KEY=<your-hsl-api-key>
DEV_ID=<most-likely-your-discord-user-id>
DISCORD_TOKEN=<your-bot-token>
ACCEPTED_GUILDS=<your-server-id>
PREFIX=<bot-prefix>
```

**And** install all necessary `node_modules`; just run `npm install`

Then you should be done! Thanks for using maykBot!

### Examples (images)

[HSL Embed](/github/screenshots/hsl-ss.png)
[Covid Embed](/github/screenshots/covid-ss.png)
