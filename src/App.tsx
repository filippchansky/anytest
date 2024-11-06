import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Micro from "./components/MicroTest/MicroTest";

function App() {
  const [name, setName] = useState("");


  return (
    <>
      <h1>{name}</h1>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />
      <Micro/>
    </>
  );
}

export default App;
