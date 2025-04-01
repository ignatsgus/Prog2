import React from "react";
import axios from "axios";

export function RequestBooks(props) {
  const [books, setBooks] = React.useState([]);

  console.log(props);

  React.useEffect(() => {
    axios
      .post("http://localhost:3000/api/books", undefined, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        const books = res?.data?.books ?? [];

        books.forEach((book) => {
          book.isAvailable = book.BookTakens.every(
            (entry) => !!entry.return_date
          );
        });

        setBooks(books);
      });
  }, []);

  return (
    <div>
      <table>
        <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
          <th>ID</th>
          <th>Nosaukums</th>
          <th>Kategorija</th>
          <th>Pieprasīt grāmatu</th>
        </tr>
        <tbody>
          {books &&
            books.map((book) => (
              <tr style={{ border: "3px solid rgb(0, 0, 0)" }}>
                <td>{book.id}</td>
                <td>{book.title}</td>
                <td>{book.BookGenre.genre_name}</td>
                <td>
                  {book.isAvailable ? (
                    <button
                      onClick={() =>
                        axios.post(
                          "http://localhost:3000/api/books/request",
                          { userId: props.userId, bookId: book.id },
                          {
                            headers: { "Content-Type": "application/json" },
                          }
                        )
                      }
                    >
                      Pieprasīt
                    </button>
                  ) : (
                    <span>Nav pieejama</span>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
