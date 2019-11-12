import React from "react";
import { InputGroup } from "react-bootstrap";
import { Select } from "antd";
import "antd/es/select/style/index.css";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";

export default class InputSelectBotoes extends React.Component {
  render() {
    const { props } = this;
    const placeholder =
      props.modo.charAt(0).toUpperCase() + props.modo.slice(1);
    return (
      <InputGroup>
        <InputGroup.Prepend>
          <h6
            className="input-group-text iconeProcurar divClicavel botoesInputSelect"
            onClick={() => {
              props.changeVar(props.nomeOpen, !props.open);
              props.changeVar("sinalInputSelect", "-");
            }}
          >
            -
          </h6>
        </InputGroup.Prepend>

        <Select
          size="small"
          value={placeholder}
          open={props.open}
          placeholder={placeholder}
          showArrow={false}
          className="selectQtde"
          onSelect={value => {
            if (props.ordemAtual)
              props.dispararAtualizacao(props.ordemAtual, value, props.modo);
            else alert(erro_opcoes_ordens_exec);
          }}
          onDropdownVisibleChange={() => props.changeVar(props.nomeOpen, false)}
        >
          {options(props.sinal, props.modo).map(option => option)}
        </Select>

        <InputGroup.Append>
          <h6
            className="input-group-text iconeProcurar divClicavel botoesInputSelect"
            onClick={() => {
              props.changeVar(props.nomeOpen, !props.open);
              props.changeVar("sinalInputSelect", "+");
            }}
          >
            +
          </h6>
        </InputGroup.Append>
      </InputGroup>
    );
  }
}

const options = (sinal, modo) => {
  if (modo === "qtde")
    if (sinal === "+")
      return [
        <Select.Option key={Math.random()} value={100}>
          +100
        </Select.Option>,
        <Select.Option key={Math.random()} value={200}>
          +200
        </Select.Option>,
        <Select.Option key={Math.random()} value={500}>
          +500
        </Select.Option>,
        <Select.Option key={Math.random()} value={1000}>
          +1K
        </Select.Option>,
        <Select.Option key={Math.random()} value={5000}>
          +5K
        </Select.Option>,
        <Select.Option key={Math.random()} value={10000}>
          +10K
        </Select.Option>
      ];
    else
      return [
        <Select.Option key={Math.random()} value={-100}>
          - 100
        </Select.Option>,
        <Select.Option key={Math.random()} value={-200}>
          - 200
        </Select.Option>,
        <Select.Option key={Math.random()} value={-500}>
          - 500
        </Select.Option>,
        <Select.Option key={Math.random()} value={-1000}>
          - 1K
        </Select.Option>,
        <Select.Option key={Math.random()} value={-5000}>
          - 5K
        </Select.Option>,
        <Select.Option key={Math.random()} value={-10000}>
          - 10K
        </Select.Option>
      ];
  else {
    if (sinal === "+")
      return [
        <Select.Option key={Math.random()} value={0.01}>
          +0.01
        </Select.Option>,
        <Select.Option key={Math.random()} value={0.02}>
          +0.02
        </Select.Option>,
        <Select.Option key={Math.random()} value={0.05}>
          +0.05
        </Select.Option>,
        <Select.Option key={Math.random()} value={0.1}>
          +0.10
        </Select.Option>,
        <Select.Option key={Math.random()} value={0.5}>
          +0.50
        </Select.Option>,
        <Select.Option key={Math.random()} value={1}>
          +1.00
        </Select.Option>
      ];
    else
      return [
        <Select.Option key={Math.random()} value={-0.01}>
          - 0.01
        </Select.Option>,
        <Select.Option key={Math.random()} value={-0.02}>
          - 0.02
        </Select.Option>,
        <Select.Option key={Math.random()} value={-0.05}>
          - 0.05
        </Select.Option>,
        <Select.Option key={Math.random()} value={-0.1}>
          - 0.10
        </Select.Option>,
        <Select.Option key={Math.random()} value={-0.5}>
          - 0.50
        </Select.Option>,
        <Select.Option key={Math.random()} value={-1}>
          - 1.00
        </Select.Option>
      ];
  }
};
