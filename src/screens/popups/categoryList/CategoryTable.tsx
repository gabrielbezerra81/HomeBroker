import React from "react";
import { Table } from "react-bootstrap";

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

const CategoryTable: React.FC<CategoryTableProps> = ({
  category,
  order,
}) => {
  return (
    <Table className="categoryTable" striped={false} style={{ order }}>
      <tbody>
        <tr className="categoryTitle">
          <td colSpan={4}>{category.title}</td>
        </tr>
        {category.lines.map((line) => (
          <tr key={line.symbol}>
            <td>{line.symbol}</td>
            <td>{line.formattedPrice}</td>
            <td
              className={
                line.oscilation >= 0 ? "positiveColor" : "negativeColor"
              }
            >
              {line.formattedOscilation}
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
        ))}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
