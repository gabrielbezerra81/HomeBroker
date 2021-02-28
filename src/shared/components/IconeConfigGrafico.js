import React from "react";
import { MDBIcon } from "mdbreact";
import { Button } from "react-bootstrap";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  abrirFormAction,
  abrirFormConfigurarAction,
} from "redux/actions/GlobalAppActions";
import { openCloseMultilegExtraConfigsAction } from "modules/multileg/duck/actions/MultilegActions";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

export default ({ className, name = "" }) => {
  let handleShow;

  const stateGlobalStore = useStateGlobalStore();

  if (["config_venda", "config_compra"].includes(name)) {
    const dispatch = useDispatchBoletas();
    handleShow = (e) =>
      dispatch(
        abrirFormConfigurarAction(e, { zIndex: stateGlobalStore.zIndex })
      );
  } //
  else if (name === "config_complementar") {
    const dispatchStorePrincipal = useDispatchStorePrincipal();

    handleShow = () =>
      dispatchStorePrincipal(openCloseMultilegExtraConfigsAction());
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
