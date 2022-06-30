// JUEGO
(function(){
    // self == window por eso puede ser llamado de cualquier lugar
    self.Board = function(width, height){
        this.width = width
        this.height = height
        this.playing = false
        this.game_over = false
        this.bars = []
        this.ball = null
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars
            elements.push(this.ball)
            return elements
        }
    }
})();
(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x
        this.y = y
        this.radius = radius
        this.speed_y = 0
        this.speed_x = 3

        board.ball = this
        this.kind = "circle"
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
        this.speed = 20
    }

    self.Bar.prototype = {
        down : function() {
            this.y += this.speed
        },
        up : function() {
            this.y -= this.speed
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
            this.ctx.clearRect(0, 0, this.board.width, this.board.height)
        },
        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i]
                draw(this.ctx, el)
            }
            
        },
        play: function(){
            this.draw()
            // this.clean()
            setTimeout(() => {this.clean()}, 500)
        }
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