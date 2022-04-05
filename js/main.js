import { h, render } from "https://unpkg.com/preact@latest?module";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import htm from "https://unpkg.com/htm@3.1.0/dist/htm.module.js?module";
import useCalculateWin from "./calculate-win.js";
import cardOptions from "./card-options.js";
import { getBoardClass, shuffleArray } from "./utils.js";

const html = htm.bind(h);

function Cell({ isMarked, image, onClick, text }) {
  return html`<div
    class="cell ${isMarked ? "is-marked" : ""}"
    onClick=${onClick}
  >
    <img src="img/bingo/${image}" alt=${text} />
    <p>${text}</p>
  </div>`;
}

function generateBoard(boardSize) {
  const options = shuffleArray(cardOptions).slice(0, boardSize * boardSize);

  const x = Math.floor(boardSize / 2);
  const center = boardSize * x + x;

  options[center] = {
    text: "Jesus Christ",
    image: "jesus_christ.png",
  };

  return options;
}

function App() {
  const [boardSize, setBoardSize] = useState(5);
  const [board, setBoard] = useState([]);
  const [marks, setMarks] = useState([]);
  const [shouldGenerateBoard, setShouldGenerateBoard] = useState(0);

  const isWin = useCalculateWin(boardSize, marks);

  const onNewGame = useCallback((e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    setMarks([]);
    setBoardSize(
      Number.parseInt(
        formProps["board-size"] instanceof File ? "5" : formProps["board-size"],
        10
      )
    );
    setShouldGenerateBoard(Date.now());
  }, []);

  const onCellClick = useMemo(
    () => (index) => () => {
      setMarks((v) =>
        v.includes(index)
          ? v.filter((i) => i !== index)
          : [...v].concat(index).sort((a, b) => a - b)
      );
    },
    []
  );

  useEffect(() => {
    if (isWin) alert("Bingo!");
  }, [isWin]);

  useEffect(() => {
    setBoard(generateBoard(boardSize));
  }, [boardSize, shouldGenerateBoard]);

  return html`
    <div class="app">
      <form class="controls" onsubmit=${onNewGame}>
        <fieldset>
          <legend>Grid Size</legend>
          <label class="radio-button-label" for="board-size-3">
            <input
              type="radio"
              class="radio-button"
              name="board-size"
              id="board-size-3"
              value="3"
              checked=${boardSize === 3 ? "checked" : ""}
            />
            3x3
          </label>
          <label class="radio-button-label" for="board-size-5">
            <input
              type="radio"
              class="radio-button"
              name="board-size"
              id="board-size-5"
              value="5"
              checked=${boardSize === 5 ? "checked" : ""}
            />
            5x5
          </label>
        </fieldset>
        <button type="submit" class="button button-primary">New Game</button>
      </form>
      <section class="board ${getBoardClass(boardSize)}">
        ${board.map(
          (cell, index) =>
            html`<${Cell}
              ...${cell}
              isMarked=${marks.includes(index)}
              onClick=${onCellClick(index)}
            />`
        )}
      </section>
    </div>
  `;
}

render(html`<${App} />`, document.querySelector("#root"));
