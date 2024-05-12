// import {
// NoSubscriberBehavior,
// VoiceConnectionStatus,
// createAudioPlayer,
// createAudioResource,
//     getVoiceConnection,
// } from "@discordjs/voice";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
// import getAudioDurationInSeconds from "get-audio-duration";
import path from "path";
import fs from "fs";
import { Song } from "../../voice/song";
import { addToQueue } from "../../voice/queue";

export const data = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Suona un suono")
    .addStringOption((option) =>
        option
            .setName("audiofile")
            .setDescription("Nome del file audio")
            .setRequired(true),
    )
    .addIntegerOption((option) =>
        option
            .setName("volume")
            .setDescription("Volume del suono")
            .setMinValue(0)
            .setMaxValue(1000)
            .setRequired(false),
    )
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    // const connection = getVoiceConnection(interaction.guildId!);
    // if (
    //     connection === undefined ||
    //     connection?.state.status === VoiceConnectionStatus.Destroyed ||
    //     connection?.state.status === VoiceConnectionStatus.Disconnected
    // ) {
    //     return interaction.reply({
    //         content: "Non sono in nessun canale",
    //         ephemeral: true,
    //     });
    // }
    await interaction.deferReply({ ephemeral: true });
    const option = interaction.options.get("audiofile")?.value!;
    if (!fs.existsSync(path.join(__dirname, "files", option + ".opus"))) {
        return await interaction.editReply(
            `Impossibile trovare l'audio **${option}**`,
        );
    }
    let pathName;
    try {
        pathName = path.join(__dirname, "files", option + ".opus");
    } catch (e) {
        return await interaction.editReply(
            `Impossibile trovare l'audio **${option}**`,
        );
    }

    let volume = 100;
    if (interaction.options.get("volume") != null) {
        volume = <number>interaction.options.get("volume")?.value!;
    }

    const song: Song = {
        filename: pathName,
        songName: "/play " + option,
        serverId: interaction.guildId!,
        user: interaction.user.id,
        username: interaction.user.username,
        time: new Date(interaction.createdTimestamp),
        volume: volume,
    };
    addToQueue(song);

    // const resource = createAudioResource(pathName, { inlineVolume: true });
    // if (interaction.options.get("volume") != null) {
    //     resource.volume?.setVolume(
    //         <number>interaction.options.get("volume")?.value! * 0.01,
    //     );
    // }
    // const player = createAudioPlayer({
    //     behaviors: {
    //         noSubscriber: NoSubscriberBehavior.Stop,
    //     },
    // });
    // player.play(resource);
    // const subscriber = connection?.subscribe(player);
    // if (subscriber) {
    //     setTimeout(
    //         () => {
    //             subscriber.unsubscribe();
    //         },
    //         (await getAudioDurationInSeconds(
    //             path.join(__dirname, "files", option + ".opus"),
    //         )) * 1000,
    //     );
    // }

    return interaction.editReply("Aggiunto in coda");
}
