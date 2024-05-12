import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import create from "./create";
import { skipNextCommand, skipCurrentCommand } from "./skip";
import clearQueueCommand from "./clear";
import { playQueueCommand } from "./play";

export const data = new SlashCommandBuilder()
    .setName("queueadmin")
    .setDescription("Commandi segretissimi per la coda segretissima")
    .addSubcommand((subcommand) =>
        subcommand.setName("create").setDescription("Creare coda in DB"),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("skipnext")
            .setDescription("Salta il prossimo in lista"),
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("skipcurrent").setDescription("Vai al prossimo"),
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("clear").setDescription("SPAZZINO"),
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("play").setDescription("Parte coda"),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    // @ts-expect-error
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply({ ephemeral: true });
    switch (subcommand) {
        case "create":
            create(interaction);
            break;
        case "skipnext":
            skipNextCommand(interaction);
            break;
        case "skipcurrent":
            skipCurrentCommand(interaction);
            break;
        case "clear":
            clearQueueCommand(interaction);
            break;
        case "play":
            playQueueCommand(interaction);
            break;
        default:
            console.log(subcommand);
            return await interaction.editReply("Stopped in admin/index");
    }
}
