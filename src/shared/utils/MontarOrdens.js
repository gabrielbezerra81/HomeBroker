import {
  erro_validar_ativo,
  erro_validar_qtde,
  erro_validar_disparo_start_movel,
  erro_validar_contaSelecionada,
} from "constants/AlertaErros";
import { toast } from "react-toastify";
import { getformatedDate } from "shared/utils/Formatacoes";

const CVStartStop = ["Compra Start Stop", "Venda Start Stop"];
const CVStopMovel = ["Compra Stop Móvel", "Venda Stop Móvel"];

export const validarOrdemBoleta = (props, selectedAccount) => {
  const { dadosPesquisa, qtde, orderInfo } = props;
  let valido = true;

  if (!dadosPesquisa.ativo) {
    valido = false;
    toast.error(erro_validar_ativo);
  }
  if (Number(qtde) === 0) {
    valido = false;
    toast.error(erro_validar_qtde);
  }

  if (CVStopMovel.includes(orderInfo.nome)) {
    if (props.inicioDisparo > props.stopDisparo) {
      valido = false;
      toast.error(erro_validar_disparo_start_movel);
    }
  }

  if (!selectedAccount) {
    valido = false;
    toast.error(erro_validar_contaSelecionada);
  }

  return valido;
};

export const montaOrdemPrincipal = (props, selectedAccount) => {
  const {
    date,
    orderInfo,
    gainDisparo,
    stopDisparo,
    validadeSelect,
    orderId,
  } = props;

  let json = {
    account: {},
    tradeName: {},
    offers: [],
    next: [],
  };

  if (orderId) {
    json.id = orderId;
  }

  //Dados da ordem
  json.account.id = selectedAccount.id;
  json.enabled = true;
  json.multiStocks = false;
  json.expiration = date.toLocaleString("pt-BR");
  if (validadeSelect === "DAY")
    json.expiration = getformatedDate(new Date()) + " 22:00:00";

  json.status = "Nova";
  json.priority = 0;
  json.tradeName.name = orderInfo.nome;
  json.formName = orderInfo.nome;

  //StartStop pode ter 2 ordens principais e até 4 ordens next
  if (CVStartStop.includes(orderInfo.nome)) {
    montaOfertaPrincipal(props, "start", json);
    montaOfertaPrincipal(props, "stop", json);
    const {
      gainDisparoConfig1,
      gainExecConfig1,
      stopDisparoConfig1,
      stopExecConfig1,
      gainDisparoConfig2,
      gainExecConfig2,
      stopDisparoConfig2,
      stopExecConfig2,
    } = props;

    montaOfertaNext(props, gainDisparoConfig1, gainExecConfig1, "gain", json);
    montaOfertaNext(props, stopDisparoConfig1, stopExecConfig1, "stop", json);
    montaOfertaNext(props, gainDisparoConfig2, gainExecConfig2, "gain", json);
    montaOfertaNext(props, stopDisparoConfig2, stopExecConfig2, "stop", json);
  }
  //CV Stop Movel
  else if (CVStopMovel.includes(orderInfo.nome)) {
    const { tabelaOrdens } = props;

    montaOfertaPrincipal(props, "", json);

    tabelaOrdens.forEach((item, index) => {
      montaOfertaPrincipal(props, "ajusteOfertaAdicional", json, index);
    });
    montaOfertaPrincipal(props, "SegundaOrdem", json);
  }
  //Demais ordens Limitada, A Mercado e Agendada com apenas 1 ordem principal e 2 ordens next
  else {
    const { gainExec, stopExec } = props;
    montaOfertaPrincipal(props, "", json);
    montaOfertaNext(props, gainDisparo, gainExec, "gain", json);
    montaOfertaNext(props, stopDisparo, stopExec, "stop", json);
  }

  return json;
};

