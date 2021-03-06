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
import { getSymbolByType } from "../duck/actions/utils";

interface Props {
  tableLine: TableLine;
  column: {
    key: string;
  };
}

type OptionColumn = {
  symbol: string;
  strike: number;
  model: "AMERICAN" | "EUROPEAN";
  formattedStrike: string;
};

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

  const columnData: OptionColumn | number | undefined = tableLine[column.key];

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
      return getSymbolByType({ type, symbol: columnData.symbol });
    }

    return "";
  }, [columnData, type]);

  const model = useMemo(() => {
    if (type === "CALL" && columnData && typeof columnData !== "number") {
      return columnData.model;
    }

    return "EUROPEAN";
  }, [columnData, type]);

  const modelStyle = useMemo(() => {
    if (strikeView === "code") {
      return { justifyContent: "flex-end" };
    }

    return { justifyContent: "center" };
  }, [strikeView]);

  if (!columnData) {
    return <td />;
  }

  if (column.key === "strike") {
    const { strike, formattedStrike } = tableLine;

    const isChecked = checkedLines.includes(strike);

    return (
      <td>
        <div>
          {strike && toggleConfig && (
            <Form.Check
              custom
              checked={isChecked}
              type="checkbox"
              label=""
              onChange={() => handleLineSelection(tableLine)}
            />
          )}
          <span>{formattedStrike}</span>
        </div>
      </td>
    );
  } //
  else if (columnData && typeof columnData !== "number") {
    const cellText =
      strikeView === "code" ? symbol : columnData.formattedStrike;

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
          <div style={modelStyle} className="modelContainer">
            <Model model={model} />
          </div>
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
