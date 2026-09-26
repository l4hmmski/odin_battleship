import {
  describe,
  expect,
  test,
} from "@jest/globals";

import { Ship } from "../modules/ship.js";

describe("Ship", function () {
  test("creates a ship with a length", function () {
    const ship = new Ship(3);

    expect(ship.length).toBe(3);
    expect(ship.hits).toBe(0);
  });

  test("hit increases the hit count", function () {
    const ship = new Ship(3);

    ship.hit();

    expect(ship.hits).toBe(1);
  });

  test("reports that an undamaged ship is not sunk", function () {
    const ship = new Ship(2);

    expect(ship.isSunk()).toBe(false);
  });

  test("reports that a fully hit ship is sunk", function () {
    const ship = new Ship(2);

    ship.hit();
    ship.hit();

    expect(ship.isSunk()).toBe(true);
  });

  test("does not record more hits than its length", function () {
    const ship = new Ship(1);

    ship.hit();
    ship.hit();

    expect(ship.hits).toBe(1);
  });
});