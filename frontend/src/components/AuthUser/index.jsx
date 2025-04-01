import React from "react";
import axios from "axios";
import "./index.css";
import { RegisterUser } from "../RegisterUser";

export function AuthUser(props) {
  const [register, setRegister] = React.useState(false);

  const authorizeUser = (email, password) => {
    axios
      .post(
        "http://localhost:3000/api/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((data) => {
        if (data?.data?.user) {
          props.setUser(data.data.user);
        } else {
          alert("Lietotājs vai parole nav pareizs");
        }
      })
      .catch(() => {
        alert("Lietotājs vai parole nav pareizs");
      });
  };

  return (
    <div className="auth">
      {!register && (
        <>
          <h4>Lūdzu, autorizējieties!</h4>
          <form
            className="auth-form"
            action={(data) => {
              const email = data.get("email");
              const password = data.get("password");

              authorizeUser(email, password);
            }}
          >
            <label htmlFor="email">E-pasts:</label>
            <input name="email" type="email" />
            <label html="password">Parole:</label>
            <input name="password" type="password" />
            <br />
            <button
              style={{ backgroundColor: "green", color: "white" }}
              type="submit"
            >
              Ieiet
            </button>
          </form>
          <br />
          <button
            style={{ backgroundColor: "orange", color: "white" }}
            onClick={() => setRegister(true)}
          >
            Reģistrēties
          </button>
        </>
      )}
      {register && <RegisterUser resetState={() => setRegister(false)} />}
    </div>
  );
}
