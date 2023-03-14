import Echo from "laravel-echo";



export function createSocketConnection() {

    let URL = "206.189.1.146:6001"


    window.io = require('socket.io-client');

    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: URL + ':6001'
    });
    window.Echo.connector.socket.on('connect', function(){
        this.isConnected = true
    })

    window.Echo.connector.socket.on('disconnect', function(){
        this.isConnected = false
    })



    window.Echo.channel('game.1')
        .listen('ChangeRound', function (message) {
            console.log(message);
        })

    // if (!window.Echo) {
    //     window.io = io;
    //     window.Echo = new Echo({
    //         broadcaster: 'socket.io',
    //         host: "206.189.1.146:6001",
    //         transports: ["websocket", "polling", "flashsocket"],
    //     });
    //
    //     window.Echo.channel('game.1').listen('ChangeRound', function (e: any) {
    //         console.log(e);
    //     });
    // }
}