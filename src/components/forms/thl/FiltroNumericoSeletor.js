import React from "react";
import { FormControl } from "react-bootstrap";

export default class FiltroNumericoSeletor extends React.Component {
  constructor(props) {
    super(props);
    this.isFiltered = this.isFiltered.bind(this);
    this.filter = this.filter.bind(this);

    this.state = { select: "", minNumber: "", maxNumber: "" };
  }

  filter(event) {
    if (!this.state.minNumber && !this.state.maxNumber) {
      this.props.filterHandler();
    } else {
      this.props.filterHandler({ callback: this.isFiltered });
    }
  }

  isFiltered(targetValue) {
    const minNumber = this.state.minNumber;
    const maxNumber = this.state.maxNumber;
    const select = this.state.select;

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

  render() {
    const select = this.state.select;
    const minNumber = this.state.minNumber;
    const maxNumber = this.state.maxNumber;

    return (
      <div style={{ position: "relative" }}>
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
      </div>
    );
  }
}
