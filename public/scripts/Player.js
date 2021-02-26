import UI from './UserInterface.js';
import Pong from './Pong.js'
 
export default class Player {
   
    constructor() {
        this.socket = io.connect(document.location.host);
        //this.socket = io();
 
        this.num = null;
        this.UI = new UI(this);
        this.Pong = new Pong(this);
 
        this.listenServer();
        this.transmitUiServer();
        this.UI.listenInterface();
    }
  
    // Listen to server (go to client)
    listenServer(){
        this.socket.on('server:user:pseudo_exists', this.UI.pseudoChoice.bind(this,true));
        this.socket.on('server:user:connected', ()=>{
            this.UI.connectUser();
            this.Pong.drawGame();
            this.Pong.listenKeyBoard();
        });
        this.socket.on('server:user:list', this.UI.listUsers);
        this.socket.on('server:user:paddle', this.Pong.setPaddles.bind(this.Pong));
    }

    // Listen to client (go to server)
    transmitUiServer() {
        document.addEventListener('local:user:pseudo', (event) => { 
            document.getElementById('welcome').innerHTML = 'Welcome ' + event.detail.user;
            this.socket.emit('client:choice:pseudo', event.detail.user); 
        });
        document.addEventListener('local:user:disconnect', ()=>{
            this.socket.emit('client:user:disconnect')
        });
        document.addEventListener('local:user:player', (event)=>{
            this.socket.emit('client:choice:player', event.detail.player);
        });
        document.addEventListener('local:user:paddle', (event)=>{
            this.socket.emit('client:user:paddle', event.detail.paddle1, event.detail.paddle2)
        });
    }
}
