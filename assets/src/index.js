import React from "react";
import ReactDOM from "react-dom";
import Navigation from "./Navigation";
import Posts from "./Posts";
import "./index.scss";

const App = () => (
  <div className="App">
    <Navigation />

    <div className="container">
      <Posts />
    </div>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));
