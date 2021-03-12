import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
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
import { collapseElement, updateHeight } from "shared/utils/AnimateHeight";
import { cond_getMultilegExecStrategiesAPIAction } from "../duck/actions/ConditionalMultilegAPIAction";
import { cond_multilegNormalHeight } from "./constants";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import HeightAdjuster from "../components/HeightAdjuster";

const popupKey = "conditionalMultileg";

class ConditionalMultileg extends React.Component {
  constructor(props) {
    super(props);

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
    this.props.cond_getMultilegExecStrategiesAPIAction();

    this.props.aumentarZindexAction(popupKey, this.props.zIndex, true);

    const multilegElement = document.getElementById(popupKey);
    var section = multilegElement?.querySelector(".mcontent");
    if (section) {
      var isCollapsed = section.getAttribute("data-collapsed") === "true";
      section.setAttribute("data-collapsed", "true");

      let popupHeight = cond_multilegNormalHeight;

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
        const multilegElement = document.getElementById(popupKey);
        var section = multilegElement?.querySelector(".mcontent");

        let popupHeight = cond_multilegNormalHeight; //multilegBaseHeight;

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

  ModalBody = () => {
    return (
      <div>
        <HeightAdjuster />

        <ConditionalMultilegTab
          tabIndex={0}
          tabTitle="CONDIÇÃO"
          titleColor="#BBE2C6"
        />
        <ConditionalMultilegTab
          tabIndex={1}
          tabTitle="ORDEM"
          titleColor="#8CA6C3"
        />
      </div>
    );
  };
}

const mapStateToPropsMultileg = (state) => ({
  configComplementarAberto:
    state.conditionalMultilegReducer.configComplementarAberto,
  multileg: state.conditionalMultilegReducer.multileg,
  abaSelecionada: state.conditionalMultilegReducer.abaSelecionada,
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
