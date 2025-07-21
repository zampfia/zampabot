import { CommandInteraction } from "discord.js";
import { playQueue, setPlaying } from "../../../../voice/playqueue";

export async function playQueueCommand(interaction: CommandInteraction) {
    setPlaying(false);
    await playQueue(interaction.guildId!);
    return await interaction.editReply("Fatta partire");
}
