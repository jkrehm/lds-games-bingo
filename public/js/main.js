import { h, render } from "https://unpkg.com/preact@latest?module";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";
import htm from "https://unpkg.com/htm@3.1.0/dist/htm.module.js?module";
import useCalculateWin from "./useCalculateWin.js";
import cardOptions from "./CardOptions.js";
import {
  getFromLocalStorage,
  saveBoardToLocalStorage,
  saveMarksToLocalStorage,
} from "./storage.js";
import { cx, shuffleArray } from "./utils.js";

const html = htm.bind(h);

function Cell({ className, isMarked, image, onClick, text }) {
  return html`<div
    class="${cx(
      className,
      "grid gap-1 grid-rows-[1fr_1rem] p-1 text-center border border-gray-300 items-center justify-items-center",
      isMarked && "bg-blue-300",
    )}"
    onClick=${onClick}
  >
    <div
      class="w-full h-full bg-contain bg-center bg-no-repeat"
      style="background-image: url('img/bingo/${image}')"
    ></div>
    <p class="truncate text-[10px] capitalize max-w-full">${text}</p>
  </div>`;
}

function generateBoard(boardSize) {
  const weightedOptions = cardOptions.flatMap((option) =>
    Array(option.weight).fill(option),
  );

  const options = shuffleArray(weightedOptions).slice(0, boardSize * boardSize);

  const x = Math.floor(boardSize / 2);
  const center = boardSize * x + x;

  options[center] = {
    text: "Jesus Christ",
    image: "jesus_christ.webp",
  };

  return options;
}

function getDefaults() {
  const { board, marks } = getFromLocalStorage();
  const boardSize = board.length ? Math.sqrt(board.length) : 5;

  return { board, boardSize, marks };
}

const defaults = getDefaults();

function App() {
  const [boardSize, setBoardSize] = useState(defaults.boardSize);
  const [board, setBoard] = useState(defaults.board);
  const [marks, setMarks] = useState(defaults.marks);
  const [shouldGenerateBoard, setShouldGenerateBoard] = useState(
    defaults.board.length > 0 ? 0 : 1
  );

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
    if (!shouldGenerateBoard) return;

    setBoard(generateBoard(boardSize));
  }, [boardSize, shouldGenerateBoard]);

  useEffect(() => {
    saveBoardToLocalStorage(board);
  }, [board]);

  useEffect(() => {
    saveMarksToLocalStorage(marks);
  }, [marks]);

  return html`
    <div class="grid md:grid-cols-[150px_1fr] gap-8 p-4 text-gray-800">
      <form class="flex flex-col gap-2 w-fit" onsubmit=${onNewGame}>
        <fieldset>
          <legend>Grid Size</legend>
          <label class="flex gap-2" for="board-size-3">
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
          <label class="flex gap-2" for="board-size-5">
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
        <button type="submit" class="py-2 px-4 bg-blue-500 text-white rounded">
          New Game
        </button>
      </form>
      <section
        class=${cx(
          "grid w-fit h-full max-h-[calc(100vh-32px)] max-w-[calc(100vw-32px)] aspect-square",
          boardSize === 3
            ? "grid-rows-3 grid-cols-3"
            : "grid-rows-5 grid-cols-5"
        )}
      >
        ${board.map(
          (cell, index) =>
            html`<${Cell}
              ...${cell}
              key=${cell.text}
              isMarked=${marks.includes(index)}
              onClick=${onCellClick(index)}
            />`
        )}
        <Cell className="invisible w-[200px]" />
      </section>
    </div>
  `;
}

render(html`<${App} />`, document.querySelector("#root"));
