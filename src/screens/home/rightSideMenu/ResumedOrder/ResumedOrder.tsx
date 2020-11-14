import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronDown } from "react-icons/fi";
import PerfectScroll from "react-perfect-scrollbar";

import ResumedOrderItem from "./ResumedOrderItem";

const ResumedOrder: React.FC = () => {
  const {
    ordersExecReducer: { tabelaOrdensExecucao },
  } = useStateStorePrincipal();

  const [hasOverflow, setHasOverflow] = useState(false);

  const [shouldDisplayArrow, setShouldDisplayArrow] = useState(true);

  const containerRef = useRef<HTMLElement | null>(null);

  const handleDisplayArrowChange = useCallback((container: HTMLElement) => {
    const { scrollTop, scrollHeight, clientHeight } = container;

    const maxScrollTop = scrollHeight - clientHeight; // 1011

    setShouldDisplayArrow(scrollTop !== maxScrollTop);
  }, []);

  const handleScrollButton = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTop + 250,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    const bar = document.getElementById("resumedOrderScroll");

    if (bar) {
      if (bar.scrollHeight > bar.clientHeight) {
        setHasOverflow(true);
      } else {
        setHasOverflow(false);
      }
    }
  }, []);

  const scrollButtonVisibility = useMemo(() => {
    return shouldDisplayArrow ? "" : "hiddenButton";
  }, [shouldDisplayArrow]);

  return (
    <>
      <PerfectScroll
        containerRef={(ref) => {
          containerRef.current = ref;
        }}
        id="resumedOrderScroll"
        options={{ wheelPropagation: false }}
        onScrollY={handleDisplayArrowChange}
      >
        <div className="resumedOrdersContainer">
          {tabelaOrdensExecucao.map((orderItem) => (
            <ResumedOrderItem key={orderItem.id} order={orderItem} />
          ))}
        </div>
      </PerfectScroll>
      {hasOverflow && (
        <div
          className={`orderScrollButton ${scrollButtonVisibility}`}
          tabIndex={0}
          onClick={handleScrollButton}
        >
          <FiChevronDown size={24} />
        </div>
      )}
    </>
  );
};

export default ResumedOrder;
