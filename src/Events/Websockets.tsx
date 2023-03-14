import Echo from "laravel-echo";
import {useEffect} from "react";
import {createSocketConnection} from "./socketService";

function WebSockets() {



    useEffect(() => {
        createSocketConnection()

    }, [])

    return (<> </>)
}


export default WebSockets;

