import React from "react";
import { Row, Col, Table } from "react-bootstrap";
import { connect } from "react-redux";
import { MDBIcon } from "mdbreact";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import EmblemaSimples from "components/utils/EmblemaSimples";

class PosicaoAmpliadaResumida extends React.Component {
  render() {
    return (
      <Row style={{ justifyContent: "center" }}>
        <div className="rowListagenItens">
          {this.props.posicoesCustodia.map((item, index) => (
            <div key={index} className="mt-2 ml-2 mr-2">
              <Row className="rowAtivosEmblema">
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
                <EmblemaSimples item={item}></EmblemaSimples>
                {this.props.tipoVisualizacao === "ampliado" ? (
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
                            <tbody>
                              {item.executando.map((itemExecutando, index3) => (
                                <tr key={index3}>
                                  {itemExecutando.oferta === "C" ? (
                                    <td>
                                      +{itemExecutando.qtdeOferta / 1000}K
                                    </td>
                                  ) : (
                                    <td>
                                      -{itemExecutando.qtdeOferta / 1000}K
                                    </td>
                                  )}
                                  <td>{itemExecutando.ativo}</td>
                                  <td>
                                    {renderCV(
                                      itemExecutando.oferta,
                                      itemExecutando.precoEnvio,
                                      itemExecutando.operacao,
                                      index3
                                    )}
                                  </td>
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

export default connect(
  mapStateToPropsPosicao,
  {}
)(PosicaoAmpliadaResumida);

const renderAtivo = item => {
  let mostrarAtivo = false;
  let conteudo = item.ativos.map((ativo, ind) => {
    //Verifica se o ativo está em uma ordem execução, caso não esteja, será mostrado.
    item.executando.some(oferta => oferta.ativo === ativo.symbol);
    if (!item.executando.some(oferta => oferta.ativo === ativo.symbol)) {
      mostrarAtivo = true;
      return <h6 key={`custodiaCompra${ind}`}>{ativo.symbol}</h6>;
    }
    return <span></span>;
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

const renderCV = (cv, valor, operacao, indice) => {
  return (
    <span>
      {cv === "C" ? (
        <div className="divCV emblemaExecutandoDivCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusConectado"
          />
          {(operacao === "Multileg" && indice === 0) ||
          operacao !== "Multileg" ? (
            <span>{valor}</span>
          ) : null}
        </div>
      ) : (
        <div className="divCV emblemaExecutandoDivCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusDesconectado"
          />
          {(operacao === "Multileg" && indice === 0) ||
          operacao !== "Multileg" ? (
            <span>{valor}</span>
          ) : null}
        </div>
      )}
    </span>
  );
};
