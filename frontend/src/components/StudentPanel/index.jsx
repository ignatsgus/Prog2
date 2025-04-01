import React from "react";
import { BorrowedBooks } from "../BorrowedBooks";
import { RequestBooks } from "../RequestBooks";

import "./index.css";

export function StudentPanel(props) {
  const [view, setView] = React.useState("borrowed-books");

  return (
    <div className="student-panel">
      <div className="menu">
        <button
          className={`menu-button ${
            view === "borrowed-books" ? "--selected" : ""
          }`}
          onClick={() => setView("borrowed-books")}
        >
          Paņemtas grāmatas
        </button>
        <button
          className={`menu-button ${view === "books-list" ? "--selected" : ""}`}
          onClick={() => setView("books-list")}
        >
          Grāmatu saraksts
        </button>
      </div>
      <div>
        {view === "borrowed-books" && <BorrowedBooks userId={props.userId} />}
        {view === "books-list" && <RequestBooks userId={props.userId} />}
      </div>
    </div>
  );
}
