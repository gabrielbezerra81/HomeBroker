import React, { useCallback } from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Form } from "react-bootstrap";
import { getformatedDate } from "shared/utils/Formatacoes";
import useStateBoletas from "hooks/useStateBoletas";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import {
  mudarDataAction,
  mudarValidadeSelectAction,
} from "../duck/actions/boletaActions";
import { BoletaNamespace } from "constants/ActionTypes";

interface Props {
  namespace: BoletaNamespace;
}

const BoletaDateSelector: React.FC<Props> = ({ namespace }) => {
  const boletaState = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  return (
    <Row className="rowFormValidade">
      <Col md={4}>
        <h6>Validade:</h6>
      </Col>
      <div>
        <Col className="colValidadeCheck">
          {boletaState.validadeSelect !== "SPECIFIED_DAY" ? (
            ValiditySelect({
              ...boletaState,
              dispatch,
              namespace,
              selectedDateLabel: "ATÉ O DIA",
            })
          ) : (
            <BoletaDatePicker namespace={namespace} />
          )}
        </Col>
      </div>
    </Row>
  );
};

export default BoletaDateSelector;

const BoletaDatePicker: React.FC<Props> = ({ namespace }) => {
  const boletaState = useStateBoletas()[namespace];

  const dispatch = useDispatchBoletas();

  const { date } = boletaState;

  const handleDateChange = useCallback(
    (date) => {
      dispatch(mudarDataAction(date, namespace));
    },
    [dispatch, namespace],
  );

  return (
    <DatePicker
      className="form-control textInput"
      selected={date}
      onChange={handleDateChange}
      dateFormat="dd/MM/yyyy"
      popperPlacement="top-start"
      autoFocus
      customInput={
        <Form>
          {ValiditySelect({
            ...boletaState,
            dispatch,
            selectedDateLabel: getformatedDate(date),
            namespace,
          })}
        </Form>
      }
    />
  );
};

interface ValiditySelectProps {
  selectedDateLabel: string;
  namespace: BoletaNamespace;
  dispatch: any;
  validadeSelect: any;
}

const ValiditySelect = ({
  dispatch,
  namespace,
  validadeSelect,
  selectedDateLabel,
}: ValiditySelectProps) => {
  return (
    <Form.Control
      as="select"
      className="textInput"
      value={validadeSelect}
      onChange={(event) =>
        dispatch(mudarValidadeSelectAction(event, namespace))
      }
      autoFocus
    >
      <option value="DAY">HOJE</option>
      <option value="SPECIFIED_DAY">{selectedDateLabel}</option>
      <option value="GTC">ATÉ CANCELAR</option>
    </Form.Control>
  );
};
