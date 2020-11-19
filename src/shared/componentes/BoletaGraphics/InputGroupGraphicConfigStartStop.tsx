import { BoletaNamespace } from "constants/ActionTypes";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";
import React, { useMemo } from "react";
import { Form } from "react-bootstrap";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import CustomInput from "shared/componentes/CustomInput";

interface Props {
  namespace: BoletaNamespace;
  cv: "compra" | "venda";
}

const InputGroupGraphicConfigStartStop: React.FC<Props> = ({
  namespace,
  cv,
}) => {
  const dispatch = useDispatchBoletas();

  const boletasState = useStateBoletas();

  const currentBoleta = boletasState[namespace];

  const positionClass = useMemo(() => {
    if (cv === "compra") {
      return "";
    }

    return "_VENDA";
  }, [cv]);

  const inputGain1 = (
    <div>
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico GainDisparoGrafico_CONFIGURAR${positionClass}`}
        value={currentBoleta.gainDisparoConfig1}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "gainDisparoConfig1"),
          )
        }
        name="gainDisparoConfig1"
      />
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico GainExecGrafico_CONFIGURAR${positionClass}`}
        value={currentBoleta.gainExecConfig1}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "gainExecConfig1"),
          )
        }
        name="gainExecConfig1"
      />
    </div>
  );

  const inputStop1 = (
    <div>
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico StopDisparoGrafico_CONFIGURAR${positionClass}`}
        value={currentBoleta.stopDisparoConfig1}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "stopDisparoConfig1"),
          )
        }
        name="stopDisparoConfig1"
      />
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico StopExecGrafico_CONFIGURAR${positionClass}`}
        value={currentBoleta.stopExecConfig1}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "stopExecConfig1"),
          )
        }
        name="stopExecConfig1"
      />
    </div>
  );

  const inputGain2 = (
    <div>
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico GainDisparoGrafico2_CONFIGURAR${positionClass}`}
        value={currentBoleta.gainDisparoConfig2}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "gainDisparoConfig2"),
          )
        }
        name="gainDisparoConfig2"
      />
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico GainExecGrafico2_CONFIGURAR${positionClass}`}
        value={currentBoleta.gainExecConfig2}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "gainExecConfig2"),
          )
        }
        name="gainExecConfig2"
      />
    </div>
  );

  const inputStop2 = (
    <div>
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico StopDisparoGrafico2_CONFIGURAR${positionClass}`}
        value={currentBoleta.stopDisparoConfig2}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "stopDisparoConfig2"),
          )
        }
        name="stopDisparoConfig2"
      />
      <CustomInput
        type="preco"
        step={0.01}
        containerClassName={`containerInputGrafico StopExecGrafico2_CONFIGURAR${positionClass}`}
        value={currentBoleta.stopExecConfig2}
        onChange={(valor) =>
          dispatch(
            mudarAtributoBoletaAction(valor, namespace, "stopExecConfig2"),
          )
        }
        name="stopExecConfig2"
      />
    </div>
  );

  return cv === "compra" ? (
    <Form>
      {inputGain1}
      {inputStop1}
      {inputGain2}
      {inputStop2}
    </Form>
  ) : (
    <Form>
      {inputStop1}
      {inputGain1}
      {inputStop2}
      {inputGain2}
    </Form>
  );
};

export default InputGroupGraphicConfigStartStop;
