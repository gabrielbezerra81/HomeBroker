import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, { useCallback, useMemo } from "react";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import DraggablePopup from "shared/components/DraggablePopup/DraggablePopup";

import TableOptionsModule from "table-options";
// "table-options": "https://github.com/adrianolsa/optiontable.git",

import "../styles/OptionsTable.scss";

const OptionsTable: React.FC = () => {
  const {
    systemReducer: { isOpenOptionsTable },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenOptionsTable", null, false));
  }, [dispatch]);

  const onConfig = useCallback(() => {}, []);

  const props = useMemo(() => {
    return { handleExit: onClose, handleSettings: onConfig };
  }, [onClose, onConfig]);

  return (
    <DraggablePopup
      popupDivKey="optionsTable"
      popupVisibility={isOpenOptionsTable}
      handleDragClass=".draggableNavbar"
    >
      <div id="optionsTable">
        <div className="mcontent">
          <TableOptionsModule navbarActions={props} />
        </div>
      </div>
    </DraggablePopup>
  );
};

export default OptionsTable;
