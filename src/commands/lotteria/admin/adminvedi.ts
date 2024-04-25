import { CommandInteraction, userMention } from "discord.js";
import prisma from "../../../db";
import { Prisma } from "@prisma/client";

export default async function adminvedi(interaction: CommandInteraction) {
    // @ts-expect-error
    const subcommand: string = interaction.options.getSubcommand();
    const fromDB = (await prisma.lotteria.findUnique({
        where: {
            serverId: interaction.guildId!,
        },
        select: {
            players: true,
        },
    }))!.players as Prisma.JsonArray;
    if (subcommand === "adminvediuser") {
        const user = interaction.options.getUser("user")!;
        const stuff = fromDB.find((value) => {
            const element = value as Prisma.JsonObject;
            if (element.userId === user.id) {
                return value;
            }
        });
        if (stuff === undefined) {
            return await interaction.editReply(
                `Non ci sono ancora i tuoi numeri`,
            );
        }
        const numbers = (stuff as Prisma.JsonObject)
            .numbers as Prisma.JsonArray;
        return await interaction.editReply(
            `I numeri di ${userMention(user.id)} per questa estrazione sono **${numbers[0]}**, **${numbers[1]}**, **${numbers[2]}**, **${numbers[3]}** e **${numbers[4]}**`,
        );
    } else {
        const name = <string>interaction.options.get("nome")?.value;
        const stuff = fromDB.find((value) => {
            const element = value as Prisma.JsonObject;
            if (element.name === name) {
                return value;
            }
        });
        if (stuff === undefined) {
            return await interaction.editReply(
                `Non ci sono ancora i tuoi numeri`,
            );
        }
        const numbers = (stuff as Prisma.JsonObject)
            .numbers as Prisma.JsonArray;
        return await interaction.editReply(
            `I numeri di **${name}** per questa estrazione sono **${numbers[0]}**, **${numbers[1]}**, **${numbers[2]}**, **${numbers[3]}** e **${numbers[4]}**`,
        );
    }
}

