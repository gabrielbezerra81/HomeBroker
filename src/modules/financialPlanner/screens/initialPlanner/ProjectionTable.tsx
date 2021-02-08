import React, { useMemo, useCallback } from "react";
import { FormControl, Table } from "react-bootstrap";

import moment from "moment";

import { updateManyFinancialPlannerAction } from "modules/financialPlanner/duck/actions/financialPlannerActions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { Projection, FormattedProjection } from "./InitialPlanner";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { convertContribution, convertInterestRate } from "../utils";
import { InitialPlannerData } from "modules/financialPlanner/types/FinancialPlannerState";

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

  const formattedInitialInvest = useMemo(() => {
    return formatarNumDecimal(initialValue, 2);
  }, [initialValue]);

  const formattedData = useMemo(() => {
    const formatted = data.map((projectionItem, index) => {
      let showContribution = true;

      let viewedRate = formattedRate;

      let viewedPeriodIncome: any = projectionItem.periodIncome;

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

        viewedPeriodIncome = projectionItem.totalIncome;

        if (data[index - 1]) {
          viewedPeriodIncome -= data[index - 1].totalIncome;
        }
      }

      const viewContribution = getContributionByListing({
        listing,
        contribution,
        contributionPeriodicity,
        projectionItem,
        index,
        data,
      });

      const formattedContribution = formatarNumDecimal(viewContribution, 2);

      const viewedContribution = showContribution
        ? formattedContribution
        : formattedInitialInvest;

      if (listing === "anual") {
        // viewedRate = projectionItem.formattedTotalPercent;
      } //

      viewedPeriodIncome = formatarNumDecimal(viewedPeriodIncome);

      return {
        ...projectionItem,
        order: index + 1,
        viewedContribution,
        viewedRate,
        viewedPeriodIncome,
      };
    });

    return formatted;
  }, [
    contribution,
    contributionPeriodicity,
    data,
    formattedInitialInvest,
    formattedRate,
    listing,
    ratePeriodicity,
  ]);

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
                <td>{index + 1}</td>
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

interface GetContribution
  extends Pick<
    InitialPlannerData,
    "listing" | "contribution" | "contributionPeriodicity"
  > {
  projectionItem: Projection & FormattedProjection;
  index: number;
  data: (Projection & FormattedProjection)[];
}

const getContributionByListing = ({
  listing,
  contribution,
  contributionPeriodicity,
  projectionItem,
  index,
  data,
}: GetContribution) => {
  let convertContribTo = "";
  let periodInMonths = 0;

  if (listing === "mensal") {
    convertContribTo = "por mês";
  } else if (listing === "semanal") {
    convertContribTo = "por semana";
  } else if (listing === "anual") {
    convertContribTo = "por ano";

    let previousDate = (null as unknown) as Date;

    // o primeiro período não tem aporte, portanto é excluído
    if (index === 0) {
      previousDate = moment().startOf("month").toDate();

      if (contributionPeriodicity === "por semana") {
        periodInMonths -= 1 / 4.3571;
      } //
      else {
        periodInMonths -= 1;
      }
    } //
    else {
      previousDate = moment(data[index - 1].period)
        .endOf("month")
        .toDate();
    }

    const duration = moment.duration(
      moment(projectionItem.period).diff(previousDate),
    );

    periodInMonths += duration.asMonths();

    if (contributionPeriodicity !== "por semana") {
      periodInMonths = +periodInMonths.toFixed(0);
    }
  }

  const contrib = convertContribution({
    contribution,
    contributionPeriodicity,
    ratePeriodicity: convertContribTo as any,
    convertMode: "visualize",
  });

  // console.log(periodInMonths);
  // console.log(projectionItem);

  if (listing === "anual") {
    return (contrib / 12) * periodInMonths;
  }

  // console.log(contrib);

  return contrib;
};
