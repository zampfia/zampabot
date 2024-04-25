import { CommandInteraction, userMention } from "discord.js";
import prisma from "../../db";

export async function aggiungi(interaction: CommandInteraction) {
    const name = <string>interaction.options.get("nome")?.value;
    const user = interaction.options.getUser("user");
    const date = <string>interaction.options.get("")?.value;
    const toDB = await prisma.compleanni.update({
        where: {
            serverId: interaction.guildId!,
        },
        data: {
            dates: {
                push: {
                    name: name,
                    userId: user != null ? user.id : "",
                    date: date,
                },
            },
        },
    });
    return await interaction.editReply(
        `Inviato data ${date} per ${user != null ? userMention(user.id) : "**" + name + "**"} a DB`,
    );
}
