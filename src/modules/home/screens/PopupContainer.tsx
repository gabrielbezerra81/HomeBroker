import React, { Suspense, useCallback } from "react";
import { Animate } from "react-show";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";

interface PopupContainerProps {
  isOpen: boolean;
  divKey: string;
}

const startStyle = {
  opacity: 0,
  pointerEvents: "none",
};

const PopupContainer: React.FC<PopupContainerProps> = ({
  children,
  isOpen,
  divKey,
}) => {
  const { zIndex } = useStateGlobalStore();
  const dispatchGlobal = useDispatchGlobalStore();

  const handleOpenPopup = useCallback(() => {
    dispatchGlobal(aumentarZindexAction(divKey, zIndex, isOpen));
  }, [dispatchGlobal, divKey, isOpen, zIndex]);

  return (
    <Suspense fallback={null}>
      <Animate
        show={isOpen}
        duration={100}
        transitionOnMount
        stayMounted={false}
        start={startStyle}
        onClick={handleOpenPopup}
      >
        {children}
      </Animate>
    </Suspense>
  );
};

export default PopupContainer;
