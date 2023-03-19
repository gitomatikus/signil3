import './PlayerList.css';
import {SyntheticEvent, useEffect, useState} from "react";
import {getEcho} from "../Events/Echo";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";
import * as localforage from "localforage";
import isHost from "../Storage/IsHost";
import {getPlayer} from "./Player";
export interface Player {
    name: string;
    score: string;
    img: string;
    title: string;
}
export default function PlayerList() {

    const [players, setPlayers] = useState([] as Player[]);
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('UpdatePlayers', function (message: any) {
                let playersList: Player[] = [];
                let players = message.players;
                let keys = Object.keys(players);
                let control = false;
                keys.forEach((key: string) => {
                    let player = players[key];
                    if (player.host) {
                        return;
                    }
                    if (player.control && player.name === getPlayer()?.name) {
                        control = true;
                    }
                    playersList.push(players[key]);
                });
                localStorage.setItem('control', control ? 'true' : 'false');
                updatePlayers(playersList, setPlayers);
            });
        setTimeout(triggerPlayersUpdate, 2000, );
        return () => {
            getEcho().channel('game.' + gameId())
                .stopListening('UpdatePlayers');
        }
        }, [])
    return(<div className={"player-list"}>
        {players.map((player: Player) => getPlayerElement(player))}

    </div>)
}



function updatePlayers(players: Player[], setPlayers: any): void
{
    setPlayers(players);
    localforage.setItem('players', players)
}
function getPlayerElement(player: Player): JSX.Element
{
    let imageFile: string = "data:image/png;base64, " + player.img;
    return (<div className={"player-card"} key={player.name}>
        <div className={"player-photo"}> <img className={"player-photo"} src={imageFile} /></div>
        <div className={"player-name"}>{player.name}</div>
        <div className={"player-points"}>
            <span className={"player-points"} contentEditable={isHost()} suppressContentEditableWarning={isHost()} onBlur={(event:SyntheticEvent) => handlePointsChange(event, player.name)}>{player.score}</span>
            <span className={"player-title"} contentEditable={isHost()} suppressContentEditableWarning={isHost()} onBlur={(event:SyntheticEvent) => handleTitleChange(event, player.name)}>{player.title}</span>
        </div>
    </div>)
}

function triggerPlayersUpdate(): void
{
    axios.post(host()+'/api/user/', {
        game: gameId(),
        host: true
    })
}

function handlePointsChange(event: SyntheticEvent, name: string) {

    let element = event.target as HTMLInputElement
    let points = element.innerText;
    axios.put(host()+'/api/user/', {
        game: gameId(),
        username: name,
        score: points,
    })
}
function handleTitleChange(event: SyntheticEvent, name: string) {
    let element = event.target as HTMLInputElement
    let title = element.innerText;
    axios.put(host()+'/api/user/', {
        game: gameId(),
        username: name,
        title: title,
    })
}