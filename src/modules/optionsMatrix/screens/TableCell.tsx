import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo } from "react";
import { Form } from "react-bootstrap";
import {
  handleLineSelectionAction,
  handleSymbolSelectionAction,
} from "../duck/actions/optionsMatrixActions";
import { TableLine } from "../types/OptionsMatrixState";

import modelEUImage from "assets/modeloEU.png";
import { ReactComponent as ModelUSAImage } from "assets/modeloUSA2.svg";

interface Props {
  tableLine: TableLine;
  column: {
    key: string;
  };
}

type ColumnData =
  | {
      symbol: string;
      strike: number;
      model: "AMERICAN" | "EUROPEAN";
    }
  | number;

const TableCell: React.FC<Props> = ({ tableLine, column }) => {
  const {
    optionsMatrixReducer: {
      checkedLines,
      checkedSymbols,
      strikeView,
      toggleConfig,
      type,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const columnData: ColumnData | undefined = tableLine[column.key];

  const handleLineSelection = useCallback(
    (tableLine: TableLine) => {
      dispatch(handleLineSelectionAction(tableLine));
    },
    [dispatch],
  );

  const handleSymbolSelection = useCallback(
    (symbol: string) => {
      dispatch(handleSymbolSelectionAction([symbol]));
    },
    [dispatch],
  );

  const symbol = useMemo(() => {
    if (columnData && typeof columnData !== "number") {
      if (type === "CALL") {
        return columnData.symbol;
      }

      const prefix = columnData.symbol.substr(0, 4);
      const callSymbolLetter = columnData.symbol.charAt(4);
      const symbolNumbers = columnData.symbol.substr(5);

      let putSymbolLetter = convertCallLetterToPut(callSymbolLetter);

      return `${prefix}${putSymbolLetter}${symbolNumbers}`;
    }

    return "";
  }, [columnData, type]);

  const model = useMemo(() => {
    if (type === "CALL" && columnData && typeof columnData !== "number") {
      return columnData.model;
    }

    return "EUROPEAN";
  }, [columnData, type]);

  if (typeof columnData === "number") {
    const isChecked = checkedLines.includes(columnData);

    return (
      <td>
        <div>
          {columnData && toggleConfig && (
            <Form.Check
              custom
              checked={isChecked}
              type="checkbox"
              label=""
              onChange={() => handleLineSelection(tableLine)}
            />
          )}
          <span>{columnData}</span>
        </div>
      </td>
    );
  } //
  else if (columnData) {
    const cellText = strikeView === "code" ? symbol : columnData.strike;

    const isChecked = checkedSymbols.includes(symbol);

    return (
      <td>
        <div>
          <span>{cellText}</span>
          {toggleConfig && (
            <Form.Check
              custom
              checked={isChecked}
              type="checkbox"
              label=""
              onChange={() => handleSymbolSelection(symbol)}
            />
          )}
          {strikeView === "strike" && (
            <div className="modelContainer">
              <Model model={model} />
            </div>
          )}
        </div>
      </td>
    );
  }

  return <td />;
};

export default TableCell;

interface ModelProps {
  model: "EUROPEAN" | "AMERICAN";
}

const Model: React.FC<ModelProps> = ({ model }) => {
  if (model === "EUROPEAN")
    return <img className="modelImg" src={modelEUImage} alt="EUROPEAN" />;
  else if (model === "AMERICAN")
    return <ModelUSAImage className="modelImg" viewBox="6 -1 17 17" />;
  else return null;
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
