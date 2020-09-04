import React, { useMemo, useEffect } from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { Animate } from "react-show";

import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import usePrevious from "hooks/usePrevious";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";

import {
  handleOpenMenusInMainScreenTabsAction,
  handleCloseMenusAction,
} from "redux/actions/system/SystemActions";

interface BoletaContainerProps {
  children: React.ReactNode;
  boletaName: string;
  visibilityIndex: number;
  appKey: number;
}

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const Boleta: React.FC<BoletaContainerProps> = ({
  children,
  boletaName,
  visibilityIndex,
  appKey,
}) => {
  const {
    systemReducer: { selectedTab, openedMenus },
  } = useStateStorePrincipal();

  const { show, zIndex } = useStateGlobalStore();

  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();

  const visibility = show[visibilityIndex][boletaName];

  const previousVisibility = usePrevious(visibility);

  useEffect(() => {
    console.log(previousVisibility, visibility);

    // Houve mudança de visibilidade: deve adicionar ou remover um elemento de openedMenus
    if (previousVisibility !== visibility) {
      const openedMenu = [
        {
          key: `${boletaName}${appKey}`,
          isOpen: visibility,
        },
      ];

      // Um appBoleta é criado e uma boleta abriu: deve adicionar um elemento em openedMenus
      if (previousVisibility === undefined || visibility) {
        dispatch(
          handleOpenMenusInMainScreenTabsAction(openedMenu, selectedTab),
        );
      } //
      else {
        dispatch(
          handleCloseMenusAction({
            visibility,
            isOpenAttribute: openedMenu[0].key,
          }),
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appKey, boletaName, visibility, dispatch]);

  const hideStyle = useMemo(() => {
    const shouldRender = openedMenus.some(
      (openedMenu) =>
        openedMenu.menuKey === `${boletaName}${appKey}` &&
        openedMenu.tabKey === selectedTab,
    );
    return shouldRender ? {} : { display: "none" };
  }, [openedMenus, boletaName, appKey, selectedTab]);

  return (
    <Animate
      show={show[visibilityIndex][boletaName]}
      duration={show[visibilityIndex][boletaName] ? 100 : 0}
      transitionOnMount
      preMount
      start={startStyle}
      style={hideStyle}
      id={`${boletaName}${appKey}`}
      onClick={() =>
        dispatchGlobal(
          aumentarZindexAction(
            `${boletaName}${appKey}`,
            zIndex,
            show[visibilityIndex][boletaName],
          ),
        )
      }
    >
      {children}
    </Animate>
  );
};

export default Boleta;
