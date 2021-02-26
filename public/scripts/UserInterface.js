export default class UserInterface {

    constructor(player){
        this.player = player;
    }

    listenInterface() {
        document.getElementById("co").addEventListener('click',()=>{
            this.pseudoChoice();
        });
        document.getElementById('deco').addEventListener('click',()=>{
            this.disconnect();
            this.disconnectUser();
        });
        document.getElementById('joueur1').addEventListener('click',()=>{
            console.log('1');
            this.playerChoice(1);
            this.player.num = 1;
            document.getElementById('choice').classList.add('hide')
            document.getElementById('canvas').classList.remove('hide')
            document.getElementById('canvas').classList.add('blue')
        })
        document.getElementById('joueur2').addEventListener('click',()=>{
            console.log('2');
            this.playerChoice(2);
            this.player.num = 2;
            document.getElementById('choice').classList.add('hide')
            document.getElementById('canvas').classList.remove('hide')
            document.getElementById('canvas').classList.add('red')
        })
    }

    pseudoChoice(alertPseudo = false)  {
        if(alertPseudo === true) alert(`Choisissez un autre pseudo, celui ci est déjà utilisé !`);
        let user;
        do {
            user = window.prompt(`Quel pseudo voulez vous ?`);
        } while(user === '');
        if(user !== null) {
            this.connectUser();
            document.dispatchEvent(new CustomEvent('local:user:pseudo', {detail : { user : user }}));
        }
    }

    disconnect(){
        document.dispatchEvent(new CustomEvent('local:user:disconnect'));
    }

    disconnectUser(){
        document.querySelectorAll(".authenticated").forEach((element) => {
            element.classList.add('hide');
        });
        document.querySelectorAll(".noAuthenticated").forEach((element) => {
            element.classList.remove('hide');
        });
    }

    connectUser() {
        document.querySelectorAll(".authenticated").forEach((element) => {
            element.classList.remove('hide');
        });
        document.querySelectorAll(".noAuthenticated").forEach((element) => {
            element.classList.add('hide');
        });    
    }

    listUsers(users) {
        document.querySelector("#listingUsers").innerHTML = "";
        if("content" in document.createElement("template")){
            let template = document.querySelector("#usersTpl"); 
            users.forEach(pseudo => {
                let clone = document.importNode(template.content, true);
                clone.querySelector("li").innerHTML = pseudo;
                document.querySelector("#listingUsers").appendChild(clone);
            });
        }
    }

    playerChoice(number){
        document.dispatchEvent(new CustomEvent('local:user:player', {detail : { player : `player${number}` }}));
    }

}
