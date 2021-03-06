import React, { useCallback, useEffect, useState, useRef } from "react";
import { Form, Table } from "react-bootstrap";
import { IoMdAddCircle } from "react-icons/io";
import {
  addNewLocalLineToCategoryAction,
  handleCategoryTitleChangeAction,
  handleCatTitleLocalUpdateAction,
  handleDeleteCategoryAction,
} from "../duck/actions/categoryListActions";
import { Category } from "../types/CategoryListState";
import useDispatchStorePrincipal from "hooks/useDispatchStorePrincipal";
import CategoryLine from "./CategoryLine";
import useStateStorePrincipal from "hooks/useStateStorePrincipal";
import { FiX } from "react-icons/fi";
import PopConfirm from "shared/components/PopConfirm/PopConfirm";
import { toast } from "react-toastify";

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
    categoryListReducer: { categories, removeMode },
  } = useStateStorePrincipal();

  const dispatch = useDispatchStorePrincipal();

  const titleInputRef = useRef<any | null>(null);

  const [autoFocusTitle, setAutoFocusTitle] = useState(!category.title);
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
    if (currentTitle === category.title) {
      return;
    }

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
      toast.warn("Já existe uma categoria com o mesmo título");
    }
  }, [categories, category.title, categoryIndex, currentTitle, dispatch]);

  const handleAddLine = useCallback(() => {
    dispatch(addNewLocalLineToCategoryAction(categoryIndex));
  }, [categoryIndex, dispatch]);

  const handleDeleteCategory = useCallback(async () => {
    await dispatch(handleDeleteCategoryAction(categoryIndex));
  }, [categoryIndex, dispatch]);

  useEffect(() => {
    setAutoFocusTitle(false);
  }, []);

  return (
    <Table className="categoryTable" striped={false} style={{ order }}>
      <tbody>
        <tr className="categoryTitle">
          <td className="deleteColumn">
            {removeMode && (
              <PopConfirm
                title="Excluir categoria"
                message={`Tem certeza que deseja excluir a categoria "${category.title}"?`}
                onConfirm={handleDeleteCategory}
              >
                <button className="brokerCustomButton">
                  <FiX color="#ce202a" size={10} strokeWidth={3} />
                </button>
              </PopConfirm>
            )}
          </td>
          <td colSpan={4}>
            <Form.Control
              value={category.title}
              className="darkSimpleInput"
              autoFocus={autoFocusTitle}
              onChange={handleChangeTitle}
              onBlur={onEndTitleEditing}
              name="title"
              autoComplete="off"
              ref={titleInputRef}
              onKeyPress={(e: any) => {
                if (e.key === "Enter" && titleInputRef.current) {
                  titleInputRef.current.blur();
                }
              }}
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
