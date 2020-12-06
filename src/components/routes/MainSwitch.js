import React from "react";

import Header from "../header/Header";

import { BrowserRouter as Router, Route } from "react-router-dom";

import Index from "../../containers/Index";
import CreateUpdateDefinition from "../../components/forms/CreateUpdateDefinition";

import { capitalizeWord } from "../../components/utils/StringStyleConverion";

function MainSwitch({ resourceName, resourceFields }) {
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  return (
    <Router>
      <Route path="/" component={Header} />

      <Route
        exact
        path="/"
        render={(props) => {
          return (
            <Index
              {...props}
              resourceName={resourceName}
              resourceFields={resourceFields}
            />
          );
        }}
      />

      <Route
        path={`${REACT_APP_RESOURCE_API_BASE_URL}/create${capitalizeWord(
          resourceName
        )}`}
        render={(props) => {
          return (
            <CreateUpdateDefinition
              {...props}
              resourceName={resourceName}
              resourceFields={resourceFields}
              create={true}
            />
          );
        }}
      />

      <Route
        path={`${REACT_APP_RESOURCE_API_BASE_URL}/update${capitalizeWord(
          resourceName
        )}/:id`}
        render={(props) => {
          return (
            <CreateUpdateDefinition
              {...props}
              resourceName={resourceName}
              resourceFields={resourceFields}
              create={false}
            />
          );
        }}
      />
    </Router>
  );
}

export default MainSwitch;
