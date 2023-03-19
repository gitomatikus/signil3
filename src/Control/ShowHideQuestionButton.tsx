import {Question} from "../Pack/Pack";
import {useNavigate} from "react-router-dom";
import {gameId, host} from "../Game/InitGame";
import axios from "axios";

export default function ShowHideQuestionButton()
{
    function handleClick() {
        axios.post(host() + '/api/question/hide', {
            game: gameId(),
        });
    }
    return (<button onClick={handleClick} id={"show-back-to-table-button"}>Back To Game</button>)
}
