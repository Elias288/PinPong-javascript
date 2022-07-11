import Board from './juego.js'
import BoardView from './vista.js'
import { Ball, Bar } from './elementos.js'

var canvas = document.getElementById('canvas')
var score1 = document.getElementById('jugador1')
var score2 = document.getElementById('jugador2')
var play = document.getElementById('play')
var modal = document.getElementById('modal')

const board = new Board(800,400)
var bar = new Bar(1, 20, board.height/2 - 50, 20, 100, board, score1)
var bar2 = new Bar(2, 760, board.height/2 - 50, 20, 100, board, score2)
var board_view = new BoardView(canvas, board)
var ball = new Ball(board.width/2, board.height/2, 10, board)

play.addEventListener('click', () => {
    modal.style.opacity = 0
    board.playing = true
})

document.addEventListener("keydown", evt => {
    evt.preventDefault()
    switch(evt.key){
        case "Down":
        case "ArrowDown":
            bar2.down()
            break;
        case "Up":
        case "ArrowUp":
            bar2.up()
            break;
        case "s":
            bar.down()
            break;
        case "w":
            bar.up()
            break;
        case "p":
		    modal.style.opacity = 1
			board.playing = false
            break;
        case "r":
            modal.style.opacity == 1
            board.playing == false
            board_view.clean()
            board.reset_game()
            break;
    }
})

window.requestAnimationFrame(controller)

function controller(){
    board_view.play()
    window.requestAnimationFrame(controller)
}
