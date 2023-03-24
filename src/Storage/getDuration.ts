import {Question} from "../Pack/Pack";

export default function getDuration(question: Question): number
{
    let duration = 0;
    question.rules?.forEach((rule) => {
        duration += rule.duration ?? 0;
    });
    return duration ?? 15
}
