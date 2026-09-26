import { Ship } from "./ship.js";

export class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.ships = [];
    this.missedAttacks = new Set();
    this.attacks = new Set();
  }

  clear() {
    this.ships = [];
    this.missedAttacks.clear();
    this.attacks.clear();
  }

  placeShip(
    length,
    startX,
    startY,
    direction = "horizontal"
  ) {
    const coordinates =
      this.createCoordinates(
        length,
        startX,
        startY,
        direction
      );

    if (!this.canPlaceShip(coordinates)) {
      return false;
    }

    const ship = new Ship(length);

    this.ships.push({
      ship,
      coordinates,
    });

    return true;
  }

  createCoordinates(
    length,
    startX,
    startY,
    direction
  ) {
    const coordinates = [];

    for (
      let position = 0;
      position < length;
      position += 1
    ) {
      const x =
        direction === "horizontal"
          ? startX + position
          : startX;

      const y =
        direction === "vertical"
          ? startY + position
          : startY;

      coordinates.push({ x, y });
    }

    return coordinates;
  }

  canPlaceShip(coordinates) {
    return coordinates.every(
      (coordinate) => {
        const insideBoard =
          coordinate.x >= 0 &&
          coordinate.x < this.size &&
          coordinate.y >= 0 &&
          coordinate.y < this.size;

        return (
          insideBoard &&
          !this.hasShipAt(
            coordinate.x,
            coordinate.y
          )
        );
      }
    );
  }

  hasShipAt(x, y) {
    return this.ships.some(
      (placement) =>
        placement.coordinates.some(
          (coordinate) =>
            coordinate.x === x &&
            coordinate.y === y
        )
    );
  }

  findShipAt(x, y) {
    return this.ships.find(
      (placement) =>
        placement.coordinates.some(
          (coordinate) =>
            coordinate.x === x &&
            coordinate.y === y
        )
    );
  }

  receiveAttack(x, y) {
    if (!this.isInsideBoard(x, y)) {
      return {
        valid: false,
        reason: "outside-board",
      };
    }

    const coordinateKey =
      this.getCoordinateKey(x, y);

    if (this.attacks.has(coordinateKey)) {
      return {
        valid: false,
        reason: "already-attacked",
      };
    }

    this.attacks.add(coordinateKey);

    const placement =
      this.findShipAt(x, y);

    if (!placement) {
      this.missedAttacks.add(
        coordinateKey
      );

      return {
        valid: true,
        hit: false,
        sunk: false,
      };
    }

    placement.ship.hit();

    return {
      valid: true,
      hit: true,
      sunk: placement.ship.isSunk(),
    };
  }

  wasAttacked(x, y) {
    return this.attacks.has(
      this.getCoordinateKey(x, y)
    );
  }

  wasMissed(x, y) {
    return this.missedAttacks.has(
      this.getCoordinateKey(x, y)
    );
  }

  allShipsSunk() {
    return (
      this.ships.length > 0 &&
      this.ships.every(
        (placement) =>
          placement.ship.isSunk()
      )
    );
  }

  getCellState(
    x,
    y,
    revealShips = false
  ) {
    const placement =
      this.findShipAt(x, y);

    const attacked =
      this.wasAttacked(x, y);

    if (placement && attacked) {
      return "hit";
    }

    if (this.wasMissed(x, y)) {
      return "miss";
    }

    if (placement && revealShips) {
      return "ship";
    }

    return "empty";
  }

  isInsideBoard(x, y) {
    return (
      Number.isInteger(x) &&
      Number.isInteger(y) &&
      x >= 0 &&
      x < this.size &&
      y >= 0 &&
      y < this.size
    );
  }

  getCoordinateKey(x, y) {
    return `${x},${y}`;
  }
}