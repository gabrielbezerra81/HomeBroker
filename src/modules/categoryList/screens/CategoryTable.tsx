import React, { useCallback, useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { IoMdAddCircle } from "react-icons/io";
import {
  addNewLocalLineToCategoryAction,
  handleCategoryTitleChangeAction,
  handleCatTitleLocalUpdateAction,
} from "../duck/actions/categoryListActions";
import { Category } from "../types/CategoryListState";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import CategoryLine from "./CategoryLine";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";

interface CategoryTableProps {
  category: Category;
  categoryIndex: number;
  order: number;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  category,
  order,
  categoryIndex,
}) => {
  const {
    categoryListReducer: { categories },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const [autoFocusTitle, setAutoFocusTitle] = useState(true);
  const [currentTitle, setCurrentTitle] = useState(category.title);

  const handleChangeTitle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.currentTarget;

      dispatch(
        handleCatTitleLocalUpdateAction({
          categoryIndex,
          attr: name as keyof Category,
          value,
        }),
      );
    },
    [categoryIndex, dispatch],
  );

  const onEndTitleEditing = useCallback(() => {
    const titleAlreadyUsed = categories.some(
      (item, index) => item.title === category.title && index !== categoryIndex,
    );

    if (!titleAlreadyUsed) {
      setCurrentTitle(category.title);
      dispatch(handleCategoryTitleChangeAction(categoryIndex));
    } //
    else {
      dispatch(
        handleCatTitleLocalUpdateAction({
          categoryIndex,
          attr: "title",
          value: currentTitle,
        }),
      );
      alert("Já existe uma categoria com o mesmo título");
    }
  }, [categories, category.title, categoryIndex, currentTitle, dispatch]);

  const handleAddLine = useCallback(() => {
    dispatch(addNewLocalLineToCategoryAction(categoryIndex));
  }, [categoryIndex, dispatch]);

  useEffect(() => {
    setAutoFocusTitle(false);
  }, []);

  return (
    <Table className="categoryTable" striped={false} style={{ order }}>
      <tbody>
        <tr className="categoryTitle">
          <td colSpan={4}>
            <Form.Control
              value={category.title}
              className="darkSimpleInput"
              autoFocus={autoFocusTitle}
              onChange={handleChangeTitle}
              onBlur={onEndTitleEditing}
              name="title"
              autoComplete="off"
            />
            <button
              className="brokerCustomButton addCodeButton"
              onClick={handleAddLine}
            >
              <IoMdAddCircle size={18} fill="#C4C4C4" />
            </button>
          </td>
        </tr>
        {category.lines.map((line, index) => (
          <CategoryLine
            key={index}
            lineData={line}
            categoryIndex={categoryIndex}
            lineIndex={index}
          />
        ))}
      </tbody>
    </Table>
  );
};

export default CategoryTable;
