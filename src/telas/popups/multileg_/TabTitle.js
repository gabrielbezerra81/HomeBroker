import React from "react";
import { MDBIcon } from "mdbreact";
import { Col, Nav, Form } from "react-bootstrap";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  removeMultilegTabAction,
  updateMultilegTabAction,
} from "redux/actions/multileg/MultilegActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

const TabTitle = ({ tabIndex }) => {
  const {
    multilegReducer: { multileg, abaSelecionada },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  return (
    <Col>
      <Nav.Item>
        <Nav.Link
          eventKey={`tab${tabIndex}`}
          className={`${abaSelecionada === `tab${tabIndex}` ? "abaAtiva" : ""}`}
          active={false}
        >
          <div className="containerTituloAba">
            <MDBIcon
              icon="times"
              className="saldoOpNegativo"
              onClick={(e) => {
                dispatch(removeMultilegTabAction(tabIndex));
                e.stopPropagation();
              }}
            />
            <Form.Control
              type="text"
              value={multileg[tabIndex].nomeAba}
              className="inputTituloAba"
              onChange={(e) => {
                const targetElement = e.target;
                const { selectionStart, value } = targetElement;

                dispatch(
                  updateMultilegTabAction({
                    tabIndex: tabIndex,
                    attributeName: "nomeAba",
                    attributeValue: value,
                  }),
                );

                requestAnimationFrame(() => {
                  targetElement.setSelectionRange(
                    selectionStart,
                    selectionStart,
                  );
                });
              }}
            />
          </div>
        </Nav.Link>
      </Nav.Item>
    </Col>
  );
};

export default TabTitle;
