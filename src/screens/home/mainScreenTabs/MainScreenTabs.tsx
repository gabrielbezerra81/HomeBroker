import React, { useEffect, useMemo, useCallback } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  handleAddOrSelectTabAction,
  handleOpenMenusInMainScreenTabsAction,
  handleChangeTabPropsAction,
} from "redux/actions/system/SystemActions";
import usePrevious from "hooks/usePrevious";
import TabButton from "./TabButton";

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
      isOpenLeftUserMenu,
      isOpenRightSideMenu,
      isOpenCategoryList,
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
      { key: "category_list", isOpen: isOpenCategoryList },
    ] as const;

    return menus;
  }, [
    isOpenOrdersExec,
    isOpenDetailedReport,
    isOpenPosition,
    isOpenMultileg,
    isOpenTHL,
    isOpenCategoryList,
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

  const previousIsOpenLeftUserMenu = usePrevious(isOpenLeftUserMenu);
  const previousIsOpenRightMenu = usePrevious(isOpenRightSideMenu);

  useEffect(() => {
    const tabElement = document.getElementById("MainScreenTabs");

    const elements = tabElement?.getElementsByClassName("navContainer");

    if (elements) {
      const navContainer = elements.item(0) as HTMLElement;

      const initialLeftMenu = isOpenLeftUserMenu ? " - 132px" : "";
      const initialRightMenu = isOpenRightSideMenu ? " - 214px" : "";

      navContainer.style.width =
        "calc(100% - 43px - 81px - 32px - 3px" +
        initialLeftMenu +
        initialRightMenu +
        ")";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tabElement = document.getElementById("MainScreenTabs");

    const elements = tabElement?.getElementsByClassName("navContainer");

    if (elements && previousIsOpenLeftUserMenu !== undefined) {
      const navContainer = elements.item(0) as HTMLElement;

      const currentWidth = navContainer.style.width.replace(")", "");

      if (isOpenLeftUserMenu) {
        navContainer.style.width = currentWidth + " - 132px)";
      } else {
        navContainer.style.width = currentWidth.replace(" - 132px", "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenLeftUserMenu]);

  useEffect(() => {
    const tabElement = document.getElementById("MainScreenTabs");

    const elements = tabElement?.getElementsByClassName("navContainer");

    if (elements && previousIsOpenRightMenu !== undefined) {
      const navContainer = elements.item(0) as HTMLElement;

      const currentWidth = navContainer.style.width.replace(")", "");

      if (isOpenRightSideMenu) {
        navContainer.style.width = currentWidth + " - 214px)";
      } else {
        navContainer.style.width = currentWidth.replace(" - 214px", "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenRightSideMenu]);

  return (
    <div id="MainScreenTabs">
      <Tab.Container onSelect={handleTabSelect} activeKey={selectedTab}>
        <Row className={`navContainer`}>
          <Nav>
            {mainTabs.map((tabItem, index) => {
              return (
                <TabButton
                  key={`tabButton${index}`}
                  tab={tabItem}
                  tabIndex={index}
                />
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
