# maykBot

Please notice that this bot is still in development, so it may not work as expected. If you want to contribute, please feel free to fork the repository and make a pull request.

## Purpose

The purpose of this bot is to provide information about the school, the school's events and the school's projects. For example, you can ask the bot about the school's events, it will respond with the most recent events. You can also ask for the food menu, it will return the menu. If you have any questions, feel free to ask us at [libremayk.fi](https://libremayk.fi). _`still in development`_

## Usage and commands

Some commands are available to the bot. You can use the following commands:

- `m!hsl`: Returns available bus stops around the school.
- `m!ruoka`: Returns the food menu this week.
- `m!covid`: Returns the latest COVID-19 statistics in Finland.
- `m!yle`: Returns latest news from Yle.
- `m!weather`: Returns the weather in Maunula.

## Installation

To use the bot, you only need to add the `.env` file:

```dotenv
WEATHER_API_KEY=<your-openweathermap-api-key>
HSL_KEY=<your-hsl-api-key>
DEV_ID=<most-likely-your-discord-user-id>
DISCORD_TOKEN=<your-bot-token>
ACCEPTED_GUILDS=<your-server-id>
PREFIX=<bot-prefix>
```

And of course, install all the node modules in the `node_modules` folder. Check `package.json` file for more information about the dependencies.

### Examples (images)

[HSL Embed](/github/screenshots/hsl-ss.png)
[Covid Embed](/github/screenshots/covid-ss.png)
