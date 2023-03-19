import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import getPack from "../Storage/GetPack";
import {Pack, Question, Round, Rule, Theme} from "../Pack/Pack";
import {useCallback, useEffect, useState} from "react";
import {gameId, host} from "../Game/InitGame";
import axios, {Axios} from "axios";



export  default function ShowAnswer({question}: {question:Question})
{
    const navigate = useNavigate();
    function handleClick() {
        axios.post(host() + '/api/answer/show', {
            game: gameId(),
            question: question.id,
        });
    }
    return ( <div>
            <button onClick={handleClick}>Show Answer</button>
    </div>)
}




