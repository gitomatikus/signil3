import {Role, role} from "./GetRole";
import {getHost} from "./GetHost";

export default function isHost(): boolean
{
    let host = getHost();
    let playerName = localStorage.getItem("player");
    return playerName === host?.name
}
