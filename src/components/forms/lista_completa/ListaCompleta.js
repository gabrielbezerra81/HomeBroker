import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Row, Col, Form } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import { iconeConfigAbrirFormulario } from "components/utils/IconesConfigFormInterno";

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
          <Col md={2}>
            <h6>GRIDI</h6>
          </Col>
          <Col md={2}>
            <div className="divIconeConfigOrdernar">
              <h6 className="mr-2">Ordernar</h6>
              {iconeConfigAbrirFormulario(() => false, "")}
            </div>
          </Col>
        </Row>
        <Row className="rowHeaderListaCompleta mt-2">
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
                <h6>ORIGINAL</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>SÍMBOLO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>LÍQUIDO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>ÚLTIMO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>RANK</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>IMPL VOL</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>GANHOS ENCONTRO</h6>
              </div>
            </div>
          </Col>
          <Col>
            <div className="divSeletor">
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>AMPLIADO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>RESUMIDO</h6>
              </div>
              <div tabIndex={0} className="divClicavel seletorAtivo">
                <h6>LISTA</h6>
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center" }}>
          <div className="rowListagenItens">
            {itensListaCompleta.map((item, index) => (
              <div key={index} className="mt-3 ml-3">
                <Row className="rowAtivosEmblema">
                  <Col md={0}>
                    <h6>{item.ativo}</h6>
                  </Col>
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
                </Row>
                <div className="mcontent itemListaCompleta"></div>
              </div>
            ))}
          </div>
        </Row>
      </div>
    );
  };
}

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
    ]
  }
];
