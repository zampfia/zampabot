import { REST, Routes } from "discord.js"
import { commands } from "./commands"
import { config } from "./config"

const commandsData = Object.values(commands).map((command) => command.data)

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN)

export async function deployCommands() {
    try {
        await rest.put(Routes.applicationCommands(config.DISCORD_CLIENT_ID), {
            body: commandsData,
        })
    } catch (error) {
        console.error(error)
    }
}
