import {useLocation} from 'react-router-dom'
import {Rule} from "../Pack/Pack";
import {useEffect, useState} from "react";
import ShowHideQuestionButton from "../Control/ShowHideQuestionButton";
import isHost from "../Storage/IsHost";
import useMediaAutostart, {useMediaControl, useSubscriberToMediaStatus} from "../Control/MediaControl";


function AnswerPage() {

    const location = useLocation()
    const { question } = location.state
    const [message, setMessage] = useState('');

    useSubscriberToMediaStatus()
    useMediaAutostart(message)
    useMediaControl()

    useEffect(() => {
        localStorage.removeItem('candidates-'+question.id)
        let timer = 0;
        question.after_round.forEach(function (rule: Rule) {
            showRule(rule)
            timer += rule.duration ?? 0;
        });
        function showRule(rule: Rule) {
            setTimeout(function() {
                setMessage(rule.content ?? '');
            }, timer * 1000);
        }
    }, [])

    return (<div><br />
        <div id="signil-answer">
            <div dangerouslySetInnerHTML={{__html: message}}/>
        </div> <div id={"go-to-table-button"}> {isHost() ? <ShowHideQuestionButton /> : <></>}</div></div>)
}


export default AnswerPage;


