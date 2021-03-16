interface GetSymbolByType {
  symbol: string;
  type: "CALL" | "PUT";
}

export const getSymbolByType = ({ symbol, type }: GetSymbolByType) => {
  if (type === "CALL") {
    return symbol;
  }

  const prefix = symbol.substr(0, 4);
  const callSymbolLetter = symbol.charAt(4);
  const symbolNumbers = symbol.substr(5);

  let putSymbolLetter = convertCallLetterToPut(callSymbolLetter);

  return `${prefix}${putSymbolLetter}${symbolNumbers}`;
};

const convertCallLetterToPut = (callLetter: string) => {
  switch (callLetter) {
    case "A":
      return "M";
    case "B":
      return "N";
    case "C":
      return "O";
    case "D":
      return "P";
    case "E":
      return "Q";
    case "F":
      return "R";
    case "G":
      return "S";
    case "H":
      return "T";
    case "I":
      return "U";
    case "J":
      return "V";
    case "K":
      return "W";
    case "L":
      return "X";
    default:
      return callLetter;
  }
};
