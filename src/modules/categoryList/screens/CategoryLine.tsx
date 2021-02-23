import usePrevious from "hooks/usePrevious";
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { Form } from "react-bootstrap";

import _ from "lodash";
import { CategoryLine as LineProps } from "../types/CategoryListState";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  addSymbolToCategoryAction,
  handleDeleteSymbolLineAction,
  handleLineSymbolChangeAction,
} from "../duck/actions/categoryListActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { FiX } from "react-icons/fi";

interface Props {
  categoryIndex: number;
  lineIndex: number;
  lineData: LineProps;
}

const CategoryLine: React.FC<Props> = ({
  categoryIndex,
  lineIndex,
  lineData,
}) => {
  const {
    categoryListReducer: { categories, removeMode },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const symbolInputRef = useRef<any | null>(null);

  const [lineKey, setLineKey] = useState(Math.random());
  const [autoFocusTitle, setAutoFocusTitle] = useState(!lineData.symbol);

  const [currentSymbol, setCurrentSymbol] = useState(lineData.symbol);

  const previousLineData = usePrevious(lineData);

  const handleChangeSymbol = useCallback(
    (e) => {
      const { value } = e.currentTarget;

      dispatch(
        handleLineSymbolChangeAction({
          categoryIndex,
          lineIndex,
          value: value.toUpperCase(),
        }),
      );
    },
    [categoryIndex, dispatch, lineIndex],
  );

  const onEndSymbolEditing = useCallback(() => {
    if (currentSymbol !== lineData.symbol) {
      const lines = categories[categoryIndex].lines;

      if (!lineData.symbol) {
        return;
      }

      const alreadyHasSymbol = lines.some((item, index) => {
        return item.symbol === lineData.symbol && index !== lineIndex;
      });

      if (alreadyHasSymbol) {
        alert("Este ativo já foi adicionado!");

        dispatch(
          handleLineSymbolChangeAction({
            categoryIndex,
            lineIndex,
            value: currentSymbol,
          }),
        );

        return;
      }

      setCurrentSymbol(lineData.symbol);
      dispatch(addSymbolToCategoryAction({ categoryIndex, lineIndex }));
      // TODO: Disparar busca por dados do novo ativo
    }
  }, [
    categories,
    categoryIndex,
    currentSymbol,
    dispatch,
    lineData.symbol,
    lineIndex,
  ]);

  const handleDeleteLine = useCallback(() => {
    dispatch(handleDeleteSymbolLineAction({ categoryIndex, lineIndex }));
  }, [categoryIndex, dispatch, lineIndex]);

  const lineHasChanged = useMemo(() => {
    if (!previousLineData) {
      return false;
    }

    const isEqual = _.isEqual(previousLineData, lineData);

    if (!isEqual) {
      setLineKey(Math.random());
      return true;
    }

    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineData]);

  const flashColor = useMemo(() => {
    if (!previousLineData || !lineHasChanged) {
      return "";
    }

    let flashColor = "";

    if (lineData.price > previousLineData.price) {
      flashColor = "flashPositive";
    } //
    else if (lineData.price < previousLineData.price) {
      flashColor = "flashNegative";
    }

    return flashColor;
  }, [lineData.price, lineHasChanged, previousLineData]);

  useEffect(() => {
    setAutoFocusTitle(false);
  }, []);

  return (
    <tr>
      <td className="deleteColumn">
        {removeMode && (
          <button className="brokerCustomButton" onClick={handleDeleteLine}>
            <FiX color="#ce202a" size={10} strokeWidth={3} />
          </button>
        )}
      </td>
      <td>
        <Form.Control
          className="darkSimpleInput symbolInput"
          name="symbol"
          value={lineData.symbol}
          onChange={handleChangeSymbol}
          onBlur={onEndSymbolEditing}
          autoFocus={autoFocusTitle}
          autoComplete="off"
          ref={symbolInputRef}
          onKeyPress={(e: any) => {
            if (e.key === "Enter" && symbolInputRef.current) {
              symbolInputRef.current.blur();
            }
          }}
        />
      </td>
      <td>
        <span key={lineKey} className={flashColor}>
          {lineData.formattedPrice}
        </span>
      </td>
      <td>
        <span
          key={`osc${lineKey}`}
          className={`${
            lineData.oscilation >= 0 ? "positiveColor " : "negativeColor"
          } ${flashColor}`}
        >
          {lineData.formattedOscilation}
        </span>
      </td>
      <td className="yearOscColumn">
        <div
          className={
            lineData.yearOscilation >= 0
              ? "positiveBackground"
              : "negativeBackground"
          }
          style={{ width: 91 * (lineData.yearOscilation / 100) }}
        />
        <span>{lineData.formattedYearOscilation}</span>
      </td>
    </tr>
  );
};

export default CategoryLine;
