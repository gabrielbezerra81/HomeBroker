const tiposOrdensTrigger = [
  "Compra Start Stop",
  "Compra Stop Movel",
  "Venda Start Stop",
  "Compra Stop Movel"
];

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
    if (gainDisparo) json.next.push(montaOfertaNext(props, "gain"));
    if (stopDisparo) json.next.push(montaOfertaNext(props, "loss"));
  }

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

export const montaOfertaNext = (props, tipo) => {
  const {
    qtde,
    dadosPesquisa,
    ordem,
    gainDisparo,
    stopDisparo,
    gainExec,
    stopExec
  } = props;

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
    if (tipo === "gain") {
      ordemNext.order.tradeName.name = "Venda Stop Gain";
    } else if (tipo === "loss") {
      ordemNext.order.tradeName.name = "Venda Stop Loss";
    }
  } else if (ordem.tipoOferta === "V") {
    ofertaNext.offerType = "C";
    ofertaNext.orderType = "buyWait";
    if (tipo === "gain") {
      ordemNext.order.tradeName.name = "Compra Stop Gain";
    } else if (tipo === "loss") {
      ordemNext.order.tradeName.name = "Compra Stop Loss";
    }
  }

  if (tipo === "gain") {
    ofertaNext.trigger = Number(gainDisparo);
    if (gainExec) ofertaNext.price = Number(gainExec);
  } else if (tipo === "loss") {
    ofertaNext.trigger = Number(stopDisparo);
    if (stopDisparo) ofertaNext.price = Number(stopExec);
  }

  ordemNext.order.offers.push(ofertaNext);

  return ordemNext;
};
