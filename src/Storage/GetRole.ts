import {getPlayer} from "../Players/Player";
export enum Role {
    Player = 'player',
    Host = 'host'
}

export function role(): Role
{
    let name = getPlayer()?.name;
    return name === 'host' ? Role.Host : Role.Player;
}
