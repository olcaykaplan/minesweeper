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
let checkCellArray = [];
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
				write += `<td class='cell bombs' data-bomb='true' data-value='${number}' data-column='${c}' data-row='${r}' data-status ='close' id='${c}/${r}'>${c}/${r}</td> `;
			} else { // if number is not found in the array, make data-bomb 'false'
				write += `<td class='cell' data-bomb='false' data-value='${number}' data-column='${c}' data-row='${r}' data-status ='close' id='${c}/${r}' > ${c}/${r}</td> `;
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
        debugger;
        if(document.getElementById(clickedCell.id).dataset.status == 'close'){
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
			let childCheckCellArray = findCheckCellArray( row, column );
			// clear the cell and areas and also write the count of the bomb around of this cell
			controlledCells( cId, childCheckCellArray, true );
			
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
findCheckCellArray = ( row, column ) => {
	let childCheckCellArray = [];
   /* es git:(master) ✗ node app
[ { name: 'Krunal', age: 26 },
  { name: 'Ankit', age: 24 },
  { name: 'Rushabh', age: 27 } ]*/
	if ( row == 1 ) { //  if the cell is at first row we cant check previous row
		if ( column == 1 ) {
			// if the cell is also first column, we cant check previous column   
        // {name : `${column}/${row}`, value: false }
			childCheckCellArray = [ {name : `${column}/${row+1}`, value: false }, {name : `${column+1}/${row+1}`, value: false }, 
                                   {name : `${column+1}/${row}`, value: false } ];
		} else if ( column == difficultyTypes[ difficulty ].column ) {
			// if thecell is also last column, we cant check next column,
           
			childCheckCellArray = [ {name : `${column}/${row+1}`, value: false }, {name : `${column-1}/${row+1}`, value: false }, 
                                    {name : `${column}/${row}`, value: false } ];
		} else {
         
			// if the cell is not at first column or last we can check previous column and the next
            childCheckCellArray = [ {name : `${column}/${row+1}`, value: false },  {name : `${column-1}/${row}`, value: false }, 
                                    {name : `${column-1}/${row+1}`, value: false }, {name : `${column+1}/${row+1}`, value: false },
                                    {name : `${column+1}/${row}`, value: false }];
		}
	} else if ( row == difficultyTypes[ difficulty ].row ) { //if the cell is at last row we cant check next row
		if ( column == 1 ) {   
			// if the cell is also first column, we cant check previous column
            childCheckCellArray = [{name : `${column}/${row-1}`, value: false }, {name : `${column+1}/${row-1}`, value: false },
                                   {name : `${column+1}/${row}`, value: false }];
		} else if ( column == difficultyTypes[ difficulty ].column ) {  
			// if the cell is also last column, we cant check next column
            
            childCheckCellArray = [{name : `${column}/${row-1}`, value: false }, {name : `${column-1}/${row-1}`, value: false }, 
                                   {name : `${column-1}/${row}`, value: false }];
			
		} else {    
			// if the cell is not at first column or last we can check previous column and next
			childCheckCellArray = [{name : `${column}/${row-1}`, value: false}, {name : `${column-1}/${row-1}`, value: false}, 
                                   {name : `${column-1}/${row}`, value: false}, {name : `${column+1}/${row-1}`, value: false}, 
                                   {name : `${column+1}/${row}`, value: false}];
            //childCheckCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column-1}/${row}`, `${column+1}/${row-1}`, `${column+1}/${row}` ];
		}
	} else { //if the cell is not at the first row or last row we cant check next row
		if ( column == 1 ) { 
			// if the cell is also first column, we cant check previous column
            childCheckCellArray = [{name : `${column}/${row-1}`, value: false}, {name : `${column+1}/${row-1}`, value: false}, 
                                   {name : `${column}/${row+1}`, value: false}, {name : `${column}/${row+1}`, value: false}, 
                                   {name : `${column+1}/${row+1}`, value: false}, {name : `${column+1}/${row}`, value: false}];
			//childCheckCellArray = [ `${column}/${row-1}`, `${column+1}/${row-1}`, `${column}/${row+1}`, `${column+1}/${row+1}`, `${column+1}/${row}`, ];
		} else if ( column == difficultyTypes[ difficulty ].column ) { 
			// if the cell is also last column, we cant check next column
	       childCheckCellArray = [{name : `${column}/${row-1}`, value: false}, {name : `${column-1}/${row-1}`, value: false},
                                  {name : `${column-1}/${row+1}`, value: false}, {name : `${column-1}/${row}`, value: false}]
            //childCheckCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column}/${row+1}`, `${column-1}/${row+1}`, `${column-1}/${row}`, ];
		} else { 
			// if the cell is not at first column or last we can check previous column and next
			childCheckCellArray = [{name : `${column}/${row-1}`, value: false}, {name : `${column-1}/${row-1}`, value: false},
                                   {name : `${column+1}/${row-1}`, value: false}, {name : `${column}/${row+1}`, value: false},
                                   {name : `${column-1}/${row+1}`, value: false}, {name : `${column+1}/${row+1}`, value: false},
                                   {name : `${column+1}/${row}`, value: false}, {name : `${column-1}/${row}`, value: false}];
            /*childCheckCellArray = [ `${column}/${row-1}`, `${column-1}/${row-1}`, `${column+1}/${row-1}`, `${column}/${row+1}`, `${column-1}/${row+1}`, `${column+1}/${row+1}`, `${column+1}/${row}`, `${column-1}/${row}` ];*/
		}
	}
    if(checkCellArray.length == 0){
       
        checkCellArray = checkCellArray.concat(childCheckCellArray);
        checkCellArray.push({name:`${column}/${row}`, value :false} );
        return childCheckCellArray;
    }
    else{
        
         /* console.log("mother array:"+checkCellArray);
        console.log(childCheckCellArray);*/
        let childArrayForEach = [];
        childArrayForEach = childArrayForEach.concat(childCheckCellArray);
   
        childArrayForEach.forEach(e => {
            if (checkCellArray.find(x => x.name === e.name))
                {  debugger;
                    if(checkCellArray[checkCellArray.findIndex(x => x.name === e.name)].value === false)
                    {
                        childCheckCellArray.splice(childCheckCellArray.findIndex(x => x.name === e.name),1);
                    }
                    else{
                        childCheckCellArray[childCheckCellArray.findIndex(x => x.name == e.name)].value=true;
                    }
                }
        });
        //bombayı splice etmiyorsun ama arraya tekrar iteliyorsun
        checkCellArray = checkCellArray.concat(childCheckCellArray.filter(x=> x.value == false));
        console.log("mother array:"+checkCellArray);
        console.log(childCheckCellArray);
        return childCheckCellArray;
    }
	
    
}
//take the cells in array which are clear and bomb and count bomb around given cell
controlledCells = ( pointedCell, childCheckCellArray, cliked) => {
   
  bombCount ='';
    bombCells=[];
    if (!Array.isArray(childCheckCellArray))
      { alert("test");
          console.log(childCheckCellArray);}
 
        childCheckCellArray.forEach( e => {
          
            let eCell = document.getElementById( e.name );                      
            if ( eCell.dataset.bomb == 'true' ) {
                bombCells.push(e.name);
                const findIndex = checkCellArray.findIndex( x => x.name == e.name);
                debugger;
                checkCellArray[findIndex].value = true;
                bombCount++;
            } else{
                clearCells.push(e.name);
            } 
        });
        document.getElementById( pointedCell ).innerHTML = `${bombCount}`;
        document.getElementById( pointedCell ).dataset.status ='opened';
        // eğer  hücrenin etrafında bomba yoksa etrafı da incelenmeli !
  
    if(cliked)
    {   
            clearCells.forEach( e => {
                 document.getElementById( e ).style.background = "#9b7653";
                 document.getElementById( e ).dataset.status = 'opened';
           });
            clearCells.forEach(e => {
                    const {column, row} = getValues(e);
                    let checkArray = findCheckCellArray(row, column);
                    controlledCells(e, checkArray, false);
                })
           
    }
    
    else 
        {
            if(bombCells.length > 0){
                 document.getElementById( pointedCell ).style.background = "#9b7653";
                 document.getElementById( pointedCell ).dataset.status = 'opened';
                 document.getElementById( pointedCell ).innerHTML = `${bombCount}`;
            }
            else{
             
                clearCells.forEach(e => {
                     document.getElementById( e ).style.background = "#9b7653";
                     document.getElementById( e ).dataset.status = 'opened';
                })
            }
            
        }
}



makeClearCellsActive = ( clearCells, cliked =false ) => {
 
         if(typeof clearCells == 'number'){
             document.getElementById( e ).style.background = "#9b7653";
             document.getElementById( e ).dataset.status = 'opened';
         }
        else{
            clearCells.forEach( e => {
                document.getElementById( e ).style.background = "#9b7653";
                 document.getElementById( e ).dataset.status = 'opened';

           });
        }
        
}