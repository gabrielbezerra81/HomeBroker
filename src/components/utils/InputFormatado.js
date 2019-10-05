import React from "react";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-intl-number-input";
import { MDBIcon } from "mdbreact";
import { formatarNumDecimal } from "components/utils/Formatacoes";
import Repeatable from "react-repeatable";

class InputFormatado extends React.Component {
  render() {
    var input;
    if (this.props.tipoInput === "preco")
      input = (
        <CurrencyInput
          locale="pt-BR"
          className={`form-control textInput inputFormatado ${this.props.className}`}
          precision={2}
          step={this.props.step}
          value={this.props.value}
          onChange={
            this.props.readOnly
              ? null
              : (event, double, string) => this.props.onChange(double)
          }
          onBlur={this.props.onBlur}
          onKeyPress={this.props.onKeyPress}
          prefix={this.props.value < 0 ? "- " : ""}
          onFocus={event => {
            if (this.props.autoSelect) event.target.select();
          }}
        />
      );
    else if (this.props.tipoInput === "quantidade")
      input = (
        <NumberFormat
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={0}
          className={`form-control textInput inputFormatado ${this.props.className}`}
          value={this.props.value}
          onChange={
            this.props.readOnly
              ? null
              : event => this.props.onChange(event.target.value)
          }
          onBlur={this.props.onBlur}
          onKeyPress={this.props.onKeyPress}
        />
      );

    return (
      <div className="containerInput">
        {input}
        {this.props.readOnly ? null : (
          <div className="divContainerBotoes">
            <Repeatable
              repeatDelay={600}
              repeatInterval={40}
              onPress={() => onUp(this.props)}
              onHold={() => onUp(this.props)}
              className="divRepetidor"
            >
              <MDBIcon icon="caret-up" className="divClicavel" />
            </Repeatable>
            <Repeatable
              repeatDelay={600}
              repeatInterval={40}
              onPress={() => onDown(this.props)}
              onHold={() => onDown(this.props)}
              className="divRepetidor"
            >
              <MDBIcon icon="caret-down" className="divClicavel" />
            </Repeatable>
          </div>
        )}
      </div>
    );
  }
}

export default InputFormatado;

const onUp = props => {
  let numero;
  numero = Number(Number(props.value) + props.step);
  if (props.tipoInput === "preco") numero = numero.toFixed(2);
  props.onChange(numero);
};

const onDown = props => {
  if (props.value > 0 || props.allowNegative) {
    let numero;
    numero = Number(Number(props.value) - props.step);
    if (props.tipoInput === "preco") numero = numero.toFixed(2);
    props.onChange(numero);
  }
};
