import React from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { connect, ConnectedProps } from "react-redux";
import { mostrarErroQtdeOnBlurAction } from "modules/boletas/duck/actions/bookOfertaActions";
import {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mudarAtributoBoletaAction,
} from "modules/boletas/duck/actions/formInputActions";
import RowFormValidade from "shared/componentes/RowFormValidade";
import RowFormAssinatura from "shared/componentes/RowFormAssinatura";
import { COMPRA_LIMITADA_NAMESPACE } from "constants/ActionTypes";
import { CalculoValorTotalLimitada } from "shared/utils/CalculoValorTotal";
import { compraLimitadaAction } from "modules/boletas/duck/actions/AppBoletasActions";
import RowAtivoQtdeBoletas from "shared/componentes/RowAtivoQtdeBoletas";
import {
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
} from "modules/boletas/duck/actions/boletasAPIActions";
import CustomInput from "shared/componentes/CustomInput";
import { BotaoEnviarOrdem } from "modules/boletas/components/BotaoEnviarOrdem";
import { BoletasState } from "redux/reducers";
import BoletasOrderType from "modules/boletas/types/boletasOrderType";
import InputGroupBoleta from "modules/boletas/components/InternalForm/InputGroupBoleta";

interface State {
  priceStep: number;
  pricePrecision: number;
}

class FormInternoCompraLimitada extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      priceStep: 0.01,
      pricePrecision: 2,
    };
  }

  componentDidUpdate(prevProps: any) {
    const { dadosPesquisa } = this.props;
    if (prevProps.dadosPesquisa.stepQtde !== dadosPesquisa.stepQtde) {
      let step = 0.01;
      let precision = 2;

      if (dadosPesquisa.stepQtde === 0.01) {
        step = 0.00001;
        precision = 5;
      }

      this.setState({ priceStep: step, pricePrecision: precision });
    }
  }

  render() {
    const { priceStep, pricePrecision } = this.state;

    return (
      <Col className="colFormInterno">
        <div className="divAsModalContainer">
          <Form>
            {RowAtivoQtdeBoletas(this.props, COMPRA_LIMITADA_NAMESPACE)}

            <Row>
              <Col md={2} className="colLabelInput">
                <h6 className="labelInput-verticalAlign">Preço</h6>
              </Col>
              <Col className="colTextInput">
                <Form.Group>
                  <Form.Label />
                  <CustomInput
                    type="preco"
                    step={priceStep}
                    id="compralim"
                    precision={pricePrecision}
                    value={this.props.preco}
                    onChange={(valor: number | string) =>
                      this.props.mudarAtributoBoletaAction(
                        valor,
                        COMPRA_LIMITADA_NAMESPACE,
                        "preco",
                      )
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={5} className="colValorTotal_CL">
                <h6 className="valorTotalText_CL">
                  {CalculoValorTotalLimitada(this.props.preco, this.props.qtde)}
                </h6>
              </Col>
            </Row>
          </Form>

          <InputGroupBoleta
            namespace={COMPRA_LIMITADA_NAMESPACE}
            cv="compra"
            popupToOpenGain="compra_gainreducao"
            popupToOpenStop="venda_stopmovel"
          />

          {RowFormValidade(this.props, COMPRA_LIMITADA_NAMESPACE)}

          <div className="customFooter">
            {RowFormAssinatura(this.props, COMPRA_LIMITADA_NAMESPACE)}
            <Row>
              <Col md={3}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    this.props.limparAction(COMPRA_LIMITADA_NAMESPACE)
                  }
                >
                  <h6>Limpar</h6>
                </Button>
              </Col>
              <Col md={6}>
                <BotaoEnviarOrdem
                  props={this.props}
                  tipoCompraVenda="Comprar"
                />
              </Col>
            </Row>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state: BoletasState) => ({
  qtde: state.compraLimitadaReducer.qtde,
  erro: state.compraLimitadaReducer.erro,
  gainDisparo: state.compraLimitadaReducer.gainDisparo,
  gainExec: state.compraLimitadaReducer.gainExec,
  stopDisparo: state.compraLimitadaReducer.stopDisparo,
  stopExec: state.compraLimitadaReducer.stopExec,
  validadeSelect: state.compraLimitadaReducer.validadeSelect,
  date: state.compraLimitadaReducer.date,
  valorTotal: state.compraLimitadaReducer.valorTotal,
  ativo: state.compraLimitadaReducer.ativo,
  assinatura: state.compraLimitadaReducer.assinatura,
  preco: state.compraLimitadaReducer.preco,
  checkSalvarAssinatura: state.compraLimitadaReducer.checkSalvarAssinatura,
  dadosPesquisa: state.compraLimitadaReducer.dadosPesquisa,
});

const mapDispatch = {
  mudarQtdAction,
  mudarValidadeSelectAction,
  mudarDataAction,
  limparAction,
  mudarAtivoAction,
  mudarAssinaturaAction,
  mudarCheckSalvarAssinaturaAction,
  mostrarErroQtdeOnBlurAction,
  compraLimitadaAction,
  pesquisarAtivoOnEnterAction,
  enviarOrdemAction,
  mudarAtributoBoletaAction,
};

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & { ordem: BoletasOrderType };

export default connector(FormInternoCompraLimitada);
