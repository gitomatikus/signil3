import {Question} from "../Pack/Pack";
import {useNavigate} from "react-router-dom";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";
import {useEffect, useState} from "react";
import {getEcho} from "../Events/Echo";

export default function ShowQuestionButton({question}: {question:Question | null})
{
    const navigate = useNavigate();

    const [hideButton, setHideButton] = useState<boolean>(true);
    useSubscribeToChooseQuestion(setHideButton)
    function handleClick() {
        if (!question) {
            console.log('No question to show')
        }
        axios.post(host() + '/api/question/show', {
            game: gameId(),
            question: question?.id,
        });
    }
    return (<button onClick={handleClick} hidden={hideButton} id={"show-question-button"}>Show Question</button>)
}

function useSubscribeToChooseQuestion(setHideButton: (hide: boolean) => void) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('QuestionChoosen', function (message: any) {
                setHideButton(false);
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('ChooseQuestion');
        }
    }, [])
}
