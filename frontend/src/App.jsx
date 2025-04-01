import React from "react";
import "./App.css";
import { Header } from "./components/Header";
import { AuthUser } from "./components/AuthUser";
import { StudentPanel } from "./components/StudentPanel";
import { AdminPanel } from "./components/AdminPanel";

function App() {
  const [user, setUser] = React.useState();

  return (
    <div className="app">
      <Header onLogoutClick={user ? () => setUser() : undefined} />
      {!user && <AuthUser setUser={setUser} />}
      {user && user.role === "user" && <StudentPanel userId={user.id} />}
      {user && user.role === "admin" && <AdminPanel userId={user.id} />}
    </div>
  );
}

export default App;
