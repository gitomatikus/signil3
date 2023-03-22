import React, {useEffect} from "react";
import localforage from "localforage";
import {NavigateFunction, useNavigate, useSearchParams} from "react-router-dom";
import {getEcho} from "../Events/Echo";
import {gameId} from "./InitGame";
import { useLocation } from 'react-router-dom'

export default function Header()
{
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(new URLSearchParams(document.location.search));

        useEffect(() => {
            getEcho().channel('game.' + gameId())
                .listen('HideQuestion', function (message: any) {
                    window.history.pushState({}, document.title, window.location.pathname);
                    navigate('/', {replace: true});
                });
            return () => {
                getEcho().channel('game.' + gameId()).stopListening('HideQuestion');
            }
        }, [])

    function reloadPack()
    {
        alert('Пак буде перезавантажено');
        localforage.removeItem('pack');
        localStorage.removeItem('control')
        localStorage.removeItem('closed_questions')

        navigate('/')
    }

    return (<div><h1 id={"signil-header"}>SiGnil<span id={"signil-version"} onClick={reloadPack}>3</span></h1></div>)

}