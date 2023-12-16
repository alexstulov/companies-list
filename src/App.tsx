import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import {addCompany, deleteCompanies, fetchData, selectCompanies, setSelectedCompanies, selectEmployees, selectSelectedCompanies, setSelectedEmployees, updateCompanyField, selectSelectedEmployees } from './app/tablesSlice'
import './App.css';

function App() {
  const companies = useAppSelector(selectCompanies);
  const selectedCompanies = useAppSelector(selectSelectedCompanies);
  const selectedEmployees = useAppSelector(selectSelectedEmployees);
  const employees = useAppSelector(selectEmployees);
  const dispatch = useAppDispatch();

  const [newCompanyMode, setNewCompanyMode] = useState(false);
  const [companyName, setCompanyName] =  useState('');
  const [companyAddress, setCompanyAddress] =  useState('');
  const defaultCompanyEditField = {
    guid: '',
    fieldName: '',
    defaultValue: '',
    value: ''
  }
  const [editCompanyField, setEditCompanyField] = useState(defaultCompanyEditField)
  const [showCellForm, setShowCellForm] = useState(false)

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const cancelEditCell = () => {
    setShowCellForm(false);
    setEditCompanyField(defaultCompanyEditField);
  }

  const handleCompanySelectChange = (guid: string) => () => {
    cancelEditCell();
    if (!selectedCompanies) {
      dispatch(setSelectedCompanies([guid]));
      return;
    }
    var index = selectedCompanies.indexOf(guid);
    if (index >= 0) {
      dispatch(setSelectedCompanies([
        ...selectedCompanies.slice(0,index),
        ...selectedCompanies.slice(index+1)
      ]));
    } else {
      const newSelectedCompanies = [
        ...selectedCompanies,
        guid
      ];
      dispatch(setSelectedCompanies(newSelectedCompanies));
    }
  }

  const handleEmployeeSelectChange = (guid: string) => () => {
    if (!selectedEmployees) {
      dispatch(setSelectedEmployees([guid]));
      return;
    }
    var index = selectedEmployees.indexOf(guid);
    if (index >= 0) {
      dispatch(setSelectedEmployees([
        ...selectedEmployees.slice(0,index),
        ...selectedEmployees.slice(index+1)
      ]));
    } else {
      const newSelectedEmployees = [
        ...selectedEmployees,
        guid
      ];
      dispatch(setSelectedEmployees(newSelectedEmployees));
    }
  }

  const handleCompaniesMultiSelectChange = () => {
    cancelEditCell();
    if (!selectedCompanies || !companies) {
      return;
    }
    if (selectedCompanies.length < companies.length) {
      dispatch(setSelectedCompanies(companies.map(company => company.guid)));
    } else {
      dispatch(setSelectedCompanies([]));
    }
  }

  const handleEmployeesMultiSelectChange = () => {
    if (!employees || !selectedEmployees) {
      return;
    }
    if (selectedEmployees.length < employees.length) {
      dispatch(setSelectedEmployees(employees.map(employee => employee.guid)));
    } else {
      dispatch(setSelectedEmployees([]));
    }
  }

  const handleDeleteCompaniesClick = () => {
    cancelEditCell();
    if (!selectedCompanies || selectedCompanies.length === 0) {
      return;
    }

    dispatch(deleteCompanies(selectedCompanies));
  }

  const handleAddCompanyClick = () => {
    cancelEditCell();
    setNewCompanyMode(true);
  }

  const handleAddCompanyCancelClick = () => {
    setCompanyName('');
    setCompanyAddress('');
    setNewCompanyMode(false);
  }

  const handleCompanyNameChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setCompanyName(event.currentTarget.value);
  }
  const handleCompanyAddressChange = (event: SyntheticEvent<HTMLInputElement>) => {
    setCompanyAddress(event.currentTarget.value);
  }

  const handleAddCompanySubmitClick = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(addCompany({
      name: companyName,
      address: companyAddress
    }));
    setCompanyName('');
    setCompanyAddress('');
    setNewCompanyMode(false);
  }
  const handleEditCompanyField = (guid: string, fieldName: string, defaultValue: string) => () => {
    setEditCompanyField(
      {guid,fieldName,defaultValue,value: defaultValue}
    )
    setShowCellForm(true);
  }
  const handleCellValueUpdate = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateCompanyField(editCompanyField));
    setShowCellForm(false);
  }
  const handleCancelCellValueUpdate = () => {
    setShowCellForm(false);
  }
  const handleCompanyFieldValueUpdate = (event: SyntheticEvent<HTMLInputElement>) => {
    setEditCompanyField(oldValue => ({
      ...oldValue,
      // @ts-ignore - update SyntheticEvent interface to fix this
      value: event.target.value
    }))
  }

  const companyRows = companies.map(company => {
    return <tr key={company.guid} className={selectedCompanies?.includes(company.guid) ? "selected-row" : ""}>
      <td className="checkbox-cell"><input type="checkbox" className="custom-checkbox" onChange={handleCompanySelectChange(company.guid)} checked={selectedCompanies?.includes(company.guid) ?? false} /></td>
      <td className="editable-cell" onClick={handleEditCompanyField(company.guid, 'name', company.name)}>{company.name}</td>
      <td className="editable-cell" onClick={handleEditCompanyField(company.guid, 'address', company.address)}>{company.address}</td>
      <td>{employees.filter(employee => employee.company_id === company.guid).length}</td>
    </tr>
  });

  const showEmployees = selectedCompanies && selectedCompanies.length === 1
  const selectedCompanyEmployees = showEmployees ? employees.filter(employee => employee.company_id === selectedCompanies[0]) : []
  const employeesRows = selectedCompanyEmployees ? selectedCompanyEmployees.map(employee => {
    return <tr key={employee.guid} className={selectedCompanies?.includes(employee.guid) ? "selected-row" : ""}>
      <td className="checkbox-cell"><input type="checkbox" className="custom-checkbox" onChange={handleEmployeeSelectChange(employee.guid)} checked={selectedEmployees?.includes(employee.guid) ?? false} /></td>
      <td>{employee.name}</td>
      <td>{employee.surname}</td>
      <td>{employee.position}</td>
    </tr>
  }) : [];
  let multiSelectInputCompaniesClasses = "custom-checkbox"
  if (selectedCompanies && selectedCompanies.length === companies.length) {
    multiSelectInputCompaniesClasses += " custom-checkbox--semi-checked custom-checkbox--checked"
  } else if (selectedCompanies && selectedCompanies.length > 0) {
    multiSelectInputCompaniesClasses += " custom-checkbox--semi-checked"
  } else {
    multiSelectInputCompaniesClasses = "custom-checkbox"
  }

  let multiSelectInputEmployeesClasses = "custom-checkbox"
  if (selectedEmployees && selectedEmployees.length === employees.length) {
    multiSelectInputEmployeesClasses += " custom-checkbox--semi-checked custom-checkbox--checked"
  } else if (selectedEmployees && selectedEmployees.length > 0) {
    multiSelectInputEmployeesClasses += " custom-checkbox--semi-checked"
  } else {
    multiSelectInputEmployeesClasses = "custom-checkbox"
  }

  return (
    <article className="app">
      <h1>Companies List App</h1>
      <main className="wrapper">
        <section className="table-wrapper companies">
          <h2>Companies</h2>
          {showCellForm && <form className="cell-form" onSubmit={handleCellValueUpdate}>
            <input type="text" placeholder={`Enter company ${editCompanyField.fieldName}`} value={editCompanyField.value} required minLength={3} onChange={handleCompanyFieldValueUpdate}  />
            <button type="submit">&#10003;</button>
            <button type="button" onClick={handleCancelCellValueUpdate}>&#x2715;</button>
          </form>}
          {newCompanyMode ? 
          <>
            <h2>Add company</h2>
            <form className="add-company-form" onSubmit={handleAddCompanySubmitClick}>
              <label htmlFor='companyName'>Name</label>
              <input type="text" name="companyName" value={companyName} required minLength={3} onChange={handleCompanyNameChange} />
              <label htmlFor='companyAddress'>Address</label>
              <input type="text" name="companyAddress" value={companyAddress} required minLength={3} onChange={handleCompanyAddressChange} />
              <div className='actions-block'>
                <button type="submit">Add company</button>
                <button type="button" onClick={handleAddCompanyCancelClick}>Cancel</button>
              </div>
            </form>
          </> : 
          <>
            <div className="table-info-block">
              {!newCompanyMode && <button type="button" onClick={handleAddCompanyClick}>Add</button>}
              {selectedCompanies && selectedCompanies.length > 0 &&
                <button type="button" onClick={handleDeleteCompaniesClick}>Delete</button>}
              <span className="rows-count">{companies.length}</span>
            </div>
            {companies.length > 0 ? <table className="table">
              <thead>
                <tr>
                  <th><input type="checkbox" className={multiSelectInputCompaniesClasses} name="select-all-companies" onChange={handleCompaniesMultiSelectChange} /></th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Employees N</th>
                </tr>
              </thead>
              <tbody>
                {companyRows}
              </tbody>
            </table> : <p>No companies loaded yet...</p>}
          </>}
        </section>
        <section className="table-wrapper employees">
          <h2>Employees</h2>
          <div className="table-info-block">
              <button type="button" onClick={() => console.log('Add employee')}>Add</button>
              {selectedEmployees && selectedEmployees.length > 0 &&
                <button type="button" onClick={() => console.log('Delete employee')}>Delete</button>}
              <span className="rows-count">{selectedCompanyEmployees.length}</span>
            </div>
          {selectedCompanyEmployees.length > 0 ? <table className="table">
                <thead>
                  <tr>
                    <th><input type="checkbox" className={multiSelectInputEmployeesClasses} name="select-all-employees" onChange={handleEmployeesMultiSelectChange} /></th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Position</th>
                  </tr>
                </thead>
                <tbody>
                  {employeesRows}
                </tbody>
              </table> : <p>No employees there yet...</p>}
        </section>
      </main>
    </article>
  );
}

export default App;
