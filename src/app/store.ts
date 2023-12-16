import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import tablesReducer from "../features/table/tableSlice";

export const store = configureStore({
    reducer: {
        tables: tablesReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
