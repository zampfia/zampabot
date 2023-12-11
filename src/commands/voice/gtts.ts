import {
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnectionStatus,
} from "@discordjs/voice"
import { CommandInteraction, SlashCommandBuilder } from "discord.js"
import * as gtts from "google-tts-api"
import fs from "fs/promises"
import { tmpNameSync } from "tmp"
import getAudioDurationInSeconds from "get-audio-duration"

export const data = new SlashCommandBuilder()
    .setName("gtts")
    .setDescription("Fa sentire il TTS di google traduttore")
    .addStringOption((option) =>
        option
            .setName("text")
            .setDescription("Testo da far sentire")
            .setMaxLength(200)
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
                { name: "Rumeno", value: "ro" },
                { name: "Russo", value: "ru" },
                { name: "Spagnolo", value: "es" },
                { name: "Sundanese", value: "su" },
                { name: "Swahili", value: "sw" },
                { name: "Svedese", value: "sv" },
                { name: "Thailandese", value: "th" },
                { name: "Turco", value: "tr" },
                { name: "Uzbeko", value: "UZ" },
                { name: "Vietnamita", value: "vi" }
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
        return interaction.reply({
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
    const buffer = Buffer.from(
        await gtts.getAudioBase64(text, {
            lang: language,
            slow: slow,
        }),
        "base64"
    )
    const path = tmpNameSync()
    await interaction.editReply("Saving audio...")
    await fs.writeFile(path, buffer)
    const resource = createAudioResource(path, {
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
        setTimeout(
            () => {
                subscriber.unsubscribe()
            },
            (await getAudioDurationInSeconds(path)) * 1000
        )
    }
    return interaction.deleteReply()
}
