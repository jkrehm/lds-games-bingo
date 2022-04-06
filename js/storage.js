function safeParse(input, fallback) {
  try {
    return input ? JSON.parse(input) : fallback;
  } catch {
    return fallback;
  }
}

export function getFromLocalStorage() {
  const board = safeParse(window.localStorage.getItem("bingo-board"), []);
  const marks = safeParse(window.localStorage.getItem("bingo-marks"), []);

  return { board, marks };
}

export function saveBoardToLocalStorage(board) {
  window.localStorage.setItem("bingo-board", JSON.stringify(board));
}

export function saveMarksToLocalStorage(marks) {
  window.localStorage.setItem("bingo-marks", JSON.stringify(marks));
}
