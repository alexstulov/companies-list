import { v4 as uuidv4 } from "uuid";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type ApiCompanyType = {
    guid: string;
    company: string;
    address: string;
};

type CompanyType = {
    guid: string;
    name: string;
    address: string;
};

type EmployeeType = {
    guid: string;
    name: string;
    surname: string;
    position: string;
    company_id: string;
};

const initialState: {
    companies: CompanyType[];
    selectedCompanies: string[] | null;
    employees: EmployeeType[];
    selectedEmployees: string[] | null;
    status: "idle" | "loading" | "failed";
} = {
    companies: [],
    selectedCompanies: null,
    employees: [],
    selectedEmployees: null,
    status: "idle",
};

export const fetchData = createAsyncThunk("tables/fetchData", async () => {
    const response = await fetch("./data.json").then((response) =>
        response.json()
    );
    return response;
});

export const tablesSlice = createSlice({
    name: "tables",
    initialState,
    reducers: {
        addCompany: (state, action) => {
            const newCompany = {
                guid: uuidv4(),
                name: action.payload.name ?? "New Company",
                address: action.payload.address ?? "New C Address",
            };
            state.companies.push(newCompany);
        },
        deleteCompanies: (state, action) => {
            const newCompaniesList = [];
            for (const company of state.companies) {
                if (action.payload.includes(company.guid)) {
                    continue;
                }
                newCompaniesList.push(company);
            }
            state.companies = newCompaniesList;
            state.selectedCompanies = [];
        },
        updateCompanyField: (state, action) => {
            const companyIndex = state.companies.findIndex(
                (company) => company.guid === action.payload.guid
            );
            const company = state.companies[companyIndex];
            const updatedCompany = {
                ...company,
                [action.payload.fieldName]: action.payload.value,
            };
            const newCompanies = Object.assign([], state.companies, {
                [companyIndex]: updatedCompany,
            });
            state.companies = newCompanies;
        },
        setSelectedCompanies: (state, action) => {
            state.selectedCompanies = action.payload;
        },
        // addEmployee: (state) => {},
        // deleteEmployees: (state) => {},
        setSelectedEmployees: (state, action) => {
            state.selectedEmployees = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.status = "idle";
                state.employees = action.payload.employee;
                state.companies = action.payload.company.map(
                    (company: ApiCompanyType) => {
                        let name = company.company.toLowerCase();
                        name = name.charAt(0).toUpperCase() + name.slice(1);
                        const { guid, address } = company;
                        return {
                            guid,
                            address,
                            name,
                        };
                    }
                );
            })
            .addCase(fetchData.rejected, (state) => {
                state.status = "failed";
            });
    },
});
export const {
    addCompany,
    deleteCompanies,
    updateCompanyField,
    setSelectedCompanies,
    setSelectedEmployees,
} = tablesSlice.actions;

export const selectCompanies = (state: RootState) => state.tables.companies;
export const selectCompanyByGuid = (state: RootState, guid: string) =>
    state.tables.companies.find((company) => company.guid === guid) ??
    state.tables.companies[0];
export const selectSelectedCompanies = (state: RootState) =>
    state.tables.selectedCompanies;
export const selectEmployees = (state: RootState) => state.tables.employees;
export const selectSelectedEmployees = (state: RootState) =>
    state.tables.selectedEmployees;

export default tablesSlice.reducer;
