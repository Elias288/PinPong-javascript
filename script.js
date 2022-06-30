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
    }

    self.Bar.prototype = {
        down : function() {

        },
        up : function() {
            
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
        draw: function(){
            for(var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i]
                draw(this.ctx, el)
            }
            
        }
    }

    function draw (ctx, element) {
        if (element != null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height)
                    break;
            }
        }
    }
})();

window.addEventListener("load", main)

function main(){
    var board = new Board(800,400)
    var canvas = document.getElementById('canvas')
    var bar = new Bar(20, 100, 40, 100, board)
    var bar = new Bar(735, 100, 40, 100, board)
    var board_view = new BoardView(canvas, board)
    //console.log(board);

    board_view.draw()
}