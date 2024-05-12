import { CommandInteraction } from "discord.js";
import { clearQueue } from "../../../../voice/queue";

export default async function clearQueueCommand(
    interaction: CommandInteraction,
) {
    await clearQueue(interaction.guildId!);
    return await interaction.editReply("Cleared");
}
