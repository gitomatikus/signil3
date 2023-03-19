import {useEffect, useState} from "react";

interface TimerProps {
    timer: number;
}
function Timer(timer: TimerProps) {
    const [counter, setCounter] = useState(timer.timer);
    useEffect(() => {
        counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
    }, [counter])
    return (<div id={"timer"}>{counter}</div>)
}
export default Timer;

