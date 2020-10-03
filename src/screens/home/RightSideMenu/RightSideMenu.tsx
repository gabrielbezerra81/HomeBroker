import { Divider } from "antd";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { MDBIcon } from "mdbreact";
import React, { useCallback, useMemo } from "react";
import { updateOneSystemStateAction } from "redux/actions/system/SystemActions";

const RightSideMenu: React.FC = () => {
  const {
    systemReducer: { isOpenRightSideMenu },
  } = useStateStorePrincipal();
  const dispatch = useDispatchStorePrincipal();

  const handleChangeMenuVisibility = useCallback(() => {
    dispatch(
      updateOneSystemStateAction("isOpenRightSideMenu", !isOpenRightSideMenu),
    );
  }, [dispatch, isOpenRightSideMenu]);

  const arrowRotationClass = useMemo(() => {
    return isOpenRightSideMenu ? "arrowRotateToRight" : "";
  }, [isOpenRightSideMenu]);

  const closedMenuContentClass = useMemo(() => {
    return isOpenRightSideMenu ? "" : "closedRightMenu";
  }, [isOpenRightSideMenu]);

  const menuItemOpacity = useMemo(() => {
    return isOpenRightSideMenu ? "" : "menuItemHidden";
  }, [isOpenRightSideMenu]);

  return (
    <div className="rightSideMenu">
      <div className="rightSideBar">
        <div tabIndex={0} onClick={handleChangeMenuVisibility}>
          <MDBIcon className={arrowRotationClass} icon="angle-left" size="lg" />
        </div>

        <div className={menuItemOpacity}></div>
        <div className={menuItemOpacity}></div>
        <div className={menuItemOpacity}></div>
        <div className={menuItemOpacity}></div>
      </div>
      <div className={`menuContent ${closedMenuContentClass}`}></div>
    </div>
  );
};

export default RightSideMenu;
