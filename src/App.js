import "./App.scss";

import MainSwitch from "./components/routes/MainSwitch";

import React from "react";

const resourceNameObj = require("./config/resource/resource-name.json");
const resourceFields = require("./config/resource/resource-fields.json");

const userFields = require("./config/user/user-fields.json");

function App() {
  return (
    <div className="App">
      <MainSwitch
        resourceName={resourceNameObj["resource-name"]}
        resourceFields={resourceFields}
        userFields={userFields}
      />
    </div>
  );
}

export default App;
