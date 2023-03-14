import {useLocation, useNavigate} from 'react-router-dom'
import {addClosedQuestions} from "../Pack/GetPack";
import {Rule, RuleType} from "../Pack/Pack";
import {useEffect, useState} from "react";
import ShowAnswer from "./Control";


function QuestionPage() {

    const [visible, setVisible] = useState(false)
    const location = useLocation()
    const { question } = location.state
    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        addClosedQuestions(question.id);

        let timer = 0;
        question.rules.forEach(function (rule: Rule) {
            showRule(rule)
            timer += rule.duration ?? 0;
        });

        setTimeout(function() {
            document.getElementById("answer-button")?.removeAttribute("hidden");
        }, timer * 1000);



        function showRule(rule: Rule) {
            setTimeout(function() {
                executeRule(rule)
            }, timer * 1000);
        }


        function executeRule(rule: Rule) {
            console.log(rule);
            switch (rule.type) {
                case RuleType.Embedded:
                    setMessage(rule.content ?? '');
                    return;
                case RuleType.App:
                    console.log(rule);
                    if (rule.path) {
                        navigate(rule.path, {state: {content: rule.content}});
                    }
            }
        }





    }, [])

    return (<div><div id="signil-question">{ message }</div> <div id={"answer-button"} hidden={true}><ShowAnswer question={question} /></div></div>)
}



export default QuestionPage;

