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
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const analyzeText = require("./functions/analyzeText");

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
const guildId = config.acceptedGuilds;

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

// On User Join
client.on("guildMemberAdd", (member) => {
  // Check if member is in accepted guilds
  if (!guildId.includes(member.guild.id)) return;
  else {
    const welcomeEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setAuthor(member.user.tag, member.user.displayAvatarURL())
      .setTitle("Tervetuloa Maunulan Yhteiskoulun Serveriin!")
      .setDescription(
        `Tervetuloa <@${member.user.id}>!\n` +
          `Lue säännöt ennen kuin lähdet keskusteluun!\n` +
          `<#913033790778134561>`
      )
      .setFooter(`${member.guild.name} | ${member.guild.memberCount} jäsentä`)
      .setTimestamp();

    console.log(`${member.user.username} joined the server!`);
    try {
      const channel = member.guild.channels.cache.find(
        (ch) => ch.name.includes("tervetuloa") || ch.name.includes("welcome")
      );

      if (!channel) {
        `No such channel in ${member.guild.name}`;
      }
      channel.send({
        content: `<@${member.user.id}>`,
        embeds: [welcomeEmbed],
      });

      member.roles.add(
        // find role by name
        member.guild.roles.cache.find(
          (role) => role.name.includes("Jäsen") || role.name.includes("Member")
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
});

// On User Leave
client.on("guildMemberRemove", (member) => {
  const leaveEmbed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTitle("Poistunut")
    .setDescription(`<@${member.user.id}> poistui serveriltä.`)
    .setTimestamp();

  console.log(`${member.user.username} left the server!`);
  try {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name.includes("tervetuloa") || ch.name.includes("welcome")
    );

    if (!channel) {
      `No such channel in ${member.guild.name}`;
    }
    channel.send({
      embeds: [leaveEmbed],
    });
  } catch (error) {
    console.log(error);
  }
});

// On Message
client.on("messageCreate", (message) => {
  // include commands in lower and upper case
  message.content = message.content.toLowerCase();

  if (
    message.content.includes("discord.gg") ||
    message.content.includes("discordapp.com/invite")
  ) {
    message.delete();
    message.reply(
      `:x: Ei ole sallittuja linkkejä.\n` + `Komento: ${command.name}`
    );
    return;
  }

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (
    message.content.startsWith(config.prefix) &&
    message.content.length === config.prefix.length
  ) {
    message.reply(`:x: Et ole syöttänyt mitään komentoa!`);
    return;
  } else if (message.content.startsWith(config.prefix) && !command) {
    message.reply(`:x: Komentoa ei ole olemassa. Tarkista kirjoitusasu.`);
    return;
  }

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
    return message.reply(`:x: Sinulla ei ole oikeuksia käyttää tätä komentoa!`);
  }

  // Check if dev command
  if (command.dev === true && message.author.id !== config.devId) {
    return message.reply(`:x: Tämä komento on vain kehittäjille!`);
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
      command.execute(message, args, command, config, client, fetch, config);
    } catch (error) {
      console.error(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
    }
  }
});

// On Interaction
client.on("interactionCreate", (interaction) => {
  if (interaction.type === "MESSAGE_REACTION_ADD") {
    const message = interaction.message;
    const emoji = interaction.emoji;
    const user = interaction.user;

    if (user.id === client.user.id) return;

    if (emoji.name === "🔄") {
      message.channel.messages.fetch(message.id).then((msg) => {
        msg.reactions.removeAll();
      });
    }
  }

  if (interaction.type === "MESSAGE_REACTION_REMOVE") {
    const message = interaction.message;
    const emoji = interaction.emoji;
    const user = interaction.user;

    if (user.id === client.user.id) return;

    if (emoji.name === "🔄") {
      message.channel.messages.fetch(message.id).then((msg) => {
        msg.reactions.removeAll();
      });
    }
  }

  if (interaction.type === "APPLICATION_COMMAND") {
    const command = interaction.command;
    const message = interaction.message;
    const args = interaction.args;
    const user = interaction.user;
  }
});

client.login(config.token);
