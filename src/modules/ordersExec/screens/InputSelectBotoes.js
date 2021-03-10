import React from "react";
import { InputGroup } from "react-bootstrap";
import { Select } from "antd";
import { erro_opcoes_ordens_exec } from "constants/AlertaErros";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  updateOneOrdersExecStateAction,
  aumentarQtdePrecoAction,
} from "modules/ordersExec/duck/actions/OrdensExecActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { toast } from "react-toastify";

export default (props) => {
  const dispatch = useDispatchStorePrincipal();
  const {
    ordersExecReducer: state,
    systemReducer: { token },
  } = useStateStorePrincipal();

  const placeholder = props.modo.charAt(0).toUpperCase() + props.modo.slice(1);
  const { ordemAtual, sinalInputSelect } = state;
  const { nomeOpen, modo, disabled = false } = props;
  const open = state[nomeOpen];

  return (
    <InputGroup>
      <InputGroup.Prepend>
        <span
          className="input-group-text appendedSearchIcon divClicavel botoesInputSelect"
          onClick={() => {
            if (disabled) {
              toast.warning("Essa ordem expirou, não é possível realizar essa ação");
            } else {
              dispatch(updateOneOrdersExecStateAction(nomeOpen, !open));
              dispatch(updateOneOrdersExecStateAction("sinalInputSelect", "-"));
            }
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
          if (disabled) {
            toast.warning("Essa ordem expirou, não é possível realizar essa ação");
          } else {
            if (ordemAtual) {
              dispatch(
                aumentarQtdePrecoAction({
                  ordemAtual,
                  valorSomar,
                  modo,
                  token,
                }),
              );
            } else {
              toast.warning(erro_opcoes_ordens_exec);
            }
          }
        }}
        onDropdownVisibleChange={() =>
          dispatch(updateOneOrdersExecStateAction(nomeOpen, false))
        }
      >
        {options(sinalInputSelect, modo)}
      </Select>

      <InputGroup.Append>
        <span
          className="input-group-text appendedSearchIcon divClicavel botoesInputSelect"
          onClick={() => {
            if (disabled) {
              toast.warning("Essa ordem expirou, não é possível realizar essa ação");
            } else {
              dispatch(updateOneOrdersExecStateAction(nomeOpen, !open));
              dispatch(updateOneOrdersExecStateAction("sinalInputSelect", "+"));
            }
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
      return [
        <Select.Option key={0} value={100}>
          +100
        </Select.Option>,
        <Select.Option key={1} value={200}>
          +200
        </Select.Option>,
        <Select.Option key={2} value={500}>
          +500
        </Select.Option>,
        <Select.Option key={3} value={1000}>
          +1K
        </Select.Option>,
        <Select.Option key={4} value={5000}>
          +5K
        </Select.Option>,
        <Select.Option key={5} value={10000}>
          +10K
        </Select.Option>,
      ];
    else
      return [
        <Select.Option key={6} value={-100}>
          - 100
        </Select.Option>,
        <Select.Option key={7} value={-200}>
          - 200
        </Select.Option>,
        <Select.Option key={8} value={-500}>
          - 500
        </Select.Option>,
        <Select.Option key={9} value={-1000}>
          - 1K
        </Select.Option>,
        <Select.Option key={10} value={-5000}>
          - 5K
        </Select.Option>,
        <Select.Option key={11} value={-10000}>
          - 10K
        </Select.Option>,
      ];
  else {
    if (sinal === "+")
      return [
        <Select.Option key={12} value={0.01}>
          +0.01
        </Select.Option>,
        <Select.Option key={13} value={0.02}>
          +0.02
        </Select.Option>,
        <Select.Option key={14} value={0.05}>
          +0.05
        </Select.Option>,
        <Select.Option key={15} value={0.1}>
          +0.10
        </Select.Option>,
        <Select.Option key={16} value={0.5}>
          +0.50
        </Select.Option>,
        <Select.Option key={17} value={1}>
          +1.00
        </Select.Option>,
      ];
    else
      return [
        <Select.Option key={18} value={-0.01}>
          - 0.01
        </Select.Option>,
        <Select.Option key={19} value={-0.02}>
          - 0.02
        </Select.Option>,
        <Select.Option key={20} value={-0.05}>
          - 0.05
        </Select.Option>,
        <Select.Option key={21} value={-0.1}>
          - 0.10
        </Select.Option>,
        <Select.Option key={22} value={-0.5}>
          - 0.50
        </Select.Option>,
        <Select.Option key={23} value={-1}>
          - 1.00
        </Select.Option>,
      ];
  }
};
