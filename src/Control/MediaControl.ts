import {useEffect} from "react";
import isHost from "../Storage/IsHost";
import {gameId, host} from "../Game/InitGame";
import {getEcho} from "../Events/Echo";
import axios from "axios";
import {useLocation} from "react-router-dom";

export default function useMediaAutostart(message: any) {
    const location = useLocation();

    useEffect(() => {
            setTimeout(function() {
                let field = document.getElementById('signil-question')
                if(location.pathname === '/answer') {
                    field = document.getElementById('signil-answer');
                }
                if (!field) {
                    return
                }
                let audio = field.getElementsByTagName('audio')
                console.log(audio, audio.length);
                if (audio?.[0]) {
                    console.log('play audio')
                    audio[0].controls = true;
                    audio[0].volume = 0.5;
                    audio[0].play();
                    if (isHost()) {
                        audio = document.getElementsByTagName('audio')
                        audio[0].onplay = function() {
                            axios.post(host()+'/api/media/', {
                                state: "play",
                                game: gameId()
                            });
                        }
                        audio[0].onpause = function() {
                            axios.post(host()+'/api/media/', {
                                state: "pause",
                                game: gameId()
                            });
                        }
                    }
                } else {
                    let video = field.getElementsByTagName('video')
                    if (video?.[0]) {
                        video[0].play();
                        if (isHost()) {
                            video = document.getElementsByTagName('video')
                            video[0].onplay = function() {
                                axios.post(host()+'/api/media/', {
                                    state: "play",
                                    game: gameId()
                                });
                            }
                            video[0].onpause = function() {
                                axios.post(host()+'/api/media/', {
                                    state: "pause",
                                    game: gameId()
                                });
                            }
                        }
                    }
                }
            },  500);
    }, [message]);
}

export function useMediaControl()
{
    useEffect(() => {
        document.addEventListener("load", addControl);
        function addControl() {
            console.log('document loaded');
            document.onload = function() {
                if (isHost()) {
                    let audio = document.getElementsByTagName('audio')
                    if (audio?.[0]) {
                        audio[0].onplay = function() {
                            axios.post(host()+'/api/media/', {
                                state: "play",
                                game: gameId()
                            });
                        }
                        audio[0].onpause = function() {
                            axios.post(host()+'/api/media/', {
                                state: "pause",
                                game: gameId()
                            });
                        }
                    } else {
                        let video = document.getElementsByTagName('video')
                        console.log(video)
                        if (video?.[0]) {
                            console.log('asd')
                            video[0].onplay = function() {
                                axios.post(host()+'/api/media/', {
                                    state: "play",
                                    game: gameId()
                                });
                            }
                            video[0].onpause = function() {
                                axios.post(host()+'/api/media/', {
                                    state: "pause",
                                    game: gameId()
                                });
                            }
                        }
                    }
                }
            }
        }

    }, [])

}
export function useSubscriberToMediaStatus() {
    useEffect(() => {
        getEcho().channel('game.' + gameId())
            .listen('Media', function (message: any) {
                if (message.state === 'play') {
                    let audio = document.getElementsByTagName('audio')
                    if (audio.length > 0) {
                        console.log('audio played from event')
                        audio[0].play();
                    } else {
                        let video = document.getElementsByTagName('video')
                        if (video.length > 0) {
                            console.log('video played from event')
                            video[0].play();
                        }
                    }
                } else if (message.state === 'pause') {
                    let audio = document.getElementsByTagName('audio')
                    if (audio.length > 0) {
                        console.log('audio stopped from event')
                        audio[0].pause();
                    } else {
                        let video = document.getElementsByTagName('video')
                        if (video.length > 0) {
                            console.log('video stopped from event')
                            video[0].pause();
                        }
                    }
                }
            });
        return () => {
            getEcho().channel('game.' + gameId()).stopListening('Media');
        }
    }, [])
}