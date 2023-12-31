import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IEmployee, INewEmployee } from "../../types";

interface EmployeesState {
  items: IEmployee[];
  paginatedItems: IEmployee[];
  currentPage: number;
  totalPages: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: EmployeesState = {
  items: [],
  paginatedItems: [],
  currentPage: 1,
  totalPages: 0,
  limit: 5,
  loading: false,
  error: null,
};

const fetchAllEmployees = createAsyncThunk<
  IEmployee[],
  void,
  { rejectValue: string }
>("employees/fetchAllEmployees", async (_, { rejectWithValue }) => {
  const response = await fetch(
    "https://rocky-temple-83495.herokuapp.com/employees"
  );
  if (!response.ok) {
    return rejectWithValue("Failed to fetch employees");
  }
  const data = await response.json();
  return data;
});

const addEmployee = createAsyncThunk<
  IEmployee,
  INewEmployee,
  { rejectValue: string }
>("employees/addEmployee", async (employee, { rejectWithValue }) => {
  const response = await fetch(
    "https://rocky-temple-83495.herokuapp.com/employees",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    }
  );

  if (!response.ok) {
    return rejectWithValue("Failed to add employee.");
  }
  const addedEmployee = await response.json();
  return addedEmployee;
});

const updateEmployee = createAsyncThunk<
  IEmployee,
  IEmployee,
  { rejectValue: string }
>("employees/updateEmployee", async (employee, { rejectWithValue }) => {
  const response = await fetch(
    `https://rocky-temple-83495.herokuapp.com/employees/${employee.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    }
  );

  if (!response.ok) {
    return rejectWithValue("Failed to update employee.");
  }
  const updatedEmployee = await response.json();
  return updatedEmployee;
});

const deleteEmployee = createAsyncThunk<void, string, { rejectValue: string }>(
  "employees/deleteEmployee",
  async (employeeId, { rejectWithValue }) => {
    const response = await fetch(
      `https://rocky-temple-83495.herokuapp.com/employees/${employeeId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      return rejectWithValue("Failed to delete employee");
    }
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    paginateEmployees: (state, { payload: page }: PayloadAction<number>) => {
      state.paginatedItems = state.items.slice(
        (page - 1) * state.limit,
        page * state.limit
      );
      state.currentPage = page;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.items = payload;
        state.totalPages = Math.ceil(state.items.length / state.limit);
      })
      .addCase(fetchAllEmployees.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;
        state.items.push(payload);
        state.totalPages = Math.ceil(state.items.length / state.limit);
      })
      .addCase(addEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateEmployee.fulfilled,
        (state, { payload: updatedEmployee }) => {
          state.loading = false;
          state.error = null;
          const index = state.items.findIndex(
            (employee) => employee.id === updatedEmployee.id
          );
          if (index !== -1) {
            state.items[index] = updatedEmployee;
          }
        }
      )
      .addCase(updateEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, { meta }) => {
        state.loading = false;
        state.error = null;
        state.items = state.items.filter(
          (employee) => employee.id !== meta.arg
        );
      })
      .addCase(deleteEmployee.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      });
  },
});

export const { paginateEmployees } = employeesSlice.actions;
export { fetchAllEmployees, addEmployee, updateEmployee, deleteEmployee };

export default employeesSlice.reducer;
