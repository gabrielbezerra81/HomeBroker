import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import DraggableModal from "shared/components/DraggableModal";
import { PopupHeader } from "shared/components/PopupHeader";
import ConditionalMultilegTab from "./ConditionalMultilegTab";
import { StorePrincipalContext, GlobalContext } from "redux/StoreCreation";
import {
  cond_selectOrAddMultilegTabAction,
  cond_updateMultilegTabAction,
} from "../duck/actions/ConditionalMultilegActions";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";
import TabTitle from "./TabTitle";
import { collapseElement, updateHeight } from "shared/utils/AnimateHeight";
import { cond_getMultilegExecStrategiesAPIAction } from "../duck/actions/ConditionalMultilegAPIAction";
import {
  multilegBaseHeight,
  multilegNormalHeight,
  multilegWithAlertHeight,
} from "./constants";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";

const popupKey = "conditionalMultileg";

class ConditionalMultileg extends React.Component {
  constructor(props) {
    super(props);

    this.handleMultilegTabSelect = this.handleMultilegTabSelect.bind(this);

    this.onClose = this.onClose.bind(this);
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
    const {
      multilegButtonsVisibility,
      createAlertButtonVisibility,
    } = this.props;

    this.props.cond_getMultilegExecStrategiesAPIAction();

    if (this.props.divkey !== "" && this.props.divkey === popupKey) {
      document.getElementById(popupKey).style.zIndex = this.props.zIndex + 1;
      this.props.aumentarZindexAction(popupKey, this.props.zIndex, true);
    }

    const multilegElement = document.getElementById(popupKey);
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
      isOpenConditionalMultileg,
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
      divkeyToCheck: popupKey,
      popupVisibility: isOpenConditionalMultileg,
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

        const multilegElement = document.getElementById(popupKey);
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
    this.props.abrirItemBarraLateralAction("isOpenConditionalMultileg");
  }

  render() {
    return (
      <DraggableModal
        id={popupKey}
        renderModalBody={() => this.ModalBody()}
        renderConfigComplementar={this.props.configComplementarAberto}
        renderHeader={() => (
          <PopupHeader
            name={this.props.name}
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            onConfig={() => {}}
            onClose={this.onClose}
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

      this.props.cond_updateMultilegTabAction({
        tabIndex,
        attributeName: "nomeAba",
        attributeValue: newTabName,
      });
    } //
    else {
      this.props.cond_selectOrAddMultilegTabAction(key);
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
        <Row style={{ height: "100%" }}>
          <Col md={12}>
            <Tab.Content>
              {this.props.multileg.map((_, index) => {
                return (
                  <Tab.Pane eventKey={`tab${index}`} key={index + "tabpane"}>
                    <ConditionalMultilegTab indice={index} />
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
  configComplementarAberto:
    state.conditionalconditionalMultilegReducer.configComplementarAberto,
  multileg: state.conditionalconditionalMultilegReducer.multileg,
  abaSelecionada: state.conditionalconditionalMultilegReducer.abaSelecionada,
  multilegButtonsVisibility: state.systemReducer.multilegButtonsVisibility,
  createAlertButtonVisibility: state.systemReducer.createAlertButtonVisibility,
  isOpenConditionalMultileg: state.systemReducer.isOpenConditionalMultileg,
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
      cond_selectOrAddMultilegTabAction,
      cond_updateMultilegTabAction,
      cond_getMultilegExecStrategiesAPIAction,
      abrirItemBarraLateralAction,
      // atualizarBookAction,
    },
    null,
    { context: StorePrincipalContext },
  ),
)(ConditionalMultileg);
