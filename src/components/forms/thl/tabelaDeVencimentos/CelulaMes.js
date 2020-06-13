import React from "react";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "components/utils/Formatacoes";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import {
  StateStorePrincipal,
  DispatchStorePrincipal,
} from "components/redux/StoreCreation";
import { mudarVariavelTHLAction } from "components/redux/actions/menu_actions/THLActions";
import BookTHL, { selecionarBooks } from "components/forms/thl/BookTHL";

export const CelulaMes = ({ itemColuna, id, ultimaColuna }) => {
  const reduxState = StateStorePrincipal("thl");
  const dispatch = DispatchStorePrincipal();
  const {
    precosTabelaVencimentos,
    booksSelecionados,
    codigoCelulaSelecionada,
  } = reduxState;
  const ativo = itemColuna.symbol;

  let compra, compraQtde, venda, vendaQtde, min, max, qtdeMontar, qtdeDesmont;

  const strike = formatarNumDecimal(itemColuna.strike);
  const ativoStrike = `${ativo.slice(4)} (${strike})`;
  const {
    custodia,
    executando,
    qtdeExecutada,
    qtdeOferta,
  } = VerificaAtivoCustodia(itemColuna);
  const estrutura = id
    ? precosTabelaVencimentos.find(
        (item) =>
          item.id === id &&
          item.components.some((comp) => comp.stock.symbol === ativo)
      )
    : null;

  let precosColuna, precosPar;
  let booksMontar = [],
    booksDesmontar = [];

  if (estrutura) {
    max = formatarNumDecimal(estrutura.max);
    min = formatarNumDecimal(estrutura.min);

    if (estrutura.components[0].stock.symbol === ativo) {
      precosColuna = estrutura.components[0];
      precosPar = estrutura.components[1];
    } else {
      precosColuna = estrutura.components[1];
      precosPar = estrutura.components[0];
    }
  }

  if (precosColuna && precosPar) {
    compra = formatarNumDecimal(precosColuna.compra);
    compraQtde = formatarQuantidadeKMG(precosColuna.compraQtde);
    venda = formatarNumDecimal(precosColuna.venda);
    vendaQtde = formatarQuantidadeKMG(precosColuna.vendaQtde);

    qtdeMontar = formatarQuantidadeKMG(
      Math.min(precosColuna.compraQtde, precosPar.vendaQtde)
    );
    qtdeDesmont = formatarQuantidadeKMG(
      Math.min(precosColuna.vendaQtde, precosPar.compraQtde)
    );

    booksMontar = [
      { ativo: precosColuna.stock.symbol, tipo: "venda" },
      { ativo: precosPar.stock.symbol, tipo: "compra" },
    ];
    booksDesmontar = [
      { ativo: precosColuna.stock.symbol, tipo: "compra" },
      { ativo: precosPar.stock.symbol, tipo: "venda" },
    ];
  }

  const {
    corQtdeExecutando,
    classeCorPrecos,
    celulaSelecionada,
    precosCelulaSelecionada,
  } = classesDinamicas(reduxState, executando, ultimaColuna, estrutura, ativo);

  return (
    <div className="containerColunaMes">
      <div
        tabIndex={0}
        className={`divClicavel containerCelula${celulaSelecionada}`}
        onClick={() =>
          selecionarCelula({ dispatch, ativo, id, codigoCelulaSelecionada })
        }
      >
        <div
          className={`itemAtivosQtde ${
            custodia ? "itemAtivosQtdeCustodia" : ""
          }`}
        >
          <div className="itemAtivos">
            {renderModelo(itemColuna.model)}
            {ativoStrike} | id:{id}
          </div>
          {custodia ? (
            <div className={`itemQtde${corQtdeExecutando}`}>{qtdeOferta}</div>
          ) : null}
        </div>

        {precosColuna ? (
          <div className="bookAtivoTHL roxoTextoTHL">
            <BookTHL
              preco={compra}
              qtde={compraQtde}
              tipo="venda"
              ativo={ativo}
            />
            <BookTHL
              preco={venda}
              qtde={vendaQtde}
              tipo="compra"
              ativo={ativo}
            />
          </div>
        ) : null}
      </div>

      <div
        className={`containerPrecoMontDesmont${classeCorPrecos}${precosCelulaSelecionada}`}
      >
        {!ultimaColuna && estrutura ? (
          <>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                selecionarBooks({
                  booksSelecionados,
                  novosBooks: booksMontar,
                  dispatch,
                })
              }
            >
              {max} | {qtdeMontar}
            </div>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                selecionarBooks({
                  booksSelecionados,
                  novosBooks: booksDesmontar,
                  dispatch,
                })
              }
            >
              {min} | {qtdeDesmont}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const renderModelo = (modelo) => {
  return (
    <div className="mr-1">
      {modelo === "EUROPEAN" ? (
        <img src={imgModeloEU} alt="" className="imgModeloTHL" />
      ) : (
        <ImgModeloUSA
          viewBox="6 -1 17 17"
          className="imgModeloTHL"
        ></ImgModeloUSA>
      )}
    </div>
  );
};

const VerificaAtivoCustodia = (itemColuna) => {
  let executando = false;
  let custodia = false;
  let qtdeExecutada = 0;
  let qtdeOferta = 0;
  const ativoCelula = itemColuna.symbol;
  const reduxState = StateStorePrincipal("posicao");
  const { posicoesCustodia } = reduxState;
  executando = posicoesCustodia.some((posicao) => {
    const execCompra = posicao.custodiaCompra.find(
      (custCompra) => custCompra.ativo === ativoCelula
    );
    const execVenda = posicao.custodiaVenda.find(
      (custVenda) => custVenda.ativo === ativoCelula
    );
    const condicaoCust = posicao.ativos.some(
      (ativo) => ativo.symbol === ativoCelula
    );
    const condicaoExec = execCompra || execVenda;
    if (condicaoCust) custodia = true;
    if (execCompra) {
      qtdeExecutada = execCompra.qtdeExecutada;
      qtdeOferta = execCompra.qtdeOferta;
    } else if (execVenda) {
      qtdeExecutada = execVenda.qtdeExecutada;
      qtdeOferta = execVenda.qtdeOferta;
    }

    return condicaoExec;
  });

  return { executando, custodia, qtdeExecutada, qtdeOferta };
};

const calculaCorPreco = (reduxState, estrutura) => {
  let classe = "";
  const { seletorMapaCalor, faixasMapaCalor } = reduxState;

  if (
    ["montar", "desmontar"].includes(seletorMapaCalor) &&
    faixasMapaCalor &&
    estrutura
  ) {
    const valor =
      seletorMapaCalor === "montar"
        ? +estrutura.max.toFixed(2)
        : +estrutura.min.toFixed(2);
    const indice = faixasMapaCalor.findIndex((faixa) => {
      const min = faixa.min;
      const max = faixa.max;

      return valor >= min && valor <= max;
    });
    if (indice !== -1) classe = ` faixa${indice + 1}Mapa`;
  }

  return classe;
};

const classesDinamicas = (
  reduxState,
  executando,
  ultimaColuna,
  estrutura,
  ativo
) => {
  const { codigoCelulaSelecionada } = reduxState;
  const corQtdeExecutando = executando ? " ativoExecutando" : "";
  const classeCorPrecos = ultimaColuna
    ? ""
    : calculaCorPreco(reduxState, estrutura);
  let celulaSelecionada = "";
  let precosCelulaSelecionada = "";
  if (codigoCelulaSelecionada === ativo) {
    celulaSelecionada = " celulaSelecionada";
    precosCelulaSelecionada = " precosCelulaSelecionada";
  }

  return {
    corQtdeExecutando,
    classeCorPrecos,
    celulaSelecionada,
    precosCelulaSelecionada,
  };
};

export const selecionarCelula = (props) => {
  const { ativo, codigoCelulaSelecionada, id, dispatch } = props;
  let novoCodigo = "";
  let novoID = null;
  if (ativo !== codigoCelulaSelecionada) {
    novoCodigo = ativo;
    novoID = id;
  }
  dispatch(mudarVariavelTHLAction("codigoCelulaSelecionada", novoCodigo));
  dispatch(mudarVariavelTHLAction("idCelulaSelecionada", novoID));
};
