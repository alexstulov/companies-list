import React from "react";
import {
    selectCompanyByGuid,
    selectEmployees,
    selectSelectedCompanies,
    setSelectedCompanies,
} from "./tableSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CellFieldType } from "./Companies";
import "./CompanyRow.css";

export const CompanyRow = ({
    companyGuid,
    showCellForm,
    hideCellForm,
    setEditCompanyField,
}: {
    companyGuid: string;
    showCellForm: VoidFunction;
    hideCellForm: VoidFunction;
    setEditCompanyField: (value: CellFieldType) => void;
}) => {
    const employees = useAppSelector(selectEmployees);
    const selectedCompanies = useAppSelector(selectSelectedCompanies);
    const company = useAppSelector((state) =>
        selectCompanyByGuid(state, companyGuid)
    );
    const dispatch = useAppDispatch();

    const handleCompanySelectChange = (guid: string) => () => {
        hideCellForm();
        if (!selectedCompanies) {
            dispatch(setSelectedCompanies([guid]));
            return;
        }
        const index = selectedCompanies.indexOf(guid);
        if (index >= 0) {
            dispatch(
                setSelectedCompanies([
                    ...selectedCompanies.slice(0, index),
                    ...selectedCompanies.slice(index + 1),
                ])
            );
        } else {
            const newSelectedCompanies = [...selectedCompanies, guid];
            dispatch(setSelectedCompanies(newSelectedCompanies));
        }
    };

    const handleEditCompanyField =
        (guid: string, fieldName: string, defaultValue: string) => () => {
            setEditCompanyField({
                guid,
                fieldName,
                defaultValue,
                value: defaultValue,
            });
            showCellForm();
        };

    return (
        <tr
            key={company.guid}
            className={
                selectedCompanies?.includes(company.guid) ? "selected-row" : ""
            }
        >
            <td className="checkbox-cell">
                <input
                    type="checkbox"
                    className="custom-checkbox"
                    onChange={handleCompanySelectChange(company.guid)}
                    checked={selectedCompanies?.includes(company.guid) ?? false}
                />
            </td>
            <td
                className="editable-cell"
                onClick={handleEditCompanyField(
                    company.guid,
                    "name",
                    company.name
                )}
            >
                {company.name}
            </td>
            <td
                className="editable-cell"
                onClick={handleEditCompanyField(
                    company.guid,
                    "address",
                    company.address
                )}
            >
                {company.address}
            </td>
            <td>
                {
                    employees.filter(
                        (employee) => employee.company_id === company.guid
                    ).length
                }
            </td>
        </tr>
    );
};
