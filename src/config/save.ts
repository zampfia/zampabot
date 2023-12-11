import { Server } from "@prisma/client"
import prisma from "../db"

export async function saveConfig(config: Server) {
    const server = await prisma.server.findUnique({
        where: {
            discordId: config.discordId,
        },
    })
    if (server === null) {
        await prisma.server.create({
            data: {
                discordId: config.discordId,
                autojoin: config.autojoin!,
            },
        })
    } else {
        await prisma.server.update({
            where: {
                id: server.id,
            },
            data: {
                autojoin: config.autojoin,
            },
        })
    }
}
