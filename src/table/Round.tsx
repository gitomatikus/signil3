import {useEffect, useState} from "react";
import getPack from "../Storage/GetPack";
import axios from "axios";
import {gameId, host} from "../Game/InitGame";
import isHost from "../Storage/IsHost";
import {useNavigate} from "react-router-dom";

interface RoundProps {
    round_number: string;
}
export default function Round(RoundProps: RoundProps) {

        const round:number = parseInt(RoundProps.round_number);
        const navigate = useNavigate();

        const [roundName, setRoundName] = useState<string>('');
        const [maxRounds, setMaxRounds] = useState<number | null>(null);
        let cantCanGoLeft = round <= 0 || !isHost();
        let cantCanGoRight = (maxRounds !== null && round >= maxRounds) || !isHost();
        useEffect(() => {
            let packPromise = getPack();
            packPromise.then((pack) => {
                if (!pack) {
                    return;
                }
                setRoundName(pack.rounds[round].name ?? '');
                setMaxRounds(pack.rounds.length - 1)
            });
        }, [round]);
        return <div className="round-name">
            <span hidden={cantCanGoLeft} className={"control"} onClick={() => handleClick(round - 1)}>&lt;&nbsp;</span>
                {roundName}
            <span hidden={cantCanGoRight} className={"control"} onClick={() => handleClick(round + 1)}>&nbsp;&gt;</span>
        </div>
    }
    function handleClick(round: number) {
        axios.post(host() + '/api/round/change', {game: gameId(), round: round})
    }
