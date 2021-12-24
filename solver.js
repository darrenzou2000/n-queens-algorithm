function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
class Solver{
    constructor(len=0){
        if(len==0){
            return this
        }
        window.len = len
        window.b = new Board(len)
        b.display()
        window.half = Math.ceil(len/2)
        this.solved = false
        this.steps=0
    }
    finishTheRest(b){
        window.len= b.length
        window.b = b 
        window.half = Math.ceil(len/2)
        this.filltherest()
    }

    async step1(){
        b.addQueen(1,0)
        b.addQueen(0,half)
        let knightpos = [[2,half+1],[2,half-1]]
        let backupBoard  = new Board(0,b)
        backupBoard.display()
        for( let k of knightpos){
            console.log("TRYING KNIGHT POS", ...k)
            await this.checkwin(b)
            b = new Board(0,backupBoard)
            b.display()   
            await this.step2(k)
        }
    }

    async step2(knightpos){
        console.log("STEP 2")
        let [x,y]= knightpos
        console.log(x,y)
        b.addQueen(x,y)
        // this means the knight is put on the right
        let count=1
        if(y-half ==-1){
            let pattern = [[3,half+1],[4,half+3],[6,half+2]]
            for( let i of pattern){
                if(b.avaliable(...i)){
                    b.addQueen(...i)
                }else{
                    break;
                }
            }
        }
        if(y-half ==1){
            if(len%2==1){
                b.addQueen(...b.getmiddle())
                var offset = true
            }
            while(x+count*2<len && y+count<len){
                await sleep(200)
                x+=count*2
                y+=count
                if(offset && x>Math.floor(len/2)){
                    x+=1
                    offset = false
                }
                if(b.avaliable(x,y)){
                    b.addQueen(x,y)
                }else{
                    return
                }
            }  
        }
        await this.checkwin(b)
        await this.step3()
    }
    async step3(){
        console.log("starting step 3")
        let lastmove = b.getLastMove()
        let [lastx,lasty] = lastmove;
        if(lasty==len-1){
            let x= 3
            let y=1
            let count=1
            if(len%2==1){
                    var offset = true
            }
            while(x<len){
                if(offset && x>=Math.floor(len/2)){
                    x+=1
                    offset = false
                }
                if(b.avaliable(x,y)){ 
                    b.addQueen(x,y)
                    x +=count*2
                    y += count
                    
                }else{
                    //if the ladder dont work, end the chain
                    console.log({x,y},"doesnt work")
                    return
                }
            }
        }
        await this.checkwin(b)
        this.filltherest()
    }

    async filltherest(){
        this.allavaliableleft = b.getAnAvaliableRow()
        console.log(this.allavaliableleft)
        this.backup = new Board(0,b)
        for(let i of this.allavaliableleft){
            console.log("trying ",...i)
            if(this.solved)return
            await this.explorePath(i)
            b = new Board(0,this.backup)
            b.display()
        }
        console.log("tried all")
        finishbtn=document.getElementById("finish").innerHTML="Sorry no solution found"
    }
    async explorePath(move){
        this.steps+=1
        await sleep(50)
        let totalremoved = b.addQueen(...move)
        let slotsleft = b.getavaliable()
        if(totalremoved>2)return
        await this.checkwin(b)
        let backup = new Board(0,b)
        for( let i of slotsleft){
            console.log("trying ",...i)
            await this.explorePath(i)
            b = new Board(0,backup)
            b.display()
        }
    }
    async checkwin(board){
        if(board.checkwin()){
           this.solved = true
            this.solution = b.queenPosition
            let solution = new Board(0,b)
            solution.display()
            console.log("Fill in the rest took", this.steps,"tries")
            await sleep(5000000) 
        }
        
    }
}
