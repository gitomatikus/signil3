import './MiniOsu.css';
import React, {RefObject, useEffect, useRef} from "react";
import {Question, Rule} from "../../Pack/Pack";
import ShowHideQuestionButton from "../../Control/ShowHideQuestionButton";
import isHost from "../../Storage/IsHost";
import OsuCandidates, {becameCandidate} from "./OsuCandidates";
import useRemoveCandidates from "../../Storage/useRemoveCandidates";
import Timer from "../../Question/Timer";
import getDuration from "../../Storage/getDuration";
import {useLocation} from "react-router-dom";
interface OsuClickerProps {
    clickCount: number;
}
export default function MiniOsuFaker(OsuClickerProps: OsuClickerProps) {
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [topFake, setTopFake] = React.useState(0);
    const [leftFake, setLeftFake] = React.useState(0);
    const [clickCount, setClickCount] = React.useState(0);
    const [startTime, setStartTime] = React.useState(getCurrentTimestamp);
    const [updateCount, setUpdateCount] = React.useState(0);

    useChangeInterval(setUpdateCount, updateCount)
    const location = useLocation()
    const { question } = location.state
    useRemoveCandidates(question)

    function clickHandler(startTime:number, question:Question) {
        if (clickCount < OsuClickerProps.clickCount) {
            setClickCount(clickCount + 1);
        } else {
            becameCandidate(startTime, question)
        }
    }


    useEffect(() => {
        const gamezone = document.getElementById("gamezone")
        if (!gamezone) {
            return;
        }
        let maxWidth = gamezone.clientWidth;
        let maxHeight = gamezone.clientHeight;
        setTop(Math.floor(Math.random() * maxHeight));
        setLeft(Math.floor(Math.random() * maxWidth));
        setTopFake(Math.floor(Math.random() * maxHeight));
        setLeftFake(Math.floor(Math.random() * maxWidth));

        let miniOsuButton = document.getElementById("miniosubutton")
        if (!miniOsuButton) {
            return;
        }
    }, [updateCount, clickCount])
    return <>
        <Timer timer={getDuration(question)}/>
        <h1 className={"round-name"}>Клацни 6 раз на зелену кнопку</h1>
        {<div id={"gamezone"} className={"gamezone"}>
            <div id={"miniosudiv"} className="round-button" style={{position: 'relative', top: top, left: left, transform: 'translate(-50%, -50%)'}}>
                <div id={"miniosubutton"} className="round-button-circle"><a href="#" className="round-button" style={{background:"#34a954"}} onClick={()=>clickHandler(startTime, question)}>Click me!!</a></div>
            </div>
            <div id={"miniosudiv"} className="round-button" style={{position: 'relative', top: topFake, left: leftFake, transform: 'translate(-50%, -50%)'}}>
                <div id={"miniosubutton"} className="round-button-circle"><a href="#" className="round-button" style={{background:"#b0b231"}} onClick={()=>alert('Неправильна кнопка')}>Click me!!</a></div>
            </div>
        </div>}
        <OsuCandidates question={question}/>
        {isHost() ? <ShowHideQuestionButton /> : <></>}
    </>
}


function getCurrentTimestamp () {
    return Date.now()
}

function useChangeInterval(setUpdateCount:any, updateCount:number) {
    useEffect(() => {
        setInterval(() => {
            setUpdateCount(getCurrentTimestamp() + 1)
        }, 570)
    }, [])
}