import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form, Table, InputGroup } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";
import { MDBIcon } from "mdbreact";
import EmblemaSimples from "components/utils/EmblemaSimples";
import { ReactComponent as IconeResumido } from "img/rounded-rectangle.svg";
import { ReactComponent as IconeAmpliado } from "img/check-box-empty.svg";
import { formatarNumDecimal } from "components/utils/Formatacoes";

export default class ListaCompleta extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "lista_completa") {
      document.getElementById("lista_completa").style.zIndex =
        this.props.zIndex + 1;
      this.props.aumentarZindexAction(
        "lista_completa",
        this.props.zIndex,
        true
      );
    }
  }

  render() {
    return (
      <DraggableModal
        id="lista_completa"
        renderModalBody={() => this.modalBody(this.props)}
        renderDivPosicaoEmCustodia={true}
        renderHeader={() =>
          modalHeaderSemBook(this.props, this.props.headerTitle, "border-green")
        }
      />
    );
  }
  /*
 
  */

  modalBody = props => {
    return (
      <div className="bodyListaCompleta">
        <Row>
          <Col md={2}></Col>
          <Col md={2}>
            <div className="divIconeConfigOrdernar">
              <h6 className="mr-2">Ordernar</h6>
              {iconeConfigAbrirFormulario(() => false, "")}
            </div>
          </Col>
          <Col md={8}>
            <div className="divIconeConfigAmpliado">
              {iconeConfigAbrirFormulario(() => false, "")}
            </div>
          </Col>
        </Row>
        <Row className="rowHeaderListaCompleta mt-2">
          <Col md={2}>
            <InputGroup>
              <Form.Control
                className="inputAtivo"
                type="text"
                value="PESQUISAR"
                onChange={() => false}
              />
              <InputGroup.Append className="inputAtivoAppend">
                <span className="input-group-text iconeProcurar divClicavel">
                  <MDBIcon icon="search" />
                </span>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control as="select" className="textInput formPosicao">
                <option value="posicao">Posição</option>
              </Form.Control>
            </Form.Group>
          </Col>

          <Col>
            <div className="divSeletor">
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>DATA</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>NOME</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>LUCRO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>VENCIMENTO</h6>
              </div>
            </div>
          </Col>
          <Col>
            <div className="divSeletor">
              <div tabIndex={0} className="divClicavel seletorAtivo">
                {" "}
                <IconeAmpliado
                  height="15"
                  width="15"
                  className="mr-1 iconeResumido"
                ></IconeAmpliado>
                <h6>AMPLIADO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <IconeResumido
                  height="15"
                  className="mr-1 iconeResumido"
                ></IconeResumido>
                <h6>RESUMIDO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <MDBIcon icon="list-ul" className="mr-1" />
                <h6>LISTA</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>DETALHADA</h6>
              </div>
            </div>
          </Col>
        </Row>
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
                  {ampliado ? (
                    <div className="divSetaPorcentagem">
                      <Col md={0} className="m-2">
                        Resultado: {formatarNumDecimal(item.resultado)}
                      </Col>
                      <Col md={0} className="m-2">
                        {renderValorPorcentagem(item.porcentagemResultado)}
                      </Col>
                    </div>
                  ) : null}
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
              </div>
            ))}
          </div>
        </Row>
      </div>
    );
  };
}

const ampliado = true;

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
