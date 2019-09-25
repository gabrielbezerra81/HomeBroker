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
  //Demais ordens Limitada, A Mercado e Agendada com apenas 1 ordem principal e 2 ordens next
  else {
    const { gainExec, stopExec } = props;
    montaOfertaPrincipal(props, "", json);
    montaOfertaNext(props, gainDisparo, gainExec, "gain", json);
    montaOfertaNext(props, stopDisparo, stopExec, "stop", json);
  }

  return json;
};

const montaOfertaPrincipal = (props, startStop, json) => {
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
      if (!props.gainDisparo) return;
      ofertaPrincipal.trigger = Number(props.gainDisparo);
      ofertaPrincipal.price = Number(props.gainExec);

      //Ordem 2 Stop
    } else if (startStop === "stop") {
      if (!props.stopDisparo) return;
      ofertaPrincipal.trigger = Number(props.stopDisparo);
      ofertaPrincipal.price = Number(props.stopExec);
    }
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
