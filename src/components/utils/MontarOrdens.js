export const montaOrdemPrincipal = props => {
  const { date, dadosPesquisa, ordem } = props;

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

  json.offers.push(montaOfertaPrincipal(props));

  return json;
};

const montaOfertaPrincipal = props => {
  const { validadeSelect, date, qtde, dadosPesquisa, ordem } = props;
  const tiposOrdensTrigger = ["Compra Start Stop", "Compra Stop Movel"];

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

  if (tiposOrdensTrigger.includes(ordem.nome)) {
    ofertaPrincipal.trigger = 0;
  }
  return ofertaPrincipal;
};

export const montaOfertaNext = props => {
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
  ordemNext.order.tradeName.name = "";

  //Dados oferta
  ofertaNext.stock.symbol = dadosPesquisa.ativo;
  ofertaNext.expirationType = "GTC";
  ofertaNext.expiration = "9999-01-01T00:00:00.000Z";

  ofertaNext.qtty = qtde;
  ofertaNext.trigger = 0;
  ofertaNext.status = "Suspensa";
  ofertaNext.enabled = false;

  //Obrigatorio para Limitada
  if (props.preco) ofertaNext.price = props.preco;

  if (ordem.tipoOferta === "C") {
    ofertaNext.offerType = "V";
    ofertaNext.orderType = "sellWait";
  } else if (ordem.tipoOferta === "V") {
    ofertaNext.offerType = "C";
    ofertaNext.orderType = "buyWait";
  }

  ordemNext.order.offers.push(ofertaNext);

  return ordemNext;
};
