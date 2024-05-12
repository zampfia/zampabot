import * as lotteria from "./lotteria";
import * as queue from "./voice/queue";
import * as queueadmin from "./voice/queue/admin";
import * as burnhome from "./random/burnhome";
import * as ping from "./random/ping";
import * as pong from "./random/pong";
import * as config from "./util/config";
import * as esilia from "./util/esilia";
import * as gtts from "./voice/gtts";
import * as join from "./voice/join";
import * as leave from "./voice/leave";
import * as play from "./voice/play";
import * as playfile from "./voice/playfile";
import * as playurl from "./voice/playurl";

export const commands = {
    lotteria,
    queue,
    queueadmin,
    burnhome,
    ping,
    pong,
    config,
    esilia,
    gtts,
    join,
    leave,
    play,
    playfile,
    playurl,
};
