import {
  beforeEach,
  describe,
  expect,
  test,
} from "@jest/globals";

import {
  Gameboard,
} from "../modules/gameboard.js";

describe("Gameboard", function () {
  let gameboard;

  beforeEach(function () {
    gameboard = new Gameboard();
  });

  test("places a horizontal ship", function () {
    const result =
      gameboard.placeShip(
        3,
        1,
        2,
        "horizontal"
      );

    expect(result).toBe(true);
    expect(
      gameboard.hasShipAt(1, 2)
    ).toBe(true);

    expect(
      gameboard.hasShipAt(3, 2)
    ).toBe(true);
  });

  test("places a vertical ship", function () {
    const result =
      gameboard.placeShip(
        3,
        4,
        1,
        "vertical"
      );

    expect(result).toBe(true);
    expect(
      gameboard.hasShipAt(4, 1)
    ).toBe(true);

    expect(
      gameboard.hasShipAt(4, 3)
    ).toBe(true);
  });

  test("prevents ships from leaving the board", function () {
    const result =
      gameboard.placeShip(
        4,
        8,
        0,
        "horizontal"
      );

    expect(result).toBe(false);
  });

  test("prevents ships from overlapping", function () {
    gameboard.placeShip(
      3,
      1,
      1,
      "horizontal"
    );

    const result =
      gameboard.placeShip(
        3,
        2,
        0,
        "vertical"
      );

    expect(result).toBe(false);
  });

  test("records a missed attack", function () {
    const result =
      gameboard.receiveAttack(5, 5);

    expect(result.hit).toBe(false);

    expect(
      gameboard.wasMissed(5, 5)
    ).toBe(true);
  });

  test("hits the correct ship", function () {
    gameboard.placeShip(
      2,
      1,
      1,
      "horizontal"
    );

    const result =
      gameboard.receiveAttack(1, 1);

    expect(result.hit).toBe(true);

    expect(
      gameboard.ships[0].ship.hits
    ).toBe(1);
  });

  test("rejects repeated attacks", function () {
    gameboard.receiveAttack(1, 1);

    const result =
      gameboard.receiveAttack(1, 1);

    expect(result.valid).toBe(false);

    expect(result.reason).toBe(
      "already-attacked"
    );
  });

  test("reports when all ships are sunk", function () {
    gameboard.placeShip(
      2,
      0,
      0,
      "horizontal"
    );

    gameboard.receiveAttack(0, 0);
    gameboard.receiveAttack(1, 0);

    expect(
      gameboard.allShipsSunk()
    ).toBe(true);
  });
});