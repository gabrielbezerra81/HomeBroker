import React, { useCallback, useState } from "react";
import {
  OverlayTrigger,
  Popover,
  OverlayTriggerProps,
  Button,
  Spinner,
} from "react-bootstrap";
import { ButtonVariant } from "react-bootstrap/esm/types";

interface Props extends Omit<OverlayTriggerProps, "overlay"> {
  title: string;
  message?: string;
  onConfirm: (...data: any) => any;
  onCancel?: (...data: any) => any;
  confirmText?: string;
  cancelText?: string;
  cancelButtonStyle?: {
    variant: ButtonVariant;
  };
  content?: React.ReactNode;
  className?: string;
}

const PopConfirm: React.FC<Props> = ({
  children,
  placement = "top",
  title,
  message = "",
  onConfirm,
  onCancel,
  confirmText = "Sim",
  cancelText = "Não",
  cancelButtonStyle = {},
  content = null,
  className,
  ...rest
}) => {
  const [waitingConfirm, setWaitingConfirm] = useState(false);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    document.body.click();
  }, [onCancel]);

  const handleConfirm = useCallback(
    async (e) => {
      e.stopPropagation();

      setWaitingConfirm(true);

      await onConfirm();

      setWaitingConfirm(false);
    },
    [onConfirm],
  );

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      key={placement}
      placement={placement}
      {...rest}
      overlay={
        <Popover
          className={`popConfirmContainer ${className}`}
          id={`popover-positioned-${placement}`}
        >
          <Popover.Title as="h3">{title}</Popover.Title>
          <Popover.Content>
            <span>{message}</span>
            {content}
            <div className="buttonsContainer">
              <Button
                size="sm"
                variant="danger"
                {...cancelButtonStyle}
                onClick={handleCancel}
              >
                {cancelText}
              </Button>
              <Button size="sm" variant="primary" onClick={handleConfirm}>
                {waitingConfirm ? (
                  <Spinner size="sm" animation="border" variant={"light"} />
                ) : (
                  confirmText
                )}
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
