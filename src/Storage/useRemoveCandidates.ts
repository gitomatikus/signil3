import {Question} from "../Pack/Pack";
import {useEffect} from "react";

export default function useRemoveCandidates(question: Question) {
    useEffect(() => {
        localStorage.removeItem('candidates-' + question.id);
    }, [])
}
