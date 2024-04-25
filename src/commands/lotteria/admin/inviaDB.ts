import { CommandInteraction, userMention } from "discord.js";
import prisma from "../../../db";

export default async function inviaDB(interaction: CommandInteraction) {
    const name = <string>interaction.options.get("nome")?.value;
    const num0 = <number>interaction.options.get("num1")?.value;
    const num1 = <number>interaction.options.get("num2")?.value;
    const num2 = <number>interaction.options.get("num3")?.value;
    const num3 = <number>interaction.options.get("num4")?.value;
    const num4 = <number>interaction.options.get("num5")?.value;
    const user = interaction.options.getUser("user")?.id;
    const toDB = await prisma.lotteria.update({
        where: {
            serverId: interaction.guildId!,
        },
        data: {
            players: {
                push: {
                    name: name,
                    userId: user != null ? user : "",
                    numbers: [num0, num1, num2, num3, num4],
                },
            },
        },
    });
    return await interaction.editReply(
        `Inviato i numeri [${num0}, ${num1}, ${num2}, ${num3}, ${num4}] per ${user != null ? userMention(user) : "**" + name + "**"} a DB`,
    );
}

