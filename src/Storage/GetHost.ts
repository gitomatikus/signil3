import {Player} from "../Players/PlayerList";

export function getHost(): Player|null
{
    let host = localStorage.getItem("host");
    return host ? JSON.parse(host) as Player : null;
}
