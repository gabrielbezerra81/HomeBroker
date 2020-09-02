import React from "react";
import { MDBIcon } from "mdbreact";
import { compose } from "redux";
import { connect } from "react-redux";
import { Tab, Row, Col, Nav, Form } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import { ModalHeaderSemBook } from "shared/componentes/PopupHeader";
import AbaMultileg from "telas/popups/multileg_/AbaMultileg";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  selectOrAddMultilegTabAction,
  updateMultilegTabAction,
  removeMultilegTabAction,
} from "redux/actions/multileg/MultilegActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";

class Multileg extends React.Component {
  // shouldComponentUpdate(nextProps, nextState) {
  //   const multileg = this.props.multileg !== nextProps.multileg;
  //   if (multileg) {
  //     // Executar atualizar book e atualizar cotação
  //     //this.props.atualizarBookAction(nextProps, nextProps.multileg);

  //     this.props.updateMultilegQuotesAction(nextProps, nextProps.multileg);
  //   }

  //   return !_.isEqual(nextProps, this.props);
  // }

  componentDidMount() {
    if (this.props.divkey !== "" && this.props.divkey === "multileg") {
      document.getElementById("multileg").style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction("multileg", this.props.zIndex, true);
    }
  }

  componentDidUpdate(prevProps) {
    const { divkey, multilegAberto, aumentarZindexAction, zIndex } = this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "multileg",
      popupVisibility: multilegAberto,
      updateFunction: aumentarZindexAction,
    });
  }

  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => this.modalBody()}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() => (
          <ModalHeaderSemBook
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
          />
        )}
      />
    );
  }
  /*
 
  */

  modalBody = () => {
    return (
      <Tab.Container
        onSelect={this.props.selectOrAddMultilegTabAction}
        activeKey={this.props.abaSelecionada}
      >
        <Row className="navTabMultileg">
          <Nav>
            {this.props.multileg.map((aba, index) => {
              return (
                <Col md={"0"} key={index}>
                  <Nav.Item>
                    <Nav.Link
                      eventKey={`tab${index}`}
                      className={`${
                        this.props.abaSelecionada === `tab${index}`
                          ? "abaAtiva"
                          : ""
                      }`}
                      active={false}
                    >
                      <div className="containerTituloAba">
                        <MDBIcon
                          icon="times"
                          className="saldoOpNegativo"
                          onClick={(e) => {
                            this.props.removeMultilegTabAction(index);
                            e.stopPropagation();
                          }}
                        />
                        <Form.Control
                          type="text"
                          value={aba.nomeAba}
                          className="inputTituloAba"
                          onChange={(e) => {
                            this.props.updateMultilegTabAction({
                              tabIndex: index,
                              attributeName: "nomeAba",
                              attributeValue: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              );
            })}

            <Col md={"0"}>
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
                  <Tab.Pane eventKey={`tab${index}`} key={index + "tabpane"}>
                    <AbaMultileg indice={index} />
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
  };

  handleSelect = (key) => {
    if (key === "adicionar") {
      const { tabs } = this.state;

      const newTabObject = {
        name: `Sim ${tabs.length + 1}`,
        content: `This is Tab ${tabs.length + 1}`,
      };

      this.setState({
        tabs: [...tabs, newTabObject],
        abaAtual: `tab${tabs.length}`,
      });
    } else {
      this.setState({
        abaAtual: key,
      });
    }
  };
}

const mapStateToPropsMultileg = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  abaSelecionada: state.multilegReducer.abaSelecionada,
  eventSourceCotacao: state.multilegReducer.eventSourceCotacao,
  multilegAberto: state.systemReducer.multilegAberto,
});

const mapStateToPropsGlobalStore = (state) => {
  return {
    divkey: state.GlobalReducer.divkey,
    zIndex: state.GlobalReducer.zIndex,
  };
};

export default compose(
  connect(mapStateToPropsGlobalStore, { aumentarZindexAction }, null, {
    context: GlobalContext,
  }),
  connect(
    mapStateToPropsMultileg,
    {
      selectOrAddMultilegTabAction,
      updateMultilegTabAction,
      removeMultilegTabAction,
      // atualizarBookAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(Multileg);
