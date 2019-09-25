import { cloneDeep } from "lodash";

const tiposOrdensTrigger = ["Compra Start Stop", "Venda Start Stop"];

export const montaOrdemPrincipal = props => {
  const { date, dadosPesquisa, ordem, gainDisparo, stopDisparo } = props;

  let json = {
    account: {},
    stock: {},
    tradeName: {},
    offers: [],
    next: []
  };

  //Dados da ordem
  json.account.id = 1;
  json.enabled = true;
  json.multiStocks = false;
  json.expiration = date;
  json.status = "Nova";
  json.priority = 0;
  json.stock.symbol = dadosPesquisa.ativo;
  json.tradeName.name = ordem.nome;

  //StartStop pode ter 2 ordens principais e até 4 ordens next
  if (tiposOrdensTrigger.includes(ordem.nome)) {
    if (gainDisparo) json.offers.push(montaOfertaPrincipal(props, "start"));
    if (stopDisparo) json.offers.push(montaOfertaPrincipal(props, "stop"));
  }
  //Demais ordens Limitada, A Mercado e Agendada com apenas 1 ordem principal e 2 ordens next
  else {
    json.offers.push(montaOfertaPrincipal(props, ""));
  }
  json.next = [...montaOfertaNext(props)];

  return json;
};

const montaOfertaPrincipal = (props, startStop) => {
  const { validadeSelect, date, qtde, dadosPesquisa, ordem } = props;

  let ofertaPrincipal = {
    stock: {}
  };
  //Dados ofertas Limitada, Mercado, Agendada, Start Stop, Stop Móvel
  ofertaPrincipal.stock.symbol = dadosPesquisa.ativo;
  ofertaPrincipal.expirationType = validadeSelect;
  ofertaPrincipal.expiration = date;
  ofertaPrincipal.qtty = Number(qtde);
  ofertaPrincipal.status = "Nova";
  ofertaPrincipal.enabled = true;
  ofertaPrincipal.orderType = ordem.tipoOrdem;
  ofertaPrincipal.offerType = ordem.tipoOferta;

  //Obrigatorio para Limitada
  if (props.preco) ofertaPrincipal.price = Number(props.preco);

  //Agendada
  if (props.entradaDisparo) {
    ofertaPrincipal.trigger = Number(props.entradaDisparo);
    if (props.entradaExec) {
      ofertaPrincipal.price = Number(props.entradaExec);
    }
  }

  //StartStop
  if (tiposOrdensTrigger.includes(ordem.nome)) {
    //Ordem 1 Start
    if (startStop === "start") {
      ofertaPrincipal.trigger = Number(props.gainDisparo);
      ofertaPrincipal.price = Number(props.gainExec);

      //Ordem 2 Stop
    } else if (startStop === "stop") {
      ofertaPrincipal.trigger = Number(props.stopDisparo);
      ofertaPrincipal.price = Number(props.stopExec);
    }
  }
  return ofertaPrincipal;
};

export const montaOfertaNext = props => {
  const {
    qtde,
    dadosPesquisa,
    ordem,
    gainDisparo,
    stopDisparo,
    gainExec,
    stopExec
  } = props;

  let next = [];

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
  ordemNext.order.expiration = "9999-01-01T00:00:00.000Z";
  ordemNext.order.status = "Suspensa";
  ordemNext.order.priority = 0;
  ordemNext.order.stock.symbol = dadosPesquisa.ativo;
  //Dados oferta
  ofertaNext.stock.symbol = dadosPesquisa.ativo;
  ofertaNext.expirationType = "GTC";
  ofertaNext.expiration = "9999-01-01T00:00:00.000Z";
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
  let ordemNext2 = cloneDeep(ordemNext);
  let ofertaNext2 = cloneDeep(ofertaNext);


  if (tiposOrdensTrigger.includes(ordem.nome)) {
    const {gainDisparoConfig1, gainExecConfig1,stopDisparoConfig1,stopExecConfig1,gainDisparoConfig2,gainExecConfig2,stopDisparoConfig2,stopExecConfig2} = props
    let ordemNext3 = cloneDeep(ordemNext);
    let ofertaNext3 = cloneDeep(ofertaNext);
    let ordemNext4 = cloneDeep(ordemNext);
    let ofertaNext4 = cloneDeep(ofertaNext);

    helperMontarNext(gainDisparoConfig1, gainExecConfig1, ordem, ordemNext, ofertaNext, "gain", next);
    helperMontarNext(stopDisparoConfig1, stopExecConfig1, ordem, ordemNext2, ofertaNext2, "st", next);
    helperMontarNext(gainDisparoConfig2, gainExecConfig2, ordem, ordemNext3, ofertaNext3, "gain", next);
    helperMontarNext(stopDisparoConfig2, stopExecConfig2, ordem, ordemNext4, ofertaNext4, "st", next);
    
  }else{
    helperMontarNext(gainDisparo, gainExec, ordem, ordemNext, ofertaNext, "gain", next);
    helperMontarNext(stopDisparo, stopExec, ordem, ordemNext2, ofertaNext2, "st", next);
  }

  return next;
};

const helperMontarNext = (
  disparo,
  execucao,
  ordem,
  ordemNext,
  ofertaNext,
  tipo,
  next
) => {
  if(disparo){
    if (tipo === "gain") {
    if (ordem.tipoOferta === "C")
      ordemNext.order.tradeName.name = "Venda Stop Gain";
    else if (ordem.tipoOferta === "V")
      ordemNext.order.tradeName.name = "Compra Stop Gain";

    ofertaNext.trigger = Number(disparo);
    if (execucao) ofertaNext.price = Number(execucao);
    ordemNext.order.offers.push(ofertaNext);
  } else if (tipo === "st") {
    if (ordem.tipoOferta === "C")
      ordemNext.order.tradeName.name = "Venda Stop Loss";
    else if (ordem.tipoOferta === "V")
      ordemNext.order.tradeName.name = "Compra Stop Loss";

    ofertaNext.trigger = Number(disparo);
    if (execucao) ofertaNext.price = Number(execucao);
    ordemNext.order.offers.push(ofertaNext);
  }
  next.push(ordemNext);
}
return null
};
