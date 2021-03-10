import React, { useCallback, useState } from "react";
import {
  OverlayTrigger,
  Popover,
  OverlayTriggerProps,
  Button,
  Spinner,
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
  const [waitingConfirm, setWaitingConfirm] = useState(false);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    document.body.click();
  }, [onCancel]);

  const handleConfirm = useCallback(async () => {
    setWaitingConfirm(true);

    await onConfirm();

    setWaitingConfirm(false);
  }, [onConfirm]);

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
              <Button size="sm" variant="primary" onClick={handleConfirm}>
                {waitingConfirm ? (
                  <Spinner size="sm" animation="border" variant={"light"} />
                ) : (
                  "Sim"
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
