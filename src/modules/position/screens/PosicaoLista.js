import React from "react";
import { Table } from "react-bootstrap";
import { connect } from "react-redux";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { StorePrincipalContext } from "redux/StoreCreation";

class PosicaoEmLista extends React.Component {
  render() {
    const { props } = this;

    const tabelaPosicao = [];
    if (props.posicoesCustodia[0])
      tabelaPosicao.push(props.posicoesCustodia[0]);
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
            {props.arrayCotacoes.length > 0
              ? props.posicoesCustodia.map((item, index) => (
                  <tr key={index} className="verticalAlignColunaTabela">
                    {listarAtributoComposto(props, item, "symbol")}
                    {listarAtributoComposto(
                      props,
                      item,
                      "qtdeComposta",
                      "colunaDividida",
                    )}
                    {listarAtributoComposto(props, item, "dealPrice")}
                    {listarAtributoComposto(props, item, "total")}
                    {listarAtributoComposto(props, item, "precoUlt")}
                    {listarAtributoComposto(props, item, "totalAtual")}
                    {listarAtributoComposto(props, item, "resultado")}
                    <td></td>
                    {/* <td>{item.precoMedio}</td>
                <td>{item.valorTotal}</td>
                <td>{item.precoUlt}</td>
                <td>{item.totalAtual}</td>
                <td>{item.resultado}</td>
                <td className="colunaDividida">
                  {renderCV(item.operacoesDia.executadas.tipo)}
                  <div>{item.operacoesDia.executadas.valor}</div>
                  {renderCV(item.operacoesDia.emAberto.tipo)}
                  <div>{item.operacoesDia.emAberto.valor}</div>
                </td> */}
                    <td>{formatarNumDecimal(item.stopLoss)}</td>
                    <td>{formatarNumDecimal(item.stopGain)}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  posicoesCustodia: state.positionReducer.posicoesCustodia,
  arrayCotacoes: state.positionReducer.arrayCotacoes,
  arrayCotacoesID: state.positionReducer.arrayCotacoesID,
});

export default connect(mapStateToProps, {}, null, {
  context: StorePrincipalContext,
})(PosicaoEmLista);

// const renderCV = cv => {
//   return (
//     <div className="divCV">
//       {cv === "compra" ? (
//         <h6 className="cvCompra"> C </h6>
//       ) : (
//         <h6 className="cvVenda"> V </h6>
//       )}
//     </div>
//   );
// };

const listarAtributoComposto = (
  props,
  posicao,
  atributo,
  classeColunaDividida = "",
) => {
  let colunaTabela = posicao.ativos.map((oferta, index2) => {
    return (
      <div key={index2} className={classeColunaDividida}>
        {renderConteudoAtributoComposto(props, posicao, oferta, atributo)}
      </div>
    );
  });

  return <td>{colunaTabela}</td>;
};

let renderConteudoAtributoComposto = (props, posicao, oferta, atributo) => {
  let conteudo;

  switch (atributo) {
    case "qtdeComposta":
      conteudo = [
        <div key={Math.random()}>
          {formatarNumDecimal(oferta.qtdeInicial || "")}
        </div>,
        <div key={Math.random()}>{formatarNumDecimal(oferta.qtty || 0)}</div>,
      ];
      break;
    case "precoUlt":
      const ativo = props.arrayCotacoes.find(
        (ativo) => ativo.codigo === oferta.symbol,
      );
      const cotacao =
        ativo && ativo.cotacao ? formatarNumDecimal(ativo.cotacao) : "";
      conteudo = <div>{cotacao}</div>;
      break;
    case "totalAtual":
      const total = oferta.qtty * posicao.cotacaoAtual;
      conteudo = <div>{formatarNumDecimal(total || 0)}</div>;
      break;
    case "resultado":
      const resultado =
        ((oferta.qtty * posicao.cotacaoAtual - oferta.total) / oferta.total) *
          100 || 0;
      conteudo = <div>{formatarNumDecimal(resultado)}</div>;
      break;
    default:
      let valor = oferta[atributo];
      if (atributo !== "symbol") valor = formatarNumDecimal(valor || 0);
      conteudo = <div>{valor}</div>;
  }

  return conteudo;
};
