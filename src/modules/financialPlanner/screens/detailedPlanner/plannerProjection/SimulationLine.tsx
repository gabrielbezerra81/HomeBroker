import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  changeSimulationAction,
  removeSimulationAction,
} from "modules/financialPlanner/duck/actions/detailedPlannerActions";
import { DetailedProjection } from "modules/financialPlanner/types/FinancialPlannerState";

import { FiX } from "react-icons/fi";

import React, { useCallback } from "react";
import { FormControl } from "react-bootstrap";
import CustomInput from "shared/components/CustomInput";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";

interface Props {
  totalResult: number;
  simulation: DetailedProjection;
  simIndex: number;
}

const SimulationLine: React.FC<Props> = ({
  totalResult,
  simulation,
  simIndex,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.currentTarget;

      dispatch(changeSimulationAction({ attr: name, value, simIndex }));
    },
    [dispatch, simIndex],
  );

  const handlePriceInputChange = useCallback(
    (value, event) => {
      const { name } = event.target;

      dispatch(changeSimulationAction({ attr: name, value, simIndex }));
    },
    [dispatch, simIndex],
  );

  const handleRemoveSimulation = useCallback(async () => {
    await dispatch(removeSimulationAction(simulation.id));
  }, [dispatch, simulation.id]);

  return (
    <tr key={simulation.id}>
      <td>
        <PopConfirm
          onConfirm={handleRemoveSimulation}
          title="Excluir simulação"
          message="Tem certeza que deseja excluir esta simulação?"
          cancelButtonStyle={{
            variant: "secondary",
          }}
        >
          <button className="brokerCustomButton">
            <FiX color="#ce202a" size={10} strokeWidth={3} />
          </button>
        </PopConfirm>
      </td>
      <td>
        <div className="cellContent periodCell">
          <FormControl
            className="darkSimpleInput"
            name="period"
            maxLength={2}
            placeholder="0"
            value={simulation.periodValue}
            onChange={handleInputChange}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="periodType"
            value={simulation.periodType}
            onChange={handleInputChange}
          >
            <option value={"anos"}>anos</option>
            <option value={"meses"}>meses</option>
            <option value={"semanas"}>semanas</option>
          </FormControl>
        </div>
      </td>
      <td>
        <div className="cellContent">
          <FormControl
            className="darkSimpleInput"
            name="title"
            placeholder="Investimento"
            value={simulation.title}
            onChange={handleInputChange}
          />
        </div>
      </td>

      <td>
        <div className="cellContent financialValueCell">
          <CustomInput
            type="preco"
            name="financialValue"
            step={0.01}
            renderArrows={false}
            theme="dark"
            onChange={handlePriceInputChange}
            value={simulation.financialValue || simulation.calcBase}
          />
        </div>
      </td>

      <td>
        <div className="cellContent column100">
          <CustomInput
            type="preco"
            name="100%"
            step={0.01}
            renderArrows={false}
            theme="dark"
            suffix="%"
            onChange={handlePriceInputChange}
            value=""
          />
        </div>
      </td>
      <td>
        <div className="cellContent">
          {/* rentabilidade */}
          <CustomInput
            type="preco"
            name="rate"
            step={0.01}
            renderArrows={false}
            theme="dark"
            suffix="%"
            onChange={handlePriceInputChange}
            value={simulation.rate}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="rateFrequency"
            value={simulation.rateFrequency}
            onChange={handleInputChange}
          >
            <option value={"anual"}>ano</option>
            <option value={"mensal"}>mês</option>
            <option value="semanal">semana</option>
          </FormControl>
        </div>
      </td>
      <td>
        <div className="cellContent contributionCell">
          {/* aporte */}
          <CustomInput
            type="preco"
            name="periodicDeposit"
            step={0.01}
            renderArrows={false}
            theme="dark"
            onChange={handlePriceInputChange}
            value={simulation.periodicDeposit}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="depositFrequency"
            value={simulation.depositFrequency}
            onChange={handleInputChange}
          >
            <option value="anual">ano</option>
            <option value="mensal">mês</option>
            <option value="semanal">semana</option>
          </FormControl>
        </div>
      </td>
      <td>
        <div className="cellContent incomeColumn">
          {simulation?.formattedTotalIncome}
        </div>
      </td>
      <td className="taxColumn">
        <div className="cellContent">
          <CustomInput
            type="preco"
            name="tax"
            step={0.01}
            renderArrows={false}
            theme="dark"
            onChange={() => {}}
            value={simulation?.formattedTax}
            disabled
            suffix="%"
          />
        </div>
      </td>
      <td>
        <div className="cellContent incomeColumn">
          {simulation?.formattedRealIncomePercentage}
        </div>
      </td>
      <td>
        <div className="cellContent incomeColumn">
          {simulation?.formattedRealIncome}
        </div>
      </td>
      <td>{simulation?.formattedTotal}</td>
      <td>
        {formatarNumDecimal(
          100 * ((simulation?.total || 0) / totalResult),
          2,
          2,
        )}
        %
      </td>

      {/* <td></td>
      <td></td>
      <td></td> */}
    </tr>
  );
};

export default SimulationLine;
