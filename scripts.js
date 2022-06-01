const Player = function (sign, type) {
    let score = 0;
    const getPlayerType = () => {
        return type;
    };
    const getSign = () => {
        return sign;
    };
    const incrementScore = () => {
        score += 1;
    };
    const getScore = () => {
        return score;
    }
    return {getSign, getPlayerType, incrementScore, getScore};
};

/* const settingsScreen = (function() {

})();
 */
const gameScreen = (function() {
    const player1 = Player("X", "Human");
    const player2 = Player("O", "Human");
    let player1Turn = true;
    const player1Moves = [];
    const player2Moves = [];
    const tile = document.querySelectorAll(".tile");

    const renderGameBoard = () => {
        let i = 0;
        const gameboard = gameBoard.getGameBoard();
        gameboard.forEach(element => {
            document.querySelector(`[data-index="${i}"]`).textContent = element;
            i++;
        });
    };

    const gameBoard = (function () {
        const board = ["", "", "", "", "", "", "", "", ""];
        const setValue = (index, sign) => {
            board[index] = sign;
        };
        const getGameBoard = () => {
            return board;
        };
        return {getGameBoard, setValue};
    })();

    const game = (function () {
        const board = gameBoard.getGameBoard();
        const playRound = (e) => {
            let index = e.target.dataset.index;
            if (board[index] != "") {
                return;
            }
            else {
                if (player1Turn) {
                    player1Moves.push(index);
                    gameBoard.setValue(index, player1.getSign());
                    player1Turn = false;
                }
                else {
                    player2Moves.push(index);
                    gameBoard.setValue(index, player2.getSign());
                    player1Turn = true;
                }
            }
            renderGameBoard();
        };
        return {playRound};
    })();

    tile.forEach(square => {square.addEventListener("click", game.playRound)});
})();