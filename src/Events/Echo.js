import Echo from "laravel-echo";



export function createSocketConnection() {

    let URL = "ws://206.189.1.146"


    window.io = require('socket.io-client');

    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: URL + ':6001'
    });




    window.Echo.channel('game.1')
        .listen('PackHosted', function (message) {
            console.log(message)
        });
    window.Echo.channel('game.1')
        .listen('Media', function(message) {
            console.log(message)
        });
}

export function getEcho()
{
    return window.Echo;
}