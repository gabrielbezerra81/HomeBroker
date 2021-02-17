import React, { useCallback, useEffect, useMemo, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

// import _ from "lodash";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import {
  getStockSymbolData,
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import Tab1StructureBook from "./tab1StructureBook/Tab1StructureBook";
import Tab4ListBooks from "./tab4ListBooks/Tab4ListBooks";
import Tab5IncludeStructure from "./tab5IncludeStructure/Tab5IncludeStructure";

import SymbolCard from "./SymbolCard";
import Tab3Alerts from "./tab3Alerts/Tab3Alerts";
import Tab2Position from "./tab2Position/Tab2Position";
import { IoMdRepeat } from "react-icons/io";
import api from "api/apiConfig";
import { url_updateBoxConfig_id } from "api/url";
import Tab0 from "./tab0/Tab0";

interface Props {
  multiBox: MultiBoxData;
}

const bounds = { left: 0, top: 0 };

const MultiBox: React.FC<Props> = ({ multiBox }) => {
  const {
    systemReducer: { openedMenus, selectedTab },
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const { id, topSymbols, strikeViewMode } = multiBox;

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === multiBox.id);
  }, [multiBox.id, boxesTab1Data]);

  const [position, setPosition] = useState(() => {
    const defaultPosition = { x: 0, y: 0 };

    if (structureData) {
      const configuration = JSON.parse(structureData.configuration);

      return configuration.position || defaultPosition;
    }

    return defaultPosition;
  });
  const [isDragging, setIsDragging] = useState(false);

  const onStartDragging = useCallback((e, data: DraggableData) => {
    const excludedClasses = [
      "react-datepicker__week",
      "ant-select-selection__rendered",
      "symbolContainer",
      "react-datepicker__tab-loop",
      "react-datepicker-wrapper",
    ];

    if (e.target) {
      for (const element of e.nativeEvent.path) {
        if (excludedClasses.includes(element.className)) {
          return false;
        }
      }

      if (
        ["BUTTON", "INPUT", "SELECT", "IMG", "I", "svg", "path"].includes(
          (e.target as any).nodeName,
        )
      ) {
        return false;
      }
    }

    setIsDragging(true);
  }, []);

  const onStopDragging = useCallback(() => {
    setIsDragging(false);

    try {
      if (structureData) {
        const configuration = JSON.parse(structureData.configuration);

        configuration.position = position;

        api.put(`${url_updateBoxConfig_id}${structureData.id}`, {
          configuration: JSON.stringify(configuration),
        });
      }
    } catch (error) {
      //
    }
  }, [position, structureData]);

  const onDrag = useCallback((e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  }, []);

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

  const handleStrikeViewChange = useCallback(() => {
    const viewMode = strikeViewMode === "code" ? "strike" : "code";

    dispatch(
      updateBoxAttrAction(multiBox.id, {
        strikeViewMode: viewMode,
      }),
    );
  }, [dispatch, multiBox.id, strikeViewMode]);

  const formattedTopSymbols = useMemo(() => {
    let formatted = topSymbols.map((topSymbol) => ({
      ...topSymbol,
      viewMode: strikeViewMode,
    }));

    // formatted = _.orderBy(formatted, ["type"]);

    return formatted;
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

  useEffect(() => {
    async function updateStockSymbolData() {
      const stockSymbolData = await getStockSymbolData(topSymbols);

      if (stockSymbolData) {
        dispatch(updateBoxAttrAction(id, { stockSymbolData }));
      }
    }

    updateStockSymbolData();
  }, [dispatch, id, topSymbols]);

  return (
    <Draggable
      enableUserSelectHack={isDragging}
      handle=".mcontent"
      position={position}
      onStart={onStartDragging}
      onStop={onStopDragging}
      onDrag={onDrag}
      bounds={bounds}
      grid={[3, 3]}
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
          <button
            onClick={handleStrikeViewChange}
            className="brokerCustomButton changeStrikeViewButton"
          >
            <IoMdRepeat size={19} color="#C4C4C4" />
          </button>

          <Tab0 multiBox={multiBox} />
          <Tab1StructureBook multiBox={multiBox} />
          <Tab2Position multiBox={multiBox} />
          <Tab3Alerts multiBox={multiBox} />
          <Tab4ListBooks multiBox={multiBox} />
          <Tab5IncludeStructure multiBox={multiBox} />
          <div className="tabButtons">
            <button
              className={`brokerCustomButton ${isSelected(
                "0",
                multiBox.activeTab,
              )}`}
              name="tab0"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <div className="selectedCircle" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected(
                "1",
                multiBox.activeTab,
              )}`}
              name="tab1"
              onClick={handleBoxTabChange}
              disabled={!structureData}
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
              disabled={!structureData}
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
              disabled={!structureData}
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
              disabled={!structureData}
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

// useEffect(() => {
//   const box = document.getElementById(`${multiBox.id}`);

//   if (box) {
//     console.log(box);
//     const { x, y } = box.getBoundingClientRect();
//     // setBounds({ left: -1 * bound.x + limitX, top: -1 * bound.y + limitY });
//     // box.style.position = "absolute";
//   }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);
