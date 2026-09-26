const playerBoard =
  document.querySelector(
    "#player-board"
  );

const computerBoard =
  document.querySelector(
    "#computer-board"
  );

const statusMessage =
  document.querySelector(
    "#status-message"
  );

const randomiseButton =
  document.querySelector(
    "#randomise-button"
  );

const startButton =
  document.querySelector(
    "#start-button"
  );

const restartButton =
  document.querySelector(
    "#restart-button"
  );

const resetScoreButton =
  document.querySelector(
    "#reset-score-button"
  );

const playerScore =
  document.querySelector(
    "#player-score"
  );

const computerScore =
  document.querySelector(
    "#computer-score"
  );

export function initialiseDOM(game) {
  computerBoard.addEventListener(
    "click",
    function (event) {
      const cell =
        event.target.closest(
          ".board-cell"
        );

      if (!cell) {
        return;
      }

      const x = Number(
        cell.dataset.x
      );

      const y = Number(
        cell.dataset.y
      );

      game.attackEnemy(x, y);
    }
  );

  randomiseButton.addEventListener(
    "click",
    function () {
      game.randomisePlayerFleet();
    }
  );

  startButton.addEventListener(
    "click",
    function () {
      game.startGame();
    }
  );

  restartButton.addEventListener(
    "click",
    function () {
      game.restartGame();
    }
  );

  resetScoreButton.addEventListener(
    "click",
    function () {
      game.resetScores();
    }
  );

  game.subscribe(render);
}

function render(state) {
  renderBoard(
    playerBoard,
    state.player.gameboard,
    true,
    false
  );

  renderBoard(
    computerBoard,
    state.computer.gameboard,
    state.phase === "finished",
    true
  );

  statusMessage.textContent =
    state.message;

  playerScore.textContent =
    state.scores.player;

  computerScore.textContent =
    state.scores.computer;

  randomiseButton.hidden =
    state.phase !== "placement";

  startButton.hidden =
    state.phase !== "placement";

  restartButton.hidden =
    state.phase !== "finished";

  computerBoard.classList.toggle(
    "disabled",
    state.phase !== "playing" ||
      state.currentTurn !== "player"
  );
}

function renderBoard(
  boardElement,
  gameboard,
  revealShips,
  enemyBoard
) {
  boardElement.textContent = "";

  boardElement.appendChild(
    createAxisLabel(
      "",
      "corner"
    )
  );

  for (
    let x = 0;
    x < gameboard.size;
    x += 1
  ) {
    const letter =
      String.fromCharCode(65 + x);

    boardElement.appendChild(
      createAxisLabel(
        letter,
        "column-label"
      )
    );
  }

  for (
    let y = 0;
    y < gameboard.size;
    y += 1
  ) {
    boardElement.appendChild(
      createAxisLabel(
        y + 1,
        "row-label"
      )
    );

    for (
      let x = 0;
      x < gameboard.size;
      x += 1
    ) {
      const cell =
        document.createElement(
          "button"
        );

      cell.type = "button";

      cell.classList.add(
        "board-cell"
      );

      cell.dataset.x = x;
      cell.dataset.y = y;

      const cellState =
        gameboard.getCellState(
          x,
          y,
          revealShips
        );

      cell.classList.add(
        cellState
      );

      cell.setAttribute(
        "aria-label",
        createCellLabel(
          x,
          y,
          cellState,
          enemyBoard
        )
      );

      if (cellState === "hit") {
        cell.textContent = "×";
      }

      if (cellState === "miss") {
        cell.textContent = "•";
      }

      boardElement.appendChild(
        cell
      );
    }
  }
}

function createAxisLabel(
  text,
  className
) {
  const label =
    document.createElement("span");

  label.classList.add(
    "axis-label",
    className
  );

  label.textContent = text;

  return label;
}

function createCellLabel(
  x,
  y,
  state,
  enemyBoard
) {
  const coordinate =
    `${String.fromCharCode(
      65 + x
    )}${y + 1}`;

  const boardName =
    enemyBoard
      ? "Enemy board"
      : "Your board";

  return (
    `${boardName}, ` +
    `${coordinate}, ` +
    state
  );
}