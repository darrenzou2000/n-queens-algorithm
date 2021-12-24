const p= (item) => console.log(item)
class Board{
    constructor(length=0,board= null){
        let confetti = document.getElementById("win")
        confetti.style.display="none"
        if(length!=0){
            this.length = length;
            this.board = []
            for(let i = 0;i<length; i++){
                this.board.push([]) 
                for(let j = 0;j<length; j++){
                this.board[i].push(0)
                }
        }
        // [[0,1],[5,6]]etc
        //2d array of queen positions
        this.queenPosition = [] 
        //list of ints of cols that have open space
        this.avaliablecol = [...Array(length).keys()]
        this.avaliablerow = [...Array(length).keys()]
        }else{
            if(board){
                this.length = board.length;
                this.board = JSON.parse(JSON.stringify(board.board));
                this.queenPosition = JSON.parse(JSON.stringify(board.queenPosition));
                this.avaliablecol = JSON.parse(JSON.stringify(board.avaliablecol));
                this.avaliablerow = JSON.parse(JSON.stringify(board.avaliablerow));
            }
                
        }  

    }
    row(num){
        return this.board[num]
    }
    column(num){
        let result = []
        for( let i =0;i<this.length;i++){
            result.push(this.board[i][num])
        }
        return result
    }
    addQueen(row,col,message=true){
        if(!this.avaliable(row, col) && this.queenPosition.indexOf([row,col])!=-1){
            console.log(row,col, "taken/outside")
            return
        }
        if(!this.containQueen(row, col)){
          this.queenPosition.push([row,col])  
        }
        if(message){
            console.log("placing queen at",row,col)
        }
        //removes row and col
        for(let i=0;i<this.length;i++){
            this.board[i][col] = 1
            marktaken(i, col)
            this.board[row][i] = 1
            marktaken(row, i)
        }
        let direction = [[1,1],[1,-1],[-1,-1],[-1,1]]
        for(let i=0;i<4;i++){
            let diagonalrow = row
            let diagonalcol = col
            let xchange = direction[i][0]
            let ychange = direction[i][1]
            while(diagonalcol>=0 && diagonalcol<this.length && diagonalrow>=0 && diagonalrow<this.length ){
                this.board[diagonalrow][diagonalcol]=1
                marktaken(diagonalrow,diagonalcol)
                diagonalrow+=xchange
                diagonalcol+=ychange
            }
        }
        displayqueen(row, col)
        let totalremoved = this.removeFromAvaliables()
        if(this.checkwin()){
            this.win()
        }
        return totalremoved
    }
    checkwin(){
        return !this.havemovesavaliable() && this.queenPosition.length== this.length
    }
    win(){
        console.log("you win!")
        let confetti = document.getElementById("win")
        confetti.style.display="grid" 
    }
    getLastMove(){
        return this.queenPosition[this.queenPosition.length-1];
    }
    avaliable(row,col){
        if(row>this.length || col >this.length)return false
        
        try {
            return !this.board[row][col];
        } catch (error) {
            console.log(row,col)
            return false
        }
    }
    getLastAvaliable(){
        return [this.avaliablerow[0],this.avaliablecol[0]]
    }
    containQueen(row,col){
        for(let queen of this.queenPosition){
            let [x,y] = queen
            if(x==row && y==col){
                return true
            }
        }
        return false
    }
    getAnAvaliableRow(){
        let result = this.getavaliable()
        let filter = result[0][0]
        result = result.filter((e)=>e[0]==filter)
        return result
    }
    removeFromAvaliables(){
        let removerow = []
        for(let i of this.avaliablerow){
            let row = this.row(i)
            let sum = row.reduce((a, b) => a + b, 0)
            if(sum==this.length){
                removerow.push(i)
            }
        }
        this.avaliablerow = this.avaliablerow.filter(function(e){
            return removerow.indexOf(e)==-1;
        });
        let removecol = []
        for(let i of this.avaliablecol){
            let row = this.column(i)
            let sum = row.reduce((a, b) => a + b, 0)
            if(sum==this.length){
                removecol.push(i)
            }
        }
        this.avaliablecol = this.avaliablecol.filter(function(e){
            return removecol.indexOf(e)==-1;
        });
        return removerow.length+removecol.length
    }
    havemovesavaliable(){
        return( this.avaliablecol.length + this.avaliablerow.length )>0;
    }
    getavaliable(){
        let result =  this.avaliablerow.flatMap(d => this.avaliablecol.map(v => [d,v ]))
        result = result.filter( (e) => this.avaliable(e[0], e[1]))
        return result
    }
    getmiddle(){
        return [Math.floor(this.length/2),Math.floor(this.length/2)]
    }
    display(){
        createBoard(length)
        for(let i=0;i< this.queenPosition.length;i++){
            let [row,col] = this.queenPosition[i]
            this.addQueen(row, col,false)
        }
    }
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
var board = document.getElementById("Board")
function createBoard(length){
    board = document.getElementById("Board")
    removeAllChildNodes(board)
    for (let i = 0; i < length; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < length; j++) {
            let td = document.createElement('td');
            if (i%2 == j%2) {
                td.className = "white";
            } else {
                td.className = "black";
            }
            td.id = `${i},${j}`
            tr.appendChild(td);
        }
        board.appendChild(tr);
    }
}
function marktaken(row,col){
     board.children[row].children[col].className="taken"
}
function displayqueen(row,col){
    board.children[row].children[col].className="queen"
}

// play = prompt("Do you want to play or watch")
length = parseInt(prompt("What is the length of the board"),10)
let play="watch";



const game = {
    start(play,length){
        this.play = play!="watch"
        this.length = length
        if(this.play){
            this.b = new Board(length)
            this.b.display()
            
        }else{
            this.s = new Solver(this.length)
            this.s.step1()
        }
    },
    putqueen(cord){
        row = parseInt(cord.split(",")[0],10)
        col = parseInt(cord.split(",")[1],10)
        if(this.b.avaliable(row,col)){
            this.b.addQueen(row,col)
        }
    },
    restart(){
        delete this.b;
        this.b = new Board(this.length)
        this.b.display()
        this.play=true
        document.getElementById("finish").style.display="inline-block"
    },
    finishTheRest(){
        this.play = false
        this.s = new Solver()
        this.s.finishTheRest(this.b)
    }
}
game.start(play,length)
function finishTheRest(){
    game.finishTheRest()
}
function restart(){
    game.restart()
}
window.onclick = e => {
    target = e.target;  // to get the element
    cord = e.target.id
    if(game.play && target.nodeName=="TD"){ 
        console.log({cord})
        game.putqueen(cord)
    }
} 