import { Guild } from "discord.js"
import prisma from "../db"
import { joinChannel } from "./autojoin"

export async function loadConfig(guild: Guild) {
    const serverId = guild.id
    const server = await prisma.server.findUnique({
        where: {
            discordId: serverId,
        },
        select: {
            autojoin: true,
        },
    })
    if (server != null) {
        const channelId = server.autojoin
        if (channelId != null) {
            await joinChannel(channelId, serverId, guild.voiceAdapterCreator!)
        }
    }
}
