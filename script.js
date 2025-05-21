function createGameBoard() {
  let cells = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  return { cells };
}

function createPlayer(name, symbol) {
  return { name, symbol };
}

function createGameController(gameBoard, player1, player2) {
  let board = gameBoard.cells;
  let endGame = false;
  let turn = "player1";
  let player1Controller = player1;
  let player2Controller = player2;

  const printBoard = () => {
    console.log("\nCurrent board:");
    board.forEach((row) => {
      console.log(row.map((cell) => cell || "_").join(" "));
    });
  };

  const checkWin = () => {
    const size = board.length;

    // Rows
    for (let row of board) {
      if (row[0] !== null && row.every((val) => val === row[0])) {
        endGame = true;
        return true;
      }
    }

    // Columns
    for (let col = 0; col < size; col++) {
      let first = board[0][col];
      if (first !== null && board.every((row) => row[col] === first)) {
        endGame = true;
        return true;
      }
    }

    // Main diagonal
    let firstDiag = board[0][0];
    if (firstDiag !== null && board.every((row, i) => row[i] === firstDiag)) {
      endGame = true;
      return true;
    }

    // Anti diagonal
    let firstAntiDiag = board[0][size - 1];
    if (
      firstAntiDiag !== null &&
      board.every((row, i) => row[size - 1 - i] === firstAntiDiag)
    ) {
      endGame = true;
      return true;
    }

    // Draw check
    if (board.flat().every((cell) => cell !== null)) {
      endGame = true;
      return "draw";
    }

    return false;
  };

  const makeMove = (player, row, col) => {
    if (row < 0 || row > 2 || col < 0 || col > 2) {
      console.log("Invalid coordinates. Please enter 0, 1, or 2.");
      return false;
    }
    if (board[row][col] !== null) {
      console.log("Cell already occupied. Choose another.");
      return false;
    }
    board[row][col] = player.symbol;
    return true;
  };

  const promptMove = (player) => {
    let input = prompt(
      `${player.name} (${player.symbol}), enter your move as "row col" (0-2 each):`
    );
    if (input === null) {
      console.log("Game aborted by user.");
      endGame = true;
      return null;
    }
    let parts = input.trim().split(/\s+/);
    if (parts.length !== 2) {
      console.log("Invalid input format. Try again.");
      return promptMove(player);
    }
    let row = parseInt(parts[0], 10);
    let col = parseInt(parts[1], 10);
    if (isNaN(row) || isNaN(col)) {
      console.log("Invalid numbers. Try again.");
      return promptMove(player);
    }
    return [row, col];
  };

  const startGame = () => {
    console.clear();
    console.log("Tic-Tac-Toe game started!");
    printBoard();

    while (!endGame) {
      let currentPlayer =
        turn === "player1" ? player1Controller : player2Controller;

      let move = promptMove(currentPlayer);
      if (endGame) break; // if aborted

      if (!makeMove(currentPlayer, move[0], move[1])) {
        continue; // invalid move, retry same player
      }

      printBoard();

      let result = checkWin();
      if (result === true) {
        console.log(`🎉 ${currentPlayer.name} (${currentPlayer.symbol}) wins!`);
      } else if (result === "draw") {
        console.log("It's a draw!");
      }

      if (endGame) break;

      turn = turn === "player1" ? "player2" : "player1";
    }

    console.log("Game over.");
  };

  return {
    startGame,
  };
}

// Initialize and start
let gameBoard = createGameBoard();
let player1 = createPlayer("Mohamed", "X");
let player2 = createPlayer("Ali", "O");

let gameController = createGameController(gameBoard, player1, player2);
gameController.startGame();
