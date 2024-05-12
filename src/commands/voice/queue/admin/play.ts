import { CommandInteraction } from "discord.js";
import { playQueue } from "../../../../voice/playqueue";

export async function playQueueCommand(interaction: CommandInteraction) {
    await playQueue(interaction.guildId!);
    return await interaction.editReply("Fatta partire");
}
