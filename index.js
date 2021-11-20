// Discord Bot for Maunulan yhteiskoulu
const Discord = require("discord.js");
const {
  Client,
  MessageEmbed,
  Intents,
  MessageActionRow,
} = require("discord.js");
const config = require("./config.json");
const fs = require("fs");

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

// Cooldowns
const cooldowns = new Discord.Collection();

// On Ready
client.once("ready", () => {
  console.log(`${client.user.username} is ready!`);
  //   set custom status
  client.user.setStatus("idle");
  client.user.setActivity("Maunulan yhteiskoulu", {
    type: "WATCHING",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  });
});

// On Message
client.on("messageCreate", (message) => {
  config.prefix.toLowerCase();
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
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs!");
  }

  // Check if args are required
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author.username}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Check if user is in cooldown
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
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
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    // Execute command
    try {
      command.execute(message, args, command);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  }
});

client.login(config.token);
