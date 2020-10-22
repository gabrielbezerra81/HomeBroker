import React from "react";
import { Button, ButtonProps as BTProps, Spinner } from "react-bootstrap";
import { Variant } from "react-bootstrap/esm/types";

interface ButtonProps extends BTProps {
  loading?: boolean;
  spinnerVariant?: Variant;
}

const CustomButton: React.FC<ButtonProps> = ({
  children,
  loading,
  spinnerVariant,
  ...rest
}) => {
  return (
    <Button className="customButton" variant="primary" size="sm" {...rest}>
      {loading ? (
        <Spinner
          size="sm"
          animation="border"
          variant={spinnerVariant || "light"}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default CustomButton;
