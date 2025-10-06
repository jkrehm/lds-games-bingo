export function shuffleArray(arrayIn) {
  const arrayOut = [...arrayIn];

  for (let i = arrayOut.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayOut[i], arrayOut[j]] = [arrayOut[j], arrayOut[i]];
  }

  return arrayOut;
}

export function uniqueBy(arrayIn, property) {
  return Array.from(new Set(arrayIn.map((o) => o[property]))).map((v) =>
    arrayIn.find((o) => o[property] === v),
  );
}

export function classnames(...args) {
  return args.filter(Boolean).join(" ").trim();
}

export const cx = classnames;
