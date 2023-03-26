import React, {useEffect} from "react";

import {Area, ImageMap} from "@qiuz/react-image-map";
import {useLocation} from "react-router-dom";
import useRemoveCandidates from "../../Storage/useRemoveCandidates";
import Timer from "../../Question/Timer";
import getDuration from "../../Storage/getDuration";
import OsuCandidates, {becameCandidate} from "../MiniOsu/OsuCandidates";
import isHost from "../../Storage/IsHost";
import ShowHideQuestionButton from "../../Control/ShowHideQuestionButton";
import Candidates from "../../Question/Candidates";
import {getCurrentTimestamp} from "../MiniOsu/MiniOsu1";
const counter:boolean[] = [];



// in hooks
export default function FindACat() {

    const location = useLocation()
    const { question } = location.state
    useRemoveCandidates(question)
    const [startTime, setStartTime] = React.useState(getCurrentTimestamp());
    const [counter, setCounter] = React.useState<boolean[]>([]);


    const img = question.rules[0].content;
    const mapArea: any[] = JSON.parse(question.rules[1].content);

    const onMapClick = (area: Area, index: number) => {
        const tip = `click map${area.href || index + 1}`;
        let gameCounter = counter;
        console.log(gameCounter);
        if (gameCounter[index] === undefined) {
            alert('Кота знайдено!')
            gameCounter[index] = true;
        } else {
            alert('Цього Кота вже було знайдено!')
        }
        let i = 0;
        gameCounter.forEach((value, index) => i++);
        if (i === mapArea.length) {
            becameCandidate(startTime, question);
            alert('Вітаю!! Ти знайшов усіх котів!');
        } else {
            alert('Але ще є котики, яких треба знайти!');
        }
        setCounter(gameCounter)
    };
    const ImageMapComponent = React.useMemo(
        () => (
            <ImageMap
                src={img}
                map={mapArea}
                onMapClick={onMapClick}
            />
        ),
        [img]
    );

    console.log(mapArea.length);
    return <>
        <Timer timer={getDuration(question)} ></Timer>
        <h1 className={"round-name"}>Знайди всіх котів!</h1>
        <div id={"wooley-field"} style={{display:"flex"}}>
            <div style={{margin:"auto"}} className={"find-wooley"}>
                {ImageMapComponent}
            </div>
        </div>
        <Candidates question={question}/>
        {isHost() ? <ShowHideQuestionButton /> : <></>}
    </>;
}

