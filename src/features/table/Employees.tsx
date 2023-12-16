import { useAppSelector } from "../../app/hooks";
import {
    selectEmployees,
    selectSelectedCompanies,
    selectSelectedEmployees,
} from "./tableSlice";
import "./Employees.css";

export const Employees = () => {
    const selectedCompanies = useAppSelector(selectSelectedCompanies);
    const selectedEmployees = useAppSelector(selectSelectedEmployees);
    const employees = useAppSelector(selectEmployees);

    const showEmployees = selectedCompanies && selectedCompanies.length === 1;
    const selectedCompanyEmployees = showEmployees
        ? employees.filter(
              (employee) => employee.company_id === selectedCompanies[0]
          )
        : [];
    const employeesRows = selectedCompanyEmployees
        ? selectedCompanyEmployees.map((employee) => {
              return (
                  <tr
                      key={employee.guid}
                      className={
                          selectedCompanies?.includes(employee.guid)
                              ? "selected-row"
                              : ""
                      }
                  >
                      <td className="checkbox-cell">
                          <input
                              type="checkbox"
                              className="custom-checkbox"
                              onChange={() =>
                                  console.log(
                                      `select employee ${employee.guid}`
                                  )
                              }
                              checked={
                                  selectedEmployees?.includes(employee.guid) ??
                                  false
                              }
                          />
                      </td>
                      <td>{employee.name}</td>
                      <td>{employee.surname}</td>
                      <td>{employee.position}</td>
                  </tr>
              );
          })
        : [];

    let multiSelectInputEmployeesClasses = "custom-checkbox";
    if (selectedEmployees && selectedEmployees.length === employees.length) {
        multiSelectInputEmployeesClasses +=
            " custom-checkbox--semi-checked custom-checkbox--checked";
    } else if (selectedEmployees && selectedEmployees.length > 0) {
        multiSelectInputEmployeesClasses += " custom-checkbox--semi-checked";
    } else {
        multiSelectInputEmployeesClasses = "custom-checkbox";
    }

    return (
        <>
            <h2>Employees</h2>
            <div className="table-info-block">
                <button
                    type="button"
                    onClick={() => console.log("Add employee")}
                >
                    Add
                </button>
                {selectedEmployees && selectedEmployees.length > 0 && (
                    <button
                        type="button"
                        onClick={() => console.log("Delete employee")}
                    >
                        Delete
                    </button>
                )}
                <span className="rows-count">
                    {selectedCompanyEmployees.length}
                </span>
            </div>
            {selectedCompanyEmployees.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className={multiSelectInputEmployeesClasses}
                                    name="select-all-employees"
                                    onChange={() =>
                                        console.log("select all employees")
                                    }
                                />
                            </th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Position</th>
                        </tr>
                    </thead>
                    <tbody>{employeesRows}</tbody>
                </table>
            ) : (
                <p>No employees there yet...</p>
            )}
        </>
    );
};
