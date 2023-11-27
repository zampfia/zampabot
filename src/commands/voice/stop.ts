import {
    NoSubscriberBehavior,
    createAudioPlayer,
    getVoiceConnection,
} from "@discordjs/voice"
import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Ferma l'audio attuale")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const connection = getVoiceConnection(interaction.guildId!)
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
        },
    })
    const subscriber = connection?.subscribe(player)
    if (subscriber) {
        subscriber.unsubscribe()
    }
    return interaction.editReply("Fermato suono in corso")
}
