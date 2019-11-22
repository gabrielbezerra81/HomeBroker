import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import EmblemaSimples from "components/utils/EmblemaSimples";
import _ from "lodash";

class PosicaoAmpliadaResumida extends React.Component {
  render() {
    const { props } = this;
    const styleRowAtivo = calculaAlturaRowAtivos(props.posicoesCustodia);
    return (
      <Row style={{ justifyContent: "center" }}>
        <div className="rowListagenItens">
          {props.posicoesCustodia.map((item, index) => (
            <div key={index} className="mt-2 ml-2 mr-2">
              <Row
                className="rowAtivosEmblema"
                id={"posicao" + index}
                style={styleRowAtivo[index]}
              >
                {renderAtivo(item)}

                {item.custodiaCompra.length > 0 ? (
                  <Col md={0}>
                    {item.custodiaCompra.map((itemCustodiaCompra, index2) => (
                      <h6
                        key={`custodiaCompra${index2}`}
                        className="itemCustodiaCompra"
                      >
                        {itemCustodiaCompra.ativo} (
                        {itemCustodiaCompra.qtdeExecutada / 1000}K)
                      </h6>
                    ))}
                  </Col>
                ) : null}
                {item.custodiaVenda.length > 0 ? (
                  <Col md={0}>
                    {item.custodiaVenda.map((itemCustodiaVenda, index2) => (
                      <h6
                        key={`custodiaVenda${index2}`}
                        className="itemCustodiaVenda"
                      >
                        {itemCustodiaVenda.ativo} (-
                        {itemCustodiaVenda.qtdeExecutada / 1000}K)
                      </h6>
                    ))}
                  </Col>
                ) : null}
              </Row>

              <div className="mcontent containerEmblema">
                <EmblemaSimples
                  item={item}
                  emblemaMaior={props.emblemaMaior}
                ></EmblemaSimples>
                {props.tipoVisualizacao === "ampliado" ? (
                  <div>
                    <div className="divSetaPorcentagem">
                      <Col md={0} className="m-2">
                        Resultado: {formatarNumDecimal(item.total)}
                      </Col>
                      <Col md={0} className="m-2">
                        {renderValorPorcentagem(item.variacaoGanho)}
                      </Col>
                    </div>
                    {item.executando.length > 0 ? (
                      <div className="text-align-center">
                        <Col md={12}>
                          <span>Executando</span>
                        </Col>
                        <Row className="rowTabela">
                          <Table
                            variant="dark"
                            bordered={false}
                            borderless
                            striped
                            className="tabelaExecutando text-center mt-1"
                            style={{ tableLayout: "auto" }}
                          >
                            <tbody className="verticalAlignColunaTabela">
                              {item.executando.map((ordem, index3) => (
                                <tr key={index3}>
                                  <td>
                                    {ordem.offers.map((oferta, indice) =>
                                      oferta.oferta === "C" ? (
                                        <span key={indice}>
                                          +{oferta.qtdeOferta / 1000}K
                                          <br />
                                        </span>
                                      ) : (
                                        <span key={indice}>
                                          -{oferta.qtdeOferta / 1000}K
                                          <br />
                                        </span>
                                      )
                                    )}
                                  </td>
                                  <td>
                                    {ordem.offers.map((oferta, indice) => (
                                      <span key={indice}>
                                        {oferta.ativo}
                                        <br />
                                      </span>
                                    ))}
                                  </td>
                                  <td>
                                    {ordem.offers.map((oferta, indice) =>
                                      renderCV(
                                        oferta.oferta,
                                        oferta.operacao,
                                        indice
                                      )
                                    )}
                                  </td>
                                  <td>{ordem.offers[0].precoEnvio}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Row>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </Row>
    );
  }
}

const mapStateToPropsPosicao = state => ({
  ordenacao: state.posicaoReducer.ordenacao,
  tipoVisualizacao: state.posicaoReducer.tipoVisualizacao,
  posicoesCustodia: state.posicaoReducer.posicoesCustodia
});

export default connect(mapStateToPropsPosicao, {})(PosicaoAmpliadaResumida);

const renderAtivo = item => {
  let mostrarAtivo = false;
  let conteudo = item.ativos.map((ativo, ind) => {
    //Verifica se o ativo está em uma ordem execução, caso não esteja, será mostrado.
    item.executando.some(oferta => oferta.ativo === ativo.symbol);
    if (!item.executando.some(oferta => oferta.ativo === ativo.symbol)) {
      mostrarAtivo = true;
      return <h6 key={`custodiaCompra${ind}`}>{ativo.symbol}</h6>;
    }
    return <span key={`custodiaCompra${ind}`}></span>;
  });

  return mostrarAtivo ? <Col md={0}>{conteudo}</Col> : null;
};

const renderValorPorcentagem = porcentagem => {
  if (porcentagem > 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <span className="porcentagemPositiva">+{porcentagem}%</span>;
  } else if (porcentagem < 0) {
    porcentagem = formatarNumDecimal(porcentagem);
    return <span className="porcentagemNegativa">{porcentagem}%</span>;
  } else {
    porcentagem = formatarNumDecimal(porcentagem);

    return <span>+{porcentagem}%</span>;
  }
};

const renderCV = (cv, operacao, indice) => {
  return (
    <span key={indice}>
      {cv === "C" ? (
        <div className="divCV emblemaExecutandoDivCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusConectado"
          />
          {/* {(operacao === "Multileg" && indice === 0) ||
          operacao !== "Multileg" ? (
            <span>{valor}</span>
          ) : null} */}
        </div>
      ) : (
        <div className="divCV emblemaExecutandoDivCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusDesconectado"
          />
          {/* {(operacao === "Multileg" && indice === 0) ||
          operacao !== "Multileg" ? (
            <span>{valor}</span>
          ) : null} */}
        </div>
      )}
    </span>
  );
};

const calculaAlturaRowAtivos = posicoesCustodia => {
  let arrayQtdeCustodia = [];

  //Calcula o numero máximo de linhas de ativos para cada emblema. resultado => array de 42 elementos contendo a altura de cada emblema
  posicoesCustodia.forEach(posicao => {
    arrayQtdeCustodia.push(
      Math.max(
        posicao.custodiaCompra.length,
        posicao.custodiaVenda.length,
        posicao.ativos.length
      )
    );
  });

  //Faz um agrupamento dividindo o array em pequenos arrays de 4 elementos para cada linha de 4 emblemas. resultado => [[1,2,0,0],[1,2,0,0]]
  var groupSize = 4;
  arrayQtdeCustodia = _.map(arrayQtdeCustodia, function(item, index) {
    return index % groupSize === 0
      ? arrayQtdeCustodia.slice(index, index + groupSize)
      : null;
  }).filter(function(item) {
    return item;
  });
  //Calcula a altura máxima de cada linha baseando-se no emblema com maior número de linhas.
  const alturasRowAtivo = arrayQtdeCustodia.map(array => Math.max(...array));

  const arrayStyles = [];

  //Retorna um array de estilos do mesmo do tamanho do array de posições
  alturasRowAtivo.forEach(rows => {
    let altura = 19;
    if (rows > 1) altura = altura * rows;
    const style = { height: altura + "px" };
    arrayStyles.push(style, style, style, style);
  });

  return arrayStyles;
};
