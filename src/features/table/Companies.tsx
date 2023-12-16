import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../..//app/hooks";
import {
    deleteCompanies,
    selectCompanies,
    setSelectedCompanies,
    selectSelectedCompanies,
} from "./tableSlice";
import { AddCompany } from "./AddCompany";
import { CellForm } from "./CellForm";
import { CompanyRow } from "./CompanyRow";
import "./Companies.css";

export type CellFieldType = {
    guid: string;
    fieldName: string;
    defaultValue: string;
    value: string;
};

export const Companies = () => {
    const selectedCompanies = useAppSelector(selectSelectedCompanies);
    const companies = useAppSelector(selectCompanies);
    const dispatch = useAppDispatch();

    const defaultCompanyEditField = {
        guid: "",
        fieldName: "",
        defaultValue: "",
        value: "",
    };
    const [editCompanyField, setEditCompanyField] = useState<CellFieldType>(
        defaultCompanyEditField
    );
    const [newCompanyMode, setNewCompanyMode] = useState(false);
    const [isCellFormShown, setShowCellForm] = useState(false);
    const showCellForm = () => {
        setShowCellForm(true);
    };
    const hideCellForm = () => {
        setShowCellForm(false);
    };

    const exitNewCompanyMode = () => {
        hideCellForm();
        setNewCompanyMode(false);
    };

    let multiSelectInputCompaniesClasses = "custom-checkbox";
    if (selectedCompanies && selectedCompanies.length === companies.length) {
        multiSelectInputCompaniesClasses +=
            " custom-checkbox--semi-checked custom-checkbox--checked";
    } else if (selectedCompanies && selectedCompanies.length > 0) {
        multiSelectInputCompaniesClasses += " custom-checkbox--semi-checked";
    } else {
        multiSelectInputCompaniesClasses = "custom-checkbox";
    }

    const handleDeleteCompaniesClick = () => {
        hideCellForm();
        if (!selectedCompanies || selectedCompanies.length === 0) {
            return;
        }

        dispatch(deleteCompanies(selectedCompanies));
    };

    const handleAddCompanyClick = () => {
        hideCellForm();
        setNewCompanyMode(true);
    };

    const handleCompaniesMultiSelectChange = () => {
        hideCellForm();
        if (!companies) {
            return;
        }
        if (!selectedCompanies || selectedCompanies.length < companies.length) {
            dispatch(
                setSelectedCompanies(companies.map((company) => company.guid))
            );
        } else {
            dispatch(setSelectedCompanies([]));
        }
    };

    const companyRows = companies.map((company) => (
        <CompanyRow
            companyGuid={company.guid}
            hideCellForm={hideCellForm}
            showCellForm={showCellForm}
            setEditCompanyField={setEditCompanyField}
        />
    ));

    return (
        <>
            <h2>Companies</h2>
            {isCellFormShown && (
                <CellForm
                    hideForm={hideCellForm}
                    editCompanyField={editCompanyField}
                    setEditCompanyField={setEditCompanyField}
                />
            )}
            {newCompanyMode ? (
                <AddCompany hideForm={exitNewCompanyMode} />
            ) : (
                <>
                    <div className="table-info-block">
                        {!newCompanyMode && (
                            <button
                                type="button"
                                onClick={handleAddCompanyClick}
                            >
                                Add
                            </button>
                        )}
                        {selectedCompanies && selectedCompanies.length > 0 && (
                            <button
                                type="button"
                                onClick={handleDeleteCompaniesClick}
                            >
                                Delete
                            </button>
                        )}
                        <span className="rows-count">{companies.length}</span>
                    </div>
                    {companies.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            className={
                                                multiSelectInputCompaniesClasses
                                            }
                                            name="select-all-companies"
                                            onChange={
                                                handleCompaniesMultiSelectChange
                                            }
                                            checked={false}
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Employees N</th>
                                </tr>
                            </thead>
                            <tbody>{companyRows}</tbody>
                        </table>
                    ) : (
                        <p>No companies loaded yet...</p>
                    )}
                </>
            )}
        </>
    );
};
