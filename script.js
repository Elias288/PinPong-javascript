// JUEGO
(function(){
    // self == window por eso puede ser llamado de cualquier lugar
    self.Board = function(width, height){
        this.width = width
        this.height = height
        this.playing = true
        this.game_over = false
        this.bars = []
        this.ball = null
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){ return bar })
            elements.push(this.ball)
            return elements
        }
    }
})();
// BALL
(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x
        this.y = y
        this.radius = radius
        this.speed_y = 0
        this.speed_x = 4
        this.speed = 4
        this.board = board
        this.direction = 1
        this.bounce_angle = 0
        this.max_bounce_angle = Math.PI / 12

        board.ball = this
        this.kind = "circle"

    }
    self.Ball.prototype = {
        move: function(){
            this.x += (this.speed_x * this.direction)
            this.y += (this.speed_y)
        },
        get width(){
            return this.radius * 2
        },
        get height(){
            return this.radius * 2
        },
        collisionBar: function(bar){
            var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y
            
            console.log("rel: "+ relative_intersect_y + " y: " + this.y);
            var normalized_intersect_y = relative_intersect_y / (bar.height / 2)

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle
            this.speed_y = this.speed * -Math.sin(this.bounce_angle)
            this.speed_x = this.speed * Math.cos(this.bounce_angle)

            if (this.x > (this.board.width / 2)) this.direction = -1
            else this.direction = 1
        },
        collision: function(i){
            if (i == 1){
                this.speed_y = this.speed * Math.sin(this.max_bounce_angle)
                this.speed_x = this.speed * Math.cos(this.max_bounce_angle)
            }else{
                this.speed_y = this.speed * -Math.sin(this.max_bounce_angle)
                this.speed_x = this.speed * Math.cos(this.max_bounce_angle)
            }
        }
    }
})();
// BARRA
(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.board = board
        // se acceede al array bars de board y se le agrega esta barra
        this.board.bars.push(this)
        // para saber que tiene que dibujar el canvasa
        this.kind = "rectangle"
        this.speed = 15
    }

    self.Bar.prototype = {
        down : function() {
            if (this.board.playing && this.y + (this.height) < this.board.height) this.y += this.speed
        },
        up : function() {
            if(this.board.playing && this.y > 0) this.y -= this.speed
        }
    }
})();
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
            setTimeout(() => {this.ctx.clearRect(0, 0, this.board.width, this.board.height)}, 200)
        },
        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i]
                draw(this.ctx, el)
            }
            
        },
        play: function(){
            this.draw()
            if (this.board.playing){
                this.clean()
                this.check_collisions()
                this.board.ball.move()
            }
        },
        check_collisions: function(){
            // chequea las colisiones con las paredes
            var i = hit(this.board, this.board.ball)
            if(i == 1 || i == 2){
                this.board.ball.collision(i)
            }

            // chequea las colisiones que dan puntos
            if (this.board.ball.x >= this.board.width || this.board.ball.x <= 0){
                this.board.playing = false
            }

            // chequea la colisiones con las barras
            for (var i = this.board.bars.length - 1; i >= 0; i--){
                var bar = this.board.bars[i]
                if(hitBarra(bar, this.board.ball)){
                    this.board.ball.collisionBar(bar)
                }
            }
        }
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

var board = new Board(800,400)
var canvas = document.getElementById('canvas')
var bar2 = new Bar(20, 100, 40, 100, board)
var bar = new Bar(735, 100, 40, 100, board)
var board_view = new BoardView(canvas, board)
var ball = new Ball(350, 100, 10, board)

document.addEventListener("keydown", evt => {
    evt.preventDefault()
    switch(evt.key){
        case "Down":
        case "ArrowDown":
            bar.down()
            break;
        case "Up":
        case "ArrowUp":
            bar.up()
            break;
        case "s":
            bar2.down()
            break;
        case "w":
            bar2.up()
            break;
    }
})

window.requestAnimationFrame(controller)

function controller(){
    board_view.play()
    window.requestAnimationFrame(controller)
}