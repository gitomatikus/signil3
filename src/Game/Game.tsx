import './Game.css';
import Table from "../table/Table";
import {useEffect, useState} from "react";
import {Question} from "../Pack/Pack";
import HostCard from "../Host/HostCard";
import Player from "../Players/Player";
import ShowQuestionButton from "../Control/ShowQuestionButton";
import {getEcho} from "../Events/Echo";
import {gameId} from "./InitGame";
import {getQuestionById} from "../Storage/GetQuestionById";
import isHost from "../Storage/IsHost";
import Round from "../table/Round";
import {useLocation} from "react-router-dom";


function Game() {
    const [chosenQuestion, setChosenQuestion] = useState<Question | null>(null);
    useSubscribeToChooseQuestion(setChosenQuestion);


    const location = useLocation()
    const {round} = location.state

    const [currentRound, setCurrentRound] = useState<number>(round);
    useChangeRoundSubscriber(setCurrentRound);
    return <div>
        <Player />
        <br />
        <Round round_number={currentRound.toString()}/>
        <div className={"table-and-host"}>
            <Table round_number={currentRound} />
            <HostCard/>
        </div>
        {isHost() ? <ShowQuestionButton question={chosenQuestion} /> : <></>}
        <br />
        <br />
        <br />
    </div>
}




export default Game;

function useSubscribeToChooseQuestion(setChosenQuestion: (question: Question | null) => void) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('ChooseQuestion', function (message: any) {
                getQuestionById(message.question).then(question => {
                    setChosenQuestion(question);
                });
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('ChooseQuestion');
        }
    }, [])
}



function useChangeRoundSubscriber(setCurrentRound: (round: number) => void)
{
    useState(() => {
        getEcho().channel('game.1')
            .listen('ChangeRound', function (message: any) {
                setCurrentRound(message.round)
                localStorage.setItem('round', message.round)
            })
    })
}