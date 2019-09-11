const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const SQ = 20;
const ROW = 20;
const COLUMN = 10;
const VACANT = "WHITE";
const PIECES = [
[Z, "red"],
[S, "green"],
[T, "cyan"],
[O, "indigo"], 
[I, "blue"], 
[L, "purple"], 
[J, "orange"]
];

function drawSquare(posX, posY, fill){
	context.fillStyle = fill;
	context.fillRect(posX*SQ, posY*SQ, SQ, SQ);
	context.strokeStyle = "BLACK";
	context.strokeRect(posX*SQ, posY*SQ, SQ, SQ);

}

//create board

let board = [];
for (r = 0; r < ROW; r++){
	board[r] = [];
	for (c = 0; c < COLUMN; c++){
		board[r][c] = VACANT;
	}
}

//draw board
function drawBoard() {
	for (r = 0; r < ROW; r++){
		for (c = 0; c < COLUMN; c++){
			drawSquare(c, r, board[r][c]);
		}
	}
}

drawBoard();

function randomPiece(){
	let randonNo = Math.floor(Math.random() * PIECES.length);

	return new Piece(PIECES[randonNo][0], PIECES[randonNo][1]);
}

let piece = randomPiece();
let dropStart = Date.now();
let gameOver = false;
piece.drawTertomino(true);

let score = 0;

function drop() {
	let now = Date.now();
	delta = now - dropStart;

	if(delta > 1000){
		moveDownResults = piece.moveDown(score, VACANT);
		score = moveDownResults.points;
		scoreElement.innerHTML = score;
		console.log(score);
		if (moveDownResults.collide) {
			piece = randomPiece();
		}
		dropStart = Date.now();
	}
	if (!gameOver){
		requestAnimationFrame(drop);
	}
}
drop();

//control

const Keys = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
}

document.addEventListener("keydown", CONTROL);

function CONTROL(event){
	document.removeEventListener("keydown", CONTROL);
	switch (event.keyCode) {
		case Keys.LEFT:
		piece.moveLeft();
		dropStart = Date.now();
		break;
		case Keys.RIGHT:
		piece.moveRight();
		dropStart = Date.now();
		break;
		case Keys.UP:
		piece.rotate();
		dropStart = Date.now();
		break;
		case Keys.DOWN:
		piece.moveDown();
		score = moveDownResults.points;
		console.log(score);
		dropStart = Date.now();
		break;
	}
	document.addEventListener("keydown", CONTROL);
}
