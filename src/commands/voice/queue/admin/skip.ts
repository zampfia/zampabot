import { CommandInteraction } from "discord.js";
import { skipCurrent, skipNext } from "../../../../voice/queue";

export async function skipNextCommand(interaction: CommandInteraction) {
    await skipNext(interaction.guildId!);
    return await interaction.editReply("Saltato il prossimo");
}

export async function skipCurrentCommand(interaction: CommandInteraction) {
    const result = skipCurrent(interaction.guildId!);
    if (result) {
        return await interaction.editReply("Saltato il corrente");
    }
    return await interaction.editReply("Salto fallito");
}
