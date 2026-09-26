import {
  Gameboard,
} from "./gameboard.js";

export class Player {
  constructor(
    name,
    type = "human"
  ) {
    this.name = name;
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(enemyPlayer, x, y) {
    return enemyPlayer.gameboard
      .receiveAttack(x, y);
  }

  resetGameboard() {
    this.gameboard = new Gameboard();
  }
}