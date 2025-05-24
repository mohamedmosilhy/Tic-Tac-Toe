// GameBoard Module
const createGameBoard = (() => {
  let board = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));

  const reset = () => {
    board = Array(3)
      .fill(null)
      .map(() => Array(3).fill(null));
  };

  const setCell = (row, col, symbol) => {
    if (!board[row][col]) {
      board[row][col] = symbol;
      return true;
    }
    return false;
  };

  const getBoard = () => board;

  return { reset, setCell, getBoard };
})();

// Player Factory
const createPlayer = (symbol) => {
  return { symbol };
};

// Display Controller Module
const displayController = (() => {
  const newGameButton = document.querySelector(".new-game-button");
  const cells = Array.from(document.querySelectorAll(".grid-cell"));
  const message = document.querySelector(".message");
  const player1_score = document.querySelector(".player1-score .score");
  const player2_score = document.querySelector(".player2-score .score");
  const draw = document.querySelector(".draw .score");

  const clearBoard = () => {
    cells.forEach((cell) => (cell.textContent = ""));
  };

  const updateCell = (row, col, content) => {
    const cell = document.querySelector(`[data-pos="${row}_${col}"]`);
    if (cell) cell.textContent = content;
  };

  const bindCellClick = (callback) => {
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const [row, col] = cell.dataset.pos.split("_").map(Number);
        callback(row, col);
      });
    });
  };

  const showMessage = (text) => {
    if (message) message.textContent = text;
  };

  const updateScores = (text, player) => {
    if (player === "player1") {
      player1_score.textContent = text;
    } else if (player === "player2") {
      player2_score.textContent = text;
    } else {
      draw.textContent = text;
    }
  };

  return {
    newGameButton,
    clearBoard,
    updateCell,
    bindCellClick,
    showMessage,
    updateScores,
  };
})();

// Game Controller Module
const gameController = (() => {
  const player1 = createPlayer("X");
  const player2 = createPlayer("O");
  let currentPlayer = player1;
  let isGameOver = false;
  let player1Score = 0;
  let player2Score = 0;
  let draw = 0;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (board) => {
    // Rows and Columns
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      )
        return true;

      if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[1][i] === board[2][i]
      )
        return true;
    }

    // Diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    )
      return true;

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    )
      return true;

    return false;
  };

  const isDraw = (board) => board.flat().every((cell) => cell !== null);

  const handleCellClick = (row, col) => {
    if (isGameOver) return;

    if (createGameBoard.setCell(row, col, currentPlayer.symbol)) {
      displayController.updateCell(row, col, currentPlayer.symbol);

      const board = createGameBoard.getBoard();

      if (checkWin(board)) {
        displayController.showMessage(`${currentPlayer.symbol} wins!`);
        isGameOver = true;
        if (currentPlayer === player1) {
          player1Score += 1;
          displayController.updateScores(player1Score, "player1");
        } else {
          player2Score += 1;
          displayController.updateScores(player2Score, "player2");
        }
        reset_after_win();
      } else if (isDraw(board)) {
        displayController.showMessage("It's a draw!");
        isGameOver = true;
        draw += 1;
        displayController.updateScores(draw, "draw");
        reset_after_win();
      } else {
        switchPlayer();
      }
    }
  };
  const reset_after_win = () => {
    setTimeout(() => {
      createGameBoard.reset();
      displayController.clearBoard();
      displayController.showMessage("");
      isGameOver = false;
      currentPlayer = player1;
    }, 1000);
  };

  const startGame = () => {
    createGameBoard.reset();
    displayController.clearBoard();
    displayController.showMessage("");
    isGameOver = false;
    currentPlayer = player1;
    displayController.updateScores(0, "player1");
    displayController.updateScores(0, "player2");
    displayController.updateScores(0, "draw");
  };

  // Bind UI events
  displayController.bindCellClick(handleCellClick);
  displayController.newGameButton.addEventListener("click", startGame);

  return { startGame };
})();

// Start first game
gameController.startGame();
