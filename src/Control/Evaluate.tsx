import {Question} from "../Pack/Pack";
import axios from "axios";
import {gameId, host} from "../Game/InitGame";
import getPlayerScore from "../Storage/GetPlayerScore";
import {unmountComponentAtNode} from "react-dom";

export interface EvaluateProp {
    question: Question;
    name: string;
}
export default function Evaluate(props: EvaluateProp) {
    {
        let question = props.question;
        let name = props.name;
        let priceForCorrectAnswer = question.price?.correct;
        let symbol = priceForCorrectAnswer && priceForCorrectAnswer > 0 ? '+' : '';
        return <span>[
            <span className={"control incorrect"} onClick={() => acceptAnswer(name, question, false)}>{question.price?.incorrect}</span>|
            <span className={"control correct"} onClick={() => acceptAnswer(name, question, true)}>{symbol + question.price?.correct}</span>
        ]</span>
    }

    function acceptAnswer(name: string, question: Question, correct: boolean) {

        getPlayerScore(name).then((currentScore: string) => {
            let questionConst = correct ? question.price?.correct : question.price?.incorrect;
            let newScore = questionConst ? parseInt(currentScore) + questionConst : currentScore;
            axios.put(host() + '/api/user', {
                game: gameId(),
                username: name,
                score: newScore,
                control: correct
            });
        });
    }
}
