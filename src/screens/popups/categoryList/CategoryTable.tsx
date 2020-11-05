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
  renderTHead: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  category,
  order,
  renderTHead,
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
            <td>{line.formattedYearOscilation}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
