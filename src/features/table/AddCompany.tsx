import React, { SyntheticEvent, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { addCompany } from "./tableSlice";
import "./AddCompany.css";

export const AddCompany = ({ hideForm }: { hideForm: VoidFunction }) => {
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const dispatch = useAppDispatch();

    const handleAddCompanyCancelClick = () => {
        setCompanyName("");
        setCompanyAddress("");
        hideForm();
    };

    const handleCompanyNameChange = (
        event: SyntheticEvent<HTMLInputElement>
    ) => {
        setCompanyName(event.currentTarget.value);
    };
    const handleCompanyAddressChange = (
        event: SyntheticEvent<HTMLInputElement>
    ) => {
        setCompanyAddress(event.currentTarget.value);
    };

    const handleAddCompanySubmitClick = (
        event: SyntheticEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        dispatch(
            addCompany({
                name: companyName,
                address: companyAddress,
            })
        );
        setCompanyName("");
        setCompanyAddress("");
        hideForm();
    };

    return (
        <>
            <h2>Add company</h2>
            <form
                className="add-company-form"
                onSubmit={handleAddCompanySubmitClick}
            >
                <label htmlFor="companyName">Name</label>
                <input
                    type="text"
                    name="companyName"
                    value={companyName}
                    required
                    minLength={3}
                    onChange={handleCompanyNameChange}
                />
                <label htmlFor="companyAddress">Address</label>
                <input
                    type="text"
                    name="companyAddress"
                    value={companyAddress}
                    required
                    minLength={3}
                    onChange={handleCompanyAddressChange}
                />
                <div className="actions-block">
                    <button type="submit">Add company</button>
                    <button type="button" onClick={handleAddCompanyCancelClick}>
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};
