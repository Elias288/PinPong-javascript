// VISTA DEL JUEGO
(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas
        this.canvas.width = board.width
        this.canvas.height = board.height
        this.board = board
        this.ctx = canvas.getContext("2d")
    }

    self.BoardView.prototype = {
        clean: function(){
            //setTimeout(() => {this.ctx.clearRect(0, 0, this.board.width, this.board.height)}, 100)
            this.ctx.clearRect(0, 0, this.board.width, this.board.height)
        },
        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i]
                draw(this.ctx, el)
            }
            this.ctx.beginPath();
            this.ctx.moveTo((this.board.width / 2), 0);
            this.ctx.lineTo((this.board.width / 2), this.board.height);
            this.ctx.setLineDash([10, 10]);
            this.ctx.strokeStyle = "#FFFFFF";
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
            
            this.ctx.closePath();
        },
        play: function(){
            if (this.board.playing && !this.board.game_over){
                this.clean()
                this.check_collisions()
                this.board.ball.move()
            }
            this.draw()
        },
        check_collisions: function(){
            // chequea las colisiones con las paredes
            var i = hit(this.board, this.board.ball)
            if(i == 1 || i == 2){
                this.board.ball.collision(i)
            }

            // chequea las colisiones que dan puntos
            if (this.board.ball.x >= this.board.width){
                this.board.bars[0].scoreUp()
                this.board.reset()
                // console.log(this.board.bars[1].score);
            }
            
            if (this.board.ball.x <= 0){
                this.board.bars[1].scoreUp()
                this.board.reset()
                // console.log(this.board.bars[0].score);
            }

            // chequea la colisiones con las barras
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i]
                if(hitBarra(bar, this.board.ball)){
                    this.board.ball.collisionBar(bar)
                }
            }
        },
    }

    function hitBarra(a, b){
        var hit = false

        if (b.x + b.width >= a.x && b.x < a.x + a.width){
            if (b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true
            }
        }

        if (b.x <= a.x && b.x + b.width >= a.x + a.width){
            if (b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true
            }
        }

        if (a.x <= b.x && a.x + a.width >= b.x + b.width){
            if (a.y <= b.y && a.height >= b.y + b.height){
                hit = true
            }
        }

        return hit
    }

    function hit(a, b){
        // b = ball
        // a = board
        var hit = 0
        // si la posicion de la bola es menor igual al borde superior de la cancha
        if (b.y < 0 + b.height){
            hit = 1
        }
        // si la posicion de la bola es mayor igual al borde inferior de la cancha
        if (b.y + b.width >= a.height){
            hit = 2
        }

        return hit
    }

    function draw (ctx, element) {
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height)
                break;
            case "circle":
                ctx.beginPath()
                ctx.arc(element.x, element.y, element.radius, 0, 7)
                ctx.fill()
                ctx.closePath()
                break;
        }
    }
})();

export default window.BoardView