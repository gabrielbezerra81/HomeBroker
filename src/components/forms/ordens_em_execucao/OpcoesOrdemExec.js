import React from "react";
import { Form } from "react-bootstrap";
import InputFormatado from "components/utils/InputFormatado";

export default class OpcoesOrdemExec extends React.Component {
  render() {
    const { props } = this;
    return (
      <div className="containerOpcoesOrdem mcontent">
        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => props.cancelarOrdemExecAction(props.ordemAtual.id)}
        >
          <h6>Cancelar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "")}
        >
          <h6>Editar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={() => props.finalizarAMercadoAction(props.ordemAtual.id)}
        >
          <h6>Finalizar a Mercado</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "duplicar")}
        >
          <h6>Duplicar Ordem</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "oposta")}
        >
          <h6>Ordem Oposta</h6>
        </div>

        <div
          className="divClicavel"
          tabIndex={0}
          onClick={e => abrirFormOrdem(e, props, "reabrir")}
        >
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
          <h6>x</h6>
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
  }
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
