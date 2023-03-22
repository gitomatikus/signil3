import {getPlayer} from "../Players/Player";
import getByKey from "./GetByKey";

export default async function getPlayersList()
{
    return await getByKey('players')
}
