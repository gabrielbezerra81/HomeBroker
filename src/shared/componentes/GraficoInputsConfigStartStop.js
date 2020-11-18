import React from "react";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import { mapStateToPropsInputsPreco } from "shared/componentes/GraficoInputs";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import CustomInput from "shared/componentes/CustomInput";

class GraficoInputsConfigStartStop extends React.Component {
  render() {
    const inputGain1 = (
      <div>
        <CustomInput
          type="preco"
          step={0.01}
          className={`GainDisparoGrafico_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].gainDisparoConfig1}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "gainDisparoConfig1",
            )
          }
          name="gainDisparoConfig1"
        />
        <CustomInput
          type="preco"
          step={0.01}
          className={`GainExecGrafico_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].gainExecConfig1}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "gainExecConfig1",
            )
          }
          name="gainExecConfig1"
        />
      </div>
    );

    const inputStop1 = (
      <div>
        <CustomInput
          type="preco"
          step={0.01}
          className={`StopDisparoGrafico_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].stopDisparoConfig1}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "stopDisparoConfig1",
            )
          }
          name="stopDisparoConfig1"
        />
        <CustomInput
          type="preco"
          step={0.01}
          className={`StopExecGrafico_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].stopExecConfig1}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "stopExecConfig1",
            )
          }
          name="stopExecConfig1"
        />
      </div>
    );

    const inputGain2 = (
      <div>
        <CustomInput
          type="preco"
          step={0.01}
          className={`GainDisparoGrafico2_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].gainDisparoConfig2}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "gainDisparoConfig2",
            )
          }
          name="gainDisparoConfig2"
        />
        <CustomInput
          type="preco"
          step={0.01}
          className={`GainExecGrafico2_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].gainExecConfig2}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "gainExecConfig2",
            )
          }
          name="gainExecConfig2"
        />
      </div>
    );

    const inputStop2 = (
      <div>
        <CustomInput
          type="preco"
          step={0.01}
          className={`StopDisparoGrafico2_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].stopDisparoConfig2}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "stopDisparoConfig2",
            )
          }
          name="stopDisparoConfig2"
        />
        <CustomInput
          type="preco"
          step={0.01}
          className={`StopExecGrafico2_CONFIGURAR${this.props.posicionamento}`}
          containerClassName="containerInputGrafico"
          value={this.props[this.props.namespace].stopExecConfig2}
          onChange={(valor) =>
            this.props.mudarAtributoBoletaAction(
              valor,
              this.props.namespace,
              "stopExecConfig2",
            )
          }
          name="stopExecConfig2"
        />
      </div>
    );

    return this.props.cv === "compra" ? (
      <Form>
        {inputGain1}
        {inputStop1}
        {inputGain2}
        {inputStop2}
      </Form>
    ) : (
      <Form>
        {inputStop1}
        {inputGain1}
        {inputStop2}
        {inputGain2}
      </Form>
    );
  }
}

export default connect(mapStateToPropsInputsPreco, {
  mudarAtributoBoletaAction,
})(GraficoInputsConfigStartStop);
