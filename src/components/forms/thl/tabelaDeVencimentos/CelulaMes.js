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

  const strike = formatarNumDecimal(itemColuna.strike);
  const ativoStrike = `${itemColuna.symbol.slice(4)} (${strike})`;
  const custodia = verificaAtivoCustodia(itemColuna);
  const estrutura = precosTabelaVencimentos.find((item) =>
    item.components.some((comp) => comp.id === itemColuna.id)
  );

  let precosColuna;
  let precosPar;

  if (estrutura) {
    if (estrutura.components[0].id === itemColuna.id) {
      precosColuna = estrutura.components[0];
      precosPar = estrutura.components[1];
    } else {
      precosColuna = estrutura.components[1];
      precosPar = estrutura.components[0];
    }
  }

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
          {custodia ? <div className="itemQtde">{300}</div> : null}
        </div>

        {precosColuna ? (
          <div className="bookAtivoTHL roxoTextoTHL">
            <div className="divClicavel" tabIndex={0}>
              {formatarNumDecimal(precosColuna.compra)} |{" "}
              {formatarQuantidadeKMG(precosColuna.compraQtde)}
            </div>
            <div className="divClicavel" tabIndex={0}>
              {formatarNumDecimal(precosColuna.venda)} |{" "}
              {formatarQuantidadeKMG(precosColuna.vendaQtde)}
            </div>
          </div>
        ) : null}
      </div>

      <div className="containerPrecoMontDesmont">
        {estrutura ? (
          <div>
            <div className="divClicavel" tabIndex={0}>
              {formatarNumDecimal(estrutura.max)} |{" "}
              {formatarQuantidadeKMG(
                Math.min(precosColuna.compraQtde, precosPar.vendaQtde)
              )}
            </div>
            <div className="divClicavel" tabIndex={0}>
              {formatarNumDecimal(estrutura.min)} |{" "}
              {formatarQuantidadeKMG(
                Math.min(precosColuna.vendaQtde, precosPar.compraQtde)
              )}
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

const verificaAtivoCustodia = (itemColuna) => {
  let custodia = false;

  return custodia;
};
