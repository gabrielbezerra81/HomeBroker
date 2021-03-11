import React from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";
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

  return (
    <Row className="mr-2 mb-2 multilegInputGroup">
      <Col md={5} className="ml-2">
        <h6>Validade</h6>
      </Col>

      <Col>
        {multilegTab.validadeSelect !== "SPECIFIED_DAY" ? (
          Select({
            dateOptionLabel: "ATÉ O DIA",
            multilegTab,
            tabIndex,
            dispatch,
          })
        ) : (
          <MultilegDatePicker tabIndex={tabIndex} />
        )}
      </Col>
    </Row>
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
      popperPlacement="top-end"
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
