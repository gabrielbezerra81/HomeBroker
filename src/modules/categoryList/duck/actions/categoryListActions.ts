import api from "api/apiConfig";
import { getStructureBySymbolAPI } from "api/symbolAPI";
import { url_updateCategoryTitle_title_ids } from "api/url";
import produce from "immer";
import { CategoryListAPI } from "modules/categoryList/types/CategoryAPI";
import {
  Category,
  CategoryLine,
  CategoryListState,
} from "modules/categoryList/types/CategoryListState";
import { MainThunkAction } from "types/ThunkActions";

import { UPDATE_CATEGORY_LIST_STATE } from "./actionsTypes";

export const updateCategoryListAction = (
  payload: Partial<CategoryListState>,
): MainThunkAction => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CATEGORY_LIST_STATE,
      payload,
    });
  };
};

export const listCategoriesAction = (): MainThunkAction => {
  return async (dispatch) => {
    try {
      const { data } = await api.get<CategoryListAPI[]>("favorite");

      const filtered = data.filter((favorite) => {
        const configuration = JSON.parse(favorite.configuration);

        if (configuration && configuration.isCategory) {
          return true;
        }

        return false;
      });

      const categories: Category[] = [];

      filtered.forEach((favorite) => {
        const category = categories.find(
          (category) => category.title === favorite.group,
        );

        const newLine: CategoryLine = {
          id: favorite.id,
          symbol: favorite.structure.components[0].stock.symbol,
          price: favorite.structure.last || 0,
          oscilation: 0,
          yearOscilation: 0,
        };

        if (category) {
          category.lines.push(newLine);
        } //
        else {
          categories.push({ title: favorite.group, lines: [newLine] });
        }
      });

      dispatch(updateCategoryListAction({ categories }));
    } catch (error) {}
  };
};

export const addCategoryAction = (): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    const updatedCategories = produce(categories, (draft) => {
      draft.push({
        title: "",
        lines: [],
      });
    });

    dispatch(updateCategoryListAction({ categories: updatedCategories }));
  };
};

interface CategoryTitleUpdate {
  categoryIndex: number;
  attr: keyof Category;
  value: any;
}

export const handleCatTitleLocalUpdateAction = ({
  categoryIndex,
  attr,
  value,
}: CategoryTitleUpdate): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    const updatedCategories = produce(categories, (draft) => {
      Object.assign(draft[categoryIndex], { [attr]: value });
    });

    dispatch(updateCategoryListAction({ categories: updatedCategories }));
  };
};

export const handleCategoryTitleChangeAction = (
  categoryIndex: number,
): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    const idsArray: number[] = [];

    const category = categories[categoryIndex];

    category.lines.forEach((line) => {
      if (line.id) {
        idsArray.push(line.id);
      }
    });

    const idsToUpdate = idsArray.join(",");

    if (idsToUpdate) {
      try {
        await api.put(
          `${url_updateCategoryTitle_title_ids}${category.title}`,
          undefined,
          {
            params: {
              ids: idsToUpdate,
            },
          },
        );
      } catch (error) {
        alert("Falha ao editar título da categoria");
      }
    }
  };
};

interface ChangeLineSymbol {
  categoryIndex: number;
  lineIndex: number;
  value: string;
}

export const handleLineSymbolChangeAction = ({
  categoryIndex,
  lineIndex,
  value,
}: ChangeLineSymbol): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    const updatedCategories = produce(categories, (draft) => {
      draft[categoryIndex].lines[lineIndex].symbol = value;
    });

    dispatch(updateCategoryListAction({ categories: updatedCategories }));
  };
};

export const addNewLocalLineToCategoryAction = (
  categoryIndex: number,
): MainThunkAction => {
  return (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    const updatedCategories = produce(categories, (draft) => {
      draft[categoryIndex].lines.push({
        oscilation: 0,
        price: 0,
        symbol: "",
        yearOscilation: 0,
      });
    });

    dispatch(updateCategoryListAction({ categories: updatedCategories }));
  };
};

interface AddSymbolToCategory {
  categoryIndex: number;
  lineIndex: number;
}

export const addSymbolToCategoryAction = ({
  categoryIndex,
  lineIndex,
}: AddSymbolToCategory): MainThunkAction => {
  return async (dispatch, getState) => {
    const {
      categoryListReducer: { categories },
    } = getState();

    try {
      const category = categories[categoryIndex];

      const line = category.lines[lineIndex];

      const { symbol } = line;

      const structureData = await getStructureBySymbolAPI(symbol);

      if (structureData) {
        const payload = {
          group: category.title,
          configuration: JSON.stringify({
            isCategory: true,
          }),
          structure: {
            id: structureData.id,
          },
        };

        const { data } = await api.post("favorite", payload);

        if (line.id) {
          await api.delete(`favorite/${line.id}`);
        }


        const updatedCategories = produce(categories, (draft) => {
          draft[categoryIndex].lines[lineIndex] = {
            id: data.id,
            symbol,
            price: structureData.last || 0,
            oscilation: 0,
            yearOscilation: 0,
          };
        });

        dispatch(updateCategoryListAction({ categories: updatedCategories }));

        return true;
      } //
      else {
        throw new Error("");
      }
    } catch (error) {
      alert("Erro ao adicionar ativo à categoria, tente novamente!");
      return false;
    }
  };
};
