import React, { useCallback, useEffect, useRef, useState } from "react";
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

  const [disabledEdit, setDisabledEdit] = useState(true);

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

  const handleAllowEditOnDoubleClick = useCallback(() => {
    setDisabledEdit(false);
  }, []);

  const resetDisabledOnBlur = useCallback(() => {
    setDisabledEdit(true);
  }, []);

  useEffect(() => {
    if (selectedTab !== `tab${tabIndex}`) {
      setDisabledEdit(true);
    }

    return () => {
      setDisabledEdit(true);
    };
  }, [selectedTab, tabIndex]);

  return (
    <Col>
      <Nav.Item>
        <Nav.Link
          eventKey={`tab${tabIndex}`}
          className={selectedTab === `tab${tabIndex}` ? "selectedTab" : ""}
          active={false}
          onDoubleClick={handleAllowEditOnDoubleClick}
        >
          <div className="titleContainer">
            {tabIndex !== 0 && (
              <MDBIcon icon="times" onClick={handleRemoveTab} />
            )}
            <Form.Control
              disabled={disabledEdit}
              ref={inputRef}
              type="text"
              value={tab.tabName}
              onChange={handleTabNameChange}
              onKeyPress={handleBlurOnEnter}
              onBlur={resetDisabledOnBlur}
            />
          </div>
        </Nav.Link>
      </Nav.Item>
    </Col>
  );
};

export default TabButton;
