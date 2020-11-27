import React, { useState, useMemo, useCallback, useEffect } from "react";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import DraggablePopup from "shared/componentes/DraggablePopup/DraggablePopup";
import { ModalHeaderClean } from "shared/componentes/PopupHeader";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import CustomInput from "shared/componentes/CustomInput";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
import { FormControl } from "react-bootstrap";

const InitialPlanner: React.FC = () => {
  const {
    systemReducer: { isOpenInitialPlanner },
    financialPlannerReducer: {
      initialValue,
      mensalValue,
      interestRate,
      period,
    },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const onClose = useCallback(() => {
    dispatch(
      abrirItemBarraLateralAction(
        { isOpenInitialPlanner },
        "isOpenInitialPlanner",
      ),
    );
  }, [dispatch, isOpenInitialPlanner]);

  const handleInputChange = (value: any, event: any) => {
    const { name } = event.target;

    dispatch(
      updateManyFinancialPlannerAction({
        [name]: value,
      }),
    );
  };

  return (
    <DraggablePopup
      popupDivKey="initialPlanner"
      popupVisibility={isOpenInitialPlanner}
    >
      <div id="initialPlanner">
        <div className="mcontent">
          <ModalHeaderClean
            titulo="Carregando simulador"
            headerClass="border-green"
            onClose={onClose}
          />

          <div>
            <div className="inputsAndGraphContainer">
              <div>
                <h6>Valor inicial:</h6>
                <CustomInput
                  value={initialValue}
                  type="preco"
                  name="initialValue"
                  step={1}
                  onChange={(v, e) => handleInputChange(v, e)}
                  renderArrows={false}
                  theme="dark"
                />
                <span></span>
              </div>

              <div>
                <h6>Valor mensal:</h6>
                <CustomInput
                  value={mensalValue}
                  type="preco"
                  name="mensalValue"
                  step={1}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                />
                <h6>Quanto pode investir por mês?</h6>
              </div>

              <div>
                <h6>Taxa de juros:</h6>
                <CustomInput
                  value={interestRate}
                  type="preco"
                  name="interestRate"
                  step={0.01}
                  onChange={handleInputChange}
                  renderArrows={false}
                  theme="dark"
                  suffix=" %"
                />
                <h6>Rentabilidade mensal?</h6>
              </div>

              <div>
                <h6>Período em:</h6>
                <FormControl as="select" className="darkInputSelect">
                  <option value={10}>10 anos</option>
                </FormControl>{" "}
                <span></span>
              </div>

              <div>
                <h6>Total investido:</h6>
                <h6>R$ 61.000,00</h6>
                <span></span>
              </div>

              <div>
                <h6>Total ganho em juros:</h6>
                <h6>R$ 31.635,44</h6>
                <span></span>
              </div>

              <div>
                <h6>Total</h6>
                <h6>R$ 92.635,44</h6>
                <span></span>
              </div>
            </div>
            <div className="projectionContainer"></div>
          </div>
        </div>
      </div>
    </DraggablePopup>
  );
};

export default InitialPlanner;
