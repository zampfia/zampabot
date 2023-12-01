import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
} from "@discordjs/voice"
import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import * as gtts from "google-tts-api"
import { tmpNameSync, dirSync } from "tmp"
import Ffmpeg, { setFfmpegPath } from "fluent-ffmpeg"
import ffmpegPath from "ffmpeg-static"
import fs from "fs"
import getAudioDurationInSeconds from "get-audio-duration"

setFfmpegPath(ffmpegPath!)
const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

export const data = new SlashCommandBuilder()
    .setName("gttsl")
    .setDescription(
        "Fa sentire il TTS di google traduttore senza un massimo di caratteri"
    )
    .addStringOption((option) =>
        option
            .setName("text")
            .setDescription("Testo da far sentire")
            .setRequired(true)
    )
    .addStringOption((option) =>
        option
            .setName("language")
            .setDescription(
                "Lingua (usando la seconda colonna di questo https://cloud.google.com/speech/docs/languages)"
            )
            .addChoices(
                { name: "Amarico", value: "am" },
                { name: "Arabo", value: "ar" },
                { name: "Bosniaco", value: "bs" },
                { name: "Bulgaro", value: "bg" },
                { name: "Cinese, mandarino", value: "zh" },
                { name: "Olandese", value: "nl" },
                { name: "Inglese", value: "en" },
                { name: "Estone", value: "et" },
                { name: "Finlandese", value: "fi" },
                { name: "Ungherese", value: "hu" },
                { name: "Islandese", value: "is" },
                { name: "Italiano", value: "it" },
                { name: "Giapponese", value: "ja" },
                { name: "Persiano", value: "fa" },
                { name: "Rumeno", value: "ro" },
                { name: "Russo", value: "ru" },
                { name: "Spagnolo", value: "es" },
                { name: "Sundanese", value: "su" },
                { name: "Swahili", value: "sw" },
                { name: "Svedese", value: "sv" },
                { name: "Thailandese", value: "th" },
                { name: "Turco", value: "tr" },
                { name: "Uzbeko", value: "UZ" },
                { name: "Vietnamita", value: "vi" },
                { name: "Zulu", value: "zu" }
            )
            .setRequired(false)
    )
    .addBooleanOption((option) =>
        option
            .setName("slow")
            .setDescription("Se il testo viene parlato lentamente")
            .setRequired(false)
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
        return await interaction.reply({
            content: "Non sono in nessun canale",
            ephemeral: true,
        })
    }
    await interaction.deferReply({ ephemeral: true })
    const text = <string>interaction.options.get("text")?.value
    let language = interaction.options.get("language")?.value
    if (language === undefined) {
        language = "it"
    } else {
        language = <string>language
    }
    let slow = interaction.options.get("slow")?.value
    if (slow === undefined) {
        slow = false
    } else {
        slow = <boolean>slow
    }
    await interaction.editReply("Getting audio...")
    let base64s: { shortText: string; base64: string }[] = []
    base64s = await gtts.getAllAudioBase64(text, {
        lang: language,
        slow: slow,
    })
    await interaction.editReply("Merging audio...")
    let ffmpeg = Ffmpeg()
    base64s.map((element) => {
        const path = tmpNameSync()
        const buffer = Buffer.from(element["base64"], "base64")
        const uint8arr = new Uint8Array(buffer.byteLength)

        buffer.copy(uint8arr, 0, 0, buffer.byteLength)
        const v = new DataView(uint8arr.buffer)
        fs.writeFileSync(path, v)
        ffmpeg = ffmpeg.addInput(path)
    })
    await interaction.editReply("Saving audio...")
    const tmpPath = tmpNameSync()
    ffmpeg = ffmpeg.noVideo()
    let ended = false
    ffmpeg = ffmpeg.on("end", () => {
        ended = true
    })
    ffmpeg = ffmpeg
        .mergeToFile(tmpPath, dirSync().name)
        .withOutputFormat("opus")
    while (!ended) {
        await delay(100)
    }
    const duration = (await getAudioDurationInSeconds(tmpPath)) * 1000
    const resource = createAudioResource(tmpPath, {
        inlineVolume: true,
    })
    if (interaction.options.get("volume") != null) {
        resource.volume?.setVolume(
            <number>interaction.options.get("volume")?.value! * 0.01
        )
    }
    await interaction.editReply("Creating player and subscribing...")
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
    return await interaction.deleteReply()
}
