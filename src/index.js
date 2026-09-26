import "./styles.css";

import { GameController } from "./modules/game-controller.js";
import { initialiseDOM } from "./ui/dom-controller.js";

const game = new GameController();

initialiseDOM(game);