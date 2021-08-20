import React, { useCallback, useEffect, useMemo } from "react";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-intl-number-input";
import { MDBIcon } from "mdbreact";
import Repeatable from "react-repeatable";
import { formatarNumero } from "shared/utils/Formatacoes";
import usePrevious from "hooks/usePrevious";

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
  name?: string;
  renderArrows?: boolean;
  theme?: "light" | "dark";
  suffix?: string;
  suffixStyle?: React.CSSProperties;
  disabled?: boolean;
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
  name,
  renderArrows = true,
  theme = "light",
  suffix = "",
  suffixStyle = {},
  disabled = false,
}) => {
  var input: React.ReactNode;

  const handleChange = useMemo(() => {
    return readOnly ? () => {} : onChange;
  }, [onChange, readOnly]);

  const onUp = useCallback(
    (event) => {
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
      handleChange(resultado, event);
    },
    [value, type, step, handleChange, precision],
  );

  const onDown = useCallback(
    (event) => {
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
        handleChange(resultado, event);
      }
    },
    [allowNegative, handleChange, precision, step, type, value],
  );

  const previousStep = usePrevious(step);

  useEffect(() => {
    if (previousStep && previousStep !== step) {
      const newValue = validateValueOnPrecisionChange({
        previousStep,
        step,
        value,
      });

      handleChange(newValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, value, handleChange]);

  const themeClass = useMemo(() => {
    return theme === "light" ? "" : "darkCustomInput";
  }, [theme]);

  const hasArrowClassName = useMemo(() => {
    if (renderArrows) {
      return "arrowsInput";
    }

    return "";
  }, [renderArrows]);

  const hasSuffixClassName = useMemo(() => {
    if (suffix) {
      return "suffixInput";
    }

    return "";
  }, [suffix]);

  if (type === "preco")
    input = (
      <CurrencyInput
        disabled={disabled}
        placeholder={placeholder}
        locale="pt-BR"
        className={`form-control textInput ${className} ${hasArrowClassName} ${hasSuffixClassName}`}
        precision={precision}
        step={step}
        value={value}
        name={name}
        onChange={(event: any, double: number) => handleChange(double, event)}
        onBlur={onBlur}
        // suffix={suffix}
        onKeyPress={onKeyPress}
        prefix={value < 0 ? "- " : ""}
        onFocus={(event: React.FocusEvent<HTMLInputElement>) => {
          if (autoSelect) event.target.select();
        }}
        onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "ArrowUp") {
            onUp(event);
          } else if (event.key === "ArrowDown") {
            onDown(event);
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
        className={`form-control textInput  ${hasArrowClassName} ${className} ${hasSuffixClassName}`}
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
            onUp(event);
          } else if (event.key === "ArrowDown") {
            onDown(event);
          }
        }}
      />
    );
  else if (type === "precoNegativo")
    input = (
      <NumberFormat
        placeholder={placeholder}
        className={`form-control textInput ${hasSuffixClassName}`}
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
          if (event.key === "Backspace") {
            const previousValueHasMinus = `${value}`.includes("-");
            const hasErasedMinus =
              event.currentTarget.value.includes("-") === false;

            if (previousValueHasMinus && hasErasedMinus) {
              handleChange(event.currentTarget.value);
            }
          }

          if (event.key === "ArrowUp") {
            onUp(event);
          } else if (event.key === "ArrowDown") {
            onDown(event);
          }
        }}
      />
    );

  return (
    <div className={`containerInput ${containerClassName} ${themeClass}`}>
      {!!suffix && (
        <span style={suffixStyle} className="suffix">
          {suffix}
        </span>
      )}
      {input}
      {readOnly || !renderArrows ? null : (
        <div className="divContainerBotoes">
          <Repeatable
            repeatDelay={600}
            repeatInterval={40}
            onPress={(event: any) => {
              event.preventDefault();
              onUp(event);
            }}
            onHold={onUp}
            className="divRepetidor"
            name={name}
          >
            <MDBIcon icon="caret-up" className="divClicavel" />
          </Repeatable>
          <Repeatable
            repeatDelay={600}
            repeatInterval={40}
            onPress={(event: any) => {
              event.preventDefault();
              onDown(event);
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

interface ValidateProps {
  previousStep: number;
  step: number;
  value: any;
}

const validateValueOnPrecisionChange = ({
  previousStep,
  step,
  value,
}: ValidateProps) => {
  let newValue = value;

  const [_, fractionDigits] = step.toString().split(".");

  const precision = fractionDigits ? fractionDigits.length : 0;

  if (step < previousStep) {
    newValue = newValue * 1;
  } else {
    newValue = +Number(newValue).toFixed(precision);
  }
  return newValue;
};
