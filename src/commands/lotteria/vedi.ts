import { CommandInteraction } from "discord.js";
import prisma from "../../db";
import { Prisma } from "@prisma/client";

export default async function vedi(interaction: CommandInteraction) {
    const fromDB = (await prisma.lotteria.findUnique({
        where: {
            serverId: interaction.guildId!,
        },
        select: {
            players: true,
        },
    }))!.players as Prisma.JsonArray;
    const stuff = fromDB.find((value) => {
        const element = value as Prisma.JsonObject;
        if (element.userId === interaction.user.id) {
            return value;
        }
    });
    if (stuff === undefined) {
        return await interaction.editReply(`Non ci sono ancora i tuoi numeri`);
    }
    const numbers = (stuff as Prisma.JsonObject).numbers as Prisma.JsonArray;
    return await interaction.editReply(
        `I **tuoi** numeri per questa estrazione sono ${numbers[0]}, ${numbers[1]}, ${numbers[2]}, ${numbers[3]} e ${numbers[4]}`,
    );
}

