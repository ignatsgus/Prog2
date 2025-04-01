import React from "react";
import axios from "axios";
import "./index.css";

export function RegisterUser(props) {
  const registerUser = (email, password, name, surname) => {
    if (!email || !password || !name || !surname) {
      alert("Pietrūkst dati");
      return;
    }

    return axios
      .post(
        "http://localhost:3000/api/register",
        { email, password, name, surname },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        alert("Reģistrācija ir veiksmīga!");
        props.resetState();
      })
      .catch(() => {
        alert("E-pasts ir aizņemts");
      });
  };

  return (
    <div className="register">
      <h4>Reģistrācija</h4>
      <form
        className="auth-form"
        action={(data) => {
          const email = data.get("email");
          const password = data.get("password");
          const name = data.get("name");
          const surname = data.get("surname");

          registerUser(email, password, name, surname);
        }}
      >
        <label htmlFor="email">E-pasts:</label>
        <input name="email" type="email" />
        <label html="password">Parole:</label>
        <input name="password" type="password" />
        <label html="name">Vārds:</label>
        <input name="name" type="text" />
        <label html="surname">Uzvārds:</label>
        <input name="surname" type="text" />
        <br />
        <button
          type="submit"
          style={{ backgroundColor: "green", color: "white" }}
        >
          Reģistrēties
        </button>
      </form>
      <br />
      <button
        style={{ backgroundColor: "red", color: "white" }}
        onClick={() => props.resetState()}
      >
        Atcelt
      </button>
    </div>
  );
}
