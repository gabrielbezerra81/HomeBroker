import { ALERTA_COMPRA, ALERTA_VENDA } from "../../constants/Erros";

const compararCompra = (disparo, execucao) => {
  if (execucao < disparo) return true;
};

const compararVenda = (disparo, execucao) => {
  if (execucao > disparo) return true;
};

export const validacaoCompraAgenda = props => {
  const {
    entradaDisparo,
    entradaExec,
    gainDisparo,
    gainExec,
    stopDisparo,
    stopExec
  } = props;

  if (
    compararCompra(entradaDisparo, entradaExec) ||
    compararCompra(gainDisparo, gainExec) ||
    compararCompra(stopDisparo, stopExec)
  ) {
    alert(ALERTA_COMPRA);
  }
};
