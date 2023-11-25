import {
    CommandInteraction,
    SlashCommandBuilder,
    REST,
    Routes,
    PermissionFlagsBits,
} from "discord.js"
import { config } from "../../config"

export const data = new SlashCommandBuilder()
    .setName("esilia")
    .setDescription("Esilia un ruolo da un canale")
    .addRoleOption((option) =>
        option
            .setName("role")
            .setDescription("Il ruolo da esiliare")
            .setRequired(true)
    )
    .addChannelOption((option) =>
        option
            .setName("channel")
            .setDescription("Il canale da cui esiliarlo")
            .setRequired(true)
    )
    .setDefaultMemberPermissions(
        PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageRoles
    )
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply()
    const roleId = interaction.options.get("role")?.role?.id!
    const channelId = interaction.options.get("channel")?.channel?.id!
    await new REST()
        .setToken(config.DISCORD_TOKEN)
        .put(Routes.channelPermission(channelId, roleId), {
            body: {
                type: 0,
                deny: (
                    PermissionFlagsBits.SendMessages |
                    PermissionFlagsBits.SendMessagesInThreads |
                    PermissionFlagsBits.CreatePrivateThreads |
                    PermissionFlagsBits.CreatePublicThreads
                ).toString(),
            },
        })
    return interaction.editReply(
        `In teoria <@&${roleId}> sono fuori dal canale ⁠<#${channelId}>`
    )
}
