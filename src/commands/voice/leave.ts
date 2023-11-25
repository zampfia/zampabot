import { VoiceConnectionStatus, getVoiceConnection } from "@discordjs/voice"
import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Lascia il canale corrente")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    const connection = getVoiceConnection(interaction.guildId!)
    if (
        connection === undefined ||
        connection?.state.status === VoiceConnectionStatus.Destroyed ||
        connection?.state.status === VoiceConnectionStatus.Disconnected
    ) {
        return interaction.reply({
            content: "Non sono in nessun canale",
            ephemeral: true,
        })
    }
    connection?.destroy()
    return interaction.reply({
        content: "Uscito dal canale corrente",
        ephemeral: true,
    })
}
