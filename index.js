const Discord = require("discord.js");
const {
  Client,
  MessageEmbed,
  Intents,
  MessageActionRow,
} = require("discord.js");

const status = require("./test/json/status.json");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const prettySeconds = require("./my-modules/pretty-seconds-suomi");
const dotenv = require("dotenv").config();
const colors = require("colors");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const client = new Discord.Client({
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION", "USER", "GUILD_MEMBER"],
});
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/` + file);
  client.commands.set(command.name, command);
}

const clientId = "911661457249280021";
const guildId = process.env.ACCEPTED_GUILDS;

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

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

client.once("ready", () => {
  console.log(`${client.user.username}`.rainbow + ` is ready!`);

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

client.on("guildMemberAdd", (member) => {
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
        member.guild.roles.cache.find(
          (role) => role.name.includes("Jäsen") || role.name.includes("Member")
        )
      );
    } catch (error) {
      console.log(error);
    }
  }
});

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

client.on("messageCreate", (message) => {
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

  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;

  const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (
    message.content.startsWith(process.env.PREFIX) &&
    message.content.length === process.env.PREFIX.length
  ) {
    message.reply(`:x: Et ole syöttänyt mitään komentoa!`);
    return;
  } else if (message.content.startsWith(process.env.PREFIX) && !command) {
    message.reply(`:x: Komentoa ei ole olemassa. Tarkista kirjoitusasu.`);
    return;
  }

  if (!command) return;

  if (
    command.guildOnly &&
    message.channel.type !== "text" &&
    !message.guildId
  ) {
    return message.reply("Et voi käyttää tämän komennon YVssä!");
  }

  if (command.args && !args.length) {
    let reply = `, ${message.author.username}!`;

    if (command.usage) {
      reply += `\nOikea komennon käyttö olisi: \`${process.env.PREFIX}${
        command.usage === "" ? command.name : command.name + " " + command.usage
      }\``;
    }
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  if (
    command.adminPermOverride === true &&
    !message.member.permissions.has(!Discord.Permissions.FLAGS.ADMINISTRATOR)
  ) {
    return message.reply(`:x: Sinulla ei ole oikeuksia käyttää tätä komentoa!`);
  }

  if (command.dev === true && message.author.id !== process.env.DEV_ID) {
    return message.reply(`:x: Tämä komento on vain kehittäjille!`);
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
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

    try {
      if (args[0] === "--usage" || args[0] === "-u") {
        if (command.usage) {
          message.channel.send(
            `Komennon käyttö: \`${process.env.PREFIX}${
              command.usage === ""
                ? command.name
                : command.name + " " + command.usage
            }\``
          );
          command.cooldown = 0;
          return;
        } else {
          message.channel.send(
            `Komennon käyttö: \`${process.env.PREFIX}${command.name}\``
          );
          command.cooldown = 0;
          return;
        }
      } else if (
        args[0] === "--description" ||
        args[0] === "--desc" ||
        args[0] === "-d"
      ) {
        message.channel.send(
          `Käyttö: \`${process.env.PREFIX}${
            command.usage === ""
              ? command.name
              : command.name + " " + command.usage
          }\`\n\nKomennon kuvaus: \`${command.description}\``
        );
        command.cooldown = 0;
        return;
      } else if (args[0] === "--alias" || args[0] === "-a") {
        if (command.aliases) {
          message.channel.send(
            `Käyttö: \`${process.env.PREFIX}${command.name} ${
              command.usage
            }\`\n\nAliakset: \`${command.aliases.join("`, `")}\``
          );
          command.cooldown = 0;
          return;
        } else {
          message.channel.send(
            `Käyttö: \`${process.env.PREFIX}${
              command.usage === ""
                ? command.name
                : command.name + " " + command.usage
            }\`\n\nEi aliasia.`
          );
          command.cooldown = 0;
          return;
        }
      } else if (args[0] === "--cooldown" || args[0] === "-c") {
        message.channel.send(
          `Käyttö: \`${process.env.PREFIX}${
            command.usage === ""
              ? command.name
              : command.name + " " + command.usage
          }\`\n\nKomennon cooldown on ${command.cooldown} sekuntia.`
        );
        command.cooldown = 0;
        return;
      } else if (args[0] === "--help" || args[0] === "-h") {
        message.channel.send(
          `Käyttö: \`${process.env.PREFIX}${
            command.usage === ""
              ? command.name
              : command.name + " " + command.usage
          }\`\n${
            command.cooldown === 0
              ? ""
              : `\nCooldown: ${command.cooldown} sekuntia.`
          }\nKäyttö: \`${process.env.PREFIX}${command.name} ${
            command.usage
          }\`\nAliakset: \`${
            command.aliases ? command.aliases.join("`, `") : "Ei aliaksia."
          }\`\nKuvaus: \`${
            command.description ? command.description : "Ei kuvausta."
          }\``
        );
        command.cooldown = 0;
        return;
      } else {
        command.execute(message, args, command, client, fetch);
      }
    } catch (error) {
      console.error(error);
      message.reply(`:x: **Tapahtui virhe:**\n\`${error}\``);
    }
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.type === "APPLICATION_COMMAND") {
    let message = interaction.message;
    const args = interaction.args;
    const user = interaction.user;

    const { commandName } = interaction;

    interaction.reply(
      `ID: \`${interaction.id}\`\nKäyttäjä: \`${user.tag}\`\nKanava: \`${interaction.channel.name}\``
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
