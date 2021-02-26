const express = require('express');
const app = express();
const port =  process.env.PORT || 9000;
//----------------------------------------------------------
// Mise en place du répertoire static (./public)
//----------------------------------------------------------
app.use(express.static(require("path").join(__dirname, 'public')));
 
//----------------------------------------------------------
// Mise en écoute sur le port http
//----------------------------------------------------------
const server = app.listen(port, () => {
    console.log(`Le serveur est en écoute à l'adresse : http://localhost:${port}`);
});
 
//----------------------------------------------------------
// Mise en place des WebSockets
//----------------------------------------------------------
var io = require('socket.io')(server);
let player1 = { pseudo : null , paddle : 190};;
let player2 = { pseudo : null , paddle : 190};;
let spectators = [];
let users = [];

io.on('connection', (socket) => { 
    
    // on envoie dès la connexion toute les infos de la partie (la liste des spectateurs et les 2 joueurs)
    socket.emit('server:players:infos', player1.pseudo, player2.pseudo, spectators);

    socket.on('client:choice:pseudo', (pseudo) => {
        // si le pseudo n'est pas disponible
        if(users.includes(pseudo)) {
            socket.emit('server:user:pseudo_exists');
        }
        else {
            // si disponible on pousse dans le tableau
            users.push(pseudo);
            // on stocke le pseudo dans la socket
            socket.pseudo = pseudo;
            socket.emit('server:user:connected');
            io.emit('server:user:list', users.map(user => user));
            console.log(socket.pseudo);
        }
    }); 

    socket.on('client:user:disconnect', () => {
        if(socket.pseudo != undefined) {
            let index = users.findIndex(user => user == socket.pseudo);
            if(index != -1) {
                users.splice(index,1);
                // si le pseudo était en tant que player1 ou player2
                if(socket.pseudo == player1.pseudo) 
                    player1 = {pseudo : null, paddle : 190};
                if(socket.pseudo == player2.pseudo) 
                    player2 = {pseudo : null, paddle : 190};
                // on le retire des spectateurs
                let index2 = spectators.indexOf(socket.pseudo);
                if(index2 != -1) { spectators.splice(index2,1);}
                // on renvoie toute les infos de la partie
                io.emit('server:players:infos', 
                    player1.pseudo, 
                    player2.pseudo, 
                    spectators
                );
            }
        }
    });

     // quand on choisi le player
    socket.on('client:choice:player', (player) => {
        if(player == 'spectator') {
            if(spectators.includes(socket.pseudo) === false) {
                spectators.push(socket.pseudo);
                // si le pseudo était en tant que player1 ou player2 on le retire
                if(socket.pseudo == player1.pseudo) player1 = {pseudo : null, paddle : 190};
                if(socket.pseudo == player2.pseudo) player2 = {pseudo : null, paddle : 190};
            }
        } else if((player == 'player1' && player1.pseudo === null) || (player == 'player2' && player2.pseudo === null)) {
            if(player == 'player1') {
                player1 = { pseudo : socket.pseudo, paddle : 190};
                console.log('player1')
                console.log(player1)
                // si il était en player2
                if(socket.pseudo == player2.pseudo) player2 = {pseudo : null, paddle : 190};
            }
            else if(player == 'player2') {
                player2 = { pseudo : socket.pseudo, paddle : 190};
                console.log('player2')
                console.log(player2)
                // si il était en player1
                if(socket.pseudo == player1.pseudo) player1 = {pseudo : null, paddle : 190};
            }
    
            // on le retire des spectateurs (si il était en spectateur)
            let index = spectators.indexOf(socket.pseudo);
            if(index != -1) { spectators.splice(index,1);}
        }
        // on renvoie toute les infos de la partie (la liste des spectateurs et les 2 joueurs)
        io.emit('server:players:infos', player1.pseudo, player2.pseudo, spectators);
    });

    socket.on('client:user:paddle', (paddle1, paddle2)=>{
        io.emit('server:user:paddle', paddle1, paddle2);
    });


});