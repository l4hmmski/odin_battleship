import "./styles.css";

import {
  GameController,
} from "./modules/gameController.js";

import {
  initialiseDOM,
} from "./ui/DOMController.js";

const game = new GameController();

initialiseDOM(game);