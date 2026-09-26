import {
  describe,
  expect,
  test,
} from "@jest/globals";

import { Player } from "../modules/player.js";

describe("Player", function () {
  test("creates a player with a gameboard", function () {
    const player =
      new Player("Liam");

    expect(player.name).toBe("Liam");
    expect(player.gameboard).toBeDefined();
  });

  test("can attack another player", function () {
    const player =
      new Player("Player");

    const enemy =
      new Player("Computer");

    enemy.gameboard.placeShip(
      2,
      0,
      0,
      "horizontal"
    );

    const result =
      player.attack(enemy, 0, 0);

    expect(result.hit).toBe(true);

    expect(
      enemy.gameboard.ships[0]
        .ship.hits
    ).toBe(1);
  });
});