import './Host.css';
import {getEcho} from "../Events/Echo";
import {gameId} from "../Game/InitGame";
import {Player} from "../Players/PlayerList";
import {useEffect, useState} from "react";
import {getHost} from "../Storage/GetHost";
export default function HostCard() {

    const [host, setHost] = useState<Player | null>(getHost());
    useHostSubscriber(setHost);


    return(<div className={"player-list"}>
        {getHostCard(host)}
    </div>)
}
function getHostCard(player: Player|null): JSX.Element
{
    if (!player) {
        return <></>;
    }
    let imageFile: string = "data:image/png;base64, " + player?.img ?? '';

    return (<div className={"host-card"}>
        <div className={"host-photo"}> <img className={"player-photo"} src={imageFile} /></div>
        <div className={"host-name"}>{player.name}</div>
    </div>)
}

function useHostSubscriber(setHost: (player:  Player) => void): void {
    getEcho().channel('game.' + gameId())
        .listen('UpdateHost', function (message: any) {
            let players = message.players;
            let keys = Object.keys(players);
            keys.forEach((key: string) => {
                if (players[key].host) {
                    setHost(players[key])
                    localStorage.setItem('host', JSON.stringify(players[key]));
                }
            });
        });
}