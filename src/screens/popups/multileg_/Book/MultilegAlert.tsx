import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { createMultilegAlertAction } from "redux/actions/multileg/MultilegAPIAction";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import usePrevious from "hooks/usePrevious";
import { expandElement, collapseElement } from "shared/utils/AnimateHeight";
import { updateMultilegTabAction } from "redux/actions/multileg/MultilegActions";

interface MultilegAlertProps {
  tabIndex: number;
}

const MultilegAlert: React.FC<MultilegAlertProps> = ({ tabIndex }) => {
  const dispatch = useDispatchStorePrincipal();

  const {
    multilegReducer: { multileg },
    systemReducer: { multilegButtonsVisibility },
  } = useStateStorePrincipal();

  const [param, setParam] = useState("Bid");
  const [operator, setOperator] = useState("Less");
  const [comment, setComment] = useState("");

  const isAnyAlertOpen = useMemo(() => {
    return multileg.some((tab) => tab.isAlertOpen);
  }, [multileg]);

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

  const handleCreateAlert = useCallback(
    () =>
      dispatch(
        createMultilegAlertAction({ tabIndex, param, operator, comment }),
      ),
    [comment, dispatch, operator, param, tabIndex],
  );

  const multilegHeight = useMemo(() => {
    return multilegButtonsVisibility ? 410 : 345;
  }, [multilegButtonsVisibility]);

  useEffect(() => {
    if (previousNumberOfOffers || previousNumberOfOffers === 0) {
      const multilegElement = document.getElementById("multileg");
      var section = multilegElement?.querySelector(".mcontent");

      if (section) {
        var isCollapsed = section.getAttribute("data-collapsed") === "true";

        if (!isCollapsed && multileg[tabIndex].isAlertOpen) {
        } //
        else {
          if (isCollapsed) {
            expandElement({
              element: section,
              height: multilegHeight,
              extraDynamicHeight: 27 * maxNumberOfOffers,
              extraHeight: 12,
            });
            section.setAttribute("data-collapsed", "false");
          }

          if (!isCollapsed && !isAnyAlertOpen) {
            collapseElement({
              element: section,
              height: multilegHeight,
              extraDynamicHeight: 27 * maxNumberOfOffers,
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multileg[tabIndex].isAlertOpen]);

  const openedAlertClass = useMemo(() => {
    return multileg[tabIndex].isAlertOpen ? " openedAlert" : "";
  }, [multileg, tabIndex]);

  return (
    <>
      <Row className="mb-2">
        <Col md={9} className="ml-4 pr-0">
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
        </Col>
      </Row>
      {multileg[tabIndex].isAlertOpen && (
        <div className="multilegAlertContent">
          <Form.Control
            value={param}
            onChange={(e) => setParam(e.target.value)}
            as="select"
            className="textInput"
          >
            <option value={"Bid"}>Oferta de compra</option>
            <option value={"Ask"}>Oferta de venda</option>
            <option value={"Last"}>Último</option>
          </Form.Control>
          <Form.Control
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            as="select"
            className="textInput"
          >
            <option value={"Less"}>Menor ou igual {"<="}</option>
            <option value={"Greater"}>Maior ou igual {">="}</option>
          </Form.Control>
          <Form.Control
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="textInput"
            placeholder="Comentários"
          />

          <Button onClick={handleCreateAlert} size="sm">
            ENVIAR
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
