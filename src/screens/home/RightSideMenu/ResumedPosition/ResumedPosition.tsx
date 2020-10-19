import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiChevronDown } from "react-icons/fi";
import ResumedPositionItem from "./ResumedPositionItem";
import PerfectScroll from "react-perfect-scrollbar";

const ResumedPosition: React.FC = () => {
  const {
    positionReducer: { posicoesCustodia },
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
    const bar = document.getElementById("resumedPositionScroll");

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
        id="resumedPositionScroll"
        options={{ wheelPropagation: false }}
        onScrollY={handleDisplayArrowChange}
      >
        <div className="resumedPositionContainer">
          {posicoesCustodia.map((positionItem, index) => {
            return (
              <ResumedPositionItem
                key={`${positionItem.idEstrutura}${index}`}
                position={positionItem}
              />
            );
          })}
        </div>
      </PerfectScroll>
      {hasOverflow && (
        <div
          className={`positionScrollButton ${scrollButtonVisibility}`}
          tabIndex={0}
          onClick={handleScrollButton}
        >
          <FiChevronDown size={24} />
        </div>
      )}
    </>
  );
};

export default ResumedPosition;
