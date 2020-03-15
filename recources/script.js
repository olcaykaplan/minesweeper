let difficulty = "easy";
let writeTable = ""
let createdBombs = [];
let bombed = false;
const mines = document.querySelector( '#mines' );
const difficultyTypes = {
	easy: {
		name: 'easy',
		column: 6,
		row: 12,
		bomb: 10
	},
	medium: {
		name: 'medium',
		column: 10,
		row: 20,
		bomb: 35
	},
	hard: {
		name: 'hard',
		column: 13,
		row: 26,
		bomb: 75
	}
}
let clearCells = [];
let bombCells = [];
let bombCount = '';
window.onload = () => {
	setup( difficulty );
};
/* ---- SETUP ----*/
setup = ( difficulty ) => {
	let number = 0;
	let column = difficultyTypes[ difficulty ].column;
	let row = difficultyTypes[ difficulty ].row;
	let bomb = difficultyTypes[ difficulty ].bomb;
	for ( let i = 1; i <= bomb; i++ ) {
		//create random numbers between 1 to max-cell number of difficulty
		let random = Math.floor( Math.random( 0, 1 ) * ( row * column ) ) + 1;
		if ( createdBombs.includes( random ) ) { // if bombCell has this random number go previous number of count
			i--;
		} else { // if the random number not found in the array then add it
			createdBombs.push( random );
		}
	}
	console.log( createdBombs );
	for ( let r = 1; r <= row; r++ ) { // create row
		let write = `<tr class= '${r}'>`;
		for ( let c = 1; c <= column; c++ ) { // create cells 
			number = r > 1 ? ( ( r - 1 ) * column ) + c : c;
			if ( createdBombs.includes( number ) ) { // if the number of cell has in the bombCell array make data-bomb 'true'
				write += `<td class='cell bombs' data-bomb='true' data-value='${number}' data-column='${c}' data-row='${r}'  id='${c}/${r}'> </td> `;
			} else { // if number is not found in the array, make data-bomb 'false'
				write += `<td class='cell' data-bomb='false' data-value='${number}' data-column='${c}' data-row='${r}' id='${c}/${r}' > </td> `;
			}
		}
		write += "</tr>";
		writeTable += write;
	}
	mines.insertAdjacentHTML( "afterbegin", writeTable );
}
mines.addEventListener( 'click', e => {
	if ( bombed == false ) {
		//characterView.openCharacterViewPage();
		let clickedCell = e.target.closest( '.cell' );
		let checkBomb = clickedCell.dataset.bomb;
		let allBombCells = document.querySelectorAll( '.bombs' );
		if ( checkBomb == 'true' ) {
			bombed = true; // after bombed this script will do nothing until game restarted
			allBombCells.forEach( e => {
				document.getElementById( `${e.id}` ).style.backgroundImage = "url(' ')";
				document.getElementById( `${e.id}` ).style.background = "#FA8072";
				const icon = document.createElement( 'i' );
				icon.className = "fas fa-bomb";
				document.getElementById( `${e.id}` ).appendChild( icon );
			} )
		} else {
			const cId = clickedCell.id;
			const {column, row} = getValues(cId);
              /*const cIdColumn = parseInt(clickedCell.dataset.column);
              const cIdRow = parseInt(clickedCell.dataset.row);*/
            
			document.getElementById( cId ).style.background = "#9b7653";
			let checkCellArray = findCheckCellArray( row, column );
			// clear the cell and areas and also write the count of the bomb around of this cell
			controlledCells( cId, checkCellArray, true );
			
		}
	}
} );

//
getValues = (id) =>{
    const el = document.getElementById(id);  
    debugger;
    return {
        column : parseInt(el.dataset.column),
        row : parseInt(el.dataset.row)
    };
}

// which cells will be controlled
findCheckCellArray = ( row, column ) => {
	let checkCellArray = [];
	if ( row == 1 ) { //  if the cell is at first row we cant check previous row
		if ( column == 1 ) {
			// if the cell is also first column, we cant check previous column   
			checkCellArray = [ `${column}/${row+1}`, `${column+1}/${row+1}`, `${column+1}/${row}`, ];
		} else if ( cIdColumn == difficultyTypes[ difficulty ].column ) {
			// if thecell is also last column, we cant check next column,
			checkCellArray = [ `${column}/${row+1}`, `${column-1}/${row+1}`, `${column-1}/${row}`, ];
		} else {
			// if the cell is not at first column or last we can check previous column and the next
			checkCellArray = [ `${column}/${row+1}`, `${column-1}/${row+1}`, `${column-1}/${row}`, `${column+1}/${row+1}`, `${column+1}/${row}` ];
		}
	} else if ( row == difficultyTypes[ difficulty ].row ) { //if the cell is at last row we cant check next row
		if ( column == 1 ) {
			// if the cell is also first column, we cant check previous column
			checkCellArray = [ `${column}/${row-1}`, `${column+1}/${row-1}`, `${column+1}/${row}`, ];
		} else if ( column == difficultyTypes[ difficulty ].column ) {
			// if the cell is also last column, we cant check next column
			checkCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column-1}/${row}`, ];
		} else {
			// if the cell is not at first column or last we can check previous column and next
			checkCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column-1}/${row}`, `${column+1}/${row-1}`, `${column+1}/${row}` ];
		}
	} else { //if the cell is nıot at the first row or last row we cant check next row
		if ( row == 1 ) {
			// if the cell is also first column, we cant check previous column
			checkCellArray = [ `${column}/${row-1}`, `${column+1}/${row-1}`, `${column}/${row+1}`, `${column+1}/${row+1}`, `${column+1}/${row}`, ];
		} else if ( column == difficultyTypes[ difficulty ].column ) {
			// if the cell is also last column, we cant check next column
			checkCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column}/${row+1}`, `${column-1}/${row+1}`, `${column-1}/${row}`, ];
		} else {
			// if the cell is not at first column or last we can check previous column and next
			checkCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column+1}/${row-1}`, `${column}/${row+1}`, `${column-1}/${row+1}`, `${column+1}/${row+1}`, `${column+1}/${row}`, `${column-1}/${row}` ];
		}
	}
	return checkCellArray;
}
//take the cells in array which are clear and bomb and count bomb around given cell
controlledCells = ( pointedCell, checkCellArray, cliked) => {
   // if(cliked){
        checkCellArray.forEach( e => {
            // debugger;
            let eCell = document.getElementById( e );
            if ( eCell.dataset.bomb == 'true' ) {
                bombCells.push(e);
                bombCount++;
            } else {
                clearCells.push(e);
            }
        } );
        document.getElementById( pointedCell ).innerHTML = `${bombCount}`;
        bombCount = '';
        makeClearCellsActive( clearCells );
  //  }
    
}

makeClearCellsActive = ( clearCells ) => {
	//debugger;
	clearCells.forEach( e => {
		document.getElementById( e ).style.background = "#9b7653";
        const {column, row} = getValues(e);
        let checkArray = findCheckCellArray(column, row);
       // controlledCells (e, checkArray, false);
	});
  
}