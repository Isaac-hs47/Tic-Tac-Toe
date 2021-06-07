class Template{
    constructor(){
        this.template = [];
        this.player = false;
        this.winner = false;
        this.full = false;
        this.wins_x = 0;
        this.wins_o = 0;
        this.row_winner = {};
    }

    mark_cell( cell ){
        let turn = this.player ? "X" : "O";
        cell--;

        if(cell >= 0 && cell <= 2){
            
            if(!this.cell_is_empty(0, cell)) return false;
            
            this.template[0][cell] = turn;
            this.has_winner(0, cell, turn);

        }else if(cell >= 3 && cell <= 5){
            cell -= 3;
        
            if(!this.cell_is_empty(1, cell)) return false;

            this.template[1][cell] = turn;
            this.has_winner(1, cell, turn);

        }else if(cell >= 6 && cell <= 8){
            cell -= 6;
            if(!this.cell_is_empty(2, cell)) return false;

            this.template[2][cell] = turn;
            this.has_winner(2, cell, turn);

        }else{
            alert("La casilla elegida no existe!!!");
            return false;
        }

        this.full = this.isEmpty();
        this.player = !this.player;
        
        return true;
    }

    cell_is_empty(row, column){
        if (this.template[row][column] !== undefined) {
            return false;
        }
        return true;
    }

    has_winner(row, column, turn){
        let count = 0;
    
        //Validate in horizontally
        for (let i = 0; i < this.template[row].length; i++) {
            if (this.template[row][i] === undefined) {
                break;
            } else if (this.template[row][i] === turn) {
                count++;
            }
        }
        
        this.winner = count === 3;
        if (this.winner) { 
            turn === "X" ? this.wins_x++ : this.wins_o++;
            this.row_winner = {orientation: "horizontal", row: row, column: undefined};
            return true;
        }
        
        count = 0;
        //Validate in vertically
        for (let i = 0; i < this.template.length; i++) {
                if (this.template[i][column] === undefined) {
                    break;
                } else if (this.template[i][column] === turn) {
                    count++;
                }               
        }
        
        this.winner = count === 3;
        if (this.winner) {
            turn === "X" ? this.wins_x++ : this.wins_o++;
            this.row_winner = {orientation: "vertical", row: undefined, column: column};
            return true
        };
          
        this.winner = this.verify_diagonals(turn, true);
        if(this.winner) {
            turn === "X" ? this.wins_x++ : this.wins_o++;
            this.row_winner = {orientation: "First-diagonal", row: undefined, column: undefined};
            return true
        };

        this.winner = this.verify_diagonals(turn, false);
        if(this.winner) {
            turn === "X" ? this.wins_x++ : this.wins_o++;
            this.row_winner = {orientation: "Second-diagonal", row: undefined, column: undefined };
            return true
        };
        
        return false;
    }
    
    verify_diagonals(turn, increment){
        let count = 0;
        let aux = increment ? 0 : 2;

        this.template.forEach(item => {
            for (let i = aux; i < item.length; i++) {
                if(item[i] === undefined){
                    break;
                }else if(item[i] === turn){
                    count++;
                    increment ? aux++ : aux--;
                    break;
                }else{
                    break;
                }
            }
        });

        return count === 3;
    }

    isEmpty(){
        let count = 0;
        for (let i = 0; i < this.template.length; i++) {
            for (let j = 0; j < this.template[i].length; j++) {
                if(this.template[i][j] !== undefined){
                    count++;
                }
            }
        }
        return count === 9;
    }

    create_template(rows, columns){
        let x = new Array(rows);
        for (let i = 0; i < rows; i++) {
            x[i] = new Array(columns);
        }
        this.template = x;
    }

    get_player_value(){
        return !this.player ? "X" : "O";
    }
    get_winner(){
        return this.winner;
    }
    get_full(){
        return this.full;
    }
    get_template(){
        return this.template;
    }
    reset_template(){
        let x = new Array(this.template.length);
        for (let i = 0; i < this.template[0].length; i++) {
            x[i] = new Array(3);
        }
        this.template = x;
    }
    get_row_winner(){
        return this.row_winner;
    }
    get_wins(){
        return {
            wins_x: this.wins_x,
            wins_o: this.wins_o
        };
    }


}
const $CONTAINER_MESSAGE = document.getElementById("message");
const $BTN_RESET = document.getElementById("btn-reset");

