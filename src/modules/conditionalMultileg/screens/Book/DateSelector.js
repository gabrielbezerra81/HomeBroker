import React from "react";
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { getformatedDate } from "shared/utils/Formatacoes";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { cond_updateMultilegTabAction } from "../../duck/actions/ConditionalMultilegActions";

const DateSelector = ({ tabIndex }) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = useStateStorePrincipal();

  const multilegTab = multileg[tabIndex];

  const dispatch = useDispatchStorePrincipal();

  return multilegTab.validadeSelect !== "SPECIFIED_DAY" ? (
    Select({
      dateOptionLabel: "ATÉ O DIA",
      multilegTab,
      tabIndex,
      dispatch,
    })
  ) : (
    <MultilegDatePicker tabIndex={tabIndex} />
  );
};

export default DateSelector;

const MultilegDatePicker = ({ tabIndex }) => {
  const {
    conditionalMultilegReducer: { multileg },
  } = useStateStorePrincipal();

  const multilegTab = multileg[tabIndex];

  const dispatch = useDispatchStorePrincipal();

  return (
    <DatePicker
      className={`form-control textInput ${
        multilegTab.validadeSelect === "SPECIFIED_DAY" ? "formDatepicker" : ""
      }`}
      selected={multilegTab.date}
      onChange={(data) =>
        dispatch(
          cond_updateMultilegTabAction({
            tabIndex,
            attributeName: "date",
            attributeValue: data,
          }),
        )
      }
      dateFormat="dd/MM/yyyy"
      popperPlacement="auto"
      autoFocus
      customInput={Select({
        dateOptionLabel: getformatedDate(multilegTab.date),
        tabIndex,
        dispatch,
        multilegTab,
      })}
    />
  );
};

const Select = ({ dateOptionLabel, tabIndex, dispatch, multilegTab }) => {
  return (
    <span>
      <Form.Control
        as="select"
        className={`textInput ${
          multilegTab.validadeSelect === "SPECIFIED_DAY"
            ? "inputDate"
            : "inputValidade"
        }`}
        value={multilegTab.validadeSelect}
        onChange={(event) =>
          dispatch(
            cond_updateMultilegTabAction({
              tabIndex,
              attributeName: "validadeSelect",
              attributeValue: event.currentTarget.value,
            }),
          )
        }
        autoFocus
      >
        <option value="DAY">HOJE</option>
        <option value="SPECIFIED_DAY">{dateOptionLabel}</option>
        <option value="GTC">ATÉ CANCELAR</option>
      </Form.Control>
    </span>
  );
};
