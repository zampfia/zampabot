import { CommandInteraction } from "discord.js";
import prisma from "../../../db";

export default async function create(interaction: CommandInteraction) {
    const fromDB = await prisma.lotteria.findUnique({
        where: {
            serverId: interaction.guildId!,
        },
    });
    if (fromDB != null) {
        return await interaction.editReply("Lotteria già esiste");
    } else {
        await prisma.lotteria.create({
            data: {
                serverId: interaction.guildId!,
            },
        });
        return await interaction.editReply("Creata lotteria in DB");
    }
}

