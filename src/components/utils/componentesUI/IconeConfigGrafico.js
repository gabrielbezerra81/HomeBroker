import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import {
  useDispatchGlobalStore,
  useSelectorGlobalStore,
  useDispatchStorePrincipal,
  useSelectorStorePrincipal,
} from "redux/StoreCreation";
import {
  abrirFormAction,
  abrirFormConfigurarAction,
} from "redux/actions/MainAppActions";
import { useDispatch } from "react-redux";
import { abrirFecharConfigComplAction } from "redux/actions/menu_actions/MultilegActions";

export default ({ className, name = "" }) => {
  let handleShow;

  const stateGlobalStore = useSelectorGlobalStore(
    (state) => state.MainAppReducer
  );

  if (["config_venda", "config_compra"].includes(name)) {
    const dispatch = useDispatch();
    handleShow = (e) =>
      dispatch(
        abrirFormConfigurarAction(e, { zIndex: stateGlobalStore.zIndex })
      );
  } //
  else if (name === "config_complementar") {
    const dispatchStorePrincipal = useDispatchStorePrincipal();
    const stateMultileg = useSelectorStorePrincipal(
      (state) => state.multilegReducer
    );
    handleShow = () =>
      dispatchStorePrincipal(
        abrirFecharConfigComplAction(stateMultileg.configComplementarAberto)
      );
  } //
  else {
    const dispatchGlobal = useDispatchGlobalStore();
    handleShow = (e) =>
      dispatchGlobal(abrirFormAction(e, { ...stateGlobalStore }, ""));
  }

  return (
    <div className={`wrapperIconeConfiguracaoGrafico ${className}`}>
      <Button
        variant="link"
        className="iconeConfiguracaoGrafico"
        onClick={(event) => {
          event.stopPropagation();
          handleShow(event);
        }}
        data-name={name}
      >
        <MDBIcon icon="cog" size="2x" data-name={name} />
      </Button>
    </div>
  );
};
