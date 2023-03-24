import {getPlayer} from "../../Players/Player";
import axios from "axios";
import {gameId, host} from "../../Game/InitGame";

function Muffin () {

    axios.post(host() + '/api/game/results', {
        game: gameId(),
        customName: 'Muffin',
        clear: true
    })

    let link = muffinHost() + '?name=' + getPlayer().hash;
    let html = '<iframe src=' + link + ' />'
    return <div id={"muffin-game"}  dangerouslySetInnerHTML= {{ __html: html}} />;
}
export default Muffin;

export function muffinHost() {
    return  "http://192.168.0.92:8080/";
}
