import {Pack, Question, QuestionType, Round, Theme} from "../Pack/Pack";
import {create} from "domain";


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

