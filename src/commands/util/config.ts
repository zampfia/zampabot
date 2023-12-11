import {
    CommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js"
import { Server } from "@prisma/client"
import { saveConfig } from "../../config/save"

export const data = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Set the Config")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("autojoin")
            .setDescription("Set channel to autojoin on load")
            .addChannelOption((option) =>
                option
                    .setName("channel")
                    .setDescription("Channel to autojoin")
                    .setRequired(false)
            )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const guildId = interaction.guildId!
    // @ts-expect-error
    const subcommand: string = interaction.options.getSubcommand()
    switch (subcommand) {
        case "autojoin":
            const option = interaction.options.get("channel")?.channel?.id
            const channel = option != null ? option : ""
            const config: Server = {
                id: "",
                discordId: guildId,
                autojoin: channel,
            }
            await saveConfig(config)
            return await interaction.editReply(
                `Changed **autojoin** to <#${option}>`
            )
        default:
            break
    }
}
