import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useEffect } from "react";
import { startReactiveMultilegUpdateAction } from "redux/actions/multileg/MultilegActions";
import checkIfUpdateConfigChanged from "./utils";

const MultilegUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenMultileg },
    multilegReducer: {
      multileg,
      abaSelecionada,
      eventSourceCotacao,
      setIntervalCotacoesMultileg,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousMultileg = usePrevious(multileg);

  const verifyVisibilityChange = useCallback((previous, current) => {
    if (previous !== undefined && previous !== current) {
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    function checkIfMultilegChanged() {
      const tabIndex = Number(abaSelecionada.replace("tab", ""));

      if (!previousMultileg) {
        return false;
      }

      const exportedOrdersToMultileg =
        previousMultileg.length < multileg.length &&
        !!multileg[tabIndex].tabelaMultileg.length;

      if (exportedOrdersToMultileg) {
        return true;
      }

      if (!previousMultileg[tabIndex]) {
        return false;
      }

      const codeDiff =
        previousMultileg[tabIndex].ativoAtual !== multileg[tabIndex].ativoAtual;

      if (codeDiff) {
        return true;
      }

      const addedOffer =
        previousMultileg[tabIndex].tabelaMultileg.length !==
        multileg[tabIndex].tabelaMultileg.length;

      if (addedOffer) {
        return true;
      }

      const changedOfferSymbol = multileg[tabIndex].tabelaMultileg.some(
        (offer, index) => {
          return (
            previousMultileg[tabIndex].tabelaMultileg[index]
              .codigoSelecionado !== offer.codigoSelecionado
          );
        },
      );

      if (changedOfferSymbol) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        console.log("começou atualização reativa da multileg");
        dispatch(startReactiveMultilegUpdateAction());
      } //
      else {
        console.log("atualização proativa da multileg");
      }
    }

    const hasMultilegChanged = checkIfMultilegChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (isOpenMultileg && (hasMultilegChanged || hasUpdateConfigChanged)) {
      startUpdate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMultileg, multileg, updateMode, updateInterval, dispatch]);

  // Para atualização ao fechar multileg
  useEffect(() => {
    if (!isOpenMultileg) {
      console.log("clear Multileg");

      if (eventSourceCotacao && eventSourceCotacao.close) {
        eventSourceCotacao.close();
      }

      if (setIntervalCotacoesMultileg) {
        clearInterval(setIntervalCotacoesMultileg);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMultileg]);

  return null;
};

export default MultilegUpdateManager;
