import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect } from "react";
import {} from "../duck/actions/ConditionalMultilegAPIAction";
import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";

const MultilegUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenMultileg },
    multilegReducer: {
      multileg,
      abaSelecionada,
      esource_multilegQuotes,
      interval_multilegQuotes,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousIsOpenMultileg = usePrevious(isOpenMultileg);
  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);
  const previousMultileg = usePrevious(multileg);

  // Iniciar atualização
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
      } //
      else {
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
    if (!isOpenMultileg && previousIsOpenMultileg) {
      if (esource_multilegQuotes && esource_multilegQuotes.close) {
        esource_multilegQuotes.close();
      }

      if (interval_multilegQuotes) {
        clearInterval(interval_multilegQuotes);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenMultileg]);

  return null;
};

export default MultilegUpdateManager;
