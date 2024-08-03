let selectedValue = Math.ceil(Math.random() * 9);


function renderCanvas(ctx , board ,
			ROWS , COLS ,
			CELL_WIDTH , CELL_HEIGHT
){
    ctx.fillStyle = "#121212";
    ctx.rect(0 , 0 , ctx.canvas.width , ctx.canvas.height);
    ctx.fill();

    ctx.lineWidth = 1;
    ctx.strokeStyle = "grey";
    for(let col = 0 ; col <= COLS ; ++col){
        ctx.beginPath();
        ctx.moveTo(col*CELL_WIDTH , 0 );
        ctx.lineTo(col*CELL_WIDTH , COLS*CELL_WIDTH);
	ctx.stroke();
    }

    for(let row = 0 ; row <= ROWS ; ++row){
        ctx.beginPath();
        ctx.moveTo( 0 , row*CELL_HEIGHT);
        ctx.lineTo(ROWS*CELL_HEIGHT , row*CELL_HEIGHT);
	ctx.stroke();
    }

    ctx.lineWidth = 10;
    for(let col = 0 ; col <= COLS ; col+=3){
        ctx.beginPath();
        ctx.moveTo(col*CELL_WIDTH , 0 );
        ctx.lineTo(col*CELL_WIDTH , COLS*CELL_WIDTH);
	ctx.stroke();
    }

    for(let row = 0 ; row <= ROWS ; row+=3){
        ctx.beginPath();
        ctx.moveTo( 0 , row*CELL_HEIGHT);
        ctx.lineTo(ROWS*CELL_HEIGHT , row*CELL_HEIGHT);
	ctx.stroke();
    }

    ctx.fillStyle = "grey"
    for(let row = 0 ; row < ROWS ; ++row){
	for(let col = 0 ; col < COLS ; ++col){
	    ctx.beginPath();
	    ctx.font = "30px Verdana"
	    ctx.textAlign = "center"
	    ctx.textBaseline = "middle"
	    let x = col*CELL_WIDTH + CELL_WIDTH/2;
	    let y = row*CELL_HEIGHT + CELL_HEIGHT/2;
	    ctx.fillText(board[row][col] , x , y);
	}
    }

}

function renderBtnCanvas(numCtx , NUM_ROWS , NUM_COLS , NUM_CELL_WIDTH , NUM_CELL_HEIGHT , selectedValue){
    numCtx.fillStyle = "#141414"
    numCtx.rect(0 , 0 , numCtx.canvas.width , numCtx.canvas.height);
    numCtx.fill();

    numCtx.strokeStyle = "grey"
    numCtx.lineWidth = 7

    for(let col = 0 ; col <= NUM_COLS ; ++col){
	numCtx.beginPath();
	numCtx.moveTo(col*NUM_CELL_WIDTH , 0);
	numCtx.lineTo(col*NUM_CELL_WIDTH , NUM_COLS*NUM_CELL_WIDTH);
	numCtx.stroke();

	numCtx.fillStyle = "grey"
	let btn = col + 1;
	if(btn === selectedValue){
	    numCtx.fillStyle = "red"
	}

	numCtx.font = "30px Verdana"
	numCtx.textAlign = "center"
	numCtx.textBaseline = "middle"
	let x = col*NUM_CELL_WIDTH + NUM_CELL_WIDTH/2;
	let y = NUM_CELL_HEIGHT/2;
	numCtx.fillText(btn , x , y);
	numCtx.fill();


    }

    for(let row = 0 ; row <= NUM_ROWS ; ++row){
	numCtx.beginPath();
	numCtx.moveTo(0 , row*NUM_CELL_HEIGHT);
	numCtx.lineTo(NUM_COLS*NUM_CELL_HEIGHT , row*NUM_CELL_HEIGHT);
	numCtx.stroke();
    }

}

(async()=>{

    const wasm = await WebAssembly.instantiateStreaming(
	fetch("sudoku.wasm")
    )


    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width  = 9*60;
    canvas.height = 9*60;

    const ROWS = 9;
    const COLS = 9;

    const CELL_WIDTH = canvas.width / COLS;
    const CELL_HEIGHT = canvas.height / ROWS

    const numCanvas = document.getElementById("numberCanvas");
    const numCtx = numCanvas.getContext("2d");

    numCanvas.width = canvas.width;
    numCanvas.height = CELL_HEIGHT;

    const NUM_COLS = COLS;
    const NUM_ROWS = 1;

    const NUM_CELL_WIDTH = numCanvas.width / NUM_COLS;
    const NUM_CELL_HEIGHT = numCanvas.height / NUM_ROWS;


    let board = Array(ROWS).fill(Array(COLS).fill(0))

    //Test board
    const testBoard = [
		["5","3",".",".","7",".",".",".","."],
	    	["6",".",".","1","9","5",".",".","."],
	    	[".","9","8",".",".",".",".","6","."],
	    	["8",".",".",".","6",".",".",".","3"],
	    	["4",".",".","8",".","3",".",".","1"],
	    	["7",".",".",".","2",".",".",".","6"],
	    	[".","6",".",".",".",".","2","8","."],
	    	[".",".",".","4","1","9",".",".","5"],
	    	[".",".",".",".","8",".",".","7","9"]
	    ]

    board = testBoard;

    renderCanvas(ctx , board , ROWS , COLS,
		    CELL_WIDTH , CELL_HEIGHT
    );

    renderBtnCanvas(numCtx , NUM_ROWS , NUM_COLS,
		    NUM_CELL_WIDTH , NUM_CELL_HEIGHT,
		    selectedValue
    );

    numCanvas.addEventListener("click", (e)=>{

	selectedValue = Math.ceil(e.offsetX / NUM_CELL_WIDTH);

	renderBtnCanvas(numCtx , NUM_ROWS , NUM_COLS,
			NUM_CELL_WIDTH , NUM_CELL_HEIGHT,
			selectedValue);

    });


    canvas.addEventListener("click" , (e)=>{
	let Y = Math.floor(e.offsetX / CELL_WIDTH);
	let X = Math.floor(e.offsetY / CELL_HEIGHT);

	board[X][Y] = selectedValue;

	renderCanvas(ctx , board , ROWS , COLS,
    	    	    CELL_WIDTH , CELL_HEIGHT
    	);

    })

})();
