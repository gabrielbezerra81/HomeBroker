import React, { useEffect } from "react";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import checkIfUpdateConfigChanged from "./utils";
import { listPositionAction } from "redux/actions/posicao/PosicaoActions";

const PositionUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenPosition },
    positionReducer: {
      eventSourceEmblema,
      eventSourceCotacoes,
      setIntervalEmblema,
      setIntervalCotacoesPosicao,
      posicoesCustodia: positionList,
      arrayPrecos: positionPrices,
      arrayCotacoes: positionQuotes,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousIsOpenPosition = usePrevious(isOpenPosition);
  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);

  useEffect(() => {
    function startUpdate() {
      if (updateMode === "reactive") {
        console.log("começou atualização reativa da posição");
      } //
      else {
        console.log("atualização proativa da posição");
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

  useEffect(() => {
    dispatch(listPositionAction());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: implementar atualização inicial
  useEffect(() => {}, []);

  // Para atualização ao fechar posição
  useEffect(() => {
    if (!isOpenPosition && previousIsOpenPosition) {
      if (eventSourceEmblema && eventSourceEmblema.close) {
        eventSourceEmblema.close();
      }

      if (setIntervalEmblema) {
        clearInterval(setIntervalEmblema);
      }

      if (eventSourceCotacoes && eventSourceCotacoes.close) {
        eventSourceCotacoes.close();
      }

      if (setIntervalCotacoesPosicao) {
        clearInterval(setIntervalCotacoesPosicao);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenPosition]);

  return null;
};

export default PositionUpdateManager;

/**
 
      atualizarPosicao({
        dispatch,
        listaPosicoes,
        token,
        eventSourcePosicao,
      });

      if (isOpenPosition) {
        atualizarEmblemas({
          dispatch,
          token,
          listaPosicoes,
          listaPrecos: arrayPrecos,
          eventSourceEmblema,
          setIntervalEmblema,
        });
        atualizarCotacoes({
          dispatch,
          listaPosicoes,
          arrayCotacoes,
          eventSourceCotacoes,
          setIntervalCotacoesPosicao,
          token,
        });
      }

 */