let template = new Template();

template.create_template(3,3);

let cell, wins;
let winner = false, full = false;

wins = template.get_wins();

document.getElementById("winsX").innerText = `X: ${wins.wins_x}`;
document.getElementById("winsO").innerText = `O: ${wins.wins_o}`;
document.getElementById("turn").innerHTML = `<span>Turn of  <b>O</b></span>`;

document.addEventListener("click", (e) => {
    if(e.target.matches(".game-item")){

        if(!winner && !full){ 
            document.getElementById("turn").innerHTML = `<span>Turn of  <b>${template.get_player_value()}</b></span>`; 
            let num = e.target.id.split("-");
            let cell = num[1];

            if(template.mark_cell(cell)){
                e.target.innerText = template.get_player_value();

                if(template.get_winner()) {

                    winner = true;
                    painting_cells(template.get_row_winner());
                    $BTN_RESET.disabled = false;
                    $CONTAINER_MESSAGE.classList.add("alert-success");
                    $CONTAINER_MESSAGE.innerHTML = `<strong>WINNER!!!</strong><span> The winner is "${template.get_player_value()}"</span>`;
                    $CONTAINER_MESSAGE.classList.remove("d-none");

                    wins = template.get_wins();
                   

                }else if(template.get_full()){
                    full = true;
                    $BTN_RESET.disabled = false;
                    $CONTAINER_MESSAGE.classList.add("alert-warning");
                    $CONTAINER_MESSAGE.innerHTML = `<strong>FULL!!!</strong><span> All cells already been marked</span>`;
                    $CONTAINER_MESSAGE.classList.remove("d-none");
                }
            }else{
                $CONTAINER_MESSAGE.classList.add("alert-danger");
                $CONTAINER_MESSAGE.innerHTML = `<strong>INVALID!!!</strong><span> These cell already been marked</span>`;
                $CONTAINER_MESSAGE.classList.remove("d-none");
                setTimeout(()=>{
                    $CONTAINER_MESSAGE.classList.remove("alert-danger");
                    $CONTAINER_MESSAGE.classList.add("d-none");
                }, 2000);
            }
            document.getElementById("winsX").innerText = `X: ${wins.wins_x}`;
            document.getElementById("winsO").innerText = `O: ${wins.wins_o}`;
        } 
    }

    if(e.target.matches("#btn-reset")){
        document.querySelectorAll(".game-item").forEach(item => {
            item.classList.remove("border-success");
            item.classList.remove("border-3");
            item.innerText = null;
        });
        template.reset_template();

        winner = false;
        full = false;

        $BTN_RESET.disabled = true;

        $CONTAINER_MESSAGE.classList.remove("alert-success");
        $CONTAINER_MESSAGE.classList.remove("alert-warning");
        $CONTAINER_MESSAGE.classList.add("d-none");
    }
});

function painting_cells(row_winner = {}){
    const $ITEMS = document.querySelectorAll(".game-item");
  
    switch(row_winner.orientation){
        case "horizontal":
            if(row_winner.row === 0){
                for (let i = 0; i < 3; i++) {
                    $ITEMS[i].classList.add("border-success");
                    $ITEMS[i].classList.add("border-3");                    
                }
            }else if(row_winner.row === 1){
                for (let i = 3; i < 6; i++) {
                    $ITEMS[i].classList.add("border-success");
                    $ITEMS[i].classList.add("border-3");                    
                }
            }else{
                for (let i = 6; i < 9; i++) {
                    $ITEMS[i].classList.add("border-success");
                    $ITEMS[i].classList.add("border-3");
                }
            }
            break;
        case "vertical":

            for (let i = row_winner.column; i < $ITEMS.length; i+=3) {
                $ITEMS[i].classList.add("border-success");
                $ITEMS[i].classList.add("border-3"); 
            }

            break;
        case "First-diagonal":

            for (let i = 0; i < $ITEMS.length; i+=4) {
                $ITEMS[i].classList.add("border-success");
                $ITEMS[i].classList.add("border-3");
            }

            break;
        case "Second-diagonal":
            for (let i = 2; i < $ITEMS.length; i+=2) {
                $ITEMS[i].classList.add("border-success");
                $ITEMS[i].classList.add("border-3");
                if(i == 6) break;
            }
            break;
        default:
            break;
    }
}
