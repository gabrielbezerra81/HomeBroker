import React, { useCallback, useMemo, useState } from "react";
import Draggable, { DraggableData, DraggableEvent } from "react-draggable";

// import _ from "lodash";

import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import { MultiBoxData } from "modules/multiBox/types/MultiBoxState";
import {
  handleDuplicateBoxAction,
  updateBoxAttrAction,
} from "modules/multiBox/duck/actions/multiBoxActions";

import { ReactComponent as Tab0QuoteIcon } from "assets/multiBox/tab0QuoteIcon.svg";
import { ReactComponent as Tab1StructureIcon } from "assets/multiBox/tab1StructureIcon.svg";
import { ReactComponent as Tab2SymbolsIcon } from "assets/multiBox/tab2SymbolsIcon.svg";
import { ReactComponent as Tab3PositionIcon } from "assets/multiBox/tab3PositionIcon.svg";
import { ReactComponent as Tab4AlertIcon } from "assets/multiBox/tab4AlertIcon.svg";
import { ReactComponent as Tab5SearchIcon } from "assets/multiBox/tab5SearchIcon.svg";

import Tab1StructureBook from "./tab1StructureBook/Tab1StructureBook";
import Tab2ListBooks from "./tab2ListBooks/Tab2ListBooks";
import Tab3Position from "./tab3Position/Tab3Position";
import Tab4Alerts from "./tab4Alerts/Tab4Alerts";
import Tab5IncludeStructure from "./tab5IncludeStructure/Tab5IncludeStructure";

import SymbolCard from "../../../shared/components/SymbolCard/SymbolCard";
import { IoMdRepeat } from "react-icons/io";
import api from "api/apiConfig";
import { url_updateBoxConfig_id } from "api/url";
import Tab0 from "./tab0/Tab0";
import { Spinner } from "react-bootstrap";
import useStateGlobalStore from "hooks/useStateGlobalStore";
import useDispatchGlobalStore from "hooks/useDispatchGlobalStore";
import { aumentarZindexAction } from "redux/actions/GlobalAppActions";

interface Props {
  multiBox: MultiBoxData | null;
  boxIndex: number;
}

const bounds = { left: -26, top: 0 };

