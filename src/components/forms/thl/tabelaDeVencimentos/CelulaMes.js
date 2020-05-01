import React from "react";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "components/utils/Formatacoes";
import imgModeloEU from "img/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "img/modeloUSA2.svg";
import { StateStorePrincipal } from "components/redux/StoreCreation";

export const CelulaMes = ({ itemColuna }) => {
  const reduxState = StateStorePrincipal().THLReducer;
  const { precosTabelaVencimentos } = reduxState;
  let compra, compraQtde, venda, vendaQtde, min, max, qtdeMontar, qtdeDesmont;

  const strike = formatarNumDecimal(itemColuna.strike);
  const ativoStrike = `${itemColuna.symbol.slice(4)} (${strike})`;
  const { custodia, executando } = VerificaAtivoCustodia(itemColuna);
  const estrutura = precosTabelaVencimentos.find((item) =>
    item.components.some((comp) => comp.stock.symbol === itemColuna.symbol)
  );

  let precosColuna;
  let precosPar;

  if (estrutura) {
    max = formatarNumDecimal(estrutura.max);
    min = formatarNumDecimal(estrutura.min);

    if (estrutura.components[0].stock.symbol === itemColuna.symbol) {
      precosColuna = estrutura.components[0];
      precosPar = estrutura.components[1];
    } else {
      precosColuna = estrutura.components[1];
      precosPar = estrutura.components[0];
    }
  }

  if (precosColuna && precosColuna) {
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
  }
  const corQtdeExecutando = executando ? " ativoExecutando" : "";

  return (
    <div className="containerColunaMes">
      <div>
        <div
          className={`itemAtivosQtde ${
            custodia ? "itemAtivosQtdeCustodia" : ""
          }`}
        >
          <div className="itemAtivos divClicavel" tabIndex={0}>
            {renderModelo(itemColuna.model)}
            {ativoStrike}
          </div>
          {custodia ? (
            <div className={`itemQtde${corQtdeExecutando}`}>{300}</div>
          ) : null}
        </div>

        {precosColuna ? (
          <div className="bookAtivoTHL roxoTextoTHL">
            <div className="divClicavel" tabIndex={0}>
              {compra} | {compraQtde}
            </div>
            <div className="divClicavel" tabIndex={0}>
              {venda} | {vendaQtde}
            </div>
          </div>
        ) : null}
      </div>

      <div className="containerPrecoMontDesmont">
        {estrutura ? (
          <div>
            <div className="divClicavel" tabIndex={0}>
              {max} | {qtdeMontar}
            </div>
            <div className="divClicavel" tabIndex={0}>
              {min} | {qtdeDesmont}
            </div>
          </div>
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
  const ativoCelula = itemColuna.symbol;
  const reduxState = StateStorePrincipal().posicaoReducer;
  const { posicoesCustodia } = reduxState;
  executando = posicoesCustodia.some((posicao) => {
    const condicaoExec =
      posicao.custodiaCompra.some(
        (custCompra) => custCompra.ativo === ativoCelula
      ) ||
      posicao.custodiaVenda.some(
        (custVenda) => custVenda.ativo === ativoCelula
      );
    const condicaoCust = posicao.ativos.some(
      (ativo) => ativo.symbol === ativoCelula
    );
    if (condicaoCust) custodia = true;

    return condicaoExec;
  });

  return { executando, custodia };
};
