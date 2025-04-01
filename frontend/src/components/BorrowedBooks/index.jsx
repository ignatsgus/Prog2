import React from "react";
import axios from "axios";
import dayjs from "dayjs";

export function BorrowedBooks(props) {
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
    axios
      .post(
        "http://localhost:3000/api/user-books",
        { userId: props.userId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => setBooks(res.data.books));
  }, []);

  return (
    <div>
      <table>
        <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
          <th>ID</th>
          <th>Nosaukums</th>
          <th>Paņemts</th>
        </tr>
        <tbody>
          {books.map((book) => (
            <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
              <td>{book.id}</td>
              <td>{book.Book.title}</td>
              <td>{dayjs(book.borrow_date).format("DD.MM.YYYY.")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
