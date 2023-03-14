import { useLocation } from 'react-router-dom'
import getPack from "../Pack/GetPack";
import {Question, Rule, Theme} from "../Pack/Pack";
import {useCallback, useEffect, useState} from "react";
import ShowAnswer, {ShowTable} from "./Control";



function AnswerPage() {

    const [visible, setVisible] = useState(false)
    const location = useLocation()
    const { question } = location.state
    const [message, setMessage] = useState('');


    useEffect(() => {
        let timer = 0;
        question.after_round.forEach(function (rule: Rule) {
            showRule(rule)
            timer += rule.duration ?? 0;
        });
        setTimeout(function() {
            document.getElementById("go-to-table-button")?.removeAttribute("hidden");
        }, timer * 1000);
        function showRule(rule: Rule) {
            setTimeout(function() {
                console.log(rule.content);
                setMessage(rule.content ?? '');
            }, timer * 1000);
        }
    }, [])

    return (<div><div id="signil-answer">{ message }</div> <div id={"go-to-table-button"} hidden={true}><ShowTable question={question} /></div></div>)
}


export default AnswerPage;

