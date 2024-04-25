import { CommandInteraction } from "discord.js";
import prisma from "../../db";

export async function setup(interaction: CommandInteraction) {
    const fromDB = await prisma.compleanni.findUnique({
        where: {
            serverId: interaction.guildId!,
        },
    });
    if (fromDB != null) {
        return await interaction.editReply("Conpleanni già esiste");
    } else {
        const channel = interaction.options.get("channel")?.channel!;
        await prisma.compleanni.create({
            data: {
                serverId: interaction.guildId!,
                channelId: channel.id,
            },
        });
        return await interaction.editReply("Creata compleanni in DB");
    }
}
