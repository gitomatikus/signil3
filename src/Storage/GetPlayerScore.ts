import getByKey from "./GetByKey";
import {Player} from "../Players/PlayerList";

export default async function getPlayerScore(playerName: string): Promise<string>
{
    let scores = await getByKey('players') as Array<Player>;
    if (!scores) {
        return '0';
    }
    let score = '';
    scores.forEach((player: Player) => {
        if (player.name === playerName) {
            console.log('found player: ' + player.name + ' with score: ' + player.score);
            score = player.score.toString();
            return
        }
    });
    return  score;
}