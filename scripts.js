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
    const resetScore = () => {
        score = 0;
    };
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
        resetScore,
    };
};

/* const selectScreen = (function() {

})();
 */

//creates a module for the game screen
const GameScreen = (function() {
    //instantiates game screen variables
    let player1 = Player("X", "Human");
    let player2 = Player("O", "Human");
    let player1Turn = true;
    const tile = document.querySelectorAll(".tile");

    //function for rendering player clicks onto the game board
    const renderGameBoard = () => {
        let i = 0;
        const gameboard = GameBoard.getGameBoard();
        gameboard.forEach(element => {
            document.querySelector(`[data-index="${i}"]`).textContent = element;
            i++;
        });
    };

    //module for adding/removing the event listeners
    const EventListeners = (function() {
        const addGameBoard = () => {
            tile.forEach(square => {
                square.addEventListener("click", Game.playRound);
            });
        };

        //clicking restart button will reset values, hide the game screen and bring
        //back the select screen
        const restartButton = () => {
            const btn = document.getElementById("restart");
            const gameScreen = document.querySelector(".game-content-screen");
            const selectScreen = document.querySelector(".player-select-screen");
            btn.addEventListener("click", function() {
                /* player1 = "";
                player2 = ""; */
                Game.resetGame();
                Scoreboard.updateScoreboard();
                gameScreen.classList.add("hidden");
                selectScreen.classList.remove("hidden");
            });
        };

        const removeGameBoard = () => {
            tile.forEach(square => {
                square.removeEventListener("click", Game.playRound);
            });
        };

        return {
            addGameBoard,
            removeGameBoard,
            restartButton
        }
    })();

    //Module for creating the game board
    const GameBoard = (function () {
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

    const Scoreboard = (function () {
        const player1Score = document.querySelector(".player-1-score p");
        const player2Score = document.querySelector(".player-2-score p");

        const updateScoreboard = () => {
            player1Score.textContent = player1.getScore();
            player2Score.textContent = player2.getScore();
        };

        return {updateScoreboard}
    })();

    //Module for handling the game play loop
    const Game = (function () {
        let board = GameBoard.getGameBoard();
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
                Scoreboard.updateScoreboard();
                win.forEach(element => {
                    document.querySelector(`[data-index="${element}"]`).style.backgroundColor = "#b4edce";
                });
                resetGame();
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
            EventListeners.removeGameBoard();
            setTimeout(() => {
                board = GameBoard.resetGameBoard();
                tile.forEach(element => {
                    element.style.backgroundColor = "white";
                });
                EventListeners.addGameBoard();
                renderGameBoard();
                }, 2000);
        };

        //function for handling the moves of a human player
        const humanTurn = (player, index) => {
            player.setMoveIndex(index);
            GameBoard.setValue(index, player.getSign());
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
        return {playRound, resetGame};
    })();

    EventListeners.addGameBoard();
    EventListeners.restartButton();
})();