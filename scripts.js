//Factory function for creating Player objects
const Player = function (sign, type) {
    let score = 0;
    let playerMoves = [];
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
    const setMoveIndex = (index) => {
        playerMoves.push(index);
    };
    const getMoveIndex = () => {
        return playerMoves;
    };
    const resetMoveIndex = () => {
        return playerMoves = [];
    };
    return {getSign,
        getPlayerType,
        incrementScore,
        getScore,
        setMoveIndex,
        getMoveIndex,
        resetMoveIndex,
    };
};

/* const settingsScreen = (function() {

})();
 */

//creates a module for the game screen
const gameScreen = (function() {
    //instantiates game screen variables
    const player1 = Player("X", "Human");
    const player2 = Player("O", "Human");
    let player1Turn = true;
    const tile = document.querySelectorAll(".tile");

    //function for rendering player clicks onto the game board
    const renderGameBoard = () => {
        let i = 0;
        const gameboard = gameBoard.getGameBoard();
        gameboard.forEach(element => {
            document.querySelector(`[data-index="${i}"]`).textContent = element;
            i++;
        });
    };

    //module for adding/removing the event listeners
    const eventListeners = (function() {
        const add = () => {
            tile.forEach(square => {
                square.addEventListener("click", game.playRound);
            });
        };

        const remove = () => {
            tile.forEach(square => {
                square.removeEventListener("click", game.playRound);
            });
        };

        return {
            add,
            remove,
        }
    })();

    //Module for creating the game board
    const gameBoard = (function () {
        let board = ["", "", "", "", "", "", "", "", ""];
        const setValue = (index, sign) => {
            board[index] = sign;
        };
        const getGameBoard = () => {
            return board;
        };
        const resetGameBoard = () => {
            return board = ["", "", "", "", "", "", "", "", ""];
        };
        return {getGameBoard, setValue, resetGameBoard};
    })();

    //Module for handling the game play loop
    const game = (function () {
        let board = gameBoard.getGameBoard();
        let win;
        //function for checking if the game is over
        const gameOver = (player) => {
            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [3, 4, 5],
                [0, 4, 8],
                [2, 4, 6],
            ];
            //checks if the player moves array contains every element of one of the
            //win conditions
            let checkForWin = winConditions.some((condition) => {
                const containsWin = condition.every(element => {
                    win = condition;
                    return player.getMoveIndex().includes(element);
                });
                return containsWin;
            });
            //if win condition is met, increment scores and change background color
            //to green on winning squares
            if (checkForWin) {
                player.incrementScore();
                win.forEach(element => {
                    document.querySelector(`[data-index="${element}"]`).style.backgroundColor = "#b4edce";
                });
                resetGame();
                console.log("Player Score " + player.getScore());
                console.log(win);
            }
            else if (!board.includes("")) {
                for (let i = 0; i <= 8; i++) {
                    document.querySelector(`[data-index="${i}"]`).style.backgroundColor = "#EFCED7";
                }
                resetGame();
            }
            else {
                return;
            }
        };

        //function for resetting the game
        const resetGame = () => {
            player1Turn = true;
            player1.resetMoveIndex();
            player2.resetMoveIndex();
            eventListeners.remove();
            setTimeout(() => {
                board = gameBoard.resetGameBoard();
                tile.forEach(element => {
                    element.style.backgroundColor = "white";
                });
                eventListeners.add();
                renderGameBoard();
                }, 2000);
        };

        //function for handling the moves of a human player
        const humanTurn = (player, index) => {
            player.setMoveIndex(index);
            gameBoard.setValue(index, player.getSign());
            gameOver(player);
        };
        
        //function to handle the logic for 1 round of tic tac toe
        const playRound = (e) => {
            let index = Number(e.target.dataset.index);
            if (board[index] != "") {
                return;
            }
            if (player1Turn) {
                player1Turn = false;
                humanTurn(player1, index);
            }
            else {
                player1Turn = true;
                humanTurn(player2, index);
            }
            renderGameBoard();
        };
        return {playRound};
    })();

    eventListeners.add();
})();