import React from "react";
import { InputGroup, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import iconeCancelarOrdem from "img/OrdensExecucao/iconeCancelarOrdem.svg";
import iconeEditarOrdem from "img/OrdensExecucao/iconeEditarOrdem.svg";
import iconeFinalizarAMercado from "img/OrdensExecucao/iconeFinalizarAMercado.svg";
import iconeDuplicarOrdem from "img/OrdensExecucao/iconeDuplicarOrdem.svg";
import iconeOrdemOposta from "img/OrdensExecucao/iconeOrdemOposta.svg";
import iconeReabrir from "img/OrdensExecucao/iconeReabrir.svg";
import iconeFecharMenuOpcoesOrdem from "img/OrdensExecucao/iconeFecharMenuOpcoesOrdem.svg";
import { Select } from "antd";
import "antd/es/select/style/index.css";

export default class OpcoesOrdemExec extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="containerOpcoesOrdem mcontent">
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual)
              props.cancelarOrdemExecAction(props.ordemAtual.id);
            else alert("Selecione uma ordem");
          }}
        >
          <img src={iconeCancelarOrdem} width="40" alt=""></img>
          <h6>Cancelar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "")}
        >
          <img src={iconeEditarOrdem} width="40" alt=""></img>
          <h6>Editar Ordem</h6>
        </div>

        <InputGroup>
          <InputGroup.Prepend className="inputAtivoAppend">
            <span className="input-group-text iconeProcurar divClicavel iconePesquisarBoletas">
              -
            </span>
          </InputGroup.Prepend>
          {/* <Form.Control
            className="textInput"
            as="select"
            placeholder=""
            name="ativo"
            onFocus={e => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {options("+").map(option => option)}
          </Form.Control> */}
          <Select
            showSearch
            size="small"
            showArrow={false}
            //open
            optionFilterProp="children"
            dropdownMenuStyle={{ backgroundColor: "#333", color: "#ddd" }}
            dropdownStyle={{ backgroundColor: "#333", color: "#ddd" }}
            className="selectQtde"
          >
            <Select.Option value="jack">Jack</Select.Option>
            <Select.Option value="lucy">Lucy</Select.Option>
            <Select.Option value="tom">Tom</Select.Option>
          </Select>
          <InputGroup.Append className="inputAtivoAppend">
            <span className="input-group-text iconeProcurar divClicavel iconePesquisarBoletas">
              +
            </span>
          </InputGroup.Append>
        </InputGroup>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            if (props.ordemAtual)
              props.finalizarAMercadoAction(props.ordemAtual.id);
            else alert("Selecione uma ordem");
          }}
        >
          <img src={iconeFinalizarAMercado} width="40" alt=""></img>
          <h6>Finalizar a Mercado</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "duplicar")}
        >
          <img src={iconeDuplicarOrdem} width="40" alt=""></img>
          <h6>Duplicar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "oposta")}
        >
          <img src={iconeOrdemOposta} width="40" alt=""></img>
          <h6>Ordem Oposta</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "reabrir")}
        >
          <img src={iconeReabrir} width="40" alt=""></img>
          <h6>Reabrir</h6>
        </div>
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => {
            props.mudarVariavelOrdensExecAction("opcoesOrdemAberto", false);
            props.mudarVariavelOrdensExecAction("ordemAtual", null);
          }}
        >
          <img src={iconeFecharMenuOpcoesOrdem} width="40" alt=""></img>
        </div>
      </div>
    );
  }
}

const abrirFormOrdem = (event, props, acao) => {
  if (props.ordemAtual) {
    event.stopPropagation();
    if (props.ordemAtual.operacao === "Multileg")
      props.abrirOrdemNoMultilegAction(props, props.ordemAtual, acao);
  } else alert("Selecione uma ordem");
};

const options = sinal => {
  if (sinal === "+")
    return [
      <option value={100}>+100</option>,
      <option value={200}>+200</option>,
      <option value={500}>+500</option>,
      <option value={1000}>+1K</option>,
      <option value={5000}>+5K</option>,
      <option value={10000}>+10K</option>
    ];
  else
    return [
      <option value={-100}>-100</option>,
      <option value={-200}>-200</option>,
      <option value={-500}>-500</option>,
      <option value={-1000}>-1K</option>,
      <option value={-5000}>-5K</option>,
      <option value={-10000}>-10K</option>
    ];
};

/* <Form.Group>
          <InputFormatado
            placeholder={"Preço"}
            allowNegative
            autoSelect
            tipoInput="precoNegativo"
            step={0.01}
          />
        </Form.Group>
        <Form.Group>
          <InputFormatado
            placeholder={"Qtde"}
            name="qtde"
            tipoInput="quantidade"
            step={100}
            autoSelect
            className="formDespernamento"
          />
        </Form.Group> */
