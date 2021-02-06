import usePrevious from "hooks/usePrevious";
import React, { useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import _ from "lodash";
import produce from "immer";
import { IoMdAddCircle } from "react-icons/io";

interface CategoryTableProps {
  category: {
    title: string;
    lines: Array<{
      symbol: string;
      price: number;
      oscilation: number;
      yearOscilation: number;
      [key: string]: any;
    }>;
  };
  order: number;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ category, order }) => {
  const previousLines = usePrevious(category.lines);

  const [lineKeys, setLineKeys] = useState(
    Array(category.lines.length).fill(Math.random()),
  );

  const lineDifferences = useMemo(() => {
    if (!previousLines) return [];

    const diff = _.differenceWith(previousLines, category.lines, _.isEqual);

    const changedIndexes = diff.map((diffItem) => {
      const index = category.lines.findIndex(
        (lineItem) => lineItem.symbol === diffItem.symbol,
      );

      return index;
    });

    setLineKeys((oldKeys) => {
      const updatedLineKeys = produce(oldKeys, (draft) => {
        changedIndexes.forEach((index) => {
          draft[index] = Math.random();
        });
      });

      return updatedLineKeys;
    });

    return diff;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // let lineDifferences = !previousLines
  //   ? []
  //   : _.differenceWith(previousLines, category.lines, _.isEqual);

  return (
    <Table className="categoryTable" striped={false} style={{ order }}>
      <tbody>
        <tr className="categoryTitle">
          <td colSpan={4}>
            <Form.Control
              defaultValue={category.title}
              className="darkSimpleInput"
            />
            <button className="brokerCustomButton addCodeButton">
              <IoMdAddCircle size={18} fill="#C4C4C4" />
            </button>
          </td>
        </tr>
        {category.lines.map((line, index) => {
          const previousLine = lineDifferences.find(
            (lineDiffItem) => lineDiffItem.symbol === line.symbol,
          );

          let flashColor = "";

          if (previousLine) {
            if (line.price > previousLine.price) {
              flashColor = "flashPositive";
            } else if (line.price < previousLine.price) {
              flashColor = "flashNegative";
            }
          }

          return (
            <tr key={line.symbol}>
              <td>{line.symbol}</td>
              <td>
                <span key={lineKeys[index]} className={flashColor}>
                  {line.formattedPrice}
                </span>
              </td>
              <td>
                <span
                  key={`osc${lineKeys[index]}`}
                  className={`${
                    line.oscilation >= 0 ? "positiveColor " : "negativeColor"
                  } ${flashColor}`}
                >
                  {line.formattedOscilation}
                </span>
              </td>
              <td className="yearOscColumn">
                <div
                  className={
                    line.yearOscilation >= 0
                      ? "positiveBackground"
                      : "negativeBackground"
                  }
                  style={{ width: 91 * (line.yearOscilation / 100) }}
                />
                <span>{line.formattedYearOscilation}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