const montaOfertaPrincipal = (props, tipoAuxiliar, json, numAjuste = 0) => {
  const { validadeSelect, date, qtde, dadosPesquisa, orderInfo } = props;

  let ofertaPrincipal = {
    stock: {},
  };

  ofertaPrincipal.status = "Nova";
  ofertaPrincipal.enabled = true;
  ofertaPrincipal.stock.symbol = dadosPesquisa.ativo;

  //2º Oferta e ofertas adicionais CV Stop Movel

  if (
    tipoAuxiliar === "ajusteOfertaAdicional" ||
    tipoAuxiliar === "SegundaOrdem"
  ) {
    const { tabelaOrdens, inicioDisparo, ajustePadrao } = props;

    ofertaPrincipal.orderType = "ajuste";
    if (
      tipoAuxiliar === "ajusteOfertaAdicional" &&
      tabelaOrdens[numAjuste].tipo === "real"
    ) {
      ofertaPrincipal.priority = numAjuste;
      ofertaPrincipal.trigger = Number(tabelaOrdens[numAjuste].disparo);
      ofertaPrincipal.price = Number(tabelaOrdens[numAjuste].ajuste);
    } else {
      const ajusteP = Number(ajustePadrao);
      const tamTabela = tabelaOrdens.length;
      let disparo = 0;
      ofertaPrincipal.priority = tamTabela;
      ofertaPrincipal.price = ajusteP;

      if (tamTabela === 0) disparo = Number(inicioDisparo);
      else {
        const ultimaLinha = tabelaOrdens[tamTabela - 1];
        if (orderInfo.tipoOferta === "C")
          disparo = ultimaLinha.disparo - ultimaLinha.ajuste;
        else disparo = ultimaLinha.disparo + ultimaLinha.ajuste;
      }
      ofertaPrincipal.trigger = Number(disparo.toFixed(2));
    }

    json.offers.push(ofertaPrincipal);

    return;
  }

  //Dados ofertas Limitada, Mercado, Agendada, Start Stop, Stop Móvel
  ofertaPrincipal.expirationType = validadeSelect;
  ofertaPrincipal.expiration = date.toLocaleString("pt-BR");
  if (validadeSelect === "DAY")
    ofertaPrincipal.expiration = getformatedDate(new Date()) + " 22:00:00";
  ofertaPrincipal.qtty = Number(qtde);
  ofertaPrincipal.orderType = orderInfo.tipoOrdem;
  ofertaPrincipal.offerType = orderInfo.tipoOferta;

  //Limitada
  if (props.preco) ofertaPrincipal.price = Number(props.preco);
  //Agendada
  else if (props.entradaDisparo) {
    ofertaPrincipal.trigger = Number(props.entradaDisparo);
    if (props.entradaExec) {
      ofertaPrincipal.price = Number(props.entradaExec);
    }
  }
  //StartStop
  else if (CVStartStop.includes(orderInfo.nome)) {
    //Ordem 1 Start
    if (tipoAuxiliar === "start") {
      if (!props.gainDisparo) return;
      ofertaPrincipal.trigger = Number(props.gainDisparo);
      ofertaPrincipal.price = Number(props.gainExec);

      //Ordem 2 Stop
    } else if (tipoAuxiliar === "stop") {
      if (!props.stopDisparo) return;
      ofertaPrincipal.trigger = Number(props.stopDisparo);
      ofertaPrincipal.price = Number(props.stopExec);
    }
  }
  //CV Stop Movel 1ª ordem
  else if (CVStopMovel.includes(orderInfo.nome)) {
    ofertaPrincipal.priority = -1;
    ofertaPrincipal.trigger = Number(props.stopDisparo);
    ofertaPrincipal.price = Number(props.stopExec);
  }

  json.offers.push(ofertaPrincipal);
};

export const montaOfertaNext = (props, disparo, execucao, tipo, json) => {
  const { qtde, dadosPesquisa, orderInfo } = props;

  let ordemNext = {
    action: "Enable",
    order: {
      account: {},
      stock: {},
      tradeName: {},
      offers: [],
    },
  };
  let ofertaNext = {
    stock: {},
  };

  //Dados Ordem
  ordemNext.order.account.id = 1;
  ordemNext.order.enabled = false;
  ordemNext.order.multiStocks = false;
  ordemNext.order.expiration = new Date(
    "9999-01-01T00:00:00.000Z",
  ).toLocaleString("pt-BR");
  ordemNext.order.status = "Suspensa";
  ordemNext.order.priority = 0;
  ordemNext.order.stock.symbol = dadosPesquisa.ativo;
  //Dados oferta
  ofertaNext.stock.symbol = dadosPesquisa.ativo;
  ofertaNext.expirationType = "GTC";
  ofertaNext.expiration = new Date("9999-01-01T00:00:00.000Z").toLocaleString(
    "pt-BR",
  );
  ofertaNext.qtty = Number(qtde);
  ofertaNext.status = "Suspensa";
  ofertaNext.enabled = false;

  if (orderInfo.tipoOferta === "C") {
    ofertaNext.offerType = "V";
    ofertaNext.orderType = "sellWait";
  } else if (orderInfo.tipoOferta === "V") {
    ofertaNext.offerType = "C";
    ofertaNext.orderType = "buyWait";
  }

  if (disparo) {
    if (tipo === "gain") {
      if (orderInfo.tipoOferta === "C")
        ordemNext.order.tradeName.name = "Venda Stop Gain";
      else if (orderInfo.tipoOferta === "V")
        ordemNext.order.tradeName.name = "Compra Stop Gain";

      ofertaNext.trigger = Number(disparo);
      if (execucao) ofertaNext.price = Number(execucao);
      ordemNext.order.offers.push(ofertaNext);
    } else if (tipo === "stop") {
      if (orderInfo.tipoOferta === "C")
        ordemNext.order.tradeName.name = "Venda Stop Loss";
      else if (orderInfo.tipoOferta === "V")
        ordemNext.order.tradeName.name = "Compra Stop Loss";

      ofertaNext.trigger = Number(disparo);
      if (execucao) ofertaNext.price = Number(execucao);
      ordemNext.order.offers.push(ofertaNext);
    }
    json.next.push(ordemNext);
    return ordemNext;
  }
  return null;
};
