import React, { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { fetchData } from "./features/table/tableSlice";
import { Companies } from "./features/table/Companies";
import { Employees } from "./features/table/Employees";
import "./App.css";

function App() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchData());
    }, [dispatch]);

    return (
        <article className="app">
            <h1>Companies List App</h1>
            <main className="wrapper">
                <section className="table-wrapper companies">
                    <Companies />
                </section>
                <section className="table-wrapper employees">
                    <Employees />
                </section>
            </main>
        </article>
    );
}

export default App;
