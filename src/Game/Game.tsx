import './Game.css';
import Table from "../table/Table";
import {useEffect, useState} from "react";
import {Pack, Question} from "../Pack/Pack";
import HostCard from "../Host/HostCard";
import Player from "../Players/Player";
import ShowQuestionButton from "../Control/ShowQuestionButton";
import {getEcho} from "../Events/Echo";
import {gameId, host} from "./InitGame";
import {getQuestionById} from "../Storage/GetQuestionById";
import isHost from "../Storage/IsHost";
import Round from "../table/Round";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import localforage from "localforage";
import {Simulate} from "react-dom/test-utils";
import load = Simulate.load;
import getPack from "../Storage/GetPack";


function Game() {
    console.log('game')
    const [chosenQuestion, setChosenQuestion] = useState<Question | null>(null);
    useSubscribeToChooseQuestion(setChosenQuestion);


    const location = useLocation()
    const {round} = location.state
    const [downloadProgress, setDownloadProgress] = useState<number|null>(null);
    const [pack, setPack] = useState<Pack|null>(null);
    usePackHostedSubscriber(setDownloadProgress);
    console.log(pack);

    useEffect(() => {
        let packPromise = getPack(setDownloadProgress);
        packPromise.then((pack: Pack|null) => {
            if (!pack){
                return
            }
            setPack(pack);
        })
    }, [])
    console.log('ingameProgress', downloadProgress)

    const [currentRound, setCurrentRound] = useState<number>(round);
    useChangeRoundSubscriber(setCurrentRound);
    return <div>
        <Player />
        {downloadProgress && downloadProgress < 100 ? <div className={"download-progress"}><h1>Скачування: {downloadProgress}%</h1></div> : <></>}
        <br />
        <Round round_number={currentRound.toString()}/>
        <div className={"table-and-host"}>
            {<Table round_number={currentRound} />}
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

function usePackHostedSubscriber(progressCallback: any = null)
{
    const navigator = useNavigate();
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('PackHosted', function (message: any) {
                console.log(host() + '/api/file/' + message.hash);
                let packPromis = loadPack(message.hash, progressCallback);
                packPromis.then((response) => {
                    let pack = response.data;
                    if (!pack?.rounds?.[0]?.themes[0]?.questions[0].rules) {
                        alert('Неправильний формат паку');
                        localforage.removeItem('pack');
                        return;
                    }
                    console.log('this failed')
                    localforage.setItem('pack', pack).then(() => {
                        localStorage.removeItem('closed_questions')
                        navigator('/')
                    });
                });
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('PackHosted');
        }
    }, [])
}
export async function loadPack(hash: string|null, setDownloadProgress: any = null) {
    if (!hash) {
        hash = 'singnil3NewFormatCurrent';
    }
   return axios({
        url: host() + '/api/file/' + hash,
        method: "GET",
        responseType: "json", // important
        onDownloadProgress: (progressEvent: any) => {
            let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total); // you can use this to show user percentage of file downloaded
            if (setDownloadProgress) {
                setDownloadProgress(percentCompleted);
            }
            console.log('downloading', percentCompleted);
        }
    })
}