import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "./utils";
import {
  listPositionAction,
  startReactivePositionUpdateAction,
  startReactiveEmblemUpdateAction,
  startReactivePositionQuoteUpdateAction,
  startProactivePositionUpdateAction,
  startProactiveEmblemUpdateAction,
  startProactivePositionQuoteUpdateAction,
} from "redux/actions/posicao/PosicaoActions";

const PositionUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenPosition },
    positionReducer: {
      esource_emblem,
      esource_positionQuote: esource_positionQuote,
      interval_emblem: interval_emblem,
      interval_positionQuote: interval_positionQuote,
      posicoesCustodia: positionList,
      arrayPrecos: positionPrices,
      arrayCotacoes: positionQuotes,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousIsOpenPosition = usePrevious(isOpenPosition);
  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousPositionList = usePrevious(positionList);

  // Gerenciar mudanças no modo de atualização
  useEffect(() => {
    function startUpdate() {
      if (updateMode === "reactive") {
        console.log("att reativa da posição");
        dispatch(startReactivePositionUpdateAction());

        if (isOpenPosition) {
          console.log("att reativa de emblemas");
          dispatch(startReactiveEmblemUpdateAction());
          dispatch(startReactivePositionQuoteUpdateAction());
        }
      } //
      else {
        console.log("att proativa da posição");
        dispatch(startProactivePositionUpdateAction());
        if (isOpenPosition) {
          console.log("att proativa de emblemas");
          dispatch(startProactiveEmblemUpdateAction());
          dispatch(startProactivePositionQuoteUpdateAction());
        }
      }
    }

    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (
      hasUpdateConfigChanged &&
      positionList.length &&
      positionPrices.length &&
      positionQuotes.length
    ) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateInterval, updateMode, dispatch]);

  // Listagem inicial da posição ao fazer login
  useEffect(() => {
    dispatch(listPositionAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Disparar atualização inicial
  useEffect(() => {
    // Condição para executar apenas uma vez logo após a listagem inicial
    if (
      Array.isArray(previousPositionList) &&
      previousPositionList.length === 0 &&
      positionList.length
    ) {
      if (updateMode === "reactive") {
        dispatch(startReactivePositionUpdateAction());
      } //
      else {
        dispatch(startProactivePositionUpdateAction());
      }
    }

    // Condição para executar toda vez que abrir o popup de posição
    if (isOpenPosition && positionList.length) {
      if (updateMode === "reactive") {
        dispatch(startReactiveEmblemUpdateAction());
        dispatch(startReactivePositionQuoteUpdateAction());
      } //
      else {
        dispatch(startProactiveEmblemUpdateAction());
        dispatch(startProactivePositionQuoteUpdateAction());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, positionList.length, isOpenPosition]);

  // Parar atualização ao fechar posição
  useEffect(() => {
    if (!isOpenPosition && previousIsOpenPosition) {
      if (esource_emblem && esource_emblem.close) {
        esource_emblem.close();
      }

      if (interval_emblem) {
        clearInterval(interval_emblem);
      }

      if (esource_positionQuote && esource_positionQuote.close) {
        esource_positionQuote.close();
      }

      if (interval_positionQuote) {
        clearInterval(interval_positionQuote);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenPosition]);

  return null;
};

export default PositionUpdateManager;
