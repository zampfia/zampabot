import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { aggiungi } from "./aggiungi";
import { setup } from "./setup";
import { vedi } from "./vedi";

export const data = new SlashCommandBuilder()
    .setName("compleanni")
    .setDescription("Commandi per i compleanni")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("aggiungi")
            .setDescription("Aggiungi un compleanno")
            .addStringOption((option) =>
                option
                    .setName("data")
                    .setDescription("Nel formato dd-mm")
                    .setRequired(true)
                    .setMaxLength(5)
                    .setMinLength(5),
            )
            .addStringOption((option) =>
                option
                    .setName("nome")
                    .setDescription("Nome del festeggiato")
                    .setRequired(true),
            )
            .addUserOption((option) =>
                option
                    .setName("user")
                    .setDescription("Utente se esiste")
                    .setRequired(false),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("setup")
            .setDescription("Setup compleanni")
            .addChannelOption((option) =>
                option
                    .setName("channel")
                    .setDescription("Canale compleanni")
                    .setRequired(true),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("vedinome")
            .setDescription("Vedi per nome")
            .addStringOption((option) =>
                option
                    .setName("name")
                    .setDescription("Nome del festeggiato")
                    .setRequired(true),
            ),
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("vediuser")
            .setDescription("Vedi per utente")
            .addUserOption((option) =>
                option
                    .setName("user")
                    .setDescription("Utente festeggiato")
                    .setRequired(true),
            ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    // @ts-expect-error
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case "aggiungi":
            aggiungi(interaction);
            break;
        case "setup":
            setup(interaction);
            break;
        case "vedinome":
        case "vediuser":
            vedi(interaction);
            break;
        default:
            console.log(subcommand);
            return await interaction.editReply("Stopped in index");
    }
}
