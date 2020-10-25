import React, { useCallback, useRef } from "react";
import { Nav, Col, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";

import {
  handleChangeTabPropsAction,
  handleRemoveTabAction,
} from "redux/actions/system/SystemActions";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface TabButtonProps {
  tabIndex: number;
  tab: { tabName: string };
}

const TabButton: React.FC<TabButtonProps> = ({ tabIndex, tab }, ref) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    systemReducer: { selectedTab },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const handleRemoveTab = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(handleRemoveTabAction(tabIndex));
    },
    [dispatch, tabIndex],
  );

  const handleTabNameChange = useCallback(
    (e: any) => {
      console.log(e);

      dispatch(
        handleChangeTabPropsAction({
          tabIndex,
          attributeName: "tabName",
          attributeValue: e.target.value,
        }),
      );
    },
    [dispatch, tabIndex],
  );

  const handleBlurOnEnter = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        inputRef.current?.blur();
      }
    },
    [],
  );

  return (
    <Col>
      <Nav.Item>
        <Nav.Link
          eventKey={`tab${tabIndex}`}
          className={selectedTab === `tab${tabIndex}` ? "selectedTab" : ""}
          active={false}
        >
          <div className="titleContainer">
            {tabIndex !== 0 && (
              <MDBIcon icon="times" onClick={handleRemoveTab} />
            )}
            <Form.Control
              ref={inputRef}
              type="text"
              value={tab.tabName}
              onChange={handleTabNameChange}
              onKeyPress={handleBlurOnEnter}
            />
          </div>
        </Nav.Link>
      </Nav.Item>
    </Col>
  );
};

export default TabButton;
