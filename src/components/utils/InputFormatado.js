import React from "react";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-intl-number-input";
import { MDBIcon } from "mdbreact";
import Repeatable from "react-repeatable";
import { formatarNumero } from "components/redux/reducers/formInputReducer";

class InputFormatado extends React.Component {
  render() {
    var input;
    if (this.props.tipoInput === "preco")
      input = (
        <CurrencyInput
          placeholder={this.props.placeholder}
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
          onKeyUp={event => {
            if (event.key === "ArrowUp") onUp(this.props);
            else if (event.key === "ArrowDown") onDown(this.props);
          }}
        />
      );
    else if (this.props.tipoInput === "quantidade")
      input = (
        <NumberFormat
          placeholder={this.props.placeholder}
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
          onFocus={event => {
            if (this.props.autoSelect) event.target.select();
          }}
          onBlur={this.props.onBlur}
          onKeyPress={this.props.onKeyPress}
          onKeyUp={event => {
            if (event.key === "ArrowUp") onUp(this.props);
            else if (event.key === "ArrowDown") onDown(this.props);
          }}
        />
      );
    else if (this.props.tipoInput === "precoNegativo")
      input = (
        <NumberFormat
          placeholder={this.props.placeholder}
          className="form-control textInput"
          thousandSeparator="."
          decimalSeparator=","
          value={this.props.value}
          onChange={
            this.props.readOnly
              ? null
              : event => this.props.onChange(event.target.value)
          }
          onKeyPress={event => {
            if (event.key !== "-" && !document.getSelection().toString())
              event.currentTarget.value = formatarNumero(
                event.currentTarget.value,
                1,
                ",",
                ","
              );
          }}
          onFocus={event => {
            if (this.props.autoSelect) event.target.select();
          }}
          onKeyUp={event => {
            if (event.key === "ArrowUp") onUp(this.props);
            else if (event.key === "ArrowDown") onDown(this.props);
          }}
        />
      );

    return (
      <div
        className={`containerInput ${this.props.inputGrafico}`}
        id={this.props.id}
      >
        {input}
        {this.props.readOnly ? null : (
          <div className="divContainerBotoes">
            <Repeatable
              repeatDelay={600}
              repeatInterval={40}
              onPress={event => {
                event.preventDefault();
                onUp(this.props);
              }}
              onHold={() => onUp(this.props)}
              className="divRepetidor"
            >
              <MDBIcon icon="caret-up" className="divClicavel" />
            </Repeatable>
            <Repeatable
              repeatDelay={600}
              repeatInterval={40}
              onPress={event => {
                event.preventDefault();
                onDown(this.props);
              }}
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
  let valorAnterior = props.value;
  let resultado;

  //Tira todos os pontos e vírgulas do número e o transforma em um número decimal com ponto com separador
  if (["precoNegativo", "quantidade"].includes(props.tipoInput))
    valorAnterior = valorAnterior
      .toString()
      .split(".")
      .join("")
      .replace(",", ".");

  resultado = Number(Number(valorAnterior) + Number(props.step));

  if (props.tipoInput === "preco" || props.tipoInput === "precoNegativo")
    resultado = Number(resultado).toFixed(2);
  if (props.tipoInput === "precoNegativo")
    resultado = resultado.toString().replace(".", ",");
  props.onChange(resultado);
};

const onDown = props => {
  let valorAnterior = props.value;
  if (valorAnterior > 0 || props.allowNegative) {
    let resultado;

    if (["precoNegativo", "quantidade"].includes(props.tipoInput))
      valorAnterior = valorAnterior
        .toString()
        .split(".")
        .join("")
        .replace(",", ".");

    resultado = Number(Number(valorAnterior) - props.step);
    if (props.tipoInput === "preco" || props.tipoInput === "precoNegativo")
      resultado = resultado.toFixed(2);
    if (props.tipoInput === "precoNegativo")
      resultado = resultado.toString().replace(".", ",");
    props.onChange(resultado);
  }
};

//Fazer replace de todos os pontos em QTDE
