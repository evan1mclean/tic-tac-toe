//Factory function for creating Player objects
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
    const resetScore = () => {
        score = 0;
    };
    return {getSign,
        getPlayerType,
        incrementScore,
        getScore,
        resetScore,
    };
};

/* const selectScreen = (function() {
    let choiceSelected = false;
    const botButton = () => {
        const btn = document.getElementById("botButton");
    };

    const humanButton = () => {
        const btn = document.getElementById("humanButton");
    };

    const startButton = () => {
        const btn = document.getElementById("startGameButton");
    };

    const toggleButtonOff = () => {
        let selected = document.querySelectorAll('button');
        selected.forEach((button) => {
            if (button.classList.contains('selected')) {
                button.classList.remove('selected');
            }
        })
    }
})(); */

//creates a module for the game screen
const GameScreen = (function() {
    //instantiates game screen variables
    let player1 = Player("X", "Human");
    let player2 = Player("O", "Bot");
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

        const removeGameBoard = () => {
            tile.forEach(square => {
                square.removeEventListener("click", Game.playRound);
            });
        };

        //clicking restart button will reset values, hide the game screen and bring
        //back the select screen
        const restartButton = () => {
            const btn = document.getElementById("restart");
            const gameScreen = document.querySelector(".game-content-screen");
            const selectScreen = document.querySelector(".player-select-screen");
            btn.addEventListener("click", function() {
                player2 = "";
                Game.resetGame();
                Scoreboard.updateScoreboard();
                gameScreen.classList.add("hidden");
                selectScreen.classList.remove("hidden");
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

    //Module for handling the scoreboard
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
        let gameboard = GameBoard.getGameBoard();
        let condition;
        let win = false;
        let draw = false;
        
        //function for checking if the game is over
        const isGameOver = (player, board) => {
            let playerMoves= [];
            let i = 0;
            board.forEach(element => {
                if (element === player.getSign()) {
                    playerMoves.push(i);
                }
                i++;
            });
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
            let checkIfGameEnds = winConditions.some((combination) => {
                const containsWin = combination.every(element => {
                    condition = combination;
                    return playerMoves.includes(element);
                });
                return containsWin;
            });
            if (checkIfGameEnds) {
                win = true;
            }
            if (!board.includes("") && win === false) {
                draw = true;
                checkIfGameEnds = true;
            }
            playerMoves = [];
            return checkIfGameEnds;
        };

        //function for displaying the winning combination or if a draw happens
        const displayWinner = (player) => { 
            //changes color to red if draw occurs
            if (draw) {
                for (let i = 0; i <= 8; i++) {
                    document.querySelector(`[data-index="${i}"]`).style.backgroundColor = "#EFCED7";
                }
            };
            //increment scores and change background color to green on winning squares
            if (win) {
                player.incrementScore();
                Scoreboard.updateScoreboard();
                condition.forEach(element => {
                    document.querySelector(`[data-index="${element}"]`).style.backgroundColor = "#b4edce";
                });
            }
        };
        //function for resetting the game
        const resetGame = () => {
            player1Turn = true;
            win = false;
            draw = false;
            EventListeners.removeGameBoard();
            setTimeout(() => {
                gameboard = GameBoard.resetGameBoard();
                tile.forEach(element => {
                    element.style.backgroundColor = "white";
                });
                EventListeners.addGameBoard();
                renderGameBoard();
                }, 2000);
        };

        //function for handling the moves of a human player
        const humanTurn = (player, index) => {
            GameBoard.setValue(index, player.getSign());
            renderGameBoard();
        };

        /* Takes in a percentage value and compares it to random number 
        between 1 and 100. If the percentage is lower it will play a
        random move. If not, the computer will play the best move possible. */
        const botTurn = (player, percentage) => {
            const threshold = Math.floor(Math.random() * (100 + 1));
            if (percentage <= threshold) {
                let possibleMoves = availableMoves(gameboard);
                let index = Math.floor(Math.random() * possibleMoves.length);
                GameBoard.setValue(possibleMoves[index], player.getSign());
            }
            else {
                let bestSpot = minimax(gameboard, player);
                win = false;
                draw = false;
                GameBoard.setValue(bestSpot.index, player.getSign());
            }
            renderGameBoard();
        };

        //function for finding what possible moves are left
        const availableMoves = (newBoard) => {
            let possibleMoves = [];
            let i = 0;
            newBoard.forEach(element => {
                if (element === "") {
                    possibleMoves.push(i);
                }
                i++;
            });
            return possibleMoves;
        };

        /* Function to use the minimax algorithm which can be found online to
        determine the best spot for the computer to play. The function
        recursively calls itself to try out a tree of different options and if
        the game ends on one of those, it returns a positive, negative, or
        neutral score. At the end of the function it returns the index of the
        value with the best score.*/
        const minimax = (newBoard, player) => {
            let possibleMoves = availableMoves(newBoard);

            if (isGameOver(player1, newBoard)) {
                return {score: -10};
            }
            else if (isGameOver(player2, newBoard)) {
                return {score: 10};
            }
            else if (possibleMoves.length === 0) {
                return {score: 0};
            }

            let moves = [];

            for (let i = 0; i < possibleMoves.length; i++) {
                let move = {};
                move.index = possibleMoves[i];
                newBoard[possibleMoves[i]] = player.getSign();

                if (player.getSign() === "O") {
                    let result = minimax(newBoard, player1);
                    move.score = result.score;
                }
                else {
                    let result = minimax(newBoard, player2);
                    move.score = result.score;
                }

                newBoard[possibleMoves[i]] = "";
                moves.push(move);
            }

            let bestMove;
            if (player.getSign() === "O") {
                let bestScore = -10000;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            else {
                let bestScore = 10000;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        };
         
        //function to handle the logic for 1 round of tic tac toe
        const playRound = (e) => {
            let index = Number(e.target.dataset.index);
            //handles the logic if player 2 is human
            if (player2.getPlayerType() === "Human") {
                if (gameboard[index] != "") {
                    return;
                }
                if (player1Turn) {
                    player1Turn = false;
                    humanTurn(player1, index);
                    if (isGameOver(player1)) {
                        displayWinner(player1);
                        resetGame();
                        return;
                    }
                }
                else {
                    player1Turn = true;
                    humanTurn(player2, index);
                    if (isGameOver(player2)) {
                        displayWinner(player2);
                        resetGame();
                        return;
                    }
                }
            }
            //handles the logic if player 2 is a bot
            else {
                if (gameboard[index] != "") {
                    return;
                }
                humanTurn(player1, index);
                EventListeners.removeGameBoard();
                if (isGameOver(player1, gameboard)) {
                    displayWinner(player1);
                    resetGame();
                    return;
                }
                setTimeout(() => {
                    botTurn(player2, 100);
                    EventListeners.addGameBoard();
                    if (isGameOver(player2, gameboard)) {
                        displayWinner(player2);
                        resetGame();
                        return;
                    }
                }, 500);
            }
        };

        return {playRound, resetGame};
    })();

    EventListeners.addGameBoard();
    EventListeners.restartButton();
})();