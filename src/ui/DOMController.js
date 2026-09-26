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

export function initialiseDOM(game) {
  game.subscribe(render);

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

      const x =
        Number(cell.dataset.x);

      const y =
        Number(cell.dataset.y);

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
}

function renderBoard(
  boardElement,
  gameboard,
  revealShips,
  enemyBoard
) {
  boardElement.textContent = "";

  for (
    let y = 0;
    y < gameboard.size;
    y += 1
  ) {
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

      const state =
        gameboard.getCellState(
          x,
          y,
          revealShips
        );

      cell.classList.add(state);

      cell.setAttribute(
        "aria-label",
        createCellLabel(
          x,
          y,
          state,
          enemyBoard
        )
      );

      if (state === "hit") {
        cell.textContent = "×";
      }

      if (state === "miss") {
        cell.textContent = "•";
      }

      boardElement.appendChild(cell);
    }
  }
}

function createCellLabel(
  x,
  y,
  state,
  enemyBoard
) {
  const coordinate =
    `${String.fromCharCode(65 + x)}${y + 1}`;

  const boardName =
    enemyBoard
      ? "Enemy board"
      : "Your board";

  return (
    `${boardName}, ${coordinate}, ${state}`
  );
}