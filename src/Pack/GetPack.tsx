import {Pack, Question, QuestionType, Round, Theme} from "../Pack/Pack";
import {create} from "domain";


function getPack(): Pack {

    let pack = localStorage.getItem('pack');
    if (!pack) {
        const request = new XMLHttpRequest();
        request.open('GET', 'http://localhost:3000/pack.json', false);  // `false` makes the request synchronous
        request.send(null);
        pack = request.responseText;
        localStorage.setItem('pack', pack);
    }
    return  JSON.parse(pack) as Pack;
}

export function getClosedQuestions(): number[]
{
    let questions = localStorage.getItem('closed_questions');
    if (!questions) {
        return [];
    }
    return JSON.parse(questions) as number[];
}

export function addClosedQuestions(questionId: number)
{
    let closedQuestions = getClosedQuestions();
    closedQuestions.push(questionId);
    localStorage.setItem('closed_questions', JSON.stringify(closedQuestions));
}

export default getPack();

