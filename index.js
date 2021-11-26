// Discord Bot for Maunulan yhteiskoulu
const Discord = require("discord.js");
const {
  Client,
  MessageEmbed,
  Intents,
  MessageActionRow,
} = require("discord.js");
const config = require("./config.json");
const status = require("./json/status.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const prettySeconds = require("./my-modules/pretty-seconds-suomi");
const dotenv = require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");

const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});
client.commands = new Discord.Collection();

// Take commands
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/` + file);
  client.commands.set(command.name, command);
}

const clientId = "911661457249280021";
const guildId = config.acceptedGuilds[1];

const rest = new REST({ version: "9" }).setToken(config.token);

// Cooldowns
const cooldowns = new Discord.Collection();

const maykStatus = setInterval(() => {
  client.user.setActivity(
    `${status.statuses[Math.floor(Math.random() * status.statuses.length)]}`,
    {
      type: `STREAMING`,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    }
  );
}, 5000);

// On Ready
client.once("ready", () => {
  console.log(`${client.user.username} is ready!`);
  //   set custom status
  client.user.setStatus("idle");
  maykStatus;

  (async () => {
    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(clientId), {
        body: client.commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  })();
});

// On Message
client.on("messageCreate", (message) => {
  message.content.toLowerCase();
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // If command exist
  if (!command) return;

  // Check if command can be executed in DM
  if (
    command.guildOnly &&
    message.channel.type !== "text" &&
    !message.guildId
  ) {
    return message.reply("Et voi käyttää tämän komennon YVssä!");
  }

  // Check if args are required
  if (command.args && !args.length) {
    let reply = `, ${message.author.username}!`;

    if (command.usage) {
      reply += `\nOikea komennon käyttö olisi: \`${config.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Check if user is in cooldown
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  // Check if user has permission
  if (
    command.adminPermOverride === true &&
    !message.member.permissions.has(!Discord.Permissions.FLAGS.ADMINISTRATOR)
  ) {
    return message.reply(`Sinulla ei ole oikeuksia käyttää tätä komentoa!`);
  }

  // Check if dev command
  if (command.dev === true && message.author.id !== config.devId) {
    return message.reply(`Tämä komento on vain kehittäjille!`);
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      // If user is in cooldown
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `Odota vielä ${
          prettySeconds(timeLeft) + prettySeconds(timeLeft.toFixed(1))
        } ennen kun käytät \`${command.name}\` komennon.`
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // Execute command
    try {
      command.execute(message, args, command, config, client);
    } catch (error) {
      console.error(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
    }
  }
});

client.login(config.token);
