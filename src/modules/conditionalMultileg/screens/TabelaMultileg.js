import React from "react";
import { Spinner, Table } from "react-bootstrap";
import { connect } from "react-redux";
import {
  cond_updateMultilegOfferAction,
  cond_removeMultilegOfferAction,
} from "../duck/actions/ConditionalMultilegActions";
import { StorePrincipalContext } from "redux/StoreCreation";
import MultilegOfferItem from "./MultilegOffer";

class TabelaMultileg extends React.Component {
  componentDidUpdate(prevProps) {
    const { props } = this;
    const indiceAba = props.indice;

    const currentLength = props.multileg[indiceAba].tabelaMultileg.length;

    if (
      prevProps.multileg[indiceAba].tabelaMultileg.length !== currentLength &&
      currentLength
    ) {
      const indiceLinha = currentLength - 1;
      const linha = document.getElementById("ofertaMultileg" + indiceLinha);
      const input = linha.children[2].getElementsByTagName("input");
      input[0].select();
    }
  }

  render() {
    const { loadingOffers, indice: tabIndex, multileg } = this.props;

    return (
      <Table
        variant="dark"
        bordered={false}
        borderless
        striped
        className="tableMultileg text-center"
        style={{ tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th></th>
            <th>C/V</th>
            <th>Qtde.</th>
            <th>Série</th>
            <th>Strike</th>
            <th>Código</th>
            <th>Tipo</th>
            <th>Modelo</th>
            <th>Despernamento Máx.</th>
            <th>Prioridade de Execução</th>
            <th>Ult.Neg.</th>
            <th>Valor da oferta</th>
          </tr>
        </thead>
        <tbody>
          {loadingOffers && (
            <tr>
              <td className="multilegOffersSpinners" colSpan={12}>
                <span>Carregando ofertas...</span>
                <Spinner animation="border" role="status"></Spinner>
              </td>
            </tr>
          )}
          {multileg[tabIndex].tabelaMultileg.map((item, lineIndex) => {
            return (
              <MultilegOfferItem
                offer={item}
                tabIndex={tabIndex}
                lineIndex={lineIndex}
                key={`offer${lineIndex}`}
              />
            );
          })}
        </tbody>
      </Table>
    );
  }
}

const mapStateToProps = (state) => ({
  multileg: state.conditionalMultilegReducer.multileg,
  loadingOffers: state.conditionalMultilegReducer.loadingOffers,
});

export default connect(
  mapStateToProps,
  {
    cond_updateMultilegOfferAction,
    cond_removeMultilegOfferAction,
  },
  null,
  { context: StorePrincipalContext },
)(TabelaMultileg);
