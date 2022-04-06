import {
  useEffect,
  useRef,
} from "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module";

function checkDown(markedGrid, x) {
  for (let i = 0; i < markedGrid.length; i += 1) {
    if (!markedGrid[i][x]) {
      return false;
    }
  }

  return true;
}

function checkAcross(markedGrid, y) {
  for (let i = 0; i < markedGrid.length; i += 1) {
    if (!markedGrid[y][i]) {
      return false;
    }
  }

  return true;
}

function checkDiagonal(markedGrid, x, y) {
  if (x !== y && x !== markedGrid - 1 - y) {
    return false;
  }

  for (let i = 0; i < markedGrid.length; i += 1) {
    const left_right = x === y && !markedGrid[i][i];
    const right_left = x !== y && !markedGrid[markedGrid.length - 1 - i][i];

    if (left_right || right_left) {
      return false;
    }
  }

  return true;
}

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function useCalculateWin(boardSize, marks) {
  const previousMarks = usePrevious(marks) ?? [];
  const [newMark] =
    previousMarks === marks
      ? []
      : marks.filter((m) => !previousMarks.includes(m));

  if (typeof newMark === "undefined") return false;

  const markedGrid = [];
  let index = 0;
  let newMarkCoordinates = [0, 0];

  for (let y = 0; y < boardSize; y += 1) {
    markedGrid[y] = [];

    for (let x = 0; x < boardSize; x += 1) {
      markedGrid[y][x] = marks.includes(index);
      newMarkCoordinates = index === newMark ? [x, y] : newMarkCoordinates;

      index += 1;
    }
  }

  const [x, y] = newMarkCoordinates;

  return (
    checkDown(markedGrid, x) ||
    checkAcross(markedGrid, y) ||
    checkDiagonal(markedGrid, x, y)
  );
}

export default useCalculateWin;
