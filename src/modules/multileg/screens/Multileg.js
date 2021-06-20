import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
import AbaMultileg from "./AbaMultileg";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  selectOrAddMultilegTabAction,
  updateMultilegTabAction,
} from "../duck/actions/MultilegActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import TabTitle from "./TabTitle";
import { collapseElement, updateHeight } from "shared/utils/AnimateHeight";
import { getMultilegExecStrategiesAPIAction } from "../duck/actions/MultilegAPIAction";
import {
  multilegBaseHeight,
  multilegNormalHeight,
  multilegWithAlertHeight,
} from "./constants";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

class Multileg extends React.Component {
  constructor(props) {
    super(props);

    this.handleMultilegTabSelect = this.handleMultilegTabSelect.bind(this);

    this.onClose = this.onClose.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderModalBody = this.renderModalBody.bind(this);
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
    const { multilegButtonsVisibility, createAlertButtonVisibility } =
      this.props;

    this.props.aumentarZindexAction("multileg", this.props.zIndex, true);

    this.props.getMultilegExecStrategiesAPIAction();

    // if (this.props.divkey !== "" && this.props.divkey === "multileg") {
    //   // document.getElementById("multileg").style.zIndex = this.props.zIndex + 1;
    // }

    const multilegElement = document.getElementById("multileg");
    var section = multilegElement?.querySelector(".mcontent");
    if (section) {
      var isCollapsed = section.getAttribute("data-collapsed") === "true";
      section.setAttribute("data-collapsed", "true");

      let popupHeight = multilegBaseHeight;

      if (multilegButtonsVisibility && !createAlertButtonVisibility)
        popupHeight = multilegNormalHeight;
      else if (!multilegButtonsVisibility && createAlertButtonVisibility)
        popupHeight = multilegWithAlertHeight + 109;

      if (!isCollapsed) {
        collapseElement({
          element: section,
          height: popupHeight,
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const {
      divkey,
      isOpenMultileg,
      aumentarZindexAction,
      zIndex,
      multileg,
      multilegButtonsVisibility,
      createAlertButtonVisibility,
    } = this.props;

    setPopupZIndexFromSecondaryTab({
      zIndex,
      previousDivkey: prevProps.divkey,
      currentDivkey: divkey,
      divkeyToCheck: "multileg",
      popupVisibility: isOpenMultileg,
      updateFunction: aumentarZindexAction,
    });

    const previousNumberOfOffers = Math.max(
      ...prevProps.multileg.map((tab) => tab.tabelaMultileg.length),
    );

    const maxNumberOfOffers = Math.max(
      ...multileg.map((tab) => tab.tabelaMultileg.length),
    );

    if (
      previousNumberOfOffers !== maxNumberOfOffers ||
      prevProps.multilegButtonsVisibility !== multilegButtonsVisibility ||
      prevProps.createAlertButtonVisibility !== createAlertButtonVisibility
    ) {
      if (previousNumberOfOffers || previousNumberOfOffers === 0) {
        const isAnyAlertOpen = multileg.some((tab) => tab.isAlertOpen);

        const multilegElement = document.getElementById("multileg");
        var section = multilegElement?.querySelector(".mcontent");

        let popupHeight = multilegBaseHeight;

        if (multilegButtonsVisibility && !createAlertButtonVisibility)
          popupHeight = multilegNormalHeight;
        else if (!multilegButtonsVisibility && createAlertButtonVisibility)
          popupHeight = multilegWithAlertHeight;

        if (
          isAnyAlertOpen &&
          (multilegButtonsVisibility || createAlertButtonVisibility)
        ) {
          popupHeight += 109;
        }

        updateHeight(section, popupHeight, 27 * maxNumberOfOffers);
      }
    }
  }

  onClose() {
    this.props.abrirItemBarraLateralAction("isOpenMultileg");
  }

  renderHeader() {
    return (
      <PopupHeader
        name={this.props.name}
        headerTitle={this.props.headerTitle}
        headerClass="border-green"
        onConfig={() => {}}
        onClose={this.onClose}
      />
    );
  }

  render() {
    return (
      <>
        <DraggableModal
          id="multileg"
          renderModalBody={this.renderModalBody}
          renderConfigComplementar={this.props.configComplementarAberto}
          renderHeader={this.renderHeader}
        />
      </>
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

  renderModalBody = () => {
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
        <Row style={{ height: "100%" }}>
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
  multilegButtonsVisibility: state.systemReducer.multilegButtonsVisibility,
  createAlertButtonVisibility: state.systemReducer.createAlertButtonVisibility,
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
      getMultilegExecStrategiesAPIAction,
      abrirItemBarraLateralAction,
      // atualizarBookAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(Multileg);
