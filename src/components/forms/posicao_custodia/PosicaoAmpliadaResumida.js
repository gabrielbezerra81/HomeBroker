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
          {itensListaCompleta.map((item, index) => (
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
                        {itemCustodiaCompra.qtde / 1000}K)
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
                        {itemCustodiaVenda.qtde / 1000}K)
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
                        Resultado: {formatarNumDecimal(item.resultado)}
                      </Col>
                      <Col md={0} className="m-2">
                        {renderValorPorcentagem(item.porcentagemResultado)}
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
                                  {itemExecutando.tipo === "compra" ? (
                                    <td>{itemExecutando.qtde / 1000}K</td>
                                  ) : (
                                    <td>-{itemExecutando.qtde / 1000}K</td>
                                  )}
                                  <td>{itemExecutando.ativo}</td>
                                  <td>
                                    {renderCV(
                                      itemExecutando.tipo,
                                      itemExecutando.valor
                                    )}{" "}
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
  tipoVisualizacao: state.posicaoReducer.tipoVisualizacao
});

export default connect(
  mapStateToPropsPosicao,
  {}
)(PosicaoAmpliadaResumida);

const renderAtivo = item => {
  var ativo = item.ativo;

  if (
    item.custodiaCompra.length > 0 &&
    ativo === item.custodiaCompra[0].ativo
  ) {
    return (ativo = "");
  }
  if (item.custodiaVenda.length > 0 && ativo === item.custodiaVenda[0].ativo) {
    return (ativo = "");
  }

  return (
    <Col md={0}>
      <h6>{ativo}</h6>
    </Col>
  );
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

const renderCV = (cv, valor) => {
  return (
    <span>
      {cv === "compra" ? (
        <div className="divCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusConectado"
          />
          <span>{valor}</span>
        </div>
      ) : (
        <div className="divCV">
          <MDBIcon
            icon="circle"
            className="iconeStatusCirculo iconeStatusDesconectado"
          />
          <span>{valor}</span>
        </div>
      )}
    </span>
  );
};

const itensListaCompleta = [
  {
    ativo: "PETR4",
    custodiaCompra: [
      { ativo: "X280", qtde: 1000 },
      { ativo: "X290", qtde: 1000 }
    ],
    custodiaVenda: [
      { ativo: "S272", qtde: 1000 },
      { ativo: "S290", qtde: 1000 }
    ],
    precoCompra: 2.5,
    precoVenda: 2.6,
    valorAcao: 2.55,
    porcentagem: -5.36,
    stop: 0,
    gain: 3.6,
    resultado: 180,
    porcentagemResultado: 38.46,
    executando: [
      { ativo: "S272", qtde: 1000, valor: "0,30", tipo: "compra" },
      { ativo: "T272", qtde: 1000, valor: "0,40", tipo: "venda" }
    ]
  },
  {
    ativo: "PETR4",
    custodiaCompra: [
      { ativo: "X280", qtde: 1000 },
      { ativo: "X290", qtde: 1000 }
    ],
    custodiaVenda: [
      { ativo: "S272", qtde: 1000 },
      { ativo: "S290", qtde: 1000 }
    ],
    precoCompra: 28.22,
    precoVenda: 28.31,
    valorAcao: 28.4,
    porcentagem: 2,
    stop: 28.22,
    gain: 28.31,
    resultado: 180,
    porcentagemResultado: 38.46,
    executando: []
  },
  {
    ativo: "PETR4",
    custodiaCompra: [{ ativo: "PETR4", qtde: 1000 }],
    custodiaVenda: [],
    precoCompra: 2.5,
    precoVenda: 2.6,
    valorAcao: 2.55,
    porcentagem: -5.36,
    stop: 0,
    gain: 3.6,
    resultado: 180,
    porcentagemResultado: 38.46,
    executando: []
  },
  {
    ativo: "PETR4",
    custodiaCompra: [{ ativo: "PETR4", qtde: 1000 }],
    custodiaVenda: [],
    precoCompra: 2.5,
    precoVenda: 2.6,
    valorAcao: 2.55,
    porcentagem: -5.36,
    stop: 0,
    gain: 3.6,
    resultado: 180,
    porcentagemResultado: 38.46,
    executando: []
  }
];
