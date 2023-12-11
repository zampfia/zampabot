import {
    joinVoiceChannel,
    VoiceConnectionStatus,
    entersState,
} from "@discordjs/voice"
import { InternalDiscordGatewayAdapterCreator } from "discord.js"

export async function joinChannel(
    channelId: string,
    serverId: string,
    voiceAdapterCreator: InternalDiscordGatewayAdapterCreator
) {
    const connection = joinVoiceChannel({
        channelId: channelId,
        guildId: serverId,
        adapterCreator: voiceAdapterCreator,
    })
    connection.on(
        VoiceConnectionStatus.Disconnected,
        async (oldState, newState) => {
            try {
                await Promise.race([
                    entersState(
                        connection,
                        VoiceConnectionStatus.Signalling,
                        5_000
                    ),
                    entersState(
                        connection,
                        VoiceConnectionStatus.Connecting,
                        5_000
                    ),
                ])
            } catch (error) {
                connection.destroy()
            }
        }
    )
}
