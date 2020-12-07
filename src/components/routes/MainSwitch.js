import React from "react";

import Header from "../header/Header";

import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";

import Index from "../../containers/Index";
import Login from "../../containers/Login";
import Register from "../../containers/Register";
import CreateUpdateResource from "../forms/CreateUpdateResource";

import RegisterLoginUser from "../forms/RegisterLoginUser";

import { capitalizeWord } from "../../components/utils/StringStyleConverion";
import { ListGroupItemHeading } from "reactstrap";

function MainSwitch({ resourceName, resourceFields, userFields }) {
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  const token = window.localStorage.getItem("auth");

  return (
    <div>
      {
        // If token is present, show normal application
        token && (
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
                  <CreateUpdateResource
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
                  <CreateUpdateResource
                    {...props}
                    resourceName={resourceName}
                    resourceFields={resourceFields}
                    create={false}
                  />
                );
              }}
            />
          </Router>
        )
      }

      {
        // If token isn't present, show login page
        !token && (
          <Router>
            {/* Ensures that any user navigating to /users will automatically be taken the login page.*/}
            <Route exact path="/api/users">
              <Redirect to="/api/users/login" />
            </Route>

            {/* Ensures that any user navigating to / will automatically be taken the login page.*/}
            <Route exact path="/">
              <Redirect to="/api/users/login" />
            </Route>

            <Route path="/" component={Header} />

            <Route
              path="/api/users/register"
              render={(props) => {
                return (
                  <RegisterLoginUser
                    {...props}
                    userFields={userFields}
                    register={true}
                  />
                );
              }}
            />

            <Route
              path="/api/users/login"
              render={(props) => {
                return (
                  <RegisterLoginUser
                    {...props}
                    userFields={userFields}
                    register={false}
                  />
                );
              }}
            />
          </Router>
        )
      }
    </div>
  );
}

export default MainSwitch;
