import React, { useCallback, useEffect, useMemo } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { createMultilegAlertAction } from "redux/actions/multileg/MultilegAPIAction";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import usePrevious from "hooks/usePrevious";
import { updateHeight } from "shared/utils/AnimateHeight";
import { updateMultilegTabAction } from "redux/actions/multileg/MultilegActions";
import { multilegNormalHeight, multilegWithAlertHeight } from "../constants";

interface MultilegAlertProps {
  tabIndex: number;
}

const MultilegAlert: React.FC<MultilegAlertProps> = ({ tabIndex }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multilegReducer: { multileg },
    systemReducer: { multilegButtonsVisibility, createAlertButtonVisibility },
  } = useStateStorePrincipal();

  // const isAnyAlertOpen = useMemo(() => {
  //   return multileg.some((tab, index) => tab.isAlertOpen && index !== tabIndex);
  // }, [multileg, tabIndex]);

  const maxNumberOfOffers = useMemo(() => {
    return Math.max(...multileg.map((tab) => tab.tabelaMultileg.length));
  }, [multileg]);

  const previousNumberOfOffers = usePrevious(maxNumberOfOffers);

  const handleToggleAlert = useCallback(() => {
    const { isAlertOpen } = multileg[tabIndex];

    dispatch(
      updateMultilegTabAction({
        tabIndex,
        attributeName: "isAlertOpen",
        attributeValue: !isAlertOpen,
      }),
    );
  }, [dispatch, multileg, tabIndex]);

  const handleCreateAlert = useCallback(() => {
    dispatch(createMultilegAlertAction(tabIndex));
  }, [dispatch, tabIndex]);

  const handleInputChange = useCallback(
    (e) => {
      dispatch(
        updateMultilegTabAction({
          tabIndex,
          attributeName: e.target.name,
          attributeValue: e.target.value,
        }),
      );
    },
    [dispatch, tabIndex],
  );

  const multilegHeight = useMemo(() => {
    return multilegButtonsVisibility
      ? multilegNormalHeight
      : multilegWithAlertHeight;
  }, [multilegButtonsVisibility]);

  useEffect(() => {
    function adjustMultilegHeight() {
      if (previousNumberOfOffers || previousNumberOfOffers === 0) {
        const multilegElement = document.getElementById("multileg");
        var mcontent = multilegElement?.querySelector(".mcontent");

        if (mcontent) {
          // var isCollapsed = mcontent.getAttribute("data-collapsed") === "true";
          // const thisAlertOpen = multileg[tabIndex].isAlertOpen;

          // const offersHeight = 27 * maxNumberOfOffers;

          const heights = multileg.map((tabItem) => {
            const alertHeight = tabItem.isAlertOpen ? 108 : 0;

            return tabItem.tabelaMultileg.length * 27 + alertHeight;
          });

          const maxHeight = Math.max(...heights);

          updateHeight(mcontent, multilegHeight + maxHeight);

          // // Caso 3.1 false, true
          // if (!isCollapsed && thisAlertOpen) {
          //   console.log("3.1");
          //   updateHeight(mcontent, multilegHeight, offersHeight + 108);
          //   return;
          // } //

          // // Caso 1
          // if (!isCollapsed && !thisAlertOpen) {
          //   // Caso 1.1
          //   if (!isAnyAlertOpen) {
          //     console.log("1.1");
          //     collapseElement({
          //       element: mcontent,
          //       height: multilegHeight,
          //       extraDynamicHeight: offersHeight,
          //     });
          //     return;
          //   }
          //   // Caso 1.2
          //   else {
          //     updateHeight(mcontent, multilegHeight + maxHeight);

          //     console.log("1.2");
          //     return;
          //   }
          // }

          // // Caso 2
          // if (isCollapsed && thisAlertOpen) {
          //   // Caso 2.1
          //   if (!isAnyAlertOpen) {
          //     console.log("2.1");
          //     expandElement({
          //       element: mcontent,
          //       height: multilegHeight,
          //       extraDynamicHeight: offersHeight,
          //       extraHeight: 12,
          //     });
          //     mcontent.setAttribute("data-collapsed", "false");
          //     return;
          //   } // Caso 2.2
          //   else {
          //     console.log("2.2");
          //     return;
          //   }
          // }
        }
      }
    }

    adjustMultilegHeight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multileg[tabIndex].isAlertOpen]);

  const openedAlertClass = useMemo(() => {
    return multileg[tabIndex].isAlertOpen ? " openedAlert" : "";
  }, [multileg, tabIndex]);

  const shouldDisplayToggleButton = useMemo(() => {
    if (!multilegButtonsVisibility && createAlertButtonVisibility) {
      dispatch(
        updateMultilegTabAction({
          tabIndex,
          attributeName: "isAlertOpen",
          attributeValue: true,
        }),
      );
      return false;
    }

    return true;
  }, [
    createAlertButtonVisibility,
    dispatch,
    multilegButtonsVisibility,
    tabIndex,
  ]);

  const shouldDisplayButtons = useMemo(() => {
    if (multilegButtonsVisibility && multileg[tabIndex].isAlertOpen)
      return true;

    if (!multilegButtonsVisibility && createAlertButtonVisibility) return true;

    return false;
  }, [
    createAlertButtonVisibility,
    multileg,
    multilegButtonsVisibility,
    tabIndex,
  ]);

  return (
    <>
      {shouldDisplayToggleButton && (
        <div className="operationButtonRow">
          <Button
            variant="primary"
            size="sm"
            onClick={handleToggleAlert}
            block
            className={`toggleAlertButton${openedAlertClass}`}
          >
            ALERTA DE OPERAÇÃO
            <MDBIcon icon="angle-down" />
          </Button>
        </div>
      )}

      {shouldDisplayButtons && (
        <div className="multilegAlertContent">
          <Form.Control
            value={multileg[tabIndex].param}
            name="param"
            onChange={handleInputChange}
            as="select"
            className="textInput"
          >
            <option value={"Bid"}>Oferta de compra</option>
            <option value={"Ask"}>Oferta de venda</option>
            <option value={"Last"}>Último</option>
          </Form.Control>
          <Form.Control
            value={multileg[tabIndex].operator}
            name="operator"
            onChange={handleInputChange}
            as="select"
            className="textInput"
          >
            <option value={"Less"}>Menor ou igual {"<="}</option>
            <option value={"Greater"}>Maior ou igual {">="}</option>
          </Form.Control>
          <Form.Control
            value={multileg[tabIndex].comment}
            name="comment"
            onChange={handleInputChange}
            className="textInput"
            placeholder="Comentários"
          />

          <Button onClick={handleCreateAlert} size="sm">
            Cadastrar Alerta
          </Button>
        </div>
      )}
    </>
  );
};

