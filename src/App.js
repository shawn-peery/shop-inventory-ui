import "./App.scss";

import MainSwitch from "./components/routes/MainSwitch";

import React from "react";

const resourceNameObj = require("./resource/resource-name.json");
const resourceFields = require("./resource/resource-fields.json");

function App() {
  return (
    <div className="App">
      <MainSwitch
        resourceName={resourceNameObj["resource-name"]}
        resourceFields={resourceFields}
      />
    </div>
  );
}

export default App;
