import React, { useEffect, useMemo } from "react";
// import { createMultilegAlertAction } from "../../duck/actions/ConditionalMultilegAPIAction";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import usePrevious from "hooks/usePrevious";
import { updateHeight } from "shared/utils/AnimateHeight";
import { cond_multilegNormalHeight } from "../screens/constants";

const popupKey = "conditionalMultileg";

const HeightAdjuster: React.FC = () => {
  const {
    conditionalMultilegReducer: { multileg },
  } = useStateStorePrincipal();

  const previousMultileg = usePrevious(multileg);

  const previousNumberOfOffers = useMemo(() => {
    if (!previousMultileg) {
      return undefined;
    }

    return previousMultileg.reduce((prev, curr) => {
      return prev + curr.tabelaMultileg.length;
    }, 0);
  }, [previousMultileg]);

  const totalNumberOfOffers = multileg.reduce((prev, curr) => {
    return prev + curr.tabelaMultileg.length;
  }, 0);

  useEffect(() => {
    if (
      previousNumberOfOffers !== totalNumberOfOffers &&
      typeof previousNumberOfOffers === "number"
    ) {
      const multilegElement = document.getElementById(popupKey);
      var section = multilegElement?.querySelector(".mcontent");

      const popupHeight = cond_multilegNormalHeight;

      updateHeight(section, popupHeight, 27 * totalNumberOfOffers);
    }
  }, [previousNumberOfOffers, totalNumberOfOffers]);

  return null;
};

export default HeightAdjuster;

/*

// const {
  //   conditionalMultilegReducer: { multileg },
  // } = useStateStorePrincipal();

  // const totalNumberOfOffers = useMemo(() => {
  //   return multileg.reduce((prev, curr) => {
  //     return prev + curr.tabelaMultileg.length;
  //   }, 0);
  // }, [multileg]);

  // const previousNumberOfOffers = usePrevious(totalNumberOfOffers);

  // useEffect(() => {
  //   function adjustMultilegHeight() {
  //     if (previousNumberOfOffers || previousNumberOfOffers === 0) {
  //       const multilegElement = document.getElementById("conditionalMultileg");
  //       var mcontent = multilegElement?.querySelector(".mcontent");

  //       if (mcontent) {
  //         // var isCollapsed = mcontent.getAttribute("data-collapsed") === "true";
  //         // const thisAlertOpen = multileg[tabIndex].isAlertOpen;

  //         // const offersHeight = 27 * maxNumberOfOffers;

  //         // const heights = multileg.map((tabItem) => {
  //         //   return tabItem.tabelaMultileg.length * 27;
  //         // });

  //         const maxHeight = totalNumberOfOffers;

  //         updateHeight(mcontent, multilegHeight + maxHeight);
  //       }
  //     }
  //   }

  //   adjustMultilegHeight();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

*/
