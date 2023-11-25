import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("POOOOOOOOOOOOOOOOOOOOONG")

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("pong")
}
