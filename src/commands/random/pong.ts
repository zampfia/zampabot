import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("pong")
    .setDescription("POOOOOOOOOOOOOOOOOOOOONG")

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("ping")
}
