import { Player } from "./player.js";

const FLEET = [5, 4, 3, 3, 2];

export class GameController {
  constructor() {
    this.player =
      new Player("Player", "human");

    this.computer =
      new Player("Computer", "computer");

    this.phase = "placement";
    this.currentTurn = "player";
    this.winner = null;

    this.message =
      "Position your fleet, then start the game.";

    this.changeHandler = null;

    this.randomiseBothFleets();
  }

  subscribe(changeHandler) {
    this.changeHandler = changeHandler;
    this.notifyChange();
  }

  notifyChange() {
    if (this.changeHandler) {
      this.changeHandler(this.getState());
    }
  }

  getState() {
    return {
      player: this.player,
      computer: this.computer,
      phase: this.phase,
      currentTurn: this.currentTurn,
      winner: this.winner,
      message: this.message,
    };
  }

  randomiseBothFleets() {
    this.placeFleetRandomly(
      this.player.gameboard
    );

    this.placeFleetRandomly(
      this.computer.gameboard
    );
  }

  randomisePlayerFleet() {
    if (this.phase !== "placement") {
      return;
    }

    this.placeFleetRandomly(
      this.player.gameboard
    );

    this.message =
      "Your fleet has been repositioned.";

    this.notifyChange();
  }

  placeFleetRandomly(gameboard) {
    gameboard.clear();

    FLEET.forEach((length) => {
      let placed = false;
      let attempts = 0;

      while (
        !placed &&
        attempts < 1000
      ) {
        const direction =
          Math.random() < 0.5
            ? "horizontal"
            : "vertical";

        const x =
          Math.floor(
            Math.random() *
              gameboard.size
          );

        const y =
          Math.floor(
            Math.random() *
              gameboard.size
          );

        placed = gameboard.placeShip(
          length,
          x,
          y,
          direction
        );

        attempts += 1;
      }

      if (!placed) {
        throw new Error(
          "The fleet could not be placed."
        );
      }
    });
  }

  startGame() {
    if (this.phase !== "placement") {
      return;
    }

    this.phase = "playing";
    this.currentTurn = "player";
    this.message =
      "Your turn. Attack the enemy board.";

    this.notifyChange();
  }

  attackEnemy(x, y) {
    if (
      this.phase !== "playing" ||
      this.currentTurn !== "player"
    ) {
      return;
    }

    const result =
      this.player.attack(
        this.computer,
        x,
        y
      );

    if (!result.valid) {
      this.message =
        "You have already attacked that position.";

      this.notifyChange();
      return;
    }

    this.message = result.hit
      ? result.sunk
        ? "Direct hit! You sank a ship."
        : "Direct hit!"
      : "You missed.";

    if (
      this.computer.gameboard
        .allShipsSunk()
    ) {
      this.endGame("player");
      return;
    }

    this.currentTurn = "computer";
    this.notifyChange();

    window.setTimeout(() => {
      this.computerAttack();
    }, 600);
  }

  computerAttack() {
    if (
      this.phase !== "playing" ||
      this.currentTurn !== "computer"
    ) {
      return;
    }

    let x;
    let y;

    do {
      x = Math.floor(
        Math.random() *
          this.player.gameboard.size
      );

      y = Math.floor(
        Math.random() *
          this.player.gameboard.size
      );
    } while (
      this.player.gameboard
        .wasAttacked(x, y)
    );

    const result =
      this.computer.attack(
        this.player,
        x,
        y
      );

    const coordinate =
      `${String.fromCharCode(65 + x)}${y + 1}`;

    this.message = result.hit
      ? `Computer attacked ${coordinate} and hit your ship!`
      : `Computer attacked ${coordinate} and missed.`;

    if (
      this.player.gameboard
        .allShipsSunk()
    ) {
      this.endGame("computer");
      return;
    }

    this.currentTurn = "player";

    this.notifyChange();
  }

  endGame(winner) {
    this.phase = "finished";
    this.winner = winner;

    this.message =
      winner === "player"
        ? "You won! The enemy fleet has been destroyed."
        : "The computer won. Your fleet has been destroyed.";

    this.notifyChange();
  }

  restartGame() {
    this.player.resetGameboard();
    this.computer.resetGameboard();

    this.phase = "placement";
    this.currentTurn = "player";
    this.winner = null;

    this.message =
      "Position your fleet, then start the game.";

    this.randomiseBothFleets();
    this.notifyChange();
  }
}