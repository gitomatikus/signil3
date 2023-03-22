import getByKey from "./GetByKey";
import {Player} from "../Players/PlayerList";

export default async function getPlayerByHash(playerHash: string): Promise<Player|null>
{
    let players = await getByKey('players') as Array<Player>;
    if (!players) {
        return null;
    }
    let found = null;
    players.forEach((player: Player) => {
        if (player.hash === playerHash) {
            console.log('found player: ' + player.name + ' with score: ' + player.score);
            found = player;
            return
        }
    });
    return found;
}