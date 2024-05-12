import { CommandInteraction } from "discord.js";
import { createQueue } from "../../../../voice/queue";

export default async function create(interaction: CommandInteraction) {
    const result = await createQueue(interaction.guildId!);
    if (!result) {
        return await interaction.editReply("Queue già esiste");
    } else {
        return await interaction.editReply("Creata queue in DB");
    }
}
