function Puzzle(id, url)
{
   this.id=id;
   this.url=url;
}

var puzzle1 = new Puzzle(1,"/images/1.jpg");
var puzzle2 = new Puzzle(2,"/images/2.jpg");
var puzzleEmpty = new Puzzle(3,"/images/3.jpg");
var puzzle4 = new Puzzle(4,"/images/4.jpg");
var puzzle5 = new Puzzle(5,"/images/5.jpg");
var puzzle6 = new Puzzle(6,"/images/6.jpg");
var puzzle7 = new Puzzle(7,"/images/7.jpg");
var puzzle8 = new Puzzle(8,"/images/8.jpg");
var puzzle9 = new Puzzle(9,"/images/9.jpg");


var puzzles = [puzzle1,puzzle2,puzzleEmpty,puzzle4,puzzle5,puzzle6,puzzle7,puzzle8,puzzle9];

function InitializeGame(){

	//shuffle the array
	this.shuffle = 	function(array){
		for (var max = array.length-1; max > 0; max--) {
			var temp, i;

			i = Math.floor(Math.random() * max);
			temp = array[max];
			array[max] = array[i];
			array[i] = temp;
		}
	};

	//helper function
	function swapElement(array,i,j){
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	};

	//helper function
	function getEmptyIndex(array){
		for(var i=0; i<array.length;i++){
			if(array[i].id===3)
				return i;
		}
	};

	//helper function
	function moveToLast(array,i){
		if(i<=5){
			swapElement(array,i,i+3);
			moveToLast(array,getEmptyIndex(array));
		}
		else if(i<=7){
			swapElement(array,i,i+1);
			moveToLast(array,getEmptyIndex(array));
		}
	};

	//check whether the array will has a solution
	this.hasSolutionChecker=function(array){

		var result = 0;

		var index = getEmptyIndex(array);

		moveToLast(array,index);


		for(var current =0; current<array.length;current++){
			
			for(var compare = current + 1; compare< array.length ; compare++){
				
				if(array[compare].id<array[current].id){
					result ++;
					
				}
			}

		}

		if((result % 2)==0)
			return true;
		else
			return false; 
	}

	//game starting 
	//by removing the starting mask
	this.startGame = function(){
		var child = document.getElementById("mask");
		var parent = child.parentNode;
		parent.removeChild(child);
	}
}


function Board(array){
	//place the shuffled array into board
	this.board = [
		[array[0],array[1],array[2]],
		[array[3],array[4],array[5]],
		[array[6],array[7],array[8]]
	];
	//check the game status 
	this.status = function(){
		if(this.board[0][0].id==1&&
			this.board[0][1].id==2&&
			this.board[0][2].id==3&&
			this.board[1][0].id==4&&
			this.board[1][1].id==5&&
			this.board[1][2].id==6&&
			this.board[2][0].id==7&&
			this.board[2][1].id==8&&
			this.board[2][2].id==9)
			return true;
		else
			return false;
	};

	//move the current puzzle by swapping with the empty puzzle slot
	this.move = function(x,y){
		if(x-1>=0 && this.board[x-1][y].id ==3) // swap with the empty puzzle to the left
			swap(this.board[x][y], this.board[x-1][y]);
		else if(x+1<=2 && this.board[x+1][y].id ==3) // swap with the empty puzzle to the right
			swap(this.board[x][y], this.board[x+1][y]);
		else if(y-1>=0 && this.board[x][y-1].id ==3) // swap with the empty puzzle to the top
			swap(this.board[x][y], this.board[x][y-1]);
		else if(y+1<=2 && this.board[x][y+1].id ==3) // swap with the empty puzzle to the bottom
			swap(this.board[x][y], this.board[x][y+1]);
	};

	this.displayBoard = function(){
		var table=document.createElement("table");
		for(var i = 0; i<this.board.length;i++){
			var tr = document.createElement("tr");
			table.appendChild(tr);

			for(var j=0; j<this.board[0].length ; j++){
				var td = document.createElement("td");
				var image = document.createElement("img");
				image.src = this.board[i][j].url;

				td.appendChild(image);
				tr.appendChild(td);
			}
		}
		document.getElementById("puzzleGame").appendChild(table);		
	};

	this.eraseBoard = function(){
		var parentDiv = document.getElementById("puzzleGame");
		var child = parentDiv.getElementsByTagName("table")[0];
		parentDiv.removeChild(child);
	};

	//swap two puzzle on the board
	function swap(puzzleA, puzzleB){
		var idTemp, urlTemp;
		idTemp = puzzleA.id;
		urlTemp = puzzleA.url;

		puzzleA.id = puzzleB.id;
		puzzleA.url = puzzleB.url;

		puzzleB.id = idTemp;
		puzzleB.url = urlTemp;
	};
}


var initializePuzzle = new InitializeGame();
var couponURL = "/coupon/fake_coupon.pdf";


do{
	initializePuzzle.shuffle(puzzles);
}while(!initializePuzzle.hasSolutionChecker(puzzles));

var myBoard = new Board(puzzles);



myBoard.displayBoard();
setOnClickListener();

var xCoord, yCoord;
function movePuzzle(){

	yCoord = this.cellIndex;
	xCoord = this.parentNode.rowIndex;

	myBoard.move(xCoord,yCoord);
	myBoard.eraseBoard();
	myBoard.displayBoard();

	setOnClickListener();
	if(myBoard.status())
		puzzleSolved();
}



function puzzleSolved(){

	//display congrad msg
	var msg = document.getElementById("chest-msg");
	msg.textContent = "Solved!! Get Your Coupon";

	//update the couponURL to the real one
	couponURL="/coupon/coupon.pdf";

	//change the chest box image by changing the src
	document.getElementById("chestbox").src = "/images/chestboxopen.jpg";
 
}

function download(){
   window.open(couponURL, "Download");
}

function setOnClickListener(){
	var li = document.getElementById("puzzleGame").getElementsByTagName("td");
	for( var i=0 ; i< li.length; i++ ){
	 	li[i].addEventListener("click", movePuzzle);
	}
}


document.getElementById("start").addEventListener("click", initializePuzzle.startGame);
document.getElementById("box").addEventListener("click", download);


