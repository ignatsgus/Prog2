import React from "react";

export function Header(props) {
  return (
    <div>
      <h2>Skolas bibliotēkas sistēma</h2>
      {props.onLogoutClick && (
        <button onClick={props.onLogoutClick}>Iziet</button>
      )}
    </div>
  );
}
