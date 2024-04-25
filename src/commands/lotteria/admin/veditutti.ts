import { CommandInteraction, codeBlock } from "discord.js";
import prisma from "../../../db";
import { Prisma } from "@prisma/client";
import table from "text-table";

export default async function veditutti(interaction: CommandInteraction) {
    const fromDB = (await prisma.lotteria.findUnique({
        where: {
            serverId: interaction.guildId!,
        },
        select: {
            players: true,
        },
    }))!.players as Prisma.JsonArray;
    const names: string[] = [];
    const numbers: any[] = [];
    const messages = [];
    fromDB.forEach((value) => {
        const element = value as Prisma.JsonObject;
        names.push(<string>element.name);
        numbers.push(element.numbers!);
    });
    for (let i = 0; i < numbers.length; i++) {
        messages.push([
            names[i],
            numbers[i][0],
            numbers[i][1],
            numbers[i][2],
            numbers[i][3],
            numbers[i][4],
        ]);
    }
    return await interaction.reply(
        `La lista dei numeri è:\n\n${codeBlock(table(messages))}`,
    );
}

