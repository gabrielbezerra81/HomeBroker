import React, { useMemo } from "react";
import {
  formatarNumDecimal,
  formatarQuantidadeKMG,
} from "shared/utils/Formatacoes";
import imgModeloEU from "assets/modeloEU.png";
import { ReactComponent as ImgModeloUSA } from "assets/modeloUSA2.svg";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { mudarVariavelTHLAction } from "redux/actions/thl/THLActions";
import BookTHL, { selecionarBooks } from "telas/popups/thl/BookTHL";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

export const BodyContentCell = ({ cellData, id, isLastColumn }) => {
  const {
    thlReducer: thlState,
    positionReducer: { posicoesCustodia },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();
  const {
    precosTabelaVencimentos,
    booksSelecionados,
    codigoCelulaSelecionada,
  } = thlState;

  const symbol = cellData.symbol;

  const symbolStrike = `${symbol.slice(4)} (${formatarNumDecimal(
    cellData.strike,
  )})`;

  const { isCustody, isExecuting, execQtty, offerQtty } = useMemo(() => {
    return checkIsCutody(symbol, posicoesCustodia);
  }, [symbol, posicoesCustodia]);

  const structure = useMemo(
    () => findStructureByIdAndSymbol(precosTabelaVencimentos, id, symbol),
    [precosTabelaVencimentos, id, symbol],
  );

  const { mountBook, demountBook, prices, cellHasPrices } = useMemo(
    () => calculatePricesBooks(structure, symbol),
    [structure, symbol],
  );

  const styles = useMemo(
    () =>
      getStyleClasses({
        thlState,
        isExecuting,
        isLastColumn,
        structure,
        symbol,
      }),
    [thlState, isExecuting, isLastColumn, structure, symbol],
  );

  return (
    <div className="containerColunaMes">
      <div
        tabIndex={0}
        className={`divClicavel containerCelula${styles.selectedCell}`}
        onClick={() =>
          selectCell({
            dispatch,
            symbol,
            id,
            selectedCellSymbol: codigoCelulaSelecionada,
          })
        }
      >
        <div
          className={`itemAtivosQtde ${
            isCustody ? "itemAtivosQtdeCustodia" : ""
          }`}
        >
          <div className="itemAtivos">
            {ModelImage(cellData.model)}
            {symbolStrike} | id: {id}
          </div>
          {isCustody ? (
            <div className={`itemQtde${styles.yellowQttyIfExecuting}`}>
              {offerQtty}
            </div>
          ) : null}
        </div>

        {cellHasPrices ? (
          <div className="bookAtivoTHL roxoTextoTHL">
            <BookTHL
              preco={prices.buy}
              qtde={prices.buyQtty}
              tipo="venda"
              ativo={symbol}
            />
            <BookTHL
              preco={prices.sell}
              qtde={prices.sellQtty}
              tipo="compra"
              ativo={symbol}
            />
          </div>
        ) : null}
      </div>

      <div className={`containerPrecoMontDesmont${styles.heatMapColor}`}>
        {!isLastColumn && prices ? (
          <>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                selecionarBooks({
                  booksSelecionados,
                  novosBooks: mountBook,
                  dispatch,
                })
              }
            >
              {prices.max} | {prices.mountQtty}
            </div>
            <div
              className="divClicavel"
              tabIndex={0}
              onClick={() =>
                selecionarBooks({
                  booksSelecionados,
                  novosBooks: demountBook,
                  dispatch,
                })
              }
            >
              {prices.min} | {prices.demountQtty}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

const checkIsCutody = (cellSymbol, posicoesCustodia) => {
  let isExecuting = false;
  let isCustody = false;
  let execQtty = 0;
  let offerQtty = 0;

  isExecuting = posicoesCustodia.some((posicao) => {
    const executingBuy = posicao.custodiaCompra.find(
      (custCompra) => custCompra.ativo === cellSymbol,
    );
    const executingSell = posicao.custodiaVenda.find(
      (custVenda) => custVenda.ativo === cellSymbol,
    );
    const custodyCondition = posicao.ativos.some(
      (ativo) => ativo.symbol === cellSymbol,
    );
    const executionCondition = executingBuy || executingSell;
    if (custodyCondition) isCustody = true;
    if (executingBuy) {
      execQtty = executingBuy.qtdeExecutada;
      offerQtty = executingBuy.qtdeOferta;
    } else if (executingSell) {
      execQtty = executingSell.qtdeExecutada;
      offerQtty = executingSell.qtdeOferta;
    }

    return executionCondition;
  });

  return {
    isExecuting,
    isCustody,
    execQtty,
    offerQtty,
  };
};

const findStructureByIdAndSymbol = (priceStructures, id, symbol) => {
  const structure = id
    ? priceStructures.find(
        (priceItem) =>
          priceItem.id === id &&
          priceItem.components.some((comp) => comp.stock.symbol === symbol),
      )
    : null;

  return structure;
};

const ModelImage = (modelName) => {
  return (
    <div className="mr-1">
      {modelName === "EUROPEAN" ? (
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

const calculatePricesBooks = (structure, symbol) => {
  let thisCellPrice, nextCellPrice;

  const columnPrices = {
    prices: null,
    mountBook: null,
    demountBook: null,
    cellHasPrices: false,
  };

  // TODO: verificar presença de atributo com valor 0.0031415f

  if (structure && structure.components.length === 2) {
    const hasForbiddenValue = checkForForbiddenValues(structure);

    if (hasForbiddenValue) return columnPrices;

    const [componentA, componentB] = structure.components;
    columnPrices.prices = {};
    columnPrices.prices.max = formatarNumDecimal(structure.max);
    columnPrices.prices.min = formatarNumDecimal(structure.min);

    if (componentA.stock.symbol === symbol) {
      thisCellPrice = componentA;
      nextCellPrice = componentB;
    } else {
      thisCellPrice = componentB;
      nextCellPrice = componentA;
    }
  }

  if (thisCellPrice) columnPrices.cellHasPrices = true;

  if (thisCellPrice && nextCellPrice) {
    columnPrices.prices.buy = formatarNumDecimal(thisCellPrice.compra);
    columnPrices.prices.buyQtty = formatarQuantidadeKMG(
      thisCellPrice.compraQtde,
    );
    columnPrices.prices.sell = formatarNumDecimal(thisCellPrice.venda);
    columnPrices.prices.sellQtty = formatarQuantidadeKMG(
      thisCellPrice.vendaQtde,
    );

    columnPrices.prices.mountQtty = formatarQuantidadeKMG(
      Math.min(thisCellPrice.compraQtde, nextCellPrice.vendaQtde),
    );
    columnPrices.prices.demountQtty = formatarQuantidadeKMG(
      Math.min(thisCellPrice.vendaQtde, nextCellPrice.compraQtde),
    );

    columnPrices.mountBook = [
      { ativo: thisCellPrice.stock.symbol, tipo: "venda" },
      { ativo: nextCellPrice.stock.symbol, tipo: "compra" },
    ];
    columnPrices.demountBook = [
      { ativo: thisCellPrice.stock.symbol, tipo: "compra" },
      { ativo: nextCellPrice.stock.symbol, tipo: "venda" },
    ];
  }

  return columnPrices;
};

const checkForForbiddenValues = (structure) => {
  let hasForbiddenValue = false;
  const forbiddenValue = "0.0031415f";

  if (structure.max === forbiddenValue || structure.min === forbiddenValue) {
    hasForbiddenValue = true;

    return hasForbiddenValue;
  }

  hasForbiddenValue = structure.components.some((component) => {
    const hasValueInComponent = Object.keys(component).some(
      (key) => component[key] === forbiddenValue,
    );

    return hasValueInComponent;
  });

  return hasForbiddenValue;
};

const getStyleClasses = ({
  thlState,
  isExecuting,
  isLastColumn,
  structure,
  symbol,
}) => {
  const { codigoCelulaSelecionada } = thlState;
  const yellowQttyIfExecuting = isExecuting ? " ativoExecutando" : "";
  const heatMapColor = isLastColumn ? "" : getHeatMapColor(thlState, structure);
  let selectedCell = "";

  if (codigoCelulaSelecionada === symbol) {
    selectedCell = " celulaSelecionada";
  }

  return {
    yellowQttyIfExecuting,
    heatMapColor,
    selectedCell,
  };
};

const getHeatMapColor = (thlState, structure) => {
  let styleClass = "";
  const { seletorMapaCalor, faixasMapaCalor } = thlState;

  if (
    ["montar", "desmontar"].includes(seletorMapaCalor) &&
    faixasMapaCalor &&
    structure
  ) {
    const referenceValue =
      seletorMapaCalor === "montar"
        ? +structure.max.toFixed(2)
        : +structure.min.toFixed(2);
    const index = faixasMapaCalor.findIndex((faixa) => {
      const min = faixa.min;
      const max = faixa.max;

      return referenceValue >= min && referenceValue <= max;
    });
    if (index !== -1) styleClass = ` faixa${index + 1}Mapa`;
  }

  return styleClass;
};

export const selectCell = ({ symbol, selectedCellSymbol, id, dispatch }) => {
  let selectedSymbol = "";
  let selectedId = null;
  if (symbol !== selectedCellSymbol) {
    selectedSymbol = symbol;
    selectedId = id;
  }
  dispatch(mudarVariavelTHLAction("codigoCelulaSelecionada", selectedSymbol));
  dispatch(mudarVariavelTHLAction("idCelulaSelecionada", selectedId));
};
