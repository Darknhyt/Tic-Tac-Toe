function Game(playerName1, playerName2) {
    const player1 = Player(playerName1, 1);
    const player2 = Player(playerName2, 2);
    const players = [player1, player2];

    let current = players[0];
    let table = Table();
    let turn = 1;
    let winner = false;

    //Public  get functions
    const getTable = () => table.getTable();
    const getCurrentPlayer = () => current.getPlayerName();
    const getWinner = () => winner;
    console.log(table.printTable());
    console.log("Turn: " + getCurrentPlayer());
   
    const play = (row, column) => { //Return an Object with the play Status
        let playStatus = {
            playerTurn: current.getPlayerName(),
            playerPiece: current.getPlayerPiece(),
            positionPlayed: [row, column],
            turnOfGame: turn,
            pieceSuccess: false,
            playWinner: false
        }
        if (turn < 10 && !winner) {
            if (table.addPiece(current.getPlayerPiece(), row, column)) {
                playStatus.pieceSuccess = true;
                console.log(table.printTable());
                if (winCondition()) {
                    winner = current.getPlayerName();
                    playStatus.playWinner = true;
                } else {
                    turn++;
                    switchCurrentPlayer();
                    if (turn == 10){
                        console.log("DRAW")
                    } else {
                        console.log("Turn: " + getCurrentPlayer());
                    }
                }
            }      
        } else { console.log("Game Finishied");}
        return playStatus;
    }

    //Private functions
    function switchCurrentPlayer() {
        current = current == players[0] ?
            players[1] : players[0];
    }
    function winCondition() {
        let win = false;
        const pieceOn = (x, y)=> table.getBox(x, y) == current.getPlayerPiece();

        if (pieceOn(1, 1) && ((pieceOn(0, 0) && pieceOn(2, 2)) ||
            (pieceOn(0, 2) && pieceOn(2, 0)))) { //Diagonals
            win = true;
            console.log(`${current.getPlayerName()} won!`);
        } else {
            for (let i = 0; i < 3; i++) {
                if ((pieceOn(i, 0) && pieceOn(i, 1) && pieceOn(i, 2)) || //Rows
                    (pieceOn(0, i) && pieceOn(1, i) && pieceOn(2, i))) { //Columns
                    win = true;
                    console.log(`${current.getPlayerName()} won!`);
                }
            }
        }
        return win;
    }

    //Player factory
    function Player(name, piece) {
        const getPlayerName = () => name;
        const getPlayerPiece = () => piece;
        return { getPlayerName, getPlayerPiece }
    }

    //Table factory
    function Table() {
        let box = [];
        for (let b = 0; b < 3; b++) {
            box.push([0, 0, 0]);
        }
        const getTable = () => box;
        const printTable = () => `${box[0]}\n${box[1]}\n${box[2]}`;
        const getBox = (row, column) => box[row][column];
        const addPiece = (piece, posRow, posCol) => {
            if (box[posRow - 1][posCol - 1] == 0) {
                box[posRow - 1][posCol - 1] = piece;
                return true;
            } else {
                return false;
            }
        }
        return { getTable, addPiece, printTable, getBox }
    }
    return { getCurrentPlayer, getTable, play, getWinner }
}
const game = Game("Player1", "Player2");
init();
function init(){
    const box = Array.from(document.getElementsByClassName("box"));
    box.forEach((b)=>{
        b.addEventListener("click",()=>{
            const play = game.play(b.dataset.row,b.dataset.col);
            if (play.pieceSuccess){
                b.textContent = play.playerPiece == 1? "❌" : "⭕";
            }
        })
    })
}

