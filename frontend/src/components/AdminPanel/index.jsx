import React from "react";
import { RequestedBooksList } from "../RequestedBooksList";

import "./index.css";

export function AdminPanel() {
  const [view, setView] = React.useState("requested-books");

  return (
    <div className="admin-panel">
      <div className="menu">
        <button
          className={`menu-button ${
            view === "requested-books" ? "--selected" : ""
          }`}
          onClick={() => setView("requested-books")}
        >
          Pieprasījumu saraksts
        </button>
      </div>
      <div>{view === "requested-books" && <RequestedBooksList />}</div>
    </div>
  );
}
