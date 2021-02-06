import React, { useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import { Form } from "react-bootstrap";
import { getformatedDate } from "shared/utils/Formatacoes";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import { Dispatch } from "redux";
import { updateBoxAttrAction } from "modules/multiBox/duck/actions/multiBoxActions";

interface DateSelectorProps {
  multiBox: MultiBoxData;
}

const BoxDateSelector: React.FC<DateSelectorProps> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  return multiBox.selectedValidity !== "SPECIFIED_DAY" ? (
    Select({
      selectedDateLabel: "ATÉ O DIA",
      multiBox,
      dispatch,
    })
  ) : (
    <BoxDatePickerProps multiBox={multiBox} />
  );
};

export default BoxDateSelector;

interface BoxDatePickerProps {
  multiBox: MultiBoxData;
}

const BoxDatePickerProps: React.FC<BoxDatePickerProps> = ({ multiBox }) => {
  const dispatch = useDispatchStorePrincipal();

  const { id, selectedValidity, selectedDate } = multiBox;

  const handleChangeDate = useCallback(
    (date) => {
      dispatch(
        updateBoxAttrAction(id, {
          selectedDate: date,
        }),
      );
    },
    [dispatch, id],
  );

  const customInput = useMemo(() => {
    return Select({
      selectedDateLabel: getformatedDate(selectedDate),
      dispatch,
      multiBox,
    });
  }, [dispatch, multiBox, selectedDate]);

  return (
    <DatePicker
      className={`form-control darkInputSelect ${
        selectedValidity === "SPECIFIED_DAY" ? "boxDatePicker" : ""
      }`}
      selected={selectedDate}
      onChange={handleChangeDate}
      dateFormat="dd/MM/yyyy"
      popperPlacement="bottom-end"
      customInput={customInput}
    />
  );
};

interface SelectProps {
  multiBox: MultiBoxData;
  dispatch: Dispatch<any>;
  selectedDateLabel: string;
}

const Select = ({ selectedDateLabel, dispatch, multiBox }: SelectProps) => {
  const { id, selectedValidity } = multiBox;

  return (
    <span>
      <Form.Control
        as="select"
        className={`darkInputSelect ${
          selectedValidity === "SPECIFIED_DAY" ? "dateSelect" : ""
        }`}
        value={selectedValidity}
        onChange={(event) =>
          dispatch(
            updateBoxAttrAction(id, {
              selectedValidity: event.currentTarget.value as any,
            }),
          )
        }
        autoFocus
      >
        <option value="DAY">HOJE</option>
        <option value="SPECIFIED_DAY">{selectedDateLabel}</option>
        <option value="GTC">ATÉ CANCELAR</option>
      </Form.Control>
    </span>
  );
};
