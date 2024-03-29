import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import usePrevious from "hooks/usePrevious";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useEffect, useMemo } from "react";
import checkIfUpdateConfigChanged from "../../../managers/updateManager/utils";

import _ from "lodash";
import {
  cond_startProactiveMultilegUpdateAction,
  cond_startReactiveMultilegUpdateAction,
} from "../duck/actions/ConditionalMultilegAPIAction";
import { clearIntervalAsync } from "set-interval-async/dynamic";

const ConditionalMultilegUpdateManager: React.FC = () => {
  const {
    systemReducer: { updateMode, updateInterval, isOpenConditionalMultileg },
    conditionalMultilegReducer: {
      multileg,
      abaSelecionada,
      esource_multilegQuotes,
      interval_multilegQuotes,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const previousIsOpenConditionalMultileg = usePrevious(
    isOpenConditionalMultileg,
  );
  const previousUpdateMode = usePrevious(updateMode);
  const previousUpdateInterval = usePrevious(updateInterval);

  const symbols = useMemo(() => {
    const symbols: string[] = [];

    multileg.forEach((multilegTab, index) => {
      const {
        ativoAtual: searchedSymbol,
        tabelaMultileg: offers,
      } = multilegTab;

      if (abaSelecionada !== `tab${index}`) {
        return;
      }

      if (!symbols.includes(searchedSymbol)) {
        symbols.push(searchedSymbol);
      }

      offers.forEach((offer) => {
        if (!symbols.includes(offer.codigoSelecionado)) {
          symbols.push(offer.codigoSelecionado);
        }
      });
    });

    return symbols;
  }, [abaSelecionada, multileg]);

  const previousSymbols = usePrevious(symbols);

  // Iniciar atualização
  useEffect(() => {
    function checkIfMultilegChanged() {
      if (!_.isEqual(previousSymbols, symbols)) {
        return true;
      }

      if (previousSymbols === undefined) {
        return true;
      }

      return false;
    }

    function startUpdate() {
      if (updateMode === "reactive") {
        dispatch(cond_startReactiveMultilegUpdateAction(symbols));
      } //
      else {
        dispatch(cond_startProactiveMultilegUpdateAction(symbols));
      }
    }

    const hasMultilegChanged = checkIfMultilegChanged();
    const hasUpdateConfigChanged = checkIfUpdateConfigChanged({
      previousUpdateMode,
      updateMode,
      previousUpdateInterval,
      updateInterval,
    });

    if (
      isOpenConditionalMultileg &&
      (hasMultilegChanged || hasUpdateConfigChanged)
    ) {
      startUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpenConditionalMultileg,
    symbols,
    updateMode,
    updateInterval,
    dispatch,
  ]);

  // Para atualização ao fechar multileg
  useEffect(() => {
    if (!isOpenConditionalMultileg && previousIsOpenConditionalMultileg) {
      if (esource_multilegQuotes && esource_multilegQuotes.close) {
        esource_multilegQuotes.close();
      }

      if (interval_multilegQuotes) {
        clearIntervalAsync(interval_multilegQuotes);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenConditionalMultileg]);

  return null;
};

export default ConditionalMultilegUpdateManager;
