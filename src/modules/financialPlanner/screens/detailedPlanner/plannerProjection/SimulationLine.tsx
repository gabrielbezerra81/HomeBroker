import {
  Simulation,
  SimulationResult,
} from "modules/financialPlanner/types/FinancialPlannerState";
import React from "react";
import { FormControl } from "react-bootstrap";
import CustomInput from "shared/components/CustomInput";
import { formatarNumDecimal } from "shared/utils/Formatacoes";

interface Props {
  totalResult: number;
  simulation: Simulation & SimulationResult;
}

const SimulationLine: React.FC<Props> = ({ totalResult, simulation }) => {
  return (
    <tr key={simulation.id}>
      <td>
        <div className="cellContent periodCell">
          <FormControl
            className="darkSimpleInput"
            name="period"
            maxLength={2}
            placeholder="0"
            value={simulation.period}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="periodType"
            value={simulation.periodType}
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
            onChange={() => {}}
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
            onChange={() => {}}
            value={simulation.rate}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="rateFrequency"
            value={simulation.rateFrequency}
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
            onChange={() => {}}
            value={simulation.periodicDeposit}
          />
          <FormControl
            as="select"
            className="darkInputSelect"
            name="depositFrequency"
            value={simulation.depositFrequency}
          >
            <option value="anual">ano</option>
            <option value="mensal">mês</option>
            <option value="semanal">semana</option>
          </FormControl>
        </div>
      </td>
      <td>
        <div className="cellContent incomeColumn">
          <CustomInput
            type="preco"
            name="income"
            step={0.01}
            renderArrows={false}
            theme="dark"
            onChange={() => {}}
            value={simulation.total}
          />
        </div>
      </td>
      <td>
        <div className="cellContent taxColumn">
          <CustomInput
            type="preco"
            name="tax"
            step={0.01}
            renderArrows={false}
            theme="dark"
            onChange={() => {}}
            value=""
          />
        </div>
      </td>
      <td>
        {formatarNumDecimal(100 * (simulation.total / totalResult), 2, 2)}%
      </td>
    </tr>
  );
};

export default SimulationLine;
