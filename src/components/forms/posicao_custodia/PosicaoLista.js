import React from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";

class PosicaoEmLista extends React.Component {
  render() {
    return (
      <div className="mt-4 containerTipoLista">
        <Table
          variant="dark"
          bordered={false}
          borderless
          striped
          className="tableListaCompleta text-center"
          style={{ tableLayout: "auto" }}
        >
          <thead>
            <tr>
              <th>Ativo</th>
              <th>
                Qtde
                <div className="colunaDividida">
                  <div>Inicial</div>
                  <div>Atual</div>
                </div>
              </th>
              <th>Preço Médio</th>
              <th>Valor Total</th>
              <th>Preço Ult.</th>
              <th>Total Atual</th>
              <th>Resultado %</th>
              <th>
                Operações do Dia
                <div className="colunaDividida">
                  <div>Executadas</div>
                  <div>Em Aberto</div>
                </div>
              </th>
              <th>Stop Loss</th>
              <th>Stop Gain</th>
            </tr>
          </thead>
          <tbody>
            {tabelaPosicao.map((item, index) => (
              <tr key={index}>
                <td>{item.ativo}</td>
                <td className="colunaDividida">
                  <div>{item.qtdeInicial}</div>
                  <div>{item.qtdeAtual}</div>
                </td>
                <td>{item.precoMedio}</td>
                <td>{item.valorTotal}</td>
                <td>{item.precoUlt}</td>
                <td>{item.totalAtual}</td>
                <td>{item.resultado}</td>
                <td className="colunaDividida">
                  {renderCV(item.operacoesDia.executadas.tipo)}
                  <div>{item.operacoesDia.executadas.valor}</div>
                  {renderCV(item.operacoesDia.emAberto.tipo)}
                  <div>{item.operacoesDia.emAberto.valor}</div>
                </td>
                <td>{item.stopLoss}</td>
                <td>{item.stopGain}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(PosicaoEmLista);

const renderCV = cv => {
  return (
    <div className="divCV">
      {cv === "compra" ? (
        <h6 className="cvCompra"> C </h6>
      ) : (
        <h6 className="cvVenda"> V </h6>
      )}
    </div>
  );
};

const tabelaPosicao = [
  {
    ativo: "BGIV19",
    qtdeInicial: 0,
    qtdeAtual: 1000,
    precoMedio: "0,00",
    valorTotal: "0,00",
    precoUlt: "25,65",
    totalAtual: "2458,20",
    resultado: "20",
    operacoesDia: {
      executadas: { valor: 1000, tipo: "compra" },
      emAberto: { valor: 4000, tipo: "venda" }
    },
    stopLoss: "26,78",
    stopGain: "28,20"
  },
  {
    ativo: "BGIV19",
    qtdeInicial: 0,
    qtdeAtual: 1000,
    precoMedio: "0,00",
    valorTotal: "0,00",
    precoUlt: "25,65",
    totalAtual: "2458,20",
    resultado: "20",
    operacoesDia: {
      executadas: { valor: 2000, tipo: "compra" },
      emAberto: { valor: 5000, tipo: "venda" }
    },
    stopLoss: "26,78",
    stopGain: "28,20"
  },
  {
    ativo: "BGIV19",
    qtdeInicial: 0,
    qtdeAtual: 1000,
    precoMedio: "0,00",
    valorTotal: "0,00",
    precoUlt: "25,65",
    totalAtual: "2458,20",
    resultado: "20",
    operacoesDia: {
      executadas: { valor: 3000, tipo: "compra" },
      emAberto: { valor: 6000, tipo: "venda" }
    },
    stopLoss: "26,78",
    stopGain: "28,20"
  }
];
