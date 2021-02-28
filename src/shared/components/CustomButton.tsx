import React, { ButtonHTMLAttributes, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  spinnerVariant?: Variant;
  defaultClassName?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({
  children,
  loading,
  spinnerVariant,
  className = "",
  defaultClassName = true,
  ...rest
}) => {
  const defaultClass = useMemo(() => {
    if (defaultClassName) {
      return "brokerCustomButton";
    }
    return "";
  }, [defaultClassName]);

  return (
    <button className={`customButton ${defaultClass} ${className}`} {...rest}>
      {loading ? (
        <Spinner
          size="sm"
          animation="border"
          variant={spinnerVariant || "light"}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
