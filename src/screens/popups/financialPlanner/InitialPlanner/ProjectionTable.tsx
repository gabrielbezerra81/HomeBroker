import React, { useMemo, useCallback } from "react";
import { FormControl, Table } from "react-bootstrap";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
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

  const {
    contribution,
    listing,
    ratePeriodicity,
    interestRate,
  } = initialPlanner;

  const formattedContribution = useMemo(
    () => formatarNumDecimal(contribution, 2),
    [contribution],
  );

  const handleInputChange = useCallback(
    (value: any, event: any) => {
      const { name } = event.target;

      dispatch(
        updateManyFinancialPlannerAction({
          initialPlanner: { ...initialPlanner, [name]: value },
        }),
      );
    },
    [dispatch, initialPlanner],
  );

  const listingOptions = useMemo(() => {
    const options = [];

    if (ratePeriodicity === "por semana") {
      options.push(<option value={"semanal"}>semanal</option>);
    }

    options.push(
      <option value={"mensal"}>mensal</option>,
      <option value={"anual"}>anual</option>,
    );

    return options;
  }, [ratePeriodicity]);

  const formattedRate = useMemo(() => {
    if (ratePeriodicity === "por ano") {
      if (listing === "mensal") {
        return formatarNumDecimal(
          convertInterestRate(interestRate / 100, "year", "month") * 100,
        );
      }
    }

    return formatarNumDecimal(interestRate);
  }, [ratePeriodicity, listing, interestRate]);

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
          {data.map((monthItem, index) => {
            let showContribution = true;

            if (
              ["por mês", "por ano"].includes(ratePeriodicity) &&
              listing === "mensal" &&
              index === 0
            ) {
              showContribution = false;
            }

            if (ratePeriodicity === "por semana") {
              if (listing === "semanal") {
                if (index < 1) {
                  showContribution = false;
                }
              }

              if (listing === "mensal") {
                if (index === 0) {
                  showContribution = false;
                }
              }
            }

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{monthItem.formattedPeriod}</td>
                <td>{showContribution && formattedContribution}</td>
                <td>{monthItem.formattedCalcBase}</td>
                <td>
                  {listing === "anual"
                    ? monthItem.formattedTotalPercent
                    : formattedRate}
                </td>
                <td>{monthItem.formattedMonthIncome}</td>

                <td>{monthItem.formattedTotalPercent}</td>
                <td>{monthItem.formattedTotalIncome}</td>

                <td>{monthItem.formattedTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectionTable;
