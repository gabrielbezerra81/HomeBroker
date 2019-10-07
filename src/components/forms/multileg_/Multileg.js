import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Row, Col, Nav, Form, Tabs } from "react-bootstrap";
import DraggableModal from "components/utils/DraggableModal";
import { modalHeaderSemBook } from "components/utils/FormHeader";
import AbaMultileg from "components/forms/multileg_/AbaMultileg";
import { MDBIcon } from "mdbreact";

export default class Multileg extends React.Component {
  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "multileg") {
      document.getElementById("multileg").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("multileg", this.props.zIndex, true);
    }
  }

  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => this.modalBody(this.props)}
        renderConfigComplementar={this.props.configComplementarAberto}
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
      <div className="bodyMultileg">
        <Tab.Container
          id="tabBarMultileg"
          onSelect={(key, event) => {
            // @ts-ignore
            const keysPressionadas = !arrayKeys.includes(event.key);
            if (keysPressionadas)
              this.props.selecionarAdicionarAbaAction(key, this.props.multileg);
            else {
              event.stopPropagation();
              event.preventDefault();
            }
          }}
          activeKey={this.props.abaSelecionada}
        >
          <Row className="navTabMultileg">
            <Nav>
              {this.props.multileg.map((aba, index) => {
                return (
                  <Col md={0} key={index}>
                    <Nav.Item>
                      <Nav.Link eventKey={`tab${index}`} className="abaNavTab">
                        <div className="containerTituloAba">
                          <MDBIcon
                            icon="times"
                            className="saldoOpNegativo"
                            onClick={e => {
                              this.props.excluirAbaMultilegAction(
                                this.props.multileg,
                                index
                              );
                              e.stopPropagation();
                            }}
                          />
                          <Form.Control
                            type="text"
                            value={aba.nomeAba}
                            className="inputTituloAba"
                            onChange={e => {
                              this.props.modificarAtributoAbaAction(
                                this.props.multileg,
                                index,
                                "nomeAba",
                                e.target.value
                              );
                            }}
                          />
                        </div>
                      </Nav.Link>
                    </Nav.Item>
                  </Col>
                );
              })}

              <Col md={0}>
                <Nav.Item>
                  <Nav.Link
                    eventKey="adicionar"
                    className="botaoAddAba divClicavel"
                  >
                    +
                  </Nav.Link>
                </Nav.Item>
              </Col>
            </Nav>
          </Row>
          <Row>
            <Col md={12}>
              <Tab.Content>
                {this.props.multileg.map((aba, index) => {
                  return (
                    <Tab.Pane
                      eventKey={`tab${index}`}
                      className="abaNavTab"
                      key={index}
                    >
                      <AbaMultileg indice={index} />
                    </Tab.Pane>
                  );
                })}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    );
  };

  handleSelect = key => {
    if (key === "adicionar") {
      const { tabs } = this.state;

      const newTabObject = {
        name: `Sim ${tabs.length + 1}`,
        content: `This is Tab ${tabs.length + 1}`
      };

      this.setState({
        tabs: [...tabs, newTabObject],
        abaAtual: `tab${tabs.length}`
      });
    } else {
      this.setState({
        abaAtual: key
      });
    }
  };
}

const arrayKeys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
