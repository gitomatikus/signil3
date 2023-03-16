import Table from "../table/Table";
import getPack from "../Pack/GetPack";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pack} from "../Pack/Pack";


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