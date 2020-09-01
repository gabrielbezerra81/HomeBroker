import React, { useEffect, useMemo } from "react";
import { Tab, Row, Col, Nav, Form } from "react-bootstrap";
import { MDBIcon } from "mdbreact";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  updateOneSystemStateAction,
  handleOpenMenusInMainTabAction,
} from "redux/actions/telaPrincipal/TelaPrincipalActions";

interface MenuChild {
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
      ordensExecucaoAberto,
      relatorioDetalhadoAberto,
      listaCompletaAberta,
      multilegAberto,
      thlAberta,
      openedMenus,
    },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

  const menuChildren = useMemo(() => {
    const menus = [
      { key: "ordens_execucao", isOpen: ordensExecucaoAberto },
      { key: "relatorio_detalhado", isOpen: relatorioDetalhadoAberto },
      { key: "posicao_custodia", isOpen: listaCompletaAberta },
      { key: "multileg", isOpen: multilegAberto },
      { key: "thl", isOpen: thlAberta },
    ] as const;

    return menus;
  }, [
    listaCompletaAberta,
    multilegAberto,
    ordensExecucaoAberto,
    relatorioDetalhadoAberto,
    thlAberta,
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
                <Col md={0} key={index}>
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

            <Col md={0}>
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
                        const menuChild = childItem?.valueOf() as MenuChild;

                        return (
                          openedMenu.menuKey === menuChild.key &&
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
