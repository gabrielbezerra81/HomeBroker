import React, { useEffect, useMemo, useCallback } from "react";
import { Tab, Row, Col, Nav, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleAddOrSelectTabAction,
  handleOpenMenusInMainScreenTabsAction,
  handleRemoveTabAction,
  handleChangeTabPropsAction,
} from "redux/actions/system/SystemActions";

interface TabChild {
  key: string;
  index: number;
  props: {
    menuAberto: boolean;
  };
}

interface MainScreenTabsProps {
  children: Array<React.ReactNode>;
}

const MainScreenTabs: React.FC<MainScreenTabsProps> = ({ children }) => {
  const {
    systemReducer: {
      mainTabs,
      selectedTab,
      isOpenOrdersExec,
      isOpenDetailedReport,
      isOpenPosition,
      isOpenMultileg,
      isOpenTHL,
      openedMenus,
    },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

  const menuChildren = useMemo(() => {
    const menus = [
      { key: "ordens_execucao", isOpen: isOpenOrdersExec },
      { key: "relatorio_detalhado", isOpen: isOpenDetailedReport },
      { key: "posicao_custodia", isOpen: isOpenPosition },
      { key: "multileg", isOpen: isOpenMultileg },
      { key: "thl", isOpen: isOpenTHL },
    ] as const;

    return menus;
  }, [
    isOpenPosition,
    isOpenMultileg,
    isOpenOrdersExec,
    isOpenDetailedReport,
    isOpenTHL,
  ]);

  useEffect(() => {
    function loadOpenedMenus() {
      dispatch(handleOpenMenusInMainScreenTabsAction(menuChildren));
    }

    loadOpenedMenus();
  }, [dispatch, menuChildren]);

  const handleTabSelect = useCallback(
    (key, event: any) => {
      // Não selecionar com tecla de espaço
      if (event.keyCode === 32) {
        const targetElement = event.target;
        const { selectionStart, value } = targetElement;

        const tabIndex = +selectedTab.substr(3);

        const newTabName = [
          value.slice(0, selectionStart),
          event.key,
          value.slice(selectionStart),
        ].join("");

        requestAnimationFrame(() => {
          targetElement.setSelectionRange(
            selectionStart + 1,
            selectionStart + 1,
          );
        });

        dispatch(
          handleChangeTabPropsAction({
            tabIndex,
            attributeName: "tabName",
            attributeValue: newTabName,
          }),
        );
      } else {
        dispatch(handleAddOrSelectTabAction(key));
      }
    },
    [dispatch, selectedTab],
  );

  return (
    <div id="MainScreenTabs">
      <Tab.Container onSelect={handleTabSelect} activeKey={selectedTab}>
        <Row className="navContainer">
          <Nav>
            {mainTabs.map((tabItem, index) => {
              return (
                <Col key={index}>
                  <Nav.Item>
                    <Nav.Link
                      eventKey={`tab${index}`}
                      className={
                        selectedTab === `tab${index}` ? "selectedTab" : ""
                      }
                      active={false}
                    >
                      <div className="titleContainer">
                        {index !== 0 && (
                          <MDBIcon
                            icon="times"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(handleRemoveTabAction(index));
                            }}
                          />
                        )}
                        <Form.Control
                          type="text"
                          value={tabItem.tabName}
                          onChange={(e: any) => {
                            dispatch(
                              handleChangeTabPropsAction({
                                tabIndex: index,
                                attributeName: "tabName",
                                attributeValue: e.target.value,
                              }),
                            );
                          }}
                        />
                      </div>
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              );
            })}

            <Col>
              <Nav.Item>
                <Nav.Link
                  eventKey="addTab"
                  className="addTabButton divClicavel"
                >
                  +
                </Nav.Link>
              </Nav.Item>
            </Col>
          </Nav>
        </Row>
        <Row>
          <Col md={12}>
            <Tab.Content>
              {mainTabs.map((_, index) => {
                return (
                  <Tab.Pane
                    className="popupContainer"
                    eventKey={`tab${index}`}
                    key={index + "tabpane"}
                  >
                    {openedMenus.map((openedMenu) => {
                      return children.find((childItem) => {
                        const tabChild = childItem?.valueOf() as TabChild;

                        return (
                          openedMenu.menuKey === tabChild.key &&
                          openedMenu.tabKey === `tab${index}`
                        );
                      });
                    })}
                  </Tab.Pane>
                );
              })}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default React.memo(MainScreenTabs);
