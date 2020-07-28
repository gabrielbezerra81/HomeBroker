import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import {
  useDispatchGlobalStore,
  useDispatchStorePrincipal,
} from "redux/StoreCreation";
import {
  abrirFormAction,
  abrirFormConfigurarAction,
} from "redux/actions/GlobalAppActions";
import { useDispatch } from "react-redux";
import { abrirFecharConfigComplAction } from "redux/actions/multileg/MultilegActions";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export default ({ className, name = "" }) => {
  let handleShow;

  const stateGlobalStore = useStateGlobalStore();

  if (["config_venda", "config_compra"].includes(name)) {
    const dispatch = useDispatch();
    handleShow = (e) =>
      dispatch(
        abrirFormConfigurarAction(e, { zIndex: stateGlobalStore.zIndex })
      );
  } //
  else if (name === "config_complementar") {
    const dispatchStorePrincipal = useDispatchStorePrincipal();
    const stateMultileg = useStateStorePrincipal("multileg");

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
