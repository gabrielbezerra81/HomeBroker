import React from "react";
import { FormControl } from "react-bootstrap";

export default class FiltroNumericoSeletor extends React.Component {
  constructor(props) {
    super(props);
    this.isFiltered = this.isFiltered.bind(this);
    this.filter = this.filter.bind(this);

    this.state = {
      select: "",
      minNumber: "",
      maxNumber: "",
      //
      codigo1: "",
      strike1Min: "",
      strike1Max: "",
      //
      codigo2: "",
      strike2Min: "",
      strike2Max: "",
      select2: ""
    };
  }

  filter(event) {
    let condicao;

    if (this.props.tipo === "simples")
      condicao = !this.state.minNumber && !this.state.maxNumber;
    else if (this.props.tipo === "compostoArray") condicao = false;

    if (condicao) {
      this.props.filterHandler();
    } else {
      this.props.filterHandler({ callback: this.isFiltered });
    }
  }

  isFiltered(targetValue) {
    if (this.props.tipo === "simples")
      return this.filtroNumero(
        targetValue,
        this.state.minNumber,
        this.state.maxNumber,
        this.state.select
      );
    else if (this.props.tipo === "compostoArray")
      return this.filtroCompostoNumeroTexto(targetValue);
  }

  render() {
    let filtro = <div></div>;

    if (this.props.tipo === "simples") filtro = this.inputFiltroSimples();
    else if (this.props.tipo === "compostoArray")
      filtro = this.inputFiltroComposto();

    return filtro;
  }

  // Comparar Numeros.
  filtroNumero(targetValue, min, max, select) {
    const minNumber = min;
    const maxNumber = max;

    switch (select) {
      case "><":
        if (minNumber && maxNumber)
          return targetValue >= minNumber && targetValue <= maxNumber;
        break;
      case "<>":
        if (minNumber && maxNumber)
          return !(targetValue >= minNumber && targetValue <= maxNumber);
        break;
      case "<":
        if (minNumber) return targetValue < Number(minNumber);
        break;
      case ">":
        if (minNumber) return targetValue > Number(minNumber);
        break;
      case "=":
        if (minNumber) return targetValue === Number(minNumber);
        break;
      default:
        return true;
    }
    return true;
  }

  filtroTexto(targetValue, texto) {
    return targetValue.toLocaleLowerCase().includes(texto.toLocaleLowerCase());
  }

  // Modo simples apenas com 1 filtro para numeros contendo 1 input select e 2 de numeros
  inputFiltroSimples() {
    const select = this.state.select;
    const minNumber = this.state.minNumber;
    const maxNumber = this.state.maxNumber;
    const height = select === "<>" || select === "><" ? "66px" : "43px";

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: height,
          justifyContent: "space-between"
        }}
      >
        {select === "<>" || select === "><" ? (
          <FormControl
            ref="toInput"
            type="number"
            placeholder="max"
            className="form-control inputMaxRange"
            value={maxNumber}
            onChange={e => {
              this.setState({ maxNumber: e.target.value }, () => {
                this.filter(e);
              });
            }}
          ></FormControl>
        ) : null}
        <FormControl
          ref="fromInput"
          type="number"
          placeholder={select === "<>" || select === "><" ? "min" : "valor"}
          className="form-control inputMinRange"
          value={minNumber}
          onChange={e => {
            this.setState({ minNumber: e.target.value }, () => {
              this.filter(e);
            });
          }}
        ></FormControl>
        <FormControl
          ref="selectComparator"
          as="select"
          value={select}
          onChange={e =>
            this.setState({ select: e.target.value }, () => {
              this.filter(e);
            })
          }
        >
          <option></option>
          <option>{`><`}</option>
          <option>{`<>`}</option>
          <option>{`<`}</option>
          <option>{`>`}</option>
          <option>=</option>
        </FormControl>
      </div>
    );
  }

  // Chama as funções de filtrar numero e filtrar texto e faz a operação logica final
  filtroCompostoNumeroTexto(targetValue) {
    // Objeto que contem strike e codigo
    const strike1Min = this.state.strike1Min;
    const strike1Max = this.state.strike1Max;
    const strike2Min = this.state.strike2Min;
    const strike2Max = this.state.strike2Max;
    const codigo1 = this.state.codigo1;
    const codigo2 = this.state.codigo2;
    const select = this.state.select;
    const select2 = this.state.select2;

    // Targets
    const targetSymbol1 = targetValue[0].symbol;
    const targetStrike1 = targetValue[0].strike;
    const targetSymbol2 = targetValue[1].symbol;
    const targetStrike2 = targetValue[1].strike;

    const condicaoStrike1 = this.filtroNumero(
      targetStrike1,
      strike1Min,
      strike1Max,
      select
    );
    const condicaoStrike2 = this.filtroNumero(
      targetStrike2,
      strike2Min,
      strike2Max,
      select2
    );
    const condicaoCodigo1 = this.filtroTexto(targetSymbol1, codigo1);
    const condicaoCodigo2 = this.filtroTexto(targetSymbol2, codigo2);

    return (
      condicaoStrike1 && condicaoStrike2 && condicaoCodigo1 && condicaoCodigo2
    );
  }

  // Modo composto com 2 grupos lado a lado. Cada um com 1 filtro para strike (numero) e outro para codigo (texto)
  inputFiltroComposto() {
    return (
      <div style={{ display: "flex", height: "100%", alignItems: "flex-end" }}>
        {this.grupoInputsComposto(
          "select",
          "strike1Min",
          "strike1Max",
          "codigo1"
        )}
        {this.grupoInputsComposto(
          "select2",
          "strike2Min",
          "strike2Max",
          "codigo2"
        )}
      </div>
    );
  }

  grupoInputsComposto = (
    selectLabel,
    strikeMinLabel,
    strikeMaxLabel,
    codigoLabel
  ) => {
    const select = this.state[selectLabel];
    const strikeMin = this.state[strikeMinLabel];
    const strikeMax = this.state[strikeMaxLabel];
    const codigo = this.state[codigoLabel];
    const height = ["><", "<>"].includes(select) ? "100%" : "66px"; //43 px

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: height,
          justifyContent: "space-between",
          marginLeft: "2px",
          marginRight: "2px"
        }}
      >
        {select === "<>" || select === "><" ? (
          <FormControl
            ref="toInput"
            type="number"
            placeholder="max"
            className="form-control inputMaxRange"
            value={strikeMax}
            onChange={e => {
              this.setState({ [strikeMaxLabel]: e.target.value }, () => {
                this.filter(e);
              });
            }}
          ></FormControl>
        ) : null}
        <FormControl
          ref="fromInput"
          type="number"
          placeholder={select === "<>" || select === "><" ? "min" : "valor"}
          className="form-control inputMinRange"
          value={strikeMin}
          onChange={e => {
            this.setState({ [strikeMinLabel]: e.target.value }, () => {
              this.filter(e);
            });
          }}
        ></FormControl>
        <FormControl
          ref="selectComparator"
          as="select"
          value={select}
          onChange={e =>
            this.setState({ [selectLabel]: e.target.value }, () => {
              this.filter(e);
            })
          }
        >
          <option></option>
          <option>{`><`}</option>
          <option>{`<>`}</option>
          <option>{`<`}</option>
          <option>{`>`}</option>
          <option>=</option>
        </FormControl>
        <FormControl
          type="text"
          placeholder="código"
          value={codigo}
          onChange={e => {
            this.setState({ [codigoLabel]: e.target.value }, () => {
              this.filter(e);
            });
          }}
        ></FormControl>
      </div>
    );
  };
}
