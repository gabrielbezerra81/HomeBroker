import React, { useMemo, useCallback } from "react";
import { FormControl, Table } from "react-bootstrap";
import { updateManyFinancialPlannerAction } from "redux/actions/financialPlanner/financialPlannerActions";
import { formatarNumDecimal } from "shared/utils/Formatacoes";
import { MonthProjection, FormattedProjection } from "./InitialPlanner";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface Props {
  data: Array<MonthProjection & FormattedProjection>;
}

const ProjectionTable: React.FC<Props> = ({ data }) => {
  const {
    financialPlannerReducer: { initialPlanner },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { contribution, listing, ratePeriodicity } = initialPlanner;

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
            <th colSpan={2}>Rendimento no período</th>
            <th colSpan={2}>Rendimento Total</th>
            <th></th>
          </tr>
          <tr>
            <th>ORD.</th>
            <th>Período</th>
            <th>Aporte</th>
            <th>Base de Cálc</th>
            <th>Valor</th>
            <th>%</th>
            <th>Valor</th>
            <th>%</th>
            <th>Acumulado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((monthItem, index) => (
            <tr key={monthItem.formattedPeriod}>
              <td>{index + 1}</td>
              <td>{monthItem.formattedPeriod}</td>
              <td>{formattedContribution}</td>
              <td>{monthItem.formattedCalcBase}</td>
              <td>{monthItem.formattedMonthIncome}</td>
              <td>
                {listing === "anual"
                  ? monthItem.formattedTotalPercent
                  : monthItem.formattedRentability}
              </td>
              <td>{monthItem.formattedTotalIncome}</td>
              <td>{monthItem.formattedTotalPercent}</td>
              <td>{monthItem.formattedTotal}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjectionTable;
