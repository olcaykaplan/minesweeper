
let difficulty="easy";
let writeTable = ""
let bombCell = [];
let bombed = false;
const mines= document.querySelector('#mines');
const difficultyTypes = {
    easy : { name:'easy', column :6, row: 12, bomb: 10} ,
     medium : {name: 'medium', column:10, row: 20, bomb: 35},
     hard: {name: 'hard', column:13, row:26, bomb: 75}
    
}

window.onload = () =>  {
 setup(difficulty);
};

/* ---- SETUP ----*/
setup = (difficulty) => {

    let number = 0;
    let column = difficultyTypes[difficulty].column;
    let row = difficultyTypes[difficulty].row;
    let bomb =  difficultyTypes[difficulty].bomb;
   
    for(let i  = 1; i <= bomb; i++ ){
        //create random numbers between 1 to max-cell number of difficulty
        let random = Math.floor(Math.random(0,1)*(row*column))+1;
        if(bombCell.includes(random)){  // if bombCell has this random number go previous number of count
            i--;   }
        else{  // if the random number not found in the array then add it
            bombCell.push(random);}
    }
        console.log(bombCell);
    for(let i = 0; i < row; i++)
    {   // create row
        let write = `<tr class= '${i}'>`;
          
            for( let i2 = 1; i2 <= column; i2++ )
            {   // create cells 
                number = (i*column)+i2;
               
                if(bombCell.includes(number)){ // if the number of cell has in the bombCell array make data-bomb 'true'
                    write+= `<td class='cell bombs' data-bomb='true' data-value='${number}' id='${number}'> </td> `;}
                else { // if number is not found in the array, make data-bomb 'false'
                    write+= `<td class='cell' data-bomb='false' data-value='${number}' id='${number}' > </td> `;}            
            }
         write += "</tr>";
        writeTable += write;
    }
    mines.insertAdjacentHTML("afterbegin",writeTable);
}




mines.addEventListener('click', e=>{
    
    if(bombed == false )
{
    //characterView.openCharacterViewPage();
   let checkBomb = e.target.closest('.cell').dataset.bomb;
   let allBombCells = document.querySelectorAll('.bombs');
    if(checkBomb == 'true'){
        bombed=true; // after bombed this script will do nothing until game restarted
       allBombCells.forEach(e => {
           const icon = document.createElement('i');
        icon.className="fas fa-bomb";
          console.log(e.id);
           document.getElementById(`${e.id}`).appendChild(icon);
       })   
    }
    else{
        alert("You likey bitch!")
        // clear the cell and areas and also write the count of the bomb around of this cell
    }
}
   
});