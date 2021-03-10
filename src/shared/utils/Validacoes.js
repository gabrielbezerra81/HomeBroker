import { toast } from "react-toastify";
import { ALERTA_COMPRA } from "../../constants/AlertaErros";

const compararCompra = (disparo, execucao) => {
  if (execucao < disparo) return true;
};

/*const compararVenda = (disparo, execucao) => {
  if (execucao > disparo) return true;
};*/

export const validacaoCompraAgenda = (props) => {
  const {
    entradaDisparo,
    entradaExec,
    gainDisparo,
    gainExec,
    stopDisparo,
    stopExec,
  } = props;

  if (
    compararCompra(entradaDisparo, entradaExec) ||
    compararCompra(gainDisparo, gainExec) ||
    compararCompra(stopDisparo, stopExec)
  ) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};

export const validacaoCompraLimitada = (props) => {
  const { gainDisparo, gainExec, stopDisparo, stopExec } = props;

  if (
    compararCompra(gainDisparo, gainExec) ||
    compararCompra(stopDisparo, stopExec)
  ) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};

export const validacaoCompraMercado = (props) => {
  const { gainDisparo, gainExec, stopDisparo, stopExec } = props;

  if (
    compararCompra(gainDisparo, gainExec) ||
    compararCompra(stopDisparo, stopExec)
  ) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};

export const validacaoCompraStartStop = (props) => {
  const { gainDisparo, gainExec, stopDisparo, stopExec } = props;

  if (
    compararCompra(gainDisparo, gainExec) ||
    compararCompra(stopDisparo, stopExec)
  ) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};

export const validacaoCompraStartMovel = (props) => {
  const { stopDisparo, stopExec } = props;

  if (compararCompra(stopDisparo, stopExec)) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};

export const validacaoCompraGainReducao = (props) => {
  const { gainDisparo, gainExec } = props;

  if (compararCompra(gainDisparo, gainExec)) {
    toast.error(ALERTA_COMPRA);
    return false;
  } else return true;
};
