import React from "react";
import axios from "axios";
import dayjs from "dayjs";

export function RequestedBooksList() {
  const [requestedBooks, setRequestedBooks] = React.useState([]);

  const fetchRequests = () => {
    axios
      .get("http://localhost:3000/api/books/request", {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setRequestedBooks(res?.data?.requests || []);
      });
  };

  React.useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <table>
        <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
          <th>ID</th>
          <th>Grāmatas nosaukums</th>
          <th>Pieprasīja</th>
          <th>Datums</th>
          <th>Darbības</th>
        </tr>
        <tbody>
          {requestedBooks &&
            requestedBooks.map((requestedBook) => (
              <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
                <td>{requestedBook.id}</td>
                <td>{requestedBook.Book.title}</td>
                <td>
                  {requestedBook.User.name} {requestedBook.User.surname}
                </td>
                <td>
                  {dayjs(requestedBook.request_date).format("DD.MM.YYYY.")}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "16px" }}>
                    <button
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={() => {
                        axios
                          .post(
                            "http://localhost:3000/api/books/request-approve",
                            {
                              isApproved: true,
                              requestId: requestedBook.id,
                              userId: requestedBook.User.id,
                              bookId: requestedBook.Book.id,
                            },
                            {
                              headers: { "Content-Type": "application/json" },
                            }
                          )
                          .then(() => fetchRequests());
                      }}
                    >
                      Apstiprināt
                    </button>
                    <button
                      style={{ backgroundColor: "red", color: "white" }}
                      onClick={() =>
                        axios
                          .post(
                            "http://localhost:3000/api/books/request-approve",
                            {
                              isApproved: false,
                              requestId: requestedBook.id,
                              userId: requestedBook.User.id,
                              bookId: requestedBook.Book.id,
                            },
                            {
                              headers: { "Content-Type": "application/json" },
                            }
                          )
                          .then(() => fetchRequests())
                      }
                    >
                      Atcelt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
