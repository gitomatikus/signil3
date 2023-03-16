import Echo from "laravel-echo";



export function createSocketConnection() {

    let URL = "ws://206.189.1.146"


    window.io = require('socket.io-client');

    window.Echo = new Echo({
        broadcaster: 'socket.io',
        host: URL + ':6001'
    });


    window.Echo.channel('game.1')
        .listen('ChangeRound', function (message) {
            console.log(message);
        })

    window.Echo.channel('game.1')
        .listen('GotAskForAnswer', function(message) {
            console.log(message)
        });

    window.Echo.channel('game.1')
        .listen('ChooseQuestion', function (message) {
            console.log(message)
        });

    window.Echo.channel('game.1')
        .listen('PackHosted', function (message) {
            console.log(message)
        });
    window.Echo.channel('game.1')
        .listen('ChooseQuestion', function (message) {
            console.log(message)
        });
    window.Echo.channel('game.1')
        .listen('ShowQuestion', function (message) {
            console.log(message)
        });
    window.Echo.channel('game.1')
        .listen('ShowAnswer', function (message) {
            console.log(message)
        });
    window.Echo.channel('game.1')
        .listen('HideQuestion', function (message) {
            console.log(message)
        })

    window.Echo.channel('game.1')
        .listen('GotAskForAnswer', function(message) {
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