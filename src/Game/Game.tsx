import './Game.css';
import Table from "../table/Table";
import getPack from "../Pack/GetPack";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {Pack} from "../Pack/Pack";
import PlayerList from "../Players/PlayerList";
import HostCard from "../Host/HostCard";
import Player from "../Players/Player";


function Game() {
    return <div>
        <Player />
        <br />
        <div className={"table-and-host"}>
            <Table />
            <HostCard/>
        </div>
        <br />
        <br />
        <br />
        <hr />
        <PlayerList />
    </div>
}





export default Game;

