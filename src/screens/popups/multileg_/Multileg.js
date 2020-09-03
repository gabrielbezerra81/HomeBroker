import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import { ModalHeaderSemBook } from "shared/componentes/PopupHeader";
import AbaMultileg from "screens/popups/multileg_/AbaMultileg";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  selectOrAddMultilegTabAction,
  updateMultilegTabAction,
} from "redux/actions/multileg/MultilegActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import TabTitle from "./TabTitle";

class Multileg extends React.Component {
  constructor(props) {
    super(props);
    this.handleMultilegTabSelect = this.handleMultilegTabSelect.bind(this);
  }
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
    const { divkey, isOpenMultileg, aumentarZindexAction, zIndex } = this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "multileg",
      popupVisibility: isOpenMultileg,
      updateFunction: aumentarZindexAction,
    });
  }

  render() {
    return (
      <DraggableModal
        id="multileg"
        renderModalBody={() => this.ModalBody()}
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
  handleMultilegTabSelect(key, event) {
    if (event.keyCode === 32) {
      const targetElement = event.target;
      const { selectionStart, value } = targetElement;

      const tabIndex = +this.props.abaSelecionada.substr(3);

      const newTabName = [
        value.slice(0, selectionStart),
        event.key,
        value.slice(selectionStart),
      ].join("");

      requestAnimationFrame(() => {
        targetElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
      });

      this.props.updateMultilegTabAction({
        tabIndex,
        attributeName: "nomeAba",
        attributeValue: newTabName,
      });
    } //
    else {
      this.props.selectOrAddMultilegTabAction(key);
    }
  }

  ModalBody = () => {
    return (
      <Tab.Container
        onSelect={this.handleMultilegTabSelect}
        activeKey={this.props.abaSelecionada}
      >
        <Row className="navTabMultileg">
          <Nav>
            {this.props.multileg.map((_, index) => {
              return <TabTitle tabIndex={index} key={`tabTitle${index}`} />;
            })}

            <Col>
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
              {this.props.multileg.map((_, index) => {
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
}

const mapStateToPropsMultileg = (state) => ({
  configComplementarAberto: state.multilegReducer.configComplementarAberto,
  multileg: state.multilegReducer.multileg,
  abaSelecionada: state.multilegReducer.abaSelecionada,
  isOpenMultileg: state.systemReducer.isOpenMultileg,
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
      // atualizarBookAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(Multileg);
