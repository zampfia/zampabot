import {
    CommandInteraction,
    GuildMember,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"
import {
    VoiceConnectionStatus,
    entersState,
    joinVoiceChannel,
} from "@discordjs/voice"

export const data = new SlashCommandBuilder()
    .setName("join")
    .setDescription("Unisciti al canale corrente")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    if ((<GuildMember>interaction.member).voice.channel === null) {
        return interaction.editReply("Non sei in un canale")
    }
    const channelId = (<GuildMember>interaction.member).voice.channelId
    const connection = joinVoiceChannel({
        channelId: channelId!,
        guildId: interaction.guildId!,
        adapterCreator: interaction.guild?.voiceAdapterCreator!,
    })
    connection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(
                        connection,
                        VoiceConnectionStatus.Signalling,
                        5_000
                    ),
                    entersState(
                        connection,
                        VoiceConnectionStatus.Connecting,
                        5_000
                    ),
                ])
            } catch (error) {
                connection.destroy()
            }
        }
    )
    await interaction.editReply(`Mi sono unito a <#${channelId}>`)
}
