import React from "react";
import { Form } from "react-bootstrap";
import CustomInput, { boxShadowInput } from "shared/componentes/CustomInput";
import { mudarAtributoBoletaAction } from "redux/actions/boletas/formInputActions";
import useDispatchBoletas from "hooks/useDispatchBoletas";
import useStateBoletas from "hooks/useStateBoletas";
import { BoletaNamespace } from "constants/ActionTypes";

interface Props {
  namespace: BoletaNamespace;
  cv: string;
  boletaType: string;
}

const InputGroupBoletaGraphic: React.FC<Props> = ({ boletaType, namespace, cv }) => {
  const dispatch = useDispatchBoletas();

  const boletasState = useStateBoletas();

  const currentBoleta = boletasState[namespace];

  switch (boletaType) {
    case "graficoTipoAgendada":
      return (
        <div>
          <CustomInput
            type="preco"
            step={0.01}
            className={`gainDisparo_Agendada ${boxShadowInput(
              "gainDisparo_Agendada",
            )}`}
            containerClassName={`GainDisparoGrafico_${cv} containerInputGrafico`}
            value={currentBoleta.gainDisparo}
            onChange={(valor) =>
              dispatch(
                mudarAtributoBoletaAction(valor, namespace, "gainDisparo"),
              )
            }
          />
          <CustomInput
            type="preco"
            step={0.01}
            className={`gainExec_Agendada ${boxShadowInput(
              "gainExec_Agendada",
            )}`}
            containerClassName={`GainExecGrafico_${cv} containerInputGrafico`}
            value={currentBoleta.gainExec}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "gainExec"))
            }
          />
          <CustomInput
            type="preco"
            step={0.01}
            className={`stopDisparo_Agendada ${boxShadowInput(
              "stopDisparo_Agendada",
            )}`}
            containerClassName={`StopDisparoGrafico_${cv} containerInputGrafico`}
            value={currentBoleta.stopDisparo}
            onChange={(valor) =>
              dispatch(
                mudarAtributoBoletaAction(valor, namespace, "stopDisparo"),
              )
            }
          />
          <CustomInput
            type="preco"
            step={0.01}
            className={`stopExec_Agendada ${boxShadowInput(
              "stopExec_Agendada",
            )}`}
            containerClassName={`StopExecGrafico_${cv} containerInputGrafico`}
            value={currentBoleta.stopExec}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "stopExec"))
            }
          />
        </div>
      );
    case "tipoStartMovel":
      return (
        <div>
          <CustomInput
            type="preco"
            step={0.01}
            className={`stopDisparo_Movel ${boxShadowInput(
              "stopDisparo_Movel",
            )}`}
            containerClassName={`StopDisparoGrafico_${cv} containerInputGrafico TamanhoInputGrafico_StartMovel`}
            value={currentBoleta.stopDisparo}
            onChange={(valor) =>
              dispatch(
                mudarAtributoBoletaAction(valor, namespace, "stopDisparo"),
              )
            }
          />
          <CustomInput
            type="preco"
            step={0.01}
            className={`stopExec_Movel ${boxShadowInput("stopExec_Movel")}`}
            containerClassName={`StopExecGrafico_${cv} containerInputGrafico TamanhoInputGrafico_StartMovel`}
            value={currentBoleta.stopExec}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "stopExec"))
            }
          />
          <Form.Control
            className={`inputGrafico CotacaoAtualGrafico_${cv}`}
            value={currentBoleta.dadosPesquisa.cotacaoAtual}
            onChange={() => false}
          />
          <CustomInput
            type="preco"
            step={0.01}
            className={`inicioDisparo_Movel ${boxShadowInput(
              "inicioDisparo_Movel",
            )}`}
            containerClassName={`Disparo1AjusteGrafico_${cv} containerInputGrafico TamanhoInputGrafico_StartMovel`}
            value={currentBoleta.inicioDisparo}
            onChange={(valor) =>
              dispatch(
                mudarAtributoBoletaAction(valor, namespace, "inicioDisparo"),
              )
            }
          />
          {/* <CustomInput
            type="preco"
            step={0.01}
            id={`DisparoMaisAjusteGrafico_${cv}`}
            containerClassName="containerInputGrafico TamanhoInputGrafico_StartMovel"
            value={currentBoleta.disparoMaisAjuste}
            onChange={valor =>
              dispatch(mudarAtributoBoletaAction(
                valor,
                namespace,
                "disparoMaisAjuste"
              ))
            }
          /> */}

          {/* <CustomInput
            type="preco"
            step={0.01}
            id={`StopMais1AjusteGrafico_${cv}`}
            containerClassName="containerInputGrafico TamanhoInputGrafico_StartMovel"
            value={currentBoleta.stopMais1Ajuste}
            onChange={valor =>
              dispatch(mudarAtributoBoletaAction(
                valor,
                namespace,
                "stopMais1Ajuste"
              ))
            }
          /> */}
          {/* <CustomInput
            type="preco"
            step={0.01}
            id={`StopAnteriorAjusteGrafico_${cv}`}
            containerClassName="containerInputGrafico TamanhoInputGrafico_StartMovel"
            value={currentBoleta.stopAnteriorAjuste}
            onChange={valor =>
              dispatch(mudarAtributoBoletaAction(
                valor,
                namespace,
                "stopAnteriorAjuste"
              ))
            }
          /> */}
        </div>
      );
    case "tipoGainReducao":
      return (
        <div>
          <CustomInput
            type="preco"
            step={0.01}
            containerClassName={`Reducao1Grafico_${cv} containerInputGrafico TamanhoInputGrafico_GainReducao`}
            value={currentBoleta.reducao1}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "reducao1"))
            }
          />

          <CustomInput
            type="preco"
            step={0.01}
            containerClassName={`Reducao2Grafico_${cv} containerInputGrafico TamanhoInputGrafico_GainReducao`}
            value={currentBoleta.reducao2}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "reducao2"))
            }
          />

          <CustomInput
            type="preco"
            step={0.01}
            className={`GainGrafico_${cv}`}
            containerClassName={`GainGrafico_${cv} containerInputGrafico TamanhoInputGrafico_GainReducao`}
            value={currentBoleta.gain}
            onChange={(valor) =>
              dispatch(mudarAtributoBoletaAction(valor, namespace, "gain"))
            }
          />

          <Form.Control
            className={`CotacaoAtualGrafico_${cv} inputGrafico`}
            value={currentBoleta.dadosPesquisa.cotacaoAtual}
            onChange={() => false}
          />
        </div>
      );
    default:
      return null;
  }
};

export default InputGroupBoletaGraphic;
