import './MiniOsu.css';
import React, {RefObject, useEffect, useRef} from "react";
import Candidates from "../../Question/Candidates";
import {useLocation} from "react-router-dom";
import {Question, Rule} from "../../Pack/Pack";
import ShowHideQuestionButton from "../../Control/ShowHideQuestionButton";
import isHost from "../../Storage/IsHost";
import OsuCandidates, {becameCandidate} from "./OsuCandidates";
import axios from "axios";
import {gameId, host} from "../../Game/InitGame";
import {getPlayer} from "../../Players/Player";
import useRemoveCandidates from "../../Storage/useRemoveCandidates";
import Timer from "../../Question/Timer";
import getDuration from "../../Storage/getDuration";

export default function MiniOsuFindButton() {
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [startTime, setStartTime] = React.useState(0);
    const location = useLocation()
    const { question } = location.state
    useRemoveCandidates(question)

    useEffect(() => {
        const gamezone = document.getElementById("gamezone")
        if (!gamezone) {
            return;
        }
        setStartTime(getCurrentTimestamp());
        let maxWidth = gamezone.clientWidth;
        let maxHeight = gamezone.clientHeight;
        setTop(Math.floor(Math.random() * maxHeight));
        setLeft(Math.floor(Math.random() * maxWidth));

        let miniOsuButton = document.getElementById("miniosubutton")
        if (!miniOsuButton) {
            return;
        }
    }, [])
    return <>
        <h1 className={"round-name"}>Знайди кнопку</h1>
        <Timer timer={getDuration(question)} ></Timer>
        {<div id={"gamezone"} className={"gamezone"}>
                    <div id={"miniosudiv"} className="round-button-find" style={{position: 'relative', top: top, left: left, transform: 'translate(-50%, -50%)'}}>
                        <div id={"miniosubutton"} className="round-button-circle-find"><a href="#" className="round-button-find" onClick={()=>becameCandidate(startTime, question)}></a></div>
                    </div>
                </div>}
        <OsuCandidates question={question}/>
        {isHost() ? <ShowHideQuestionButton /> : <></>}
        </>
}


function getCurrentTimestamp () {
    return Date.now()
}

