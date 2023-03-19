import {Question} from "../Pack/Pack";
import axios from "axios";
import {gameId, host} from "../Game/InitGame";
import getPlayerScore from "../Storage/GetPlayerScore";
import {unmountComponentAtNode} from "react-dom";
import {useState} from "react";

export interface EvaluateProp {
    question: Question;
    name: string;
}

interface payload {
    game: string;
    username: string;
    score: number;
    control?: boolean;
}
enum buttonsVisibility {
    both = 0,
    correct = 1,
    incorrect = 2,
}
export default function Evaluate(props: EvaluateProp) {
    {
        const [visibility, setVisibility] = useState<buttonsVisibility>(buttonsVisibility.both);
        let question = props.question;
        let name = props.name;
        let priceForCorrectAnswer = question.price?.correct;
        let symbol = priceForCorrectAnswer && priceForCorrectAnswer > 0 ? '+' : '';
        console.log(visibility !== buttonsVisibility.correct, 'visibility');
        return <span>[
            <span hidden={visibility === buttonsVisibility.correct} className={"control incorrect"} onClick={() => visibility === buttonsVisibility.both ?  acceptAnswer(name, question, false, setVisibility) : ''}>{question.price?.incorrect}</span>
            <span hidden={visibility !== buttonsVisibility.both}>|</span>
            <span hidden={visibility === buttonsVisibility.incorrect} className={"control correct"} onClick={() => visibility === buttonsVisibility.both ? acceptAnswer(name, question, true, setVisibility) : ''}>{symbol + question.price?.correct}</span>
        ]</span>
    }

    function acceptAnswer(name: string, question: Question, correct: boolean, setVisibility: (value: buttonsVisibility) => void) {

        getPlayerScore(name).then((currentScore: string) => {
            let intScore = parseInt(currentScore);
            intScore = Number.isNaN(intScore) ? 0 : intScore;
            let questionCost = correct ? question.price?.correct : question.price?.incorrect;
            let newScore = questionCost ? intScore + questionCost : currentScore;
            let payload = {
                game: gameId(),
                username: name,
                score: newScore,
            } as payload;
            if (correct) {
                payload["control"] = true;
            }
            axios.put(host() + '/api/user', payload);
            setVisibility(correct ? buttonsVisibility.correct : buttonsVisibility.incorrect);
        });
    }
}
