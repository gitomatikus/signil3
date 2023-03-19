// import {Ref, RefObject, useEffect, useRef, useState} from "react";
// import {getEcho} from "../Events/Echo";
// import {gameId, host, Role, role} from "../Game/InitGame";
// import axios from "axios";
// import {getPlayer} from "../Players/Player";
//
//

import {RefObject, useEffect, useRef, useState} from "react";
import {getEcho} from "../Events/Echo";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";
import {getPlayer} from "../Players/Player";
import {Question} from "../Pack/Pack";
import question from "./Question";
import Evaluate from "../Control/Evaluate";
import {NavigateFunction} from "react-router-dom";
import isHost from "../Storage/IsHost";
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

    const wrapperRef = useRef(null);
    useClickHandler(wrapperRef, question.question);

    let i = 0;
    return (<div ref={wrapperRef} className={"candidates-list"}>
        {candidates.map((candidate: Candidate) => getCandidate(candidate.name ?? '', candidate.time?.toString() ?? '', i++, question.question))}
    </div>)
}

function getCandidate(name:string, time:string, key: number, question: Question): JSX.Element {
    let timeInSeconds = (parseInt(time)/1000).toString();
    let evaluateProps = {question: question, name: name} as QuestionProp;
    return <div key={key} className={"candidate"}>{name}: {(timeInSeconds).toString()} {isHost() ? <Evaluate question={question} name={name} /> : ''}</div>
}
function getCurrentTimestamp () {
    return Date.now()
}
//
function becameCandidate(questionStartTime: number, question: Question)
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

//
function useClickHandler(ref: RefObject<any>, question:Question) {
    useEffect(() => {
        let questionStartTime = getCurrentTimestamp();
        function handleClickOutside(event:any) {
            if (ref.current && (event?.button === 2 || event?.key === ' ' || event?.key === "Space")) {
                if (event?.button === 2) {
                    event.preventDefault();
                }
                becameCandidate(questionStartTime, question);
            }
        }

        // Bind the event listener
        document.addEventListener("contextmenu", handleClickOutside);
        document.addEventListener("keyup", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("contextmenu", handleClickOutside);
            document.removeEventListener("keyup", handleClickOutside);

        };
    }, [ref]);
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
    localStorage.setItem('candidates-' + question.id, JSON.stringify(candidates));
    return candidates;
}
