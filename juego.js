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
        this.winner = null
    }

    self.Board.prototype = {
        get elements(){
            var elements = this.bars.map(function(bar){ return bar })
            elements.push(this.ball)
            return elements
        },
        reset: function(){ // cuando la bola hace un punto
            this.ball.reset()
            //this.bars.map(b => b.reset())
        },
        reset_game: function(){ // cuando hay ganador
            this.playing = false
            this.game_over = false
            this.bars.map(b => b.reset_score())
            this.ball.reset()
            modal.style.opacity = 1
        }
    }
})();

export default window.Board