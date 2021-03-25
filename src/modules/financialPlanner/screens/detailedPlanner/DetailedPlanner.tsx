import React, { useCallback, useEffect } from "react";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/components/DraggablePopup/DraggablePopup";
import { PopupHeader } from "shared/components/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import WalletEvolution from "./walletEvolution/WalletEvolution";
import PlannerProjection from "./plannerProjection/PlannerProjection";

import "../../styles/detailedPlanner/detailedPlanner.scss";
import { listSimulationsAction } from "modules/financialPlanner/duck/actions/detailedPlannerActions";

const DetailedPlanner: React.FC = () => {
  const {
    systemReducer: { isOpenDetailedPlanner },
    financialPlannerReducer: { detailedPlanner },
  } = useStateStorePrincipal();

  const { simulations } = detailedPlanner;

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(abrirItemBarraLateralAction("isOpenDetailedPlanner"));
  }, [dispatch]);

  useEffect(() => {
    if (simulations.length === 0) {
      dispatch(listSimulationsAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DraggablePopup
      popupDivKey="detailedPlanner"
      popupVisibility={isOpenDetailedPlanner}
    >
      <div id="detailedPlanner">
        <div className="mcontent">
          <PopupHeader
            headerTitle="Carteira de investimentos"
            onClose={onClose}
          />

          <div className="topContent">
            <PlannerProjection />
          </div>

          <WalletEvolution />
        </div>
      </div>
    </DraggablePopup>
  );
};

export default DetailedPlanner;
