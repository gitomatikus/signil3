import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom'
import {addClosedQuestions} from "../Pack/GetPack";
import {Rule, RuleType} from "../Pack/Pack";
import {useEffect, useState} from "react";
import Timer from "./Timer";
import Candidates from "./Candidates";
import {getEcho} from "../Events/Echo";
import {gameId} from "../Game/InitGame";
import {getQuestionById} from "../Storage/GetQuestionById";
import isHost from "../Storage/IsHost";
import ShowAnswer from "../Control/ShowAnswer";
import Answer from "./Answer";


function QuestionPage() {

    const [counter, setCounter] = useState(60);
    const location = useLocation()
    const { question } = location.state
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useSubscribeToAnswerShow(navigate);

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
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);

        function executeRule(rule: Rule) {
            switch (rule.type) {
                case RuleType.Embedded:
                    setMessage(rule.content ?? '');
                    return;
                case RuleType.App:
                    if (rule.path) {
                        navigate(rule.path, {state: {content: rule.content}});
                    }
            }
        }
    }, [])

    let timer = 0;
    question.rules.forEach(function (rule: Rule) {
        timer += rule.duration ?? 0;
    });
    return (<div>
        <Timer timer={timer} />
        <div id="signil-question">{ message }</div> <div id={"answer-button"}>{isHost() ? <ShowAnswer question={question} /> : <></>}</div>
        <Candidates question={question}/>
        {isHost() ? <><hr /><span className={"round-name"}>Відповідь:</span> <Answer /> </>: <></>}
    </div>)
}



export default QuestionPage;


function useSubscribeToAnswerShow(navigate: NavigateFunction)
{
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('ShowAnswer', function (message: any) {
                getQuestionById(message.question).then((question)=> {
                    if (question) {
                        navigate('/answer', {state: {question: question}
                        })
                    }
                });
        });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('ShowAnswer');
        }
    }, [])
}
