function Game(playerName1, playerName2) {
    const player1 = Player(playerName1, 1);
    const player2 = Player(playerName2, 2);
    const players = [player1, player2];

    let current = players[0];
    let table = Table();
    let turn = 1;
    let winner = false;
    table.newTable();
    //Public functions
    const getTable = () => table.getTable();
    const getCurrentPlayer = () => current.getPlayerName();
    const getCurrentPiece = () => current.getPlayerPiece();
    const getPlayerName = (p) => p == 1 ? player1.getPlayerName() : player2.getPlayerName();
    const getWinner = () => winner;
    const getPlayerPoints = (p) => players[p-1].getPoints(); 
    const resetPoints = ()=>players.forEach((p)=>p.reset());
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
                    current.addPoint();
                    playStatus.playWinner = true;
                } else {
                    turn++;
                    switchCurrentPlayer();
                    if (turn == 10) {
                        console.log("DRAW")
                    } else {
                        console.log("Turn: " + getCurrentPlayer());
                    }
                }
            }
        } else { console.log("Game Finishied"); }
        return playStatus;
    }
    const changeName = (num, newName) => {
        if (num == 1) {
            newName.length > 0 ?
                player1.setPlayerName(newName) : player1setPlayereName("Player 1");
        } else if (num == 2) {
            newName.length > 0 ?
                player2.setPlayerName(newName) : player2.setPlayerName("Player 2")
        }
    }
    const newTable = () => {
        table.newTable();
        turn = 1;
        winner = false;
    }
    //Private functions
    function switchCurrentPlayer() {
        current = current == players[0] ?
            players[1] : players[0];
    }
    function winCondition() {
        let win = false;
        const pieceOn = (x, y) => table.getBox(x, y) == current.getPlayerPiece();

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
        this.name = name;
        let points = 0;
        const getPlayerName = () => name;
        const getPlayerPiece = () => piece;
        const getPoints = () => points;
        const setPlayerName = (newName) => name = newName;
        const reset = ()=> points = 0;
        const addPoint = ()=> points++;
        return { getPlayerName, getPlayerPiece, setPlayerName, getPoints, reset, addPoint }
    }

    //Table factory
    function Table() {
        let box = [];
        const newTable = () => {
            for (let b = 0; b < 3; b++) {
                box[b] = [0, 0, 0];
            }
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
        return { getTable, addPiece, printTable, getBox, newTable }
    }
    return { getCurrentPlayer, getPlayerName, getCurrentPiece, getTable, play, getWinner, changeName, newTable, getPlayerPoints, resetPoints }
}
function Controler() {
    const game = Game("Player 1", "Player 2");
    const box = Array.from(document.getElementsByClassName("box"));
    const info = document.getElementById("info");
    const getInput = (input) => {
        return document.getElementById(input).value;
    }
    const setOutput = (output, info) => {
        document.getElementById(output).textContent = info;
    }
    const setInfo = (newInfo) => {
        info.classList.add("rotate");
        setTimeout(()=>{
            info.textContent = newInfo;
        },100);
        setTimeout(()=>{
            info.classList.remove("rotate");
        },200);
    }
    init();

    function init() {
        const newBtn = document.getElementById("opt-btn");
        const rstBtn = document.getElementById("rst-btn");
        box.forEach((b) => {
            b.addEventListener("click", (e) => {
                e.preventDefault();
                const play = game.play(b.dataset.row, b.dataset.col);
                if (play.pieceSuccess) {
                    const [icon, nextIco] = getIco(play.playerPiece);
                    b.textContent = icon;
                    b.classList.add("busy");
                    if (play.playWinner) {
                        setInfo(`${icon} ${play.playerTurn} won!`);
                        updateScore();
                    } else if (play.turnOfGame < 9) {
                        setInfo(`${nextIco} ${game.getCurrentPlayer()} turn`)
                    } else {
                        setInfo(`❌ DRAW ⭕`)
                    }
                }
            })
        })
        newBtn.addEventListener("click", () => {
            game.changeName(1, getInput("player-one"));
            game.changeName(2, getInput("player-two"));
            game.resetPoints();
            setOutput("player-name-one", `${game.getPlayerName(1)}: `);
            setOutput("player-name-two", `${game.getPlayerName(2)}: `);
            setInfo(`${getIco(game.getCurrentPiece())[0]} ${game.getCurrentPlayer()} turn`);
            resetTable();
            updateScore();
        })
        rstBtn.addEventListener("click", () => {
            resetTable();
            setInfo(`${getIco(game.getCurrentPiece())[0]} ${game.getCurrentPlayer()} turn`);
        })
    }

    function resetTable() {
        game.newTable();
        box.forEach((b) => {
            b.textContent = "";
            b.setAttribute("class", "box");
        })
    }
    function getIco(playerPiece) {
        return playerPiece == 1 ? ["❌", "⭕"] : ["⭕", "❌"]
    }
    function updateScore(){
        setOutput("score-1", game.getPlayerPoints(1));
        setOutput("score-2", game.getPlayerPoints(2));
    }
}
const con = Controler()