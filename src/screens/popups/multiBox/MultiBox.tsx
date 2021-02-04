import React, { useCallback, useEffect, useMemo, useState } from "react";
import Draggable, { DraggableData } from "react-draggable";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { MultiBoxData } from "types/multiBox/MultiBoxState";
import { updateBoxAttrAction } from "redux/actions/multiBox/multiBoxActions";

import Tab1ViewStockBook from "./tab1ViewStockBook/Tab1ViewStockBook";
import Tab4ListBooks from "./tab4ListBooks/Tab4ListBooks";
import Tab5IncludeStructure from "./tab5IncludeStructure/Tab5IncludeStructure";

import SymbolCard from "./SymbolCard";
import Tab3Alerts from "./tab3Alerts/Tab3Alerts";
import Tab2Position from "./tab2Position/Tab2Position";

interface Props {
  multiBox: MultiBoxData;
}

const limitY = 80;

const MultiBox: React.FC<Props> = ({ multiBox }) => {
  const {
    systemReducer: { isOpenLeftUserMenu, openedMenus, selectedTab },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { topSymbols, strikeViewMode } = multiBox;

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

  const handleBoxTabChange = useCallback(
    (e) => {
      const newSelectedTab = e.currentTarget.name.replace("tab", "");

      dispatch(
        updateBoxAttrAction(multiBox.id, {
          activeTab: newSelectedTab,
        }),
      );
    },
    [dispatch, multiBox],
  );

  // useEffect(() => {
  //   const box = document.getElementById(`${multiBox.id}`);

  //   if (box) {
  //     const { x, y } = box.getBoundingClientRect();
  //     setPosition({ x: x - 116, y: y - 85 });
  //     // box.style.position = "absolute";
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const formattedTopSymbols = useMemo(() => {
    return topSymbols.map((topSymbol) => ({
      ...topSymbol,
      viewMode: strikeViewMode,
    }));
  }, [strikeViewMode, topSymbols]);

  const americanTopSymbols = useMemo(() => {
    return formattedTopSymbols.filter(
      (item) => item.model === "AMERICAN" || !item.model,
    );
  }, [formattedTopSymbols]);

  const europeanTopSymbols = useMemo(() => {
    return formattedTopSymbols.filter((item) => item.model === "EUROPEAN");
  }, [formattedTopSymbols]);

  const activeTabClass = useMemo(() => {
    const activeIndex = Number(multiBox.activeTab);

    return `activeTab${activeIndex}`;
  }, [multiBox.activeTab]);

  const visibilityClass = useMemo(() => {
    const shouldShowBox = openedMenus.some(
      (menuItem) =>
        menuItem.menuKey === `multiBox${multiBox.id}` &&
        menuItem.tabKey === selectedTab,
    );

    return shouldShowBox ? {} : { display: "none" };
  }, [openedMenus, multiBox.id, selectedTab]);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
      bounds={bounds}
    >
      <div className="multiBox" id={multiBox.id} style={visibilityClass}>
        <div className="topSymbolsContainer">
          <div>
            {americanTopSymbols.map((topSymbol, index) => (
              <SymbolCard showQttyPlus data={topSymbol} key={index} showQtty />
            ))}
          </div>
          <div>
            {europeanTopSymbols.map((topSymbol, index) => (
              <SymbolCard showQttyPlus data={topSymbol} key={index} showQtty />
            ))}
          </div>
        </div>

        {/*minimizedClass  */}
        <div className={`mcontent boxContent ${activeTabClass}`}>
          <Tab1ViewStockBook multiBox={multiBox} />
          <Tab2Position multiBox={multiBox} />
          <Tab3Alerts multiBox={multiBox} />
          <Tab4ListBooks multiBox={multiBox} />
          <Tab5IncludeStructure multiBox={multiBox} />
          <div className="tabButtons">
            <button
              className={`brokerCustomButton ${isSelected(
                "1",
                multiBox.activeTab,
              )}`}
              name="tab1"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "2",
                multiBox.activeTab,
              )}`}
              name="tab2"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "3",
                multiBox.activeTab,
              )}`}
              name="tab3"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "4",
                multiBox.activeTab,
              )}`}
              name="tab4"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "5",
                multiBox.activeTab,
              )}`}
              name="tab5"
              onClick={handleBoxTabChange}
            >
              <div className="selectedCircle" />
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default MultiBox;

function isSelected(tabKey: string, activeTab: string) {
  return tabKey === activeTab ? " selected" : "";
}

// const boxIndex = useMemo(() => {
//   return boxesVisibility.findIndex(
//     (boxItem) => boxItem.boxKey === `box${quoteBox.id}`,
//   );
// }, [boxesVisibility]);

// const minimizedClass = useMemo(() => {
//   return boxesVisibility[boxIndex]?.visibility ? "" : "hiddenBoxContent";
// }, [boxIndex, boxesVisibility]);

// const handleMinimize = useCallback(() => {
//   const updatedBoxesVisibility = produce(boxesVisibility, (draft) => {
//     draft[boxIndex].visibility = !draft[boxIndex].visibility;
//   });

//   dispatch(
//     updateOneSystemStateAction("boxesVisibility", updatedBoxesVisibility),
//   );
// }, [boxesVisibility, dispatch, boxIndex]);
