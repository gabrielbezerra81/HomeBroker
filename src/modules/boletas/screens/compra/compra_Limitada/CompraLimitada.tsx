import React from "react";

import { connect, ConnectedProps } from "react-redux";
import { Row } from "react-bootstrap";
import DraggableModal from "shared/componentes/DraggableModal";
import FormInternoCompraLimitada from "./FormInternoCompraLimitada";
import GraficoCompraLimitada from "./GraficoCompraLimitada";
import BodyHeaderCompraLimitada from "./BodyHeaderCompraLimitada";
import { ModalHeader } from "shared/componentes/PopupHeader";
import { BoletasState } from "redux/reducers";
import BoletaOrderInfo from "modules/boletas/types/BoletaOrderInfo";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";

class CompraLimitada extends React.Component<Props> {
  render() {
    return (
      <DraggableModal
        id={"compra_limitada"}
        headerTitle={this.props.headerTitle}
        renderModalBody={modalBody}
        headerClass="border-green"
        renderHeader={(resetPosition: any) => (
          <ModalHeader
            headerTitle={this.props.headerTitle}
            headerClass="border-green"
            resetPosition={resetPosition}
            name={this.props.name}
            ativo={this.props.ativo}
            namespace={COMPRA_LIMITADA_NAMESPACE}
          />
        )}
      />
    );
  }
}

const modalBody = () => (
  <div className="mbody">
    <BodyHeaderCompraLimitada />
    <Row>
      <FormInternoCompraLimitada ordem={ordem} />
      <GraficoCompraLimitada />
    </Row>
  </div>
);

const mapStateToProps = (state: BoletasState) => ({
  ativo: state.compraLimitadaReducer.ativo,
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { headerTitle: string; name: string };

export default connector(CompraLimitada);

const ordem: BoletaOrderInfo = {
  nome: "Compra Limitada",
  tipoOrdem: "buyLimit",
  tipoOferta: "C",
};
