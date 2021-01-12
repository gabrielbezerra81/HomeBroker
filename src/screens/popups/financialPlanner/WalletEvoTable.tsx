import React, { useMemo } from "react";

import { Table } from "react-bootstrap";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

const data = [
  {
    projection: 7000,
    result: 18000,
  },
  {
    projection: 10000,
    result: 4666,
  },
  {
    projection: 13500,
    result: 8166,
  },
  {
    projection: 17000,
    result: 27000,
  },
  {
    projection: 20500,
    result: 30500,
  },
  {
    projection: 10000,
    result: 4666,
  },
  {
    projection: 13500,
    result: 23500,
  },
  {
    projection: 17000,
    result: 27000,
  },
  {
    projection: 6500,
    result: 1166,
  },
  {
    projection: 10000,
    result: 20000,
  },
];

const WalletEvoTable: React.FC = () => {
  const formattedEvolution = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      period: `Mês ${index + 1}`,
      formattedProjection: formatarNumDecimal(item.projection, 2),
      formattedResult: formatarNumDecimal(item.result, 2),
    }));
  }, []);

  return (
    <Table className="walletEvoTable" borderless striped={false}>
      <thead>
        <tr>
          <th>Período</th>
          <th>Projetado</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        {formattedEvolution.map((item, index) => (
          <tr key={index}>
            <td>{item.period}</td>
            <td>{item.formattedProjection}</td>
            <td>{item.formattedResult}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default WalletEvoTable;
