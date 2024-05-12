import { CommandInteraction, EmbedBuilder } from "discord.js";
import { getQueue } from "../../../voice/queue";

const numbers = [
    ":zero:",
    ":one:",
    ":two:",
    ":three:",
    ":four:",
    ":five:",
    ":six:",
    ":seven:",
    ":eight:",
    ":nine:",
];

function numberToEmojii(num: number) {
    let output = "";
    for (let i = 0; i < num.toString.length; i++) {
        output = numbers[parseInt(num.toString()[i], 10)];
    }
    return output;
}

export default async function vedi(interaction: CommandInteraction) {
    const queue = await getQueue(interaction.guildId!);
    if (queue == undefined || queue == null || queue.length == 0) {
        return await interaction.editReply("Non c'è niente in coda");
    }

    let description = "Ecco la coda\n\n";
    for (let i = 0; i < queue!.length && i < 5; i++) {
        description += `${numberToEmojii(i + 1)}. **"${queue![0 + i].songName}"** aggiunta da **"${queue![0 + i].username}"**\n`;
    }

    const embed = new EmbedBuilder()
        .setTitle("Coda")
        .setDescription(description)
        .setColor("#cdac27")
        .setFooter({
            text: "Zampa non approva, per forza, le canzoni",
        })
        .setTimestamp();

    return await interaction.editReply({ embeds: [embed] });
}
