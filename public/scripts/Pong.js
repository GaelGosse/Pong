export default class Pong{

    constructor(player){
        this.paddle1 = 190;
        this.paddle2 = 190;
        this.player = player;
        this.canvas = document.getElementById('canvas');
        this.context = canvas.getContext('2d');
    }

    setPaddles(p1, p2){
        if(this.player.num == 2){
            this.paddle1 = p1;
        }
        else if(this.player.num == 1){
            this.paddle2 = p2;
        }
        else{
            this.paddle1 = p1;
            this.paddle2 = p2;
        }
    }

    drawGame() {
        // on vide tout le canvas
        this.context.clearRect(0, 0, canvas.width, canvas.height);

        // on positionne la premiere raquette
        this.context.fillStyle = 'dodgerblue';
        this.context.fillRect(10, this.paddle1, 20, 200);
        
        // on positionne la deuxième raquette
        this.context.fillStyle = 'crimson';
        this.context.fillRect(970, this.paddle2, 20, 200);
             
        window.requestAnimationFrame(this.drawGame.bind(this));
    }

    listenKeyBoard() {
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp') {
                if(this.player.num == 1) {
                    this.paddle1 -= 10;
                    if(this.paddle1 < 0) this.paddle1 = 0;
                } else if(this.player.num == 2) {
                    this.paddle2 -= 10;
                    if(this.paddle2 < 0) this.paddle2 = 0;
                }
            } else if(e.key == 'ArrowDown') {
                if(this.player.num == 1) {
                    this.paddle1 += 10;
                    // 200 étant la taille du paddle
                    if(this.paddle1+200 > this.canvas.height) 
                    this.paddle1 = this.canvas.height-200;
                }
                else if(this.player.num == 2) {
                    this.paddle2 += 10;
                    // 200 étant la taille du paddle
                    if(this.paddle2+200 > this.canvas.height) 
                        this.paddle2 = this.canvas.height-200;
                }
            }
            if(e.key == 'ArrowDown' || e.key == 'ArrowUp'){
                document.dispatchEvent(new CustomEvent('local:user:paddle', {detail : { 
                    paddle1 : this.paddle1, 
                    paddle2 : this.paddle2 
                }}));
            }
        });
    }

}