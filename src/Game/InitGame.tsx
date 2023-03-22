import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {getPlayer} from "../Players/Player";
import getPack from "../Storage/GetPack";


function InitGame() {

    const searchParams = new URLSearchParams(document.location.search)

    searchParams.get('tutorial')

    let round = localStorage.getItem('round') ?? 0;
    const navigate = useNavigate();

    useEffect(() => {
        let route = searchParams.get("route")
        switch (route) {
            case 'muffin-results':
                navigate('/muffin-results', {state: {round: round}});
                return;
            default:
                navigate('/game', {state: {round: round}});
                return;
        }
    }, []);

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