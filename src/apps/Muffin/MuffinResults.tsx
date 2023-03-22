import axios from "axios";
import {gameId, host} from "../../Game/InitGame";
import {getEcho} from "../../Events/Echo";
import {useEffect, useState} from "react";
import {Question} from "../../Pack/Pack";
import isHost from "../../Storage/IsHost";
import getPlayersList from "../../Storage/GetPlayersList";
import {Player} from "../../Players/PlayerList";
import ShowHideQuestionButton from "../../Control/ShowHideQuestionButton";

interface MuffinResult {
    signilPoints: number;
    hash: string;
    points: number;
    grade: string;
    accuracy: string;

}
export default function MuffinResults()
{

    const [results, setMuffinResult] = useState([] as MuffinResult[]);
    const [playersList, setPlayersList] = useState([] as Player[]);


    useEffect(() => {

        getPlayersList().then((players: any) => {
            setPlayersList(players);
        })
        getEcho().channel('game.' + gameId())
            .listen('CustomGameResults', function (message: any) {
                setMuffinResult(message.results);
            });

        setTimeout(() => {
            axios.post(host() + '/api/game/results', {
                game: gameId(),
                results: null,
                customName: 'Muffin'
            });
        }, 2000, );

        return () => {
            getEcho().channel('game.' + gameId()).stopListening('CustomGameResults');
        }
    }, []);
    if (!playersList) {
        return <></>
    }

    let i= 0;
    return (<><div className={"candidates-list"}>
        {results.map((result: MuffinResult) => getResult(result, i++, playersList))}
    </div>
        {isHost() ? <ShowHideQuestionButton/> : <></>}
    </>)
}

function getResult(result: MuffinResult, key: number, playersList: any): null|JSX.Element {
    let hashedPlayer: Player = {name: 'Невідомий гравець', score: '', img: '', title: '', hash: ''};
    playersList.forEach((player: Player) => {
        if (player.hash === result.hash) {
            hashedPlayer = player;
        }
    });
    return <div key={key} className={"candidate"}><hr />{hashedPlayer.name}:<br/> Оцінка: {(result.grade)}<br /> Поінти: {result.points} <br /> Точність: {result.accuracy} <br/> Бали сігніля: {result.signilPoints} <hr /></div>

}