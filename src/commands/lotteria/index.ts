import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import vedi from "./vedi";
import admin from "./admin";

export const data = new SlashCommandBuilder()
    .setName("lotteria")
    .setDescription("Commandi per la lotteria")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("vedi")
            .setDescription("Verifica i numeri che hai inviato"),
    )
    .addSubcommandGroup((subcommandGroup) =>
        subcommandGroup
            .setName("admin")
            .setDescription("Cose nostre")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("invia")
                    .setDescription("Invia i tuoi 5 numeri da 1 a 99")
                    .addStringOption((option) =>
                        option
                            .setName("nome")
                            .setDescription("Proprietario dei numeri")
                            .setRequired(true),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName("num1")
                            .setDescription("Numero 1")
                            .setMinValue(1)
                            .setMaxValue(100)
                            .setRequired(true),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName("num2")
                            .setDescription("Numero 2")
                            .setMinValue(1)
                            .setMaxValue(100)
                            .setRequired(true),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName("num3")
                            .setDescription("Numero 3")
                            .setMinValue(1)
                            .setMaxValue(100)
                            .setRequired(true),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName("num4")
                            .setDescription("Numero 4")
                            .setMinValue(1)
                            .setMaxValue(100)
                            .setRequired(true),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName("num5")
                            .setDescription("Numero 5")
                            .setMinValue(1)
                            .setMaxValue(100)
                            .setRequired(true),
                    )
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("L'utente dei numeri (se esiste)"),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand.setName("create").setDescription("Setup lotteria"),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("adminvediuser")
                    .setDescription("Vedi per altri utenti")
                    .addUserOption((option) =>
                        option
                            .setName("user")
                            .setDescription("Utente")
                            .setRequired(true),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("adminvedinome")
                    .setDescription("Vedi per altri")
                    .addStringOption((option) =>
                        option
                            .setName("nome")
                            .setDescription("Nome")
                            .setRequired(true),
                    ),
            )
            .addSubcommand((subcommand) =>
                subcommand.setName("veditutti").setDescription("Vedi tutti"),
            ),
    )
    .setDMPermission(false);

export async function execute(interaction: CommandInteraction) {
    // @ts-expect-error
    const group = interaction.options.getSubcommandGroup();
    if (group == "admin") {
        admin(interaction);
        return null;
    }
    await interaction.deferReply({ ephemeral: true });
    // @ts-expect-error
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case "vedi":
            vedi(interaction);
            break;
        default:
            console.log(subcommand);
            return await interaction.editReply("Stopped at index");
    }
}
