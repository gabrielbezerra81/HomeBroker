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

  return (
    <div className="rightSideMenu">
      <div className="rightSideBar">
        <div>
          <MDBIcon
            className={arrowRotationClass}
            icon="angle-left"
            size="lg"
            onClick={handleChangeMenuVisibility}
          />
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={`menuContent ${closedMenuContentClass}`}></div>
    </div>
  );
};

export default RightSideMenu;
