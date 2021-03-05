import React, { useCallback } from "react";
import {
  OverlayTrigger,
  Popover,
  OverlayTriggerProps,
  Button,
} from "react-bootstrap";

interface Props extends Omit<OverlayTriggerProps, "overlay"> {
  title: string;
  message?: string;
  onConfirm: (...data: any) => any;
  onCancel?: (...data: any) => any;
}

const PopConfirm: React.FC<Props> = ({
  children,
  placement = "top",
  title,
  message = "",
  onConfirm,
  onCancel,
  ...rest
}) => {
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    document.body.click();
  }, [onCancel]);

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      key={placement}
      placement={placement}
      {...rest}
      overlay={
        <Popover
          className="popConfirmContainer"
          id={`popover-positioned-${placement}`}
        >
          <Popover.Title as="h3">{title}</Popover.Title>
          <Popover.Content>
            <span>{message}</span>
            <div className="buttonsContainer">
              <Button size="sm" variant="danger" onClick={handleCancel}>
                Não
              </Button>
              <Button size="sm" variant="primary" onClick={onConfirm}>
                Sim
              </Button>
            </div>
          </Popover.Content>
        </Popover>
      }
    >
      {children}
    </OverlayTrigger>
  );
};

export default PopConfirm;
