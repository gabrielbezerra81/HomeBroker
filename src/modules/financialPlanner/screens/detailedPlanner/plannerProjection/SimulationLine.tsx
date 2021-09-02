import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import {
  changeSimulationAction,
  removeSimulationAction,
} from "modules/financialPlanner/duck/actions/detailedPlannerActions";
import { DetailedProjection } from "modules/financialPlanner/types/FinancialPlannerState";

import { FiX } from "react-icons/fi";

import cogIcon from "assets/multiBox/cogIcon.png";
import openInNewIcon from "assets/multiBox/openInNewIcon.png";

import React, { useCallback, useMemo, useState } from "react";
import { FormControl } from "react-bootstrap";
import CustomInput from "shared/components/CustomInput";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";
import CustomTooltip from "shared/components/CustomTooltip";
import { updateInitialPlannerStateAction } from "modules/financialPlanner/duck/actions/initialPlannerActions";
import { convertFrequencyToLocalValues } from "../../utils";
import { abrirItemBarraLateralAction } from "redux/actions/system/SystemActions";
import { atualizarDivKeyAction } from "redux/actions/GlobalAppActions";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

interface Props {
  totalResult: number;
  simulation: DetailedProjection;
  simIndex: number;
  totalInvested: number;
}

const SimulationLine: React.FC<Props> = ({
  totalResult,
  simulation,
  simIndex,
  totalInvested,
}) => {
  const dispatchGlobal = useDispatchGlobalStore();
  const dispatch = useDispatchStorePrincipal();

  const [showMenu, setShowMenu] = useState(false);
  const [showTaxTooltip, setShowTaxTooltip] = useState(false);

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

  const dismissTooltipOnLineClick = useCallback(() => {
    setShowMenu(false);
    setShowTaxTooltip(false);
  }, []);

  const handleOpenConfigMenu = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowMenu((value) => !value);
    },
    [],
  );

  const handleOpenTaxTooltip = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      setShowTaxTooltip((value) => !value);
    },
    [],
  );

  const handleDetailInvestment = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleExportToInitialPlanner = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      // prevent zIndex increase on detailed planner
      e.stopPropagation();

      setShowMenu(false);

      dispatch(
        updateInitialPlannerStateAction({
          initialValue: simulation.initialDeposit,
          interestRate: simulation.rate,
          ratePeriodicity: convertFrequencyToLocalValues(
            simulation.rateFrequency,
          ),
          contribution: simulation.periodicDeposit,
          contributionPeriodicity: convertFrequencyToLocalValues(
            simulation.depositFrequency,
          ),
          listing: simulation.rateFrequency,
          periodValue: simulation.periodValue,
          periodicity: simulation.periodType,
        }),
      );

      dispatchGlobal(atualizarDivKeyAction("initialPlanner"));
      dispatch(abrirItemBarraLateralAction("isOpenInitialPlanner", true));
    },
    [
      dispatch,
      dispatchGlobal,
      simulation.depositFrequency,
      simulation.initialDeposit,
      simulation.periodType,
      simulation.periodValue,
      simulation.periodicDeposit,
      simulation.rate,
      simulation.rateFrequency,
    ],
  );

  const handleRemoveSimulation = useCallback(async () => {
    await dispatch(removeSimulationAction(simulation.id));
    setShowMenu(false);
  }, [dispatch, simulation.id]);

  const periodTypeOptions = useMemo(() => {
    const options = [
      <option key="anos" value={"anos"}>
        anos
      </option>,
      <option key="meses" value={"meses"}>
        meses
      </option>,
    ];

    if (simulation.rateFrequency === "semanal") {
      options.push(
        <option key="semanas" value={"semanas"}>
          semanas
        </option>,
      );
    }

    return options;
  }, [simulation.rateFrequency]);

  // financial is editable and has the initial value of calcBase
  const financialValue = useMemo(
    () => simulation.financialValue || simulation.calcBase,
    [simulation.calcBase, simulation.financialValue],
  );

  const percent100 = useMemo(() => {
    const value = (financialValue || 0) / totalInvested;

    return value * 100;
  }, [financialValue, totalInvested]);

  const configMenuContent = useMemo(() => {
    return (
      <div>
        <header>
          <button onClick={handleOpenConfigMenu} className="brokerCustomButton">
            <FiX color="#ce202a" size={10} strokeWidth={3} />
          </button>
        </header>

        <main>
          <button
            onClick={handleDetailInvestment}
            className="brokerCustomButton"
          >
            <img className="export" src={openInNewIcon} alt="" />
            <span>Detalhar Investimento</span>
          </button>

          <button
            onClick={handleExportToInitialPlanner}
            className="brokerCustomButton"
          >
            <img className="export" src={openInNewIcon} alt="" />
            <span>Carregar no simulador</span>
          </button>
          <PopConfirm
            onConfirm={handleRemoveSimulation}
            title="Excluir simulação"
            message="Tem certeza que deseja excluir esta simulação?"
            cancelButtonStyle={{
              variant: "secondary",
            }}
          >
            <button className="brokerCustomButton">
              <FiX color="#ce202a" size={13} strokeWidth={3} />
              <span>Excluir</span>
            </button>
          </PopConfirm>
        </main>
      </div>
    );
  }, [
    handleDetailInvestment,
    handleExportToInitialPlanner,
    handleOpenConfigMenu,
    handleRemoveSimulation,
  ]);

  const taxTooltipContent = useMemo(() => {
    return (
      <div>
        <header>
          <button onClick={handleOpenTaxTooltip} className="brokerCustomButton">
            <FiX color="#ce202a" size={10} strokeWidth={3} />
          </button>
        </header>
        <main>
          {simulation.taxes?.map((tax, index) => (
            <div key={`${tax.description}${index as any}`}>
              <span>{tax.description}: </span>
              <span>R$ {formatarNumDecimal(tax.value, 2, 2)}</span>
            </div>
          ))}
          <div>
            <span>Total: </span>
            <span>R$ {simulation.formattedTaxTotal}</span>
          </div>
        </main>
      </div>
    );
  }, [handleOpenTaxTooltip, simulation.formattedTaxTotal, simulation.taxes]);

  return (
    <tr onClick={dismissTooltipOnLineClick} key={simulation.id}>
      <td>
        <CustomTooltip
          id={`simulation${simIndex}`}
          show={showMenu}
          content={configMenuContent}
          tooltipClassName="simulationConfigMenu"
        >
          <button
            onClick={handleOpenConfigMenu}
            className="brokerCustomButton configButton"
          >
            <img src={cogIcon} alt="config" />
          </button>
        </CustomTooltip>
      </td>
      <td>{simulation.formattedStartDate}</td>
      <td>{simulation.formattedEndDate}</td>
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
            {periodTypeOptions}
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
            value={financialValue}
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
            disabled
            value={percent100}
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
          <CustomTooltip
            id={`taxTooltip${simIndex}`}
            show={showTaxTooltip}
            content={taxTooltipContent}
            tooltipClassName="simulationTaxTooltip"
          >
            <button
              onClick={handleOpenTaxTooltip}
              className="brokerCustomButton"
            >
              <span>{simulation?.taxPercent} %</span>
            </button>
          </CustomTooltip>
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
