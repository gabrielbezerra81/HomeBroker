import React, { useState, useMemo, useCallback, useEffect } from "react";
import Draggable, { DraggableData } from "react-draggable";

import bringToForegroundOnMount from "shared/utils/PopupLifeCycle/bringToForegroundOnMount";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import usePrevious from "hooks/usePrevious";
import setPopupZIndexFromSecondaryTab from "shared/utils/PopupLifeCycle/setPopupZIndexFromSecondaryTab";

interface Props {
  popupDivKey: string;
  popupVisibility: boolean;
}

const limitY = 80;

const DraggablePopup: React.FC<Props> = ({
  children,
  popupDivKey,
  popupVisibility,
}) => {
  const {
    systemReducer: { isOpenLeftUserMenu },
  } = useStateStorePrincipal();

  const dispatchGlobal = useDispatchGlobalStore();

  const {
    zIndex: currentZIndex,
    divkey: currentDivKey,
  } = useStateGlobalStore();

  const previousDivkey = usePrevious(currentDivKey);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [bounds, setBounds] = useState<
    | {
        left: number;
        top: number;
      }
    | undefined
  >(undefined);

  const limitX = useMemo(() => {
    return isOpenLeftUserMenu ? 220 : 88;
  }, [isOpenLeftUserMenu]);

  const onStartDragging = useCallback(
    (e, data: DraggableData) => {
      setIsDragging(true);

      if (!bounds) {
        const bound = data.node.getBoundingClientRect();

        setBounds({ left: -1 * bound.x + limitX, top: -1 * bound.y + limitY });
      }
    },
    [bounds, limitX],
  );

  const onStopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onDrag = useCallback(
    (e, data: DraggableData) => {
      if (!bounds) {
        return;
      }

      setPosition({ x: data.x, y: data.y });
    },
    [bounds],
  );

  useEffect(() => {
    bringToForegroundOnMount({
      popupDivKey,
      currentDivKey,
      currentZIndex,
      increaseZIndex: () =>
        dispatchGlobal(aumentarZindexAction(popupDivKey, currentZIndex, true)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPopupZIndexFromSecondaryTab({
      zIndex: currentZIndex,
      previousDivkey,
      currentDivkey: currentDivKey,
      divkeyToCheck: popupDivKey,
      popupVisibility: popupVisibility,
      updateFunction: (...data) =>
        dispatchGlobal(aumentarZindexAction(...data)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDivKey, popupVisibility]);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mheader"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
      bounds={bounds}
      positionOffset={{ y: 27, x: 4 }}
    >
      {children}
    </Draggable>
  );
};

export default DraggablePopup;
