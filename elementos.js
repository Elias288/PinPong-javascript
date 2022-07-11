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
        },
        reset: function(){
            this.x = this.board.width / 2
            this.y = this.board.height / 2
            this.bounce_angle = 0
        }
    }
})();
// BARRA
(function(){
    self.Bar = function(id, x, y, width, height, board, scoreBar){
        this.id = id
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.board = board
        this.score = 0
        this.scoreBar = scoreBar
        // se acceede al array bars de board y se le agrega esta barra
        this.board.bars.push(this)
        // para saber que tiene que dibujar el canvasa
        this.kind = "rectangle"
        this.speed = 15
    }

    self.Bar.prototype = {
        //movimiento de las barras
        down : function() {
            if (this.board.playing && !this.board.game_over && this.y + (this.height) < this.board.height) 
                this.y += this.speed
        },
        up : function() {
            if(this.board.playing && !this.board.game_over && this.y > 0) 
                this.y -= this.speed
        },
        scoreUp : function(){ // aumentar el puntaje de cada jugador
            if(this.board.playing && !this.board.game_over) {
                this.score ++   
                this.scoreBar.innerHTML = "Jugador" + this.id + " " + this.score
            } 
            if(this.score == 5) {
                this.board.game_over = true
                alert('jugador ganador: ' + this.id)
                this.board.reset_game()
            }
        },
        reset: function(){
            this.y = this.board.height / 2 - this.height / 2
        },
        reset_score: function(){
            this.reset()
            this.scoreBar.innerHTML = "Jugador" + this.id + " " + 0
            this.score = 0
        }
    }
})();

let Ball = window.Ball
let Bar = window.Bar

export { Ball, Bar }