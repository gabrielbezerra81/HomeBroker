import {
  erro_validar_ativo,
  erro_validar_qtde,
  erro_validar_disparo_start_movel
} from "constants/AlertaErros";
import { getformatedDate } from "components/utils/Formatacoes";

const CVStartStop = ["Compra Start Stop", "Venda Start Stop"];
const CVStopMovel = ["Compra Stop Móvel", "Venda Stop Móvel"];

export const validarOrdemBoleta = props => {
  const { dadosPesquisa, qtde } = props;
  let valido = true;

  if (!dadosPesquisa.ativo) {
    alert(erro_validar_ativo);
    valido = false;
  }
  if (Number(qtde) === 0) {
    alert(erro_validar_qtde);
    valido = false;
  }

  if (CVStopMovel.includes(props.ordem.nome)) {
    if (props.inicioDisparo > props.stopDisparo)
      alert(erro_validar_disparo_start_movel);
  }
  return valido;
};

export const montaOrdemPrincipal = props => {
  const { date, ordem, gainDisparo, stopDisparo, validadeSelect } = props;

  let json = {
    account: {},
    tradeName: {},
    offers: [],
    next: []
  };

  //Dados da ordem
  json.account.id = 1;
  json.enabled = true;
  json.multiStocks = false;
  json.expiration = date.toLocaleString("pt-BR");
  if (validadeSelect === "DAY")
    json.expiration = getformatedDate(new Date()) + " 22:00:00";

  json.status = "Nova";
  json.priority = 0;
  json.tradeName.name = ordem.nome;
  json.formName = ordem.nome;

  //StartStop pode ter 2 ordens principais e até 4 ordens next
  if (CVStartStop.includes(ordem.nome)) {
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
      stopExecConfig2
    } = props;

    montaOfertaNext(props, gainDisparoConfig1, gainExecConfig1, "gain", json);
    montaOfertaNext(props, stopDisparoConfig1, stopExecConfig1, "stop", json);
    montaOfertaNext(props, gainDisparoConfig2, gainExecConfig2, "gain", json);
    montaOfertaNext(props, stopDisparoConfig2, stopExecConfig2, "stop", json);
  }
  //CV Stop Movel
  else if (CVStopMovel.includes(ordem.nome)) {
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
  const { validadeSelect, date, qtde, dadosPesquisa, ordem } = props;

  let ofertaPrincipal = {
    stock: {}
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
      ofertaPrincipal.priority = tabelaOrdens.length;
      ofertaPrincipal.trigger = Number(inicioDisparo);
      ofertaPrincipal.price = Number(ajustePadrao);
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
  ofertaPrincipal.orderType = ordem.tipoOrdem;
  ofertaPrincipal.offerType = ordem.tipoOferta;

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
  else if (CVStartStop.includes(ordem.nome)) {
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
  else if (CVStopMovel.includes(ordem.nome)) {
    ofertaPrincipal.priority = -1;
    ofertaPrincipal.trigger = Number(props.stopDisparo);
    ofertaPrincipal.price = Number(props.stopExec);
  }

  json.offers.push(ofertaPrincipal);
};

export const montaOfertaNext = (props, disparo, execucao, tipo, json) => {
  const { qtde, dadosPesquisa, ordem } = props;

  let ordemNext = {
    action: "Enable",
    order: {
      account: {},
      stock: {},
      tradeName: {},
      offers: []
    }
  };
  let ofertaNext = {
    stock: {}
  };

  //Dados Ordem
  ordemNext.order.account.id = 1;
  ordemNext.order.enabled = false;
  ordemNext.order.multiStocks = false;
  ordemNext.order.expiration = new Date(
    "9999-01-01T00:00:00.000Z"
  ).toLocaleString("pt-BR");
  ordemNext.order.status = "Suspensa";
  ordemNext.order.priority = 0;
  ordemNext.order.stock.symbol = dadosPesquisa.ativo;
  //Dados oferta
  ofertaNext.stock.symbol = dadosPesquisa.ativo;
  ofertaNext.expirationType = "GTC";
  ofertaNext.expiration = new Date("9999-01-01T00:00:00.000Z").toLocaleString(
    "pt-BR"
  );
  ofertaNext.qtty = Number(qtde);
  ofertaNext.status = "Suspensa";
  ofertaNext.enabled = false;

  if (ordem.tipoOferta === "C") {
    ofertaNext.offerType = "V";
    ofertaNext.orderType = "sellWait";
  } else if (ordem.tipoOferta === "V") {
    ofertaNext.offerType = "C";
    ofertaNext.orderType = "buyWait";
  }

  if (disparo) {
    if (tipo === "gain") {
      if (ordem.tipoOferta === "C")
        ordemNext.order.tradeName.name = "Venda Stop Gain";
      else if (ordem.tipoOferta === "V")
        ordemNext.order.tradeName.name = "Compra Stop Gain";

      ofertaNext.trigger = Number(disparo);
      if (execucao) ofertaNext.price = Number(execucao);
      ordemNext.order.offers.push(ofertaNext);
    } else if (tipo === "stop") {
      if (ordem.tipoOferta === "C")
        ordemNext.order.tradeName.name = "Venda Stop Loss";
      else if (ordem.tipoOferta === "V")
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
