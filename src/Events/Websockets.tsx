import Echo from "laravel-echo";
import {useEffect} from "react";
import {createSocketConnection, getEcho} from "./Echo";
import {NavigateFunction, useNavigate} from "react-router-dom";
import {gameId} from "../Game/InitGame";

function WebSockets() {

    useEffect(() => {
        createSocketConnection()
    }, [])
    return (<> </>)
}


export default WebSockets;
