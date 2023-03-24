

import {RefObject, useEffect, useRef, useState} from "react";


import axios from "axios";
import {Question} from "../../Pack/Pack";
import isHost from "../../Storage/IsHost";
import Evaluate from "../../Control/Evaluate";
import {getPlayer} from "../../Players/Player";
import {gameId, host} from "../../Game/InitGame";
import {getEcho} from "../../Events/Echo";




interface QuestionProp {
    question: Question;
}
interface Candidate {
    name: string;
    time: string;
}
export default function Candidates(question: QuestionProp) {
    const [candidates, setCandidates] = useState([] as Candidate[]);

    useSubscribeToCandidates(candidates, setCandidates, question.question)


    let i = 0;
    return (<div  className={"candidates-list"}>
        {candidates.map((candidate: Candidate) => getCandidate(candidate.name ?? '', candidate.time?.toString() ?? '', i++, question.question))}
    </div>)
}

function getCandidate(name:string, time:string, key: number, question: Question): JSX.Element {
    let timeInSeconds = (parseInt(time)/1000).toString();
    return <div key={key} className={"candidate"}>{name}: {(timeInSeconds).toString()} {isHost() ? <Evaluate question={question} name={name} /> : ''}</div>
}
function getCurrentTimestamp () {
    return Date.now()
}
//
export function becameCandidate(questionStartTime: number, question: Question)
{
    if (isHost()) {
        return;
    }
    let currentTime = getCurrentTimestamp();
    let time = currentTime - questionStartTime;
    let candidates = getCandidatesFromStorage(question);

    let alreadyCandidate = false;
    candidates.forEach(function (candidate: Candidate) {
        if (candidate.name  === getPlayer()?.name) {
            alreadyCandidate = true;
        }
    });
    if (alreadyCandidate) {
        return;
    }
    axios.post(host()+'/api/ask/answer', {
        time: time.toString(),
        user: getPlayer()?.name,
        game: gameId()
    });
}
// //
function useSubscribeToCandidates(candidates: Candidate[], setCandidates: any, question: Question) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('GotAskForAnswer', function (message: any) {
                setCandidates(addCandidateToStorage({name: message.user, time: message.time} as Candidate, question));
            });
        return () => {
            getEcho().channel('game.' + gameId())
                .stopListening('GotAskForAnswer');
        }
    }, []);
}



function getCandidatesFromStorage(question: Question)
{
    let candidates = localStorage.getItem('candidates-' + question.id);
    return candidates ? JSON.parse(candidates) : [];
}
function addCandidateToStorage(candidate: Candidate, question: Question): Candidate[]
{
    let candidates = getCandidatesFromStorage(question);
    candidates.push(candidate);
    let sortedCandidates = candidates.sort(function (a: Candidate, b: Candidate) {
        return parseInt(a.time) - parseInt(b.time);
    });
    console.log(candidates);
    localStorage.setItem('candidates-' + question.id, JSON.stringify(sortedCandidates));
    return candidates;
}
