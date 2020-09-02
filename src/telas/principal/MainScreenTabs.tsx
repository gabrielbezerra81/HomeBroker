import React, { useEffect, useMemo } from "react";
import { Tab, Row, Col, Nav, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  updateOneSystemStateAction,
  handleOpenMenusInMainTabAction,
} from "redux/actions/telaPrincipal/TelaPrincipalActions";

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
      dispatch(handleOpenMenusInMainTabAction(menuChildren));
    }

    loadOpenedMenus();
  }, [dispatch, menuChildren]);

  return (
    <div id="MainScreenTabs">
      <Tab.Container
        onSelect={(key) => {
          dispatch(updateOneSystemStateAction("selectedTab", key));
        }}
        activeKey={selectedTab}
      >
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
                          <MDBIcon icon="times" className="saldoOpNegativo" />
                        )}
                        <Form.Control
                          type="text"
                          value={tabItem.tabName}
                          onChange={(e) => {}}
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
                  eventKey="adicionar"
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
                  <Tab.Pane eventKey={`tab${index}`} key={index + "tabpane"}>
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

export default MainScreenTabs;
