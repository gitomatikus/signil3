import React, {useEffect, useState} from 'react';
import Table from "./table/Table";
import Muffin from "./apps/Muffin/Muffin";
import {Routes, Route, MemoryRouter, NavigateFunction, useNavigate} from 'react-router-dom';
import Question from "./Question/Question";
import Game from "./Game/Game";
import Answer from "./Question/Answer";
import WebSockets from "./Events/Websockets";
import InitGame, {gameId} from "./Game/InitGame";
import PlayerList from "./Players/PlayerList";
import {getEcho} from "./Events/Echo";

function App() {
    const navigate = useNavigate();
    useSubscribeToHideQuestion(navigate);
    return (
        <div>
            <WebSockets />
            <div><h1 id={"signil-header"}>SiGnil<span id={"signil-version"}>3</span></h1></div>
            <Routes>
                <Route path="/" element={ <InitGame />} />
                <Route path="/game" element={ <Game />} />
                <Route path="/question" element={<Question />} />
                <Route path="/answer" element={<Answer />} />
                <Route path="/muffin" element={<Muffin />} />
            </Routes>
            <div className={"footer"}>
                <hr className={"player-list-distinguish"}/>
                <PlayerList />
            </div>

        </div>
    );
}

export default App;



function useSubscribeToHideQuestion(navigate: NavigateFunction) {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('HideQuestion', function (message: any) {
                navigate('/')
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('HideQuestion');
        }
    }, [])
}
