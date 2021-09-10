import React, { useCallback, useMemo, useState } from "react";

import Draggable from "react-draggable";

import CustomInput from "shared/components/CustomInput";
import { PopupHeader } from "shared/components/PopupHeader";

import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { Form, Spinner } from "react-bootstrap";
import moment from "moment";
import { launchSimulationDataAction } from "modules/financialPlanner/duck/actions/detailedPlannerActions";

interface Props {
  visibility: boolean;
  setVisibility: (...data: any) => any;
  addingType: "income" | "tax" | "result";
  simIndex: number;
  headerTitle: string;
}

const LaunchSimulationDataMenu: React.FC<Props> = ({
  visibility,
  setVisibility,
  addingType,
  simIndex,
  headerTitle,
}) => {
  const dispatch = useDispatchStorePrincipal();

  const [type, setType] = useState<"tax" | "profit" | "loss">(() => {
    if (addingType === "tax") {
      return "tax";
    }

    return "profit";
  });
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const [credit, setCredit] = useState(() => {
    if (addingType === "tax") {
      return "debit";
    }

    return "credit";
  });

  const [isSaving, setIsSaving] = useState(false);

  const onClose = useCallback(() => {
    setVisibility(false);
  }, [setVisibility]);

  const handleInputChange = useCallback((value, event) => {
    setValue(value);
  }, []);

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target;

    if (name === "type") {
      setType(value);
      return;
    }

    if (name === "description") {
      setDescription(value);
    }

    if (name === "credit") {
      setCredit(value);
      return;
    }
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    const creationDate = moment().format("DD/MM/YYYY HH:mm:ss");
    const updateDate = creationDate;

    const payload = {
      type,
      description,
      value,
      credit,
      created: creationDate,
      update: updateDate,
    };

    const success = (await dispatch(
      launchSimulationDataAction({ payload, simIndex, addingType }),
    )) as unknown as boolean;

    setIsSaving(false);

    if (success) {
      setDescription("");
      setValue(0);
      setVisibility(false);
    }
  }, [
    addingType,
    credit,
    description,
    dispatch,
    setVisibility,
    simIndex,
    type,
    value,
  ]);

  const visibilityClass = useMemo(() => {
    if (!visibility) {
      return "hidden";
    }

    return "";
  }, [visibility]);

  const typeOptions = useMemo(() => {
    if (addingType === "tax") {
      return (
        <>
          <option value="tax">Imposto</option>
        </>
      );
    }

    if (addingType === "result") {
      return (
        <>
          <option value="profit">Lucro</option>
          <option value="loss">Prejuízo</option>
        </>
      );
    }

    return (
      <>
        <option value="tax">Imposto</option>
        <option value="profit">Lucro</option>
        <option value="loss">Prejuízo</option>
      </>
    );
  }, [addingType]);

  const creditOptions = useMemo(() => {
    if (addingType === "tax") {
      return (
        <>
          <option value="debit">Débito</option>
        </>
      );
    }

    return (
      <>
        <option value="credit">Crédito</option>
        <option value="debit">Débito</option>
      </>
    );
  }, [addingType]);

  return (
    <Draggable
      enableUserSelectHack={false}
      handle=".launchSimulationDataMenu"
      onDrag={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div className={`launchSimulationDataMenu ${visibilityClass}`}>
        <PopupHeader headerTitle={headerTitle} onClose={onClose} />

        <div className="content">
          <div className="menuRow">
            <span>Tipo</span>
            <Form.Control
              as="select"
              className="darkInputSelect"
              name="type"
              onChange={handleFormChange}
              value={type}
            >
              {typeOptions}
            </Form.Control>
          </div>

          <div className="menuRow">
            <span>Descrição</span>
            <Form.Control
              className="darkSimpleInput"
              name="description"
              onChange={handleFormChange}
              value={description}
            />
          </div>

          <div className="menuRow">
            <span>Valor</span>
            <CustomInput
              value={value}
              type="preco"
              name="value"
              step={1}
              onChange={(v, e) => handleInputChange(v, e)}
              renderArrows={false}
              theme="dark"
            />
          </div>

          <div className="menuRow">
            <span>Crédito</span>
            <Form.Control
              as="select"
              className="darkInputSelect"
              name="credit"
              onChange={handleFormChange}
              value={credit}
            >
              {creditOptions}
            </Form.Control>
          </div>

          <button
            onClick={handleSave}
            className="brokerCustomButton addDataButton"
          >
            {isSaving ? (
              <Spinner className="spinner" animation="border" />
            ) : (
              "Adicionar"
            )}
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default LaunchSimulationDataMenu;
