import {
    NoSubscriberBehavior,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
} from "@discordjs/voice";
import { getQueue, skipNext } from "./queue";
import getAudioDurationInSeconds from "get-audio-duration";
import { logger } from "../log";

let playing = false;

export async function playQueue(serverId: string) {
    logger.debug("playing before: " + playing);
    if (!playing) {
        const connection = getVoiceConnection(serverId);
        if (connection != undefined) {
            const song = (await getQueue(serverId))![0];
            if (song != undefined) {
                const resource = createAudioResource(song.filename, {
                    inlineVolume: true,
                });
                resource.volume?.setVolume(song.volume * 0.01);
                const player = createAudioPlayer({
                    behaviors: {
                        noSubscriber: NoSubscriberBehavior.Pause,
                    },
                });
                player.play(resource);
                const subscriber = connection.subscribe(player);
                const duration =
                    (await getAudioDurationInSeconds(song.filename)) * 1000;
                if (subscriber) {
                    playing = true;
                    skipNext(serverId);
                    setTimeout(() => {
                        subscriber.unsubscribe();
                        if (!getPlaying()) {
                            playing = false;
                        }
                        playQueue(serverId);
                    }, duration);
                }
            }
        }
    }
    logger.debug("playing after: " + playing);
}

export function setPlaying(bool: boolean) {
    playing = bool;
}

export function getPlaying(): boolean {
    return playing;
}
