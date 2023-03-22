import React, {useEffect, useState} from 'react';
import Table from "./table/Table";
import Muffin from "./apps/Muffin/Muffin";
import {Routes, Route, MemoryRouter, BrowserRouter} from 'react-router-dom';
import Question from "./Question/Question";
import Game from "./Game/Game";
import Answer from "./Question/Answer";
import WebSockets from "./Events/Websockets";
import InitGame from "./Game/InitGame";
import PlayerList from "./Players/PlayerList";
import Header from "./Game/Header";
import MuffinResults from "./apps/Muffin/MuffinResults";

function App() {

    return (
        <div>
            <WebSockets />
            <MemoryRouter>
                <Header />
                <Routes>
                    <Route path="/" element={ <InitGame />} />
                    <Route path="/game" element={ <Game />} />
                    <Route path="/question" element={<Question />} />
                    <Route path="/answer" element={<Answer />} />
                    <Route path="/muffin" element={<Muffin />} />
                    <Route path="/muffin-results" element={<MuffinResults />} />
                </Routes>
            </MemoryRouter>
            <div className={"footer"}>
                <hr className={"player-list-distinguish"}/>
                <PlayerList />
            </div>

        </div>
    );
}

export default App;
