import React from "react";
import MainHeader from "./Components/Headers/MainHeader";
import RecordButton from "./Components/Buttons/RecordButton";
import "./App.css";

const App = () => {
  return (
    <div>
      <MainHeader></MainHeader>
      <hr></hr>
      <div className="App">
        <RecordButton></RecordButton>
      </div>
    </div>
  );
};

export default App;
