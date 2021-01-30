import React, { useMemo } from "react";

import { Tooltip, OverlayTrigger, OverlayTriggerProps } from "react-bootstrap";

interface Props extends Omit<OverlayTriggerProps, "overlay"> {
  id: string | number;
  content: React.ReactNode;
  tooltipClassName?: string;
  defaultLayout?: boolean;
}

const CustomTooltip: React.FC<Props> = ({
  id,
  children,
  content,
  tooltipClassName,
  defaultLayout = true,
  ...rest
}) => {
  const defaultClassName = useMemo(() => {
    if (defaultLayout) {
      return "defaultLayout";
    }

    return "";
  }, [defaultLayout]);

  return (
    <OverlayTrigger
      placement="top"
      {...rest}
      overlay={({ arrowProps, ...props }) => (
        <Tooltip
          id={`tooltip${id}`}
          {...props}
          arrowProps={{
            ...arrowProps,
            style: {
              ...arrowProps.style,
              bottom: 0,
              color: "#4c4b4b",
            },
          }}
          className={`customTooltip ${defaultClassName} ${tooltipClassName}`}
        >
          {content}
        </Tooltip>
      )}
    >
      {children}
    </OverlayTrigger>
  );
};

export default CustomTooltip;
