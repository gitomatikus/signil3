import './MiniOsu.css';
import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {Question} from "../../Pack/Pack";
import ShowHideQuestionButton from "../../Control/ShowHideQuestionButton";
import isHost from "../../Storage/IsHost";
import OsuCandidates, {becameCandidate} from "./OsuCandidates";
import useRemoveCandidates from "../../Storage/useRemoveCandidates";
import getDuration from "../../Storage/getDuration";
import Timer from "../../Question/Timer";
interface OsuClickerProps {
    clickCount: number;
}
export default function MiniOsuClicker(OsuClickerProps: OsuClickerProps) {
    const [top, setTop] = React.useState(0);
    const [left, setLeft] = React.useState(0);
    const [clickCount, setClickCount] = React.useState(0);
    const [startTime, setStartTime] = React.useState(getCurrentTimestamp);
    const location = useLocation()
    const { question } = location.state

    useRemoveCandidates(question)

    function clickHandler(startTime:number, question:Question) {
        if (clickCount < OsuClickerProps.clickCount) {
            setClickCount(clickCount + 1);
        } else {
            console.log('asda')
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

        let miniOsuButton = document.getElementById("miniosubutton")
        if (!miniOsuButton) {
            return;
        }
    }, [clickCount])
    return <> <Timer timer={getDuration(question)} ></Timer>{<div id={"gamezone"} className={"gamezone"}>
                    <div id={"miniosudiv"} className="round-button" style={{position: 'relative', top: top, left: left, transform: 'translate(-50%, -50%)'}}>
                        <div id={"miniosubutton"} className="round-button-circle"><a href="#" className="round-button" onClick={()=>clickHandler(startTime, question)}>Click me!!</a></div>
                    </div>
                </div>}
        <OsuCandidates question={question}/>
        {isHost() ? <ShowHideQuestionButton /> : <></>}
        </>
}


function getCurrentTimestamp () {
    return Date.now()
}

