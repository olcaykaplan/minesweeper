//let difficulty = "easy";

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
let message ='';
let flagCount = 0;

window.onload = () => {	getDifficultyType() };
/* ---- SETUP ----*/
getDifficultyType = () => {
//mines.innerHTML ="";
    bombed= false;
    setup(document.getElementById("selectedDifficulty").value);
}

setup = ( difficulty ) => {
   // debugger;
 
   mines.innerHTML ="";
    createdBombs = [];
    let writeTable = ""
	let number = 0;
    
	dColumn = difficultyTypes[ difficulty ].column;
	dRow = difficultyTypes[ difficulty ].row;
    bombCount = difficultyTypes[ difficulty ].bomb;
    setFlagCountHTML();
	let bomb = difficultyTypes[ difficulty ].bomb;
    document.getElementById("bombCount").innerHTML=bomb;
	for ( let i = 1; i <= bomb; i++ ) {
		//create random numbers between 1 to max-cell number of difficulty
		let random = Math.floor( Math.random( 0, 1 ) * ( dRow * dColumn ) ) + 1;
		if ( createdBombs.includes( random ) ) { // if bombCell has this random number go previous number of count
			i--;
		} else { // if the random number not found in the array then add it
			createdBombs.push( random );
		}
	}
    console.log(dColumn);
    console.log(dRow);
	console.log( createdBombs );
   
	for ( let r = 1; r <= dRow; r++ ) { // create row
		let write = `<tr class= '${r}'>`;
		for ( let c = 1; c <= dColumn; c++ ) { // create cells 
			number = r > 1 ? ( ( r - 1 ) * dColumn ) + c : c;
			if ( createdBombs.includes( number ) ) { // if the number of cell has in the bombCell array make data-bomb 'true'
				write += `<td class='cell ${difficulty} bombs passive ' data-bomb='true' data-value='${number}' data-column='${c}' data-row='${r}' data-hidden = 'true' id='${c}/${r}'></td> `;
			} else { // if number is not found in the array, make data-bomb 'false'
				write += `<td class='cell ${difficulty} passive ' data-bomb='false' data-value='${number}' data-column='${c}' data-row='${r}' data-hidden ='true' id='${c}/${r}' > </td> `;
			}
		}
		write += "</tr>";
		writeTable += write;
	}
	mines.insertAdjacentHTML( "afterbegin", writeTable );
}


const setFlagCountHTML = () => {
    document.getElementById("flagCount").innerHTML=flagCount;
}

//added more than one time flag and  td is not disabled when flas is available
//also it should remove when flagged td is clickt again
mines.addEventListener("contextmenu", function(e) {
  e.preventDefault();
  let clickedCell = e.target.closest( '.cell' );
  let Isflagged = document.getElementById(clickedCell.id).childNodes

  if(document.getElementById( clickedCell.id ).lastElementChild){
    console.log("before remove Isflagged ", Isflagged)
    document.getElementById( clickedCell.id ).lastElementChild.remove();
     Isflagged = document.getElementById(clickedCell.id).childNodes
     console.log("after change Isflagged",Isflagged)
     flagCount--;
     setFlagCountHTML();
 }
else{
    const svg = document.createElement( 'svg' );
    svg.className = "fab fa-font-awesome-flag";
    document.getElementById( clickedCell.id ).appendChild( svg );
    flagCount++;
    setFlagCountHTML();
}
    
});

mines.addEventListener( 'click', e => {
	if ( bombed == false) {
		let clickedCell = e.target.closest( '.cell' );
        let Isflagged = document.getElementById(clickedCell.id).childNodes
         if( Isflagged[0]?.classList || (Isflagged[1] && Isflagged[1].classList[1] == "fa-font-awesome-flag") )
            {flagCount++;}
        else 
        {
            if(document.getElementById(clickedCell.id).dataset.hidden == 'true'){
            let checkBomb = clickedCell.dataset.bomb;
            let allBombCells = document.querySelectorAll( '.bombs' );
            if ( checkBomb == 'true' ) {
                bombed = true; // after bombed this script will do nothing until game restarted
                allBombCells.forEach( e => {
                    document.getElementById( `${e.id}` ).style.backgroundImage = "url(' ')";
                    document.getElementById( `${e.id}` ).style.background = "#d72323";
                    const svg = document.createElement( 'svg' );
                    svg.className = "fas fa-bomb";
                    document.getElementById( `${e.id}` ).appendChild( svg );
                    message = 'GAME OVER!';
                    $('#message').text(message);
                    $("#myModal").modal('show');
                } )
            } else {
                const cId = clickedCell.id;
                controlledCells(cId);
                let vb = document.querySelectorAll('.passive').length;
                    
            
                if(vb == bombCount)
                    {
                    message = 'YOU WIN!!';
                    $('#message').text(message);
                    $("#myModal").modal('show');
                    }
            }
            }
          }
          console.log("buraya düştü")
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

