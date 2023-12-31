import * as burnhome from "./random/burnhome"
import * as ping from "./random/ping"
import * as pong from "./random/pong"
import * as config from "./util/config"
import * as esilia from "./util/esilia"
import * as gtts from "./voice/gtts"
import * as gttsl from "./voice/gttsl"
import * as join from "./voice/join"
import * as leave from "./voice/leave"
import * as play from "./voice/play"
import * as playfile from "./voice/playfile"
import * as playurl from "./voice/playurl"
import * as stop from "./voice/stop"

export const commands = {
    burnhome,
    ping,
    pong,
    config,
    esilia,
    gtts,
    gttsl,
    join,
    leave,
    play,
    playfile,
    playurl,
    stop,
}
