import React, { useMemo, useCallback } from "react";
import { FormControl, Table } from "react-bootstrap";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { Projection, FormattedProjection } from "./InitialPlanner";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { convertContribution, convertInterestRate } from "../utils";
import { InitialPlannerData } from "types/financialPlanner/FinancialPlannerState";

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
    contributionPeriodicity,
    initialValue,
  } = initialPlanner;

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

  const formattedInitialInvest = useMemo(() => {
    return formatarNumDecimal(initialValue, 2);
  }, [initialValue]);

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

            const viewContribution = getContributionByListing({
              listing,
              contribution,
              contributionPeriodicity,
              projectionItem: monthItem,
              index,
            });

            const formattedContribution = formatarNumDecimal(
              viewContribution,
              2,
            );

            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{monthItem.formattedPeriod}</td>
                <td>
                  {showContribution
                    ? formattedContribution
                    : formattedInitialInvest}
                </td>
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

interface GetContribution
  extends Pick<
    InitialPlannerData,
    "listing" | "contribution" | "contributionPeriodicity"
  > {
  projectionItem: Projection & FormattedProjection;
  index: number;
}

const getContributionByListing = ({
  listing,
  contribution,
  contributionPeriodicity,
  projectionItem,
  index,
}: GetContribution) => {
  let convertContribTo = "";
  let contribYearDiff = 0;

  if (listing === "mensal") {
    convertContribTo = "por mês";
  } else if (listing === "semanal") {
    convertContribTo = "por semana";
  } else if (listing === "anual") {
    convertContribTo = "por ano";
    const monthNumber = projectionItem.period.getMonth() + 1;
    contribYearDiff = 12 - monthNumber;

    // o primeiro mês não tem aporte, portanto é excluído
    if (index === 0) {
      const monthsPassed = new Date().getMonth();
      contribYearDiff += 1 + monthsPassed;
    }
  }

  const contrib =
    convertContribution({
      contribution,
      contributionPeriodicity,
      ratePeriodicity: convertContribTo as any,
      convertMode: "visualize",
    }) -
    contribYearDiff * contribution;

  return contrib;
};
