import React, { useEffect, useMemo } from "react";
// import { createMultilegAlertAction } from "../../duck/actions/ConditionalMultilegAPIAction";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import usePrevious from "hooks/usePrevious";
import { updateHeight } from "shared/utils/AnimateHeight";
import { cond_multilegNormalHeight } from "../screens/constants";

const multilegHeight = cond_multilegNormalHeight;

const HeightAdjuster: React.FC = () => {
  const {
    conditionalMultilegReducer: { multileg },
  } = useStateStorePrincipal();

  const maxNumberOfOffers = useMemo(() => {
    return Math.max(...multileg.map((tab) => tab.tabelaMultileg.length));
  }, [multileg]);

  const previousNumberOfOffers = usePrevious(maxNumberOfOffers);

  useEffect(() => {
    function adjustMultilegHeight() {
      if (previousNumberOfOffers || previousNumberOfOffers === 0) {
        const multilegElement = document.getElementById("conditionalMultileg");
        var mcontent = multilegElement?.querySelector(".mcontent");

        if (mcontent) {
          // var isCollapsed = mcontent.getAttribute("data-collapsed") === "true";
          // const thisAlertOpen = multileg[tabIndex].isAlertOpen;

          // const offersHeight = 27 * maxNumberOfOffers;

          const heights = multileg.map((tabItem) => {
            return tabItem.tabelaMultileg.length * 27;
          });

          const maxHeight = Math.max(...heights);

          updateHeight(mcontent, multilegHeight + maxHeight);
        }
      }
    }

    adjustMultilegHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default HeightAdjuster;
