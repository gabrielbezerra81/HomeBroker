import React, { useMemo, useCallback } from "react";
import { FormControl, Table } from "react-bootstrap";

import { updateInitialPlannerStateAction } from "modules/financialPlanner/duck/actions/financialPlannerActions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { Projection, FormattedProjection } from "./InitialPlanner";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { convertInterestRate } from "../utils";

interface Props {
  data: Array<Projection & FormattedProjection>;
}

const ProjectionTable: React.FC<Props> = ({ data }) => {
  const {
    financialPlannerReducer: { initialPlanner },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { listing, ratePeriodicity, interestRate } = initialPlanner;

  const handleInputChange = useCallback(
    (value: any, event: any) => {
      const { name } = event.target;

      dispatch(updateInitialPlannerStateAction({ [name]: value }));
    },
    [dispatch],
  );

  const listingOptions = useMemo(() => {
    const options = [];

    if (ratePeriodicity === "por semana") {
      options.push(
        <option key="semanal" value={"semanal"}>
          semanal
        </option>,
      );
    }

    options.push(
      <option key="mensal" value={"mensal"}>
        mensal
      </option>,
      <option key="anual" value={"anual"}>
        anual
      </option>,
    );

    return options;
  }, [ratePeriodicity]);

  const formattedRate = useMemo(() => {
    let rate = interestRate;

    if (ratePeriodicity === "por ano") {
      if (listing === "mensal") {
        rate = convertInterestRate(interestRate / 100, "year", "month") * 100;
      }
    } //
    else if (ratePeriodicity === "por semana") {
      if (listing === "mensal") {
        rate = convertInterestRate(interestRate / 100, "week", "month") * 100;
      } //
      else if (listing === "anual") {
        rate = convertInterestRate(interestRate / 100, "week", "year") * 100;
      }
    }

    return formatarNumDecimal(rate, 2);
  }, [ratePeriodicity, listing, interestRate]);

  const formattedData = useMemo(() => {
    const formatted = data.map((projectionItem, index) => {
      let viewedRate = formattedRate;

      let startOrder = 1;

      if (data[0].order === 0) {
        startOrder = 0;
      }

      if (projectionItem.order === 0) {
        // impede a formatação da linha inicial com order 0
        return projectionItem;
      }

      let viewedPeriodIncome: any = projectionItem.periodIncome;

      if (ratePeriodicity === "por semana") {
        viewedPeriodIncome = projectionItem.totalIncome;

        if (data[index - 1]) {
          viewedPeriodIncome -= data[index - 1].totalIncome;
        }
      }

      let viewContribution = projectionItem.investment;

      if (data[index - 1]) {
        viewContribution -= data[index - 1].investment;
      }

      const formattedContribution = formatarNumDecimal(viewContribution, 2);

      const viewedContribution = formattedContribution;

      viewedPeriodIncome = formatarNumDecimal(viewedPeriodIncome);

      return {
        ...projectionItem,
        order: index + startOrder,
        viewedContribution,
        viewedRate,
        viewedPeriodIncome,
      };
    });

    return formatted;
  }, [data, formattedRate, ratePeriodicity]);

  return (
    <div className="projectionContainer">
      <div>
        <span>Listagem:</span>
        <FormControl
          as="select"
          className="darkInputSelect"
          name="listing"
          onChange={(e) => handleInputChange(e.target.value, e)}
          value={listing}
        >
          {listingOptions}
        </FormControl>
      </div>
      <Table borderless striped={false}>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th colSpan={4}>Rendimento</th>
            <th></th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th colSpan={2}>Período</th>
            <th colSpan={2}>Total</th>
            <th></th>
          </tr>

          <tr>
            <th>ORD.</th>
            <th>Período</th>
            <th>Aporte</th>
            <th>Base de Cálc</th>
            <th>%</th>
            <th>Valor</th>
            <th>%</th>
            <th>Valor</th>
            <th>Acumulado</th>
          </tr>
        </thead>
        <tbody>
          {formattedData.map((projectionItem, index) => {
            return (
              <tr key={index}>
                <td>{projectionItem.order}</td>
                <td>{projectionItem.formattedPeriod}</td>
                <td>{projectionItem.viewedContribution}</td>
                <td>{projectionItem.formattedCalcBase}</td>
                <td>{projectionItem.viewedRate}</td>
                <td>{projectionItem.viewedPeriodIncome}</td>

                <td>{projectionItem.formattedTotalPercent}</td>
                <td>{projectionItem.formattedTotalIncome}</td>

                <td>{projectionItem.formattedTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectionTable;
