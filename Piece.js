// Object : Piece
function Piece(tetromino, color) {
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoNo = 0; // first pattern
	this.activeTetromino = this.tetromino[this.tetrominoNo];
	
	this.x = 3;
	this.y = -2;
}

//pass false to undraw the tetromino
Piece.prototype.drawTertomino = function(draw) {
	for (r = 0; r < this.activeTetromino.length; r++){
		for (c = 0; c < this.activeTetromino.length; c++){
			// draw only occupied squares
			if(this.activeTetromino[r][c]){
				if (draw){
					drawSquare(this.x + c, this.y + r, this.color);
				}
				else {
					drawSquare(this.x + c, this.y + r, VACANT);
				}
			}
		}
	}
}

Piece.prototype.moveDown = function(score, vacant){
	if(!this.checkCollison(0,1,this.activeTetromino)){
		//undraw to stop drawing piece copying
		this.drawTertomino(false);
		this.y++;
		//draw new position
		this.drawTertomino(true);
		return {collide: false, points: score};
	}
	else {
		return {collide: true, points: this.lock(score, vacant)};
	}
}

Piece.prototype.moveLeft = function(){
	if(!this.checkCollison(-1,0,this.activeTetromino)){
		//clear previous position
		this.drawTertomino(false);
		this.x--;
		this.drawTertomino(true);
	}
}

Piece.prototype.moveRight = function(){	
	if(!this.checkCollison(1,0,this.activeTetromino)){
		//clear previous position 
		this.drawTertomino(false);
		this.x++;
		this.drawTertomino(true);
	}
}

Piece.prototype.rotate = function(){
	let nextPattern = this.tetromino[(this.tetrominoNo + 1) % this.tetromino.length];
	let kick = 0;
	if (this.checkCollison(0,0,nextPattern)){
		if (this.x > COLUMN / 2){
		//right wall
		kick = -1;
	} else {
		//left wall
		kick = 1;
	}
}
if(!this.checkCollison(kick,0,nextPattern)){
		//clear previous position
		this.drawTertomino(false);
		this.x += kick;
		this.tetrominoNo = (this.tetrominoNo + 1)% this.tetromino.length;
		this.activeTetromino = this.tetromino[this.tetrominoNo];
		this.drawTertomino(true);
	}
	
}

Piece.prototype.checkCollison = function(xIncrement,yIncrement, pattern){

	for (r = 0; r < pattern.length; r++){
		for (c = 0; c < pattern.length; c++){
			// occupied square?
			if(!pattern[r][c]){
				continue;
			}

			let newX = this.x + c + xIncrement;
			let newY = this.y + r + yIncrement;

			if(newX < 0 || newX >= COLUMN || newY >= ROW){
				return true;
			}
			if (newY < 0){
				continue;
			}
			//check for locked piece
			if(board[newY][newX] != VACANT){
				return true;
			}
		}
	}
	return false;
	
}

Piece.prototype.lock = function(score, vacant) {

	let scr = score;
	for (r = 0; r < this.activeTetromino.length; r++){
		for (c = 0; c < this.activeTetromino.length; c++){
			//skip vacant squares
			if(!this.activeTetromino[r][c]){
				continue;
			}
			if(this.y + r < 0){
				gameOver = true;
				alert("Game Over!");
				break;
			}
			board[this.y + r][this.x + c] = this.color;
		}
	}
	//remove full rows
	for (r=0; r < ROW; r++){
		let isRowFull = true;
		for(c = 0; c < COLUMN; c++){
			isRowFull = isRowFull && (board[r][c] != vacant);
		}
		if (isRowFull){
			for (y = r; y > 1; y--){
				for(c=0; c < COLUMN; c++){
					board[y][c] = board[y-1][c];
				}
			}
			for(c=0; c < COLUMN; c++){
				board[0][c] = VACANT;
			}
			scr += 10;
		}

	}
	drawBoard();
	return scr;
}