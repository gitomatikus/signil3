import './PlayerList.css';
import {useEffect, useState} from "react";
import {getEcho} from "../Events/Echo";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";
interface Player {
    name: string;
    score: string;
    img: string;
}
export default function PlayerList() {

    const [players, setPlayers] = useState([] as Player[]);
    useEffect(() => {

        getEcho().channel('game.' + gameId())
            .listen('UpdatePlayers', function (message: any) {
                let playersList: Player[] = [];
                let players = message.players;
                let keys = Object.keys(players);
                keys.forEach((key: string) => {
                    playersList.push(players[key]);
                });
                updatePlayers(playersList, setPlayers);
            });
        setTimeout(triggerPlayersUpdate, 2000, );

    }, [])



    return(<div className={"player-list"}>
        {players.map((player: Player) => getPlayerElement(player.img ?? '', player.name ?? '', player.score?.toString() ?? ''))}

    </div>)
}



function updatePlayers(players: Player[], setPlayers: any): void
{
    console.log(players);
    setPlayers(players);
}
function getPlayerElement(image: string, name: string, points: string): JSX.Element
{
    console.log(points)
    let imageFile: string = "data:image/png;base64, " + image;
    return (<div className={"player-card"} key={name}>
        <div className={"player-photo"}> <img className={"player-photo"} src={imageFile} /></div>
        <div className={"player-name"}>{name}</div>
        <div className={"player-points"}><span className={"player-points"}>{points}</span></div>
    </div>)
}

function triggerPlayersUpdate(): void
{
    axios.post(host()+'/api/user/', {
        game: gameId(),
        host: true
    })
}