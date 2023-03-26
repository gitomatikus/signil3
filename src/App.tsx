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
import MiniOsu1 from "./apps/MiniOsu/MiniOsu1";
import MiniOsuClicker from "./apps/MiniOsu/MiniOsuClicker";
import MiniOsuFindButton from "./apps/MiniOsu/MiniOsuFindButton";
import MiniOsuClickerWithTimer from "./apps/MiniOsu/MiniOsuClickerWithTimer";
import MiniOsuFaker from "./apps/MiniOsu/MiniOsuFaker";
import FindACat from "./apps/Woolley/FindACat";

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
                    <Route path="/mini-osu" element={<MiniOsu1 />} />
                    <Route path="/mini-osu-clicker" element={<MiniOsuClicker clickCount={5} />} />
                    <Route path="/mini-osu-find" element={<MiniOsuFindButton />} />
                    <Route path="/mini-osu-clicker-timer" element={<MiniOsuClickerWithTimer clickCount={5}/>} />
                    <Route path="/mini-osu-faker" element={<MiniOsuFaker clickCount={5}/>} />
                    <Route path="/find-a-cat" element={<FindACat />} />
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
