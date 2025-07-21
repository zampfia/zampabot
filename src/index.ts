import { config } from "./config";
import { Client } from "discord.js";
import { deployCommands } from "./registerCommands";
import { commands } from "./commands";
import { loadConfig } from "./config/load";
import { logger } from "./log";

export const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildVoiceStates",
        "DirectMessages",
        "MessageContent",
        "GuildModeration",
    ],
});

client.on("ready", async () => {
    logger.info("Setting Up...");
    logger.debug("Deploying slash commands...");
    await deployCommands();
    logger.info("Deployed slash commands");
    logger.debug("Loading configs...");
    const guilds = Array.from(client.guilds.cache.values());
    for (let i = 0; i < guilds.length; i++) {
        await loadConfig(guilds[i]);
    }
    logger.info("Loaded configs");
    logger.info("Ready");
});

client.on("guildCreate", async (guild) => {
    await deployCommands();
    await loadConfig(guild);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    logger.info(
        `[${interaction.guild?.name}] ${interaction.user.username}: ${interaction.commandName}`,
    );
    interaction.command?.options.forEach((value) => {
        logger.info(`${value.name}: ${value.type} = ${value.description}`);
    });
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);
