import React from "react";
import { Col, Nav, Form } from "react-bootstrap";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  removeMultilegTabAction,
  updateMultilegTabAction,
} from "../duck/actions/MultilegActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { FiX } from "react-icons/fi";

interface TabTitleProps {
  tabIndex: number;
}

const TabTitle: React.FC<TabTitleProps> = ({ tabIndex }) => {
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
            <FiX
              size={12}
              strokeWidth={3}
              color="#666"
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
                const targetElement = e.target as any;
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
