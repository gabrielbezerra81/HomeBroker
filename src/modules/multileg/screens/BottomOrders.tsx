import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import OrdensExecucao from "modules/ordersExec/screens/OrdensExecucao";
import React from "react";
import { useMemo } from "react";

interface Props {}

const BottomOrders: React.FC<Props> = ({}) => {
  const {
    multilegReducer: { multileg, abaSelecionada },
    ordersExecReducer: { tabelaOrdensExecucao },
  } = useStateStorePrincipal();

  const tabIndex = useMemo(() => {
    const tab = abaSelecionada.replace("tab", "");

    if (tab) {
      return Number(tab);
    }

    return 0;
  }, [abaSelecionada]);

  const ordersData = useMemo(() => {
    const multilegTab = multileg[tabIndex];

    return tabelaOrdensExecucao.filter((order) => {
      const offersHasSymbol = order.offers.some((offer) => {
        const isSymbolSearched = multilegTab.ativoAtual === offer.ativo;

        const multilegOffersHasSymbol = multilegTab.tabelaMultileg.some(
          (multiOffer) => multiOffer.codigoSelecionado === offer.ativo,
        );

        return isSymbolSearched || multilegOffersHasSymbol;
      });

      return offersHasSymbol;
    });
  }, [multileg, tabIndex, tabelaOrdensExecucao]);

  return <OrdensExecucao data={ordersData} headerTitle="" type="helperPopup" />;
};

export default BottomOrders;
