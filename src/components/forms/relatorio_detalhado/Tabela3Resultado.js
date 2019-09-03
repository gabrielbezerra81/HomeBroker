import React from "react";
import { Table, ProgressBar } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

export default class Tabela3Resultado extends React.Component {
  render() {
    return (
      <Table
        variant="dark"
        borderless
        striped
        className="text-center tabela3Resultado"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th></th>
            <th>
              <div className="colunaDividida">
                <div>Ativo</div>
                <div>Total</div>
                <div>%</div>
                <div>Unit</div>
                <div>Qtde</div>
              </div>
            </th>
            <th>
              <div className="colunaDividida">
                <div>Entrada</div>
                <div>Total</div>
              </div>
            </th>
            <th>
              <div className="colunaDividida">
                <div>Saída</div>
                <div>Total</div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="verticalAlignColunaTabela">
          <tr>
            <td>JAN</td>
            <td>
              <div className="colunaDividida">
                <div>PETRX28</div>
                <div>400,00</div>
                <div>+16,00%</div>
                <div>0,40</div>
                <div>1.000</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>{renderCV("compra", "10/05", 2.4)}</div>
                <div>2400,00</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>{renderCV("venda", "10/05", 2.0)}</div>
                <div>2400,00</div>
              </div>
            </td>
          </tr>
          <tr>
            <td>FEV</td>
            <td>
              <div className="colunaDividida">
                <div>PETRX28</div>
                <div>400,00</div>
                <div>+16,00%</div>
                <div>0,40</div>
                <div>1.000</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>{renderCV("compra", "10/05", 2.4)}</div>
                <div>2400,00</div>
              </div>
            </td>
            <td>
              <div className="colunaDividida">
                <div>{renderCV("venda", "10/05", 2.0)}</div>
                <div>2400,00</div>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

const renderCV = (cv, data, valor) => {
  let tipo = " (D)";
  valor = valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2
  });
  return (
    <span>
      {cv === "compra" ? (
        <div className="divCV">
          <span>{data}</span>
          <h6 className="cvCompra"> C </h6>
          <span>
            {valor}
            {tipo}
          </span>
        </div>
      ) : (
        <div className="divCV">
          <span>{data}</span>
          <h6 className="cvVenda"> V </h6>
          <span>{valor}</span>
        </div>
      )}
    </span>
  );
};
