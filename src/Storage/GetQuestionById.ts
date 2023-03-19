import {Question, Round, Theme} from "../Pack/Pack";
import getPack from "./GetPack";

export async function getQuestionById(id: string): Promise<Question | null>
{
    console.log('getQuestionById: ' + id)
    let chosenQuestion = null;
    let  pack = await getPack();
    pack.rounds.forEach(function (round: Round) {
        round.themes.forEach(function (theme: Theme) {
            theme.questions.forEach(function (question: Question) {
                if (question.id.toString() === id) {
                    chosenQuestion = question;
                }
            });
        });
    });
    return chosenQuestion ?? null;
}
