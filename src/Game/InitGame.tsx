import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {getPlayer} from "../Players/Player";


function InitGame() {
    let round = localStorage.getItem('round') ?? 0;
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/game', {state: {round: round}});
    });

    return <></>
}





export default InitGame;

export function gameId(): string
{
    return '1'
}
export function host(): string
{
    return 'http://206.189.1.146'
}