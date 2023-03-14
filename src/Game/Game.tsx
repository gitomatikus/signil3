import Table from "../table/Table";
import getPack from "../Pack/GetPack";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pack} from "../Pack/Pack";


function Game() {
    let round = localStorage.getItem('round') ?? 0;
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/table', {state: {round: round}});
    });

    return <></>
}





export default Game;

