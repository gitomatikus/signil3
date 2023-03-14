import React from 'react';
import Table from "./table/Table";
import Muffin from "./apps/Muffin/Muffin";
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import Question from "./Question/Question";
import Game from "./Game/Game";
import Answer from "./Question/Answer";

function App() {
    return (
        <div>
            <h1 id={"signil-header"}>SiGnil3</h1>
            <Routes>
                <Route path="/" element={ <Game />} />
                <Route path="/table" element={ <Table/>} />
                <Route path="/question" element={<Question />} />
                <Route path="/answer" element={<Answer />} />
                <Route path="/muffin" element={<Muffin />} />
            </Routes>
        </div>
    );
}

export default App;