export default MultilegAlert;

// const updateHeight = (element: any, height: number, extraDynamicHeight = 0) => {
//   requestAnimationFrame(function () {
//     element.style.height = height + extraDynamicHeight + "px"; //0 + 'px'
//   });
// };

// const expandSection = (
//   element: any,
//   extraHeight = 0,
//   height = 0,
//   extraDynamicHeight = 0,
// ) => {
//   // get the height of the element's inner content, regardless of its actual size
//   var sectionHeight = element.scrollHeight;

//   // have the element transition to the height of its inner content
//   element.style.height = sectionHeight + 12 + "px";

//   const funcao = function (e: any) {
//     console.log("expand");
//     // remove this event listener so it only gets triggered once

//     // remove "height" from the element's inline styles, so it can return to its initial value
//     element.style.height = "410px";
//   };

//   // when the next css transition finishes (which should be the one we just triggered)
//   element.addEventListener("transitionend", funcao);

//   element.removeEventListener("transitionend", funcao);

//   // mark the section as "currently not collapsed"
//   element.setAttribute("data-collapsed", "false");
// };

// function collapseSection(element: any, height = 0, extraDynamicHeight = 0) {
//   // get the height of the element's inner content, regardless of its actual size
//   var sectionHeight = element.scrollHeight;

//   // temporarily disable all css transitions
//   var elementTransition = element.style.transition;
//   element.style.transition = "";

//   // on the next frame (as soon as the previous style change has taken effect),
//   // explicitly set the element's height to its current pixel height, so we
//   // aren't transitioning out of 'auto'
//   requestAnimationFrame(function () {
//     element.style.height = sectionHeight + "px";
//     element.style.transition = elementTransition;

//     // on the next frame (as soon as the previous style change has taken effect),
//     // have the element transition to height: 0
//     requestAnimationFrame(function () {
//       element.style.height = height + extraDynamicHeight + "px"; //0 + 'px'
//       console.log(element.style.height);
//     });
//   });

//   // mark the section as "currently collapsed"
//   element.setAttribute("data-collapsed", "true");
// }
