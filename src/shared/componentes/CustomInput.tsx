import React, { useCallback, useMemo } from "react";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-intl-number-input";
import { MDBIcon } from "mdbreact";
import Repeatable from "react-repeatable";
import { formatarNumero } from "redux/reducers/boletas/formInputReducer";

interface Props {
  precision?: number;
  type: "preco" | "quantidade" | "precoNegativo";
  placeholder?: string;
  readOnly?: boolean;
  id?: string;
  step: number;
  className?: string;
  onChange: (...data: any) => any;
  value: any;
  autoSelect?: boolean;
  onBlur?: (...data: any) => any;
  onKeyPress?: (...data: any) => any;
  containerClassName?: string;
  allowNegative?: boolean;
}

const CustomInput: React.FC<Props> = ({
  precision = 2,
  type,
  placeholder = "",
  readOnly = false,
  id = "",
  step,
  className = "",
  onChange,
  value,
  autoSelect = false,
  onBlur = () => {},
  onKeyPress = () => {},
  containerClassName = "",
  allowNegative = false,
}) => {
  var input: React.ReactNode;

  const handleChange = useMemo(() => {
    return readOnly ? () => {} : onChange;
  }, [onChange, readOnly]);

  const onUp = useCallback(() => {
    let valorAnterior = value;

    let resultado;

    //Tira todos os pontos e vírgulas do número e o transforma em um número decimal com ponto com separador
    if (["precoNegativo", "quantidade"].includes(type))
      valorAnterior = valorAnterior
        .toString()
        .split(".")
        .join("")
        .replace(",", ".");

    resultado = Number(Number(valorAnterior) + Number(step));

    if (type === "preco" || type === "precoNegativo") {
      resultado = Number(resultado).toFixed(precision);
    }
    if (type === "precoNegativo") {
      resultado = resultado.toString().replace(".", ",");
    }
    handleChange(resultado);
  }, [value, type, step, handleChange, precision]);

  const onDown = useCallback(() => {
    let valorAnterior = value;
    if (valorAnterior > 0 || allowNegative) {
      let resultado;

      if (["precoNegativo", "quantidade"].includes(type))
        valorAnterior = valorAnterior
          .toString()
          .split(".")
          .join("")
          .replace(",", ".");

      resultado = Number(Number(valorAnterior) - step);
      if (type === "preco" || type === "precoNegativo") {
        resultado = resultado.toFixed(precision);
      }
      if (type === "precoNegativo") {
        resultado = resultado.toString().replace(".", ",");
      }
      handleChange(resultado);
    }
  }, [allowNegative, handleChange, precision, step, type, value]);

  if (type === "preco")
    input = (
      <CurrencyInput
        id={id}
        placeholder={placeholder}
        locale="pt-BR"
        className={`form-control textInput inputFormatado ${className}`}
        precision={precision}
        step={step}
        value={value}
        onChange={(event: any, double: number) => handleChange(double)}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        prefix={value < 0 ? "- " : ""}
        onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
          if (autoSelect) event.target.select();
        }}
        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "ArrowUp") {
            onUp();
          } else if (event.key === "ArrowDown") {
            onDown();
          }
        }}
      />
    );
  else if (type === "quantidade")
    input = (
      <NumberFormat
        placeholder={placeholder}
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={0}
        className={`form-control textInput inputFormatado ${className}`}
        value={value}
        onChange={(event) => {
          const parsedValue = event.target.value.split(".").join("");

          handleChange(Number(parsedValue));
        }}
        onFocus={(event) => {
          if (autoSelect) event.target.select();
        }}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        onKeyUp={(event) => {
          if (event.key === "ArrowUp") {
            onUp();
          } else if (event.key === "ArrowDown") {
            onDown();
          }
        }}
      />
    );
  else if (type === "precoNegativo")
    input = (
      <NumberFormat
        placeholder={placeholder}
        className="form-control textInput"
        thousandSeparator="."
        decimalSeparator=","
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        onKeyPress={(event) => {
          const selection = document.getSelection();

          if (event.key !== "-" && (!selection || !selection.toString()))
            event.currentTarget.value = formatarNumero(
              event.currentTarget.value,
              1,
              ",",
              ",",
            );
        }}
        onFocus={(event) => {
          if (autoSelect) event.target.select();
        }}
        onKeyUp={(event) => {
          if (event.key === "ArrowUp") {
            onUp();
          } else if (event.key === "ArrowDown") {
            onDown();
          }
        }}
      />
    );

  return (
    <div className={`containerInput ${containerClassName}`} id={id}>
      {input}
      {readOnly ? null : (
        <div className="divContainerBotoes">
          <Repeatable
            repeatDelay={600}
            repeatInterval={40}
            onPress={(event: any) => {
              event.preventDefault();
              onUp();
            }}
            onHold={onUp}
            className="divRepetidor"
          >
            <MDBIcon icon="caret-up" className="divClicavel" />
          </Repeatable>
          <Repeatable
            repeatDelay={600}
            repeatInterval={40}
            onPress={(event: any) => {
              event.preventDefault();
              onDown();
            }}
            onHold={onDown}
            className="divRepetidor"
          >
            <MDBIcon icon="caret-down" className="divClicavel" />
          </Repeatable>
        </div>
      )}
    </div>
  );
};

export default CustomInput;

//Fazer replace de todos os pontos em QTDE
export const boxShadowInput = (classe: string) => {
  const activeElement = document.activeElement;

  if (!activeElement) {
    return "";
  }

  return activeElement.className.includes(classe) ? "inputFocado" : "";
};
