import { config } from "./config"
import { Client } from "discord.js"
import { deployCommands } from "./registerCommands"
import { commands } from "./commands"
import { loadConfig } from "./config/load"

export const client = new Client({
    intents: [
        "Guilds",
        "GuildMembers",
        "GuildVoiceStates",
        "DirectMessages",
        "MessageContent",
    ],
})

client.on("ready", async () => {
    console.log("Setting up...")
    console.log("Deploying slash commands...")
    await deployCommands()
    console.log("Deployed slash commands")
    console.log("Loading configs...")
    const guilds = Array.from(client.guilds.cache.values())
    for (let i = 0; i < guilds.length; i++) {
        await loadConfig(guilds[i])
    }
    console.log("Loaded configs")
    console.log("Ready")
})

client.on("guildCreate", async (guild) => {
    await deployCommands()
    await loadConfig(guild)
})

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return
    }

    const { commandName } = interaction
    console.log(
        `[${interaction.guild?.name}] ${interaction.user.username}: ${commandName}`
    )
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction)
    }
})

client.login(config.DISCORD_TOKEN)