const MultiBox: React.FC<Props> = ({ multiBox, boxIndex }) => {
  const {
    systemReducer: { openedMenus, selectedTab },
    multiBoxReducer: { boxesTab1Data },
  } = useStateStorePrincipal();

  const { zIndex } = useStateGlobalStore();
  const dispatchGlobal = useDispatchGlobalStore();

  const dispatch = useDispatchStorePrincipal();

  const {
    id,
    topSymbols,
    strikeViewMode,
    toggleShowId,
    activeTab,
    isLoadingBox,
  } = multiBox || {};

  const structureData = useMemo(() => {
    return boxesTab1Data.find((data) => data.boxId === id);
  }, [boxesTab1Data, id]);

  const [position, setPosition] = useState(() => {
    const defaultPosition = { x: 0, y: 0 };

    if (multiBox === null) {
      const structure = boxesTab1Data[boxIndex];

      if (structure) {
        const configuration = JSON.parse(structure.configuration);

        return configuration.position || defaultPosition;
      }
    } //
    else if (structureData) {
      const configuration = JSON.parse(structureData.configuration);

      return configuration.position || defaultPosition;
    }

    return defaultPosition;
  });
  const [isDragging, setIsDragging] = useState(false);

  const bringToForegroundOnClick = useCallback(() => {
    if (!id) {
      return;
    }

    dispatchGlobal(aumentarZindexAction(id, zIndex, true));
  }, [dispatchGlobal, id, zIndex]);

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

      if (!id) {
        return;
      }

      dispatch(
        updateBoxAttrAction(id, {
          activeTab: newSelectedTab,
        }),
      );
    },
    [dispatch, id],
  );

  const handleStrikeViewChange = useCallback(() => {
    const viewMode = strikeViewMode === "code" ? "strike" : "code";

    if (!id) {
      return;
    }

    dispatch(
      updateBoxAttrAction(id, {
        strikeViewMode: viewMode,
      }),
    );
  }, [dispatch, id, strikeViewMode]);

  const handleDuplicateBox = useCallback(() => {
    if (!id) {
      return;
    }

    dispatch(handleDuplicateBoxAction(id));
  }, [dispatch, id]);

  const formattedTopSymbols = useMemo(() => {
    if (!topSymbols || !strikeViewMode) {
      return [];
    }

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
    if (!activeTab) {
      return "";
    }

    const activeIndex = Number(activeTab);

    return `activeTab${activeIndex}`;
  }, [activeTab]);

  const visibilityClass = useMemo(() => {
    if (!id) {
      const structure = boxesTab1Data[boxIndex];

      if (structure) {
        const configuration = JSON.parse(structure.configuration);

        if (configuration.tabKey === selectedTab) {
          return {};
        }
      }

      return { display: "none" };
    }

    const shouldShowBox = openedMenus.some(
      (menuItem) =>
        menuItem.menuKey === `multiBox${id}` && menuItem.tabKey === selectedTab,
    );

    return shouldShowBox ? {} : { display: "none" };
  }, [boxIndex, boxesTab1Data, id, openedMenus, selectedTab]);

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
      <div
        onClick={bringToForegroundOnClick}
        className="multiBox"
        id={multiBox?.id}
        style={visibilityClass}
      >
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
          {!!multiBox && (
            <>
              <Tab0 multiBox={multiBox} />
              <Tab1StructureBook multiBox={multiBox} />
              <Tab2ListBooks multiBox={multiBox} />
              <Tab3Position multiBox={multiBox} />
              <Tab4Alerts multiBox={multiBox} />
              <Tab5IncludeStructure multiBox={multiBox} />
            </>
          )}

          <div className="tabButtons">
            <button
              className={`brokerCustomButton ${isSelected("0", activeTab)}`}
              name="tab0"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <Tab0QuoteIcon className="tab0" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected("1", activeTab)}`}
              name="tab1"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <Tab1StructureIcon className="tab1" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected("2", activeTab)}`}
              name="tab2"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <Tab2SymbolsIcon className="tab2" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected("3", activeTab)}`}
              name="tab3"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <Tab3PositionIcon className="tab3" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected("4", activeTab)}`}
              name="tab4"
              onClick={handleBoxTabChange}
              disabled={!structureData}
            >
              <Tab4AlertIcon className="tab4" />
            </button>
            <button
              className={`brokerCustomButton ${isSelected("5", activeTab)}`}
              name="tab5"
              onClick={handleBoxTabChange}
              disabled={!multiBox}
            >
              <Tab5SearchIcon className="tab5" />
            </button>
          </div>

          {!!structureData && (
            <button
              onClick={handleStrikeViewChange}
              className="brokerCustomButton changeStrikeViewButton"
            >
              <IoMdRepeat size={19} color="#C4C4C4" />
            </button>
          )}

          {(!multiBox || isLoadingBox) && (
            <div className="loadingBoxSpinner">
              <Spinner animation="border" variant="light" />
            </div>
          )}

          {toggleShowId && (
            <>
              <span
                style={{
                  position: "absolute",
                  width: 130,
                  right: -147,
                  fontWeight: "bold",
                  top: -22,
                }}
              >
                Cód. do Box: {structureData?.id}
              </span>
              <span
                style={{
                  position: "absolute",
                  right: -175,
                  fontWeight: "bold",
                  top: 8,
                }}
              >
                Cód. da estrutura: {structureData?.structureID}
              </span>
              <button
                style={{
                  position: "absolute",
                  right: -107,
                  fontWeight: "bold",
                  top: 38,
                }}
                className="brokerCustomButton"
                onClick={handleDuplicateBox}
              >
                Duplicar box
              </button>
            </>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default MultiBox;

function isSelected(tabKey: string, activeTab: string | undefined) {
  if (!activeTab) {
    return "";
  }

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
