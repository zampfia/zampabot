import {
    CommandInteraction,
    PermissionFlagsBits,
    PermissionsBitField,
} from "discord.js";
import create from "./create";
import inviaDB from "./inviaDB";
import adminvedi from "./adminvedi";
import veditutti from "./veditutti";

export default async function admin(interaction: CommandInteraction) {
    if (
        !(<Readonly<PermissionsBitField>>interaction.member?.permissions).has(
            PermissionFlagsBits.Administrator,
        )
    ) {
        return await interaction.reply({
            ephemeral: true,
            content: "Non hai i permessi",
        });
    }
    // @ts-expect-error
    const subcommand = interaction.options.getSubcommand();
    switch (subcommand) {
        case "create":
            await interaction.deferReply({ ephemeral: true });
            create(interaction);
            break;
        case "invia":
            await interaction.deferReply({ ephemeral: true });
            inviaDB(interaction);
            break;
        case "adminvedinome":
        case "adminvediuser":
            await interaction.deferReply({ ephemeral: true });
            adminvedi(interaction);
            break;
        case "veditutti":
            veditutti(interaction);
            break;
        default:
            console.log(subcommand);
            return await interaction.editReply("Stopped in admin/index");
    }
}

