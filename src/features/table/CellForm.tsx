import { SyntheticEvent } from "react";
import { useAppDispatch } from "../../app/hooks";
import { updateCompanyField } from "./tableSlice";
import { CellFieldType } from "./Companies";
import "./CellForm.css";

export const CellForm = ({
    hideForm,
    editCompanyField,
    setEditCompanyField,
}: {
    hideForm: VoidFunction;
    editCompanyField: CellFieldType;
    setEditCompanyField: React.Dispatch<React.SetStateAction<CellFieldType>>;
}) => {
    const dispatch = useAppDispatch();
    const handleCellValueUpdate = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(updateCompanyField(editCompanyField));
        hideForm();
    };
    const handleCancelCellValueUpdate = () => {
        hideForm();
    };
    const handleCompanyFieldValueUpdate = (
        event: SyntheticEvent<HTMLInputElement>
    ) => {
        setEditCompanyField((oldValue) => ({
            ...oldValue,
            value: (event.target as HTMLInputElement).value,
        }));
    };
    return (
        <form className="cell-form" onSubmit={handleCellValueUpdate}>
            <input
                type="text"
                placeholder={`Enter company ${editCompanyField.fieldName}`}
                value={editCompanyField.value}
                required
                minLength={3}
                onChange={handleCompanyFieldValueUpdate}
            />
            <button type="submit">&#10003;</button>
            <button type="button" onClick={handleCancelCellValueUpdate}>
                &#x2715;
            </button>
        </form>
    );
};
