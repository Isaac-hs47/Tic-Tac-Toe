class Template{
    constructor(){
        this.template = [];
        this.player = false;
        this.winner = false;
        this.full = false;
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
        if (this.winner) return true;
          
        this.winner = this.verify_diagonals(turn, true);
        if(this.winner) return true;

        this.winner = this.verify_diagonals(turn, false);
        if(this.winner) return true;
        
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

}

function Matriz(rows,columns) {
    let x = new Array(rows);
    for (let i = 0; i < rows; i++) {
        x[i] = new Array(columns);
    }
    return x;
 }


const $CONTAINER_WINNER = document.getElementById("winner");
const $BTN_RESET = document.getElementById("btn-reset");

let template = new Template();

template.create_template(3,3);

let cell;
let winner = false, full = false;

document.addEventListener("click", (e) => {
    if(e.target.matches(".game-item")){

        if(!winner && !full){  
            let num = e.target.id.split("-");
            let cell = num[1];

            if(template.mark_cell(cell)){
                e.target.innerText = template.get_player_value();
                console.log(full);
                if(template.get_winner()) {
                    winner = true;
                    $BTN_RESET.disabled = false;
                    $CONTAINER_WINNER.classList.add("alert-success");
                    $CONTAINER_WINNER.innerHTML = `<strong>WINNER!!!</strong><span> El ganador es "${template.get_player_value()}"</span>`;
                    $CONTAINER_WINNER.classList.remove("d-none");
                }else if(template.get_full()){
                    full = true;
                    $BTN_RESET.disabled = false;
                    $CONTAINER_WINNER.classList.add("alert-warning");
                    $CONTAINER_WINNER.innerHTML = `<strong>FULL!!!</strong><span> Ya todas la casillas estan marcadas</span>`;
                    $CONTAINER_WINNER.classList.remove("d-none");
                }
            }else{
                alert("La celda ya fue seleccionada!");
            }
        } 
    }

    if(e.target.matches("#btn-reset")){
        document.querySelectorAll(".game-item").forEach(item => {
            item.innerText = null;
        });
        template.reset_template();

        winner = false;
        full = false;

        $BTN_RESET.disabled = true;

        $CONTAINER_WINNER.classList.remove("alert-success");
        $CONTAINER_WINNER.classList.remove("alert-warning");
        $CONTAINER_WINNER.classList.add("d-none");
    }
});


//     public static void main(String[] args) {
//         Scanner input = new Scanner(System.in);
//         Plantilla template = new Plantilla();
        
//         int cell;
//         boolean winner = false, full = false;
//         System.out.println("BIENVENIDO!");
        
//         while(!winner && !full){
            
//             show_template(template.get_template());
            
//             System.out.println("INGRESE UN NÚMERO ENTRE 1-9 PARA ELEGIR UNA CASILLA!");
//             cell = input.nextInt();
            
//             template.mark_cell(cell);
            
//             winner = template.get_winner();
//             full = template.is_full();
//         }
        
//         if(winner){
//             show_template(template.get_template());
//             System.out.println("***************************************");
//             System.out.println("***********YA HAY UN GANADOR!**********");
//             System.out.println("***************************************");
//         }
//         else if(full){
//             System.out.println("***************************************");
//             System.out.println("*************HAY UN EMPATE!************");
//             System.out.println("***************************************"); 
//         }
//     }
    
//      public static void show_template(String template[][]){
         
//         for(int i=0; i < template.length; i++){
//             for(int j = 0; j < template[i].length; j++){
//                 if(template[i][j] != null){
//                     if((j+1) < template[i].length){
//                         System.out.print(template[i][j] + "|");
//                     }else{
//                         System.out.print(template[i][j]);
//                     }
//                 }else{
//                     if((j+1) < template[i].length){
//                         System.out.print(" |");  
//                     }else{
//                         System.out.print(" ");
//                     }
//                 }
//             }
            
//             System.out.println("\n-----");
//         }
//     }
    
// }