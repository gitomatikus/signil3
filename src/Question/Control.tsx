import {NavLink, useLocation} from 'react-router-dom'
import getPack from "../Pack/GetPack";
import {Question, Rule, Theme} from "../Pack/Pack";
import {useCallback, useEffect, useState} from "react";



export  default function ShowAnswer({question}: {question:Question})
{
    return ( <div>
        <NavLink to="/answer" state={{ question: question}}>
            <button>Show Answer</button>
        </NavLink>
    </div>)
}

export function ShowTable({question}: {question:Question})
{
    return ( <div>
        <NavLink to="/">
            <button>Back to game</button>
        </NavLink>
    </div>)
}

