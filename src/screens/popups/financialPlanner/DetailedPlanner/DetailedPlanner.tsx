import React, { useCallback } from "react";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/componentes/DraggablePopup/DraggablePopup";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import WalletEvolution from "./WalletEvolution/WalletEvolution";
import PlannerProjection from "./PlannerProjection/PlannerProjection";
import ResultPerformance from "./ResultPerformance/ResultPerformance";

const DetailedPlanner: React.FC = () => {
  const {
    systemReducer: { isOpenDetailedPlanner },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(
      abrirItemBarraLateralAction(
        { isOpenDetailedPlanner },
        "isOpenDetailedPlanner",
      ),
    );
  }, [dispatch, isOpenDetailedPlanner]);

  return (
    <DraggablePopup
      popupDivKey="detailedPlanner"
      popupVisibility={isOpenDetailedPlanner}
    >
      <div id="detailedPlanner">
        <div className="mcontent">
          <ModalHeaderClean
            titulo="Carteira de investimentos"
            headerClass="border-green"
            onClose={onClose}
          />

          <div className="topContent">
            <PlannerProjection />
            <ResultPerformance />
          </div>
          
          <WalletEvolution />
        </div>
      </div>
    </DraggablePopup>
  );
};

export default DetailedPlanner;
