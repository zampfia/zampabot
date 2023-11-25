import { CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
    .setName("burnhome")
    .setDescription("Manda un messaggio d'amore a qualcuno come qualcun'altro")
    .addUserOption((option) =>
        option
            .setName("bersaglio")
            .setDescription("La persona che riceverà il messaggio")
            .setRequired(true)
    )
    .addUserOption((option) =>
        option.setName("as").setDescription('La persona che lo "manderà"')
    )
    .setDefaultMemberPermissions("0")
    .setDMPermission(false)

export async function execute(interaction: CommandInteraction) {
    await interaction.deferReply({ ephemeral: true })
    const dmChannel = await interaction.options.getUser("bersaglio")?.createDM()
    const username =
        interaction.options.getUser("as") != null
            ? interaction.options.getUser("as")?.username
            : interaction.user.username
    await dmChannel?.send(
        `Piacere,\n\nSono qualcuno e **${username}** ti voleva dire che ti vuole molto bene e che domani verrà a salutarti\n\nCordiali saluti,\nQualcuno`
    )
    return interaction.editReply(
        `Ho inviato il messaggio a **${interaction.options.getUser("bersaglio")
            ?.username}** per conto di **${username}**`
    )
}
