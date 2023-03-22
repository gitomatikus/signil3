import './Host.css';
import {getEcho} from "../Events/Echo";
import {gameId, host} from "../Game/InitGame";
import {Player} from "../Players/PlayerList";
import {useEffect, useRef, useState} from "react";
import {getHost} from "../Storage/GetHost";
import isHost from "../Storage/IsHost";
import axios from "axios";
export default function HostCard() {

    const [hoster, setHost] = useState<Player | null>(getHost());
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    useHostSubscriber(setHost);

    const packHandler = function (event: any) {
        let file = event.target.files[0];

        let data = new FormData();
        data.append('file', file, file.name);
        data.append('game', gameId());

        axios.post(host() + '/api/file', data, {
            onUploadProgress: function (progressEvent: any) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total); // you can use this to show user percentage of file downloaded
                setUploadProgress(percentCompleted)
            }
        }).then((response:any) => {
            localStorage.removeItem('control')
            localStorage.removeItem('closed_questions')
            console.log('response', response);
        });
    }


    return(<div>
        <div className={"player-list"}>{getHostCard(hoster, uploadProgress)}</div>
        {isHost() ? <>
            <input className={"custom-file-input"} type={"file"} onChange={packHandler} />
        </> : <></>}
    </div>)
}

function getHostCard(player: Player|null, uploadProgress:number|null): JSX.Element
{
    if (!player) {
        return <></>;
    }
    let imageFile: string = "data:image/png;base64, " + player?.img ?? '';

    return (<div className={"host-card"}>
        <div className={"host-photo"}> <img className={"player-photo"} src={imageFile} /></div>
        <div className={"host-name"}>{player.name}</div>
        {uploadProgress ? <div className={"download-progress"}>Заважантажено:{uploadProgress}%</div> : <></>}
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