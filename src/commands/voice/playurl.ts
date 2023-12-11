import {
    NoSubscriberBehavior,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
} from "@discordjs/voice"
import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import getAudioDurationInSeconds from "get-audio-duration"
import fs from "fs"
import { tmpNameSync } from "tmp"
import https from "https"

const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

export const data = new SlashCommandBuilder()
    .setName("playurl")
    .setDescription("Suona un suono")
    .addStringOption((option) =>
        option
            .setName("url")
            .setDescription("Indirizzo ad un file audio NON YOUTUBE")
            .setRequired(true)
    )
    .addIntegerOption((option) =>
        option
            .setName("volume")
            .setDescription("Volume del suono")
            .setMinValue(0)
            .setMaxValue(1000)
            .setRequired(false)
    )
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

    await interaction.deferReply({ ephemeral: true })
    const option = interaction.options.get("url")?.value as string
    const filePath = tmpNameSync()
    let finished = false
    https.get(option, (res) => {
        const file = fs.createWriteStream(filePath)
        res.pipe(file)
        file.on("finish", () => {
            file.close()
            finished = true
        })
    })
    while (!finished) {
        await delay(100)
    }
    const duration = (await getAudioDurationInSeconds(filePath)) * 1000
    let resource = createAudioResource(filePath, { inlineVolume: true })
    if (interaction.options.get("volume") != null) {
        resource.volume?.setVolume(
            <number>interaction.options.get("volume")?.value! * 0.01
        )
    }
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
        },
    })
    player.play(resource)
    const subscriber = connection?.subscribe(player)
    if (subscriber) {
        setTimeout(() => {
            subscriber.unsubscribe()
        }, duration)
    }
    return interaction.deleteReply()
}
