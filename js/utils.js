export function getBoardClass(boardSize) {
  switch (boardSize) {
    case 3:
      return "board-3";
    case 5:
      return "board-5";
    default:
      throw new Error("Unsupported board size.");
  }
}

export function shuffleArray(arrayIn) {
  const arrayOut = [...arrayIn];

  for (let i = arrayOut.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayOut[i], arrayOut[j]] = [arrayOut[j], arrayOut[i]];
  }

  return arrayOut;
}
