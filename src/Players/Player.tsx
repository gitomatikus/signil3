import './PlayerList.css';
import {useState} from "react";
import {gameId, host} from "../Game/InitGame";
import axios, {AxiosResponse} from "axios";

interface Player {
    name: string;
}

export default function Player()
{


    const [name, setName] = useState('' as string);
    const [authorized, setAuthorized] = useState(false as boolean);
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const [image, setImage] = useState({} as any);

    const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        let files = event.target.files
        if (files && files[0]) {
            setImage(files[0]);
        }
    };


    function loginForm()
    {
        return <div>
            <div className={"player-control-login"}>
                <input id={"player-name"} type={"text"} name={"Введіть ім'я"} placeholder={"Ім'я"} onChange={handleNameChange} /><br />
                <input id={"player-image-picker"} type="file" multiple accept="image/*" onChange={selectFile}/>
                <button id={"login-button"} name={"Залогінитись"} placeholder={"Залогінитись"} onClick={login} value={"Login"}>Авторизуватись</button>
            </div>

        </div>
    }

    function getPlayerControl(name: string): JSX.Element
    {
        return <div className={"player-control-name"}><span>{name} </span> <span onClick={logout} className={"logout-button"}> &nbsp;[вийти]</span></div>
    }

    function login()
    {
        if (!name || !image) {
            alert('Ім\'я та Фото обов\'язкові для заповнення');
            return;
        }
        let data = new FormData();
        data.append('img', image, image.name);
        data.append('game', gameId());
        data.append('username', name);

        axios.post(host() + '/api/user/', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        }).then((response:AxiosResponse) => {
            if (response.status === 200) {
                localStorage.setItem('player', name);
                setAuthorized(true);
                setName(name)
                return;
            }
        });
    }

    function logout()
    {
        axios.delete(host() + '/api/user?game='+gameId()+'&username='+name);
        localStorage.removeItem('player');
        setAuthorized(false);
        setName('');
    }

    let player = getPlayer();
    if (!authorized && player) {
        setName(player.name);
        setAuthorized(true);
    }

    return authorized ? getPlayerControl(name) : loginForm();
}

export function getPlayer()
{
    let name = localStorage.getItem('player');
    return  name ? {name: localStorage.getItem('player')} as Player : null;
}