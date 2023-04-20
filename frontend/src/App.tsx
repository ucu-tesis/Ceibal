import MainHeader from "./Components/Headers/MainHeader";
import "./App.css";
import Recorder from "./Components/Recorder";

const App = () => {
  return (
    <div>
      <MainHeader></MainHeader>
      <hr></hr>
      <div className="App">
        <Recorder
          onComplete={(buffer) => console.log("Recording completed, send to backend", buffer)}
        ></Recorder>
      </div>
    </div>
  );
};

export default App;
