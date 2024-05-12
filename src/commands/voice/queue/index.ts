import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import vedi from "./vedi";

export const data = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Commandi per la coda")
    .addSubcommand((subcommand) =>
        subcommand.setName("vedi").setDescription("Vedi la coda"),
    )
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    // @ts-expect-error
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case "vedi":
            vedi(interaction);
            break;
        default:
            console.log(subcommand);
            return await interaction.editReply("ERRORE: Stopped at index");
    }
}
