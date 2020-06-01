import React from "react";
import { InputGroup } from "react-bootstrap";
import { Select } from "antd";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import {
  mudarVariavelOrdensExecAction,
  aumentarQtdePrecoAction,
} from "components/redux/actions/menu_actions/OrdensExecActions";

export default (props) => {
  const dispatch = DispatchStorePrincipal();
  const state = StateStorePrincipal("ordensExec");
  const { token } = StateStorePrincipal("principal");

  const placeholder = props.modo.charAt(0).toUpperCase() + props.modo.slice(1);
  const { ordemAtual, sinalInputSelect } = state;
  const { nomeOpen, modo } = props;
  const open = state[nomeOpen];

  return (
    <InputGroup>
      <InputGroup.Prepend>
        <span
          className="input-group-text iconeProcurar divClicavel botoesInputSelect"
          onClick={() => {
            dispatch(mudarVariavelOrdensExecAction(nomeOpen, !open));
            dispatch(mudarVariavelOrdensExecAction("sinalInputSelect", "-"));
          }}
        >
          -
        </span>
      </InputGroup.Prepend>

      <Select
        size="small"
        dropdownClassName="inputCodigoDropdown"
        value={placeholder}
        open={open}
        placeholder={placeholder}
        showArrow={false}
        className="selectQtde"
        onSelect={(valorSomar) => {
          if (ordemAtual)
            dispatch(
              aumentarQtdePrecoAction({
                ordemAtual,
                valorSomar,
                modo,
                token,
              })
            );
          else alert(erro_opcoes_ordens_exec);
        }}
        onDropdownVisibleChange={() =>
          dispatch(mudarVariavelOrdensExecAction(nomeOpen, false))
        }
      >
        {options(sinalInputSelect, modo).map((option) => option)}
      </Select>

      <InputGroup.Append>
        <span
          className="input-group-text iconeProcurar divClicavel botoesInputSelect"
          onClick={() => {
            dispatch(mudarVariavelOrdensExecAction(nomeOpen, !open));
            dispatch(mudarVariavelOrdensExecAction("sinalInputSelect", "+"));
          }}
        >
          +
        </span>
      </InputGroup.Append>
    </InputGroup>
  );
};

const options = (sinal, modo) => {
  if (modo === "qtde")
    if (sinal === "+")
      return (
        <>
          <Select.Option value={100}>+100</Select.Option>,
          <Select.Option value={200}>+200</Select.Option>,
          <Select.Option value={500}>+500</Select.Option>,
          <Select.Option value={1000}>+1K</Select.Option>,
          <Select.Option value={5000}>+5K</Select.Option>,
          <Select.Option value={10000}>+10K</Select.Option>
        </>
      );
    else
      return (
        <>
          <Select.Option value={-100}>- 100</Select.Option>,
          <Select.Option value={-200}>- 200</Select.Option>,
          <Select.Option value={-500}>- 500</Select.Option>,
          <Select.Option value={-1000}>- 1K</Select.Option>,
          <Select.Option value={-5000}>- 5K</Select.Option>,
          <Select.Option value={-10000}>- 10K</Select.Option>,
        </>
      );
  else {
    if (sinal === "+")
      return (
        <>
          <Select.Option value={0.01}>+0.01</Select.Option>,
          <Select.Option value={0.02}>+0.02</Select.Option>,
          <Select.Option value={0.05}>+0.05</Select.Option>,
          <Select.Option value={0.1}>+0.10</Select.Option>,
          <Select.Option value={0.5}>+0.50</Select.Option>,
          <Select.Option value={1}>+1.00</Select.Option>,
        </>
      );
    else
      return (
        <>
          <Select.Option value={-0.01}>- 0.01</Select.Option>,
          <Select.Option value={-0.02}>- 0.02</Select.Option>,
          <Select.Option value={-0.05}>- 0.05</Select.Option>,
          <Select.Option value={-0.1}>- 0.10</Select.Option>,
          <Select.Option value={-0.5}>- 0.50</Select.Option>,
          <Select.Option value={-1}>- 1.00</Select.Option>,
        </>
      );
  }
};
