let difficulty = "easy";
let writeTable = ""
let createdBombs = [];
let bombed = false;
const mines = document.querySelector('#mines');
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
let dColumn = 0;
let dRow = 0;
let clearCells = [];
let bombCells = [];
let checkCellArray = [];
let bombCount = '';
window.onload = () => {
	setup( difficulty );
};
/* ---- SETUP ----*/
setup = ( difficulty ) => {
	let number = 0;
	 dColumn = difficultyTypes[ difficulty ].column;
	 dRow = difficultyTypes[ difficulty ].row;
	let bomb = difficultyTypes[ difficulty ].bomb;
	for ( let i = 1; i <= bomb; i++ ) {
		//create random numbers between 1 to max-cell number of difficulty
		let random = Math.floor( Math.random( 0, 1 ) * ( dRow * dColumn ) ) + 1;
		if ( createdBombs.includes( random ) ) { // if bombCell has this random number go previous number of count
			i--;
		} else { // if the random number not found in the array then add it
			createdBombs.push( random );
		}
	}
	console.log( createdBombs );
	for ( let r = 1; r <= dRow; r++ ) { // create row
		let write = `<tr class= '${r}'>`;
		for ( let c = 1; c <= dColumn; c++ ) { // create cells 
			number = r > 1 ? ( ( r - 1 ) * dColumn ) + c : c;
			if ( createdBombs.includes( number ) ) { // if the number of cell has in the bombCell array make data-bomb 'true'
				write += `<td class='cell bombs passive' data-bomb='true' data-value='${number}' data-column='${c}' data-row='${r}' data-hidden = 'true' id='${c}/${r}'></td> `;
			} else { // if number is not found in the array, make data-bomb 'false'
				write += `<td class='cell passive' data-bomb='false' data-value='${number}' data-column='${c}' data-row='${r}' data-hidden ='true' id='${c}/${r}' > </td> `;
			}
		}
		write += "</tr>";
		writeTable += write;
	}
	mines.insertAdjacentHTML( "afterbegin", writeTable );
}


mines.addEventListener( 'click', e => {
  
   
	if ( bombed == false) {
		//characterView.openCharacterViewPage();
		let clickedCell = e.target.closest( '.cell' );
      
        if(document.getElementById(clickedCell.id).dataset.hidden == 'true'){
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
			//const {column, row} = getValues(cId);
              /*const cIdColumn = parseInt(clickedCell.dataset.column);
              const cIdRow = parseInt(clickedCell.dataset.row);*/
            
			//document.getElementById( cId ).style.background = "#9b7653";
			//let childCheckCellArray = findCheckCellArray( row, column );
			// clear the cell and areas and also write the count of the bomb around of this cell
			controlledCells(cId);
			
             }
        }
    }
} );

//
getValues = (id) =>{
    const el = document.getElementById(id);  
  
    return {
        column : parseInt(el.dataset.column),
        row : parseInt(el.dataset.row)
    };
}

// which cells will be controlled

//take the cells in array which are clear and bomb and count bomb around given cell
controlledCells = ( pointedCell) => {
    
    const {column, row} = getValues(pointedCell);
    
      checkTheBomb = (r,c) => {
          debugger;
            if( c < 1 || r < 1 || r > dRow || c > dColumn ) return;
            const cell = document.getElementById(`${c}/${r}`) ;
            if(cell.dataset.bomb == 'true' || cell.dataset.hidden == 'false') return;
            const minesCount = getMineCount(c, r);
            cell.dataset.hidden = 'false';
            cell.classList.remove('passive');
            cell.classList.add('active');
            if(minesCount){
                cell.innerHTML = `${minesCount}`;
                return;
            }
            for( let rw = -1;  rw <= 1; rw++){
                for( let clmn = -1; clmn <= 1; clmn++)
                    {
                        checkTheBomb(r+rw, c+clmn);
                    }
            }
      }
      
    checkTheBomb(row, column);
      
       
}

getMineCount = (c, r) => {
    let count = 0;
        for( let rw = -1; rw  <= 1; rw++){
            for(let clmn = -1; clmn <= 1; clmn++){
                let cCheck = c +clmn;
                let rCheck = r + rw;
                if( cCheck < 1 || rCheck < 1 || cCheck > dColumn || rCheck > dRow ) continue;
                let cell = document.getElementById(`${c+clmn}/${r+rw}`)
                if(cell.dataset.bomb == 'true') count++
            }
        }
    return count;
}


