import {
    NoSubscriberBehavior,
    createAudioPlayer,
    getVoiceConnection,
} from "@discordjs/voice";
import prisma from "../db";
import { playQueue, setPlaying } from "./playqueue";
import { Song } from "./song";

export async function addToQueue(song: Song) {
    await prisma.queue.update({
        where: {
            serverId: song.serverId,
        },
        data: {
            queue: {
                push: {
                    filename: song.filename,
                    songName: song.songName,
                    user: song.user,
                    username: song.username,
                    time: song.time,
                    volume: song.volume,
                },
            },
        },
    });
    await playQueue(song.serverId);
}

export async function skipNext(serverId: string) {
    const queue = await prisma.queue.findUnique({
        where: {
            serverId: serverId,
        },
        select: {
            queue: true,
        },
    });
    queue?.queue.shift();
    await prisma.queue.update({
        where: {
            serverId: serverId,
        },
        data: {
            // @ts-expect-error
            queue: queue?.queue,
        },
    });
}

export function skipCurrent(serverId: string): boolean {
    const connection = getVoiceConnection(serverId);
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Stop,
        },
    });
    const subscriber = connection?.subscribe(player);
    if (subscriber) {
        subscriber.unsubscribe();
        setPlaying(false);
        playQueue(serverId);
        return true;
    }
    return false;
}

export async function skipToIndex(serverId: string, songIndex: number) {
    const queue = await prisma.queue.findUnique({
        where: {
            serverId: serverId,
        },
        select: {
            queue: true,
        },
    });
    queue?.queue.slice(songIndex);
    await prisma.queue.update({
        where: {
            serverId: serverId,
        },
        data: {
            // @ts-expect-error
            queue: queue?.queue,
        },
    });
}

export async function getQueue(serverId: string): Promise<Song[] | undefined> {
    const queue = (
        await prisma.queue.findUnique({
            where: {
                serverId: serverId,
            },
            select: {
                queue: true,
            },
        })
    )?.queue;
    return queue?.map((value) => {
        return JSON.parse(JSON.stringify(value)) as Song;
    });
}

export async function createQueue(serverId: string): Promise<boolean> {
    const fromDB = await prisma.queue.findUnique({
        where: {
            serverId: serverId,
        },
    });
    if (fromDB == null) {
        await prisma.lotteria.create({
            data: {
                serverId: serverId,
            },
        });
        return true;
    }
    return false;
}

export async function clearQueue(serverId: string) {
    await prisma.queue.update({
        where: {
            serverId: serverId,
        },
        data: {
            queue: [],
        },
    });
}
