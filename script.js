function Player(name, piece) {
    const getPlayerName = () => name;
    const getPlayerPiece = () => piece;
    return { getPlayerName, getPlayerPiece }
}
function Table() {
    let box = [];
    for (let b = 0; b < 3; b++) {
        box.push([0, 0, 0]);
    }
    const getTable = () => box;
    const printTable = () => `${box[0]}\n${box[1]}\n${box[2]}`;
    const addPiece = (piece, posRow, posCol) => {
        if (box[posRow - 1][posCol - 1] == 0) {
            box[posRow - 1][posCol - 1] = piece;
            return true;
        } else {
            return false;
        }
    }
    return { getTable, addPiece, printTable }
}
function Game(playerName1, playerName2) {
    const player1 = Player(playerName1, 1);
    const player2 = Player(playerName2, 2);
    const players = [player1, player2];

    let current = players[0];
    let table = Table();
    let turn = 1;
    let winner = false;

    const getTable = () => table.getTable();
    const getCurrentPlayer = () => current.getPlayerName();
    const getWinner = () => winner;
    const switchCurrentPlayer = () => {
        current = current == players[0] ?
            players[1] : players[0];
    }
    console.log("Turn: "+ getCurrentPlayer());
    const play = (row, column) => {
        let playStatus = {
            playerTurn: current.getPlayerName(),
            positionPlayed: [row, column],
            pieceSuccess: false,
            playWinner: false
        }
        if (turn < 10 && !winner) {
            if (table.addPiece(current.getPlayerPiece(), row, column)) {
                playStatus.pieceSuccess = true;
                if (winCondition()) {
                    winner = current.getPlayerName();
                    playStatus.playWinner = true;
                } else {
                    turn++;
                    switchCurrentPlayer();
                }
            }

        } 
        console.log(table.printTable());
        console.log("Turn: "+ getCurrentPlayer());
        return playStatus;
    }
    function winCondition() {
        let tab = table.getTable();
        const p = current.getPlayerPiece();
        let win = false;
        for (let i = 0; i < 3; i++) {
            if ((tab[i][0] == p && tab[i][1] == p && tab[i][2] == p) ||
                (tab[0][i] == p && tab[1][i] == p && tab[2][i] == p)) {
                win = true;
            }
        }
        if ((tab[0][0] == p && tab[1][1] == p && tab[2][2] == p) ||
            (tab[0][2] == p && tab[1][1] == p && tab[2][0] == p)) {
            win = true;
        }
        return win;
    }

    return { getCurrentPlayer, getTable, play, getWinner}
}
const game = Game("Player1", "Player2");

