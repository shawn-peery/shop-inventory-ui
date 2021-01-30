import React from "react";

import Header from "../header/Header";

import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";

import Index from "../../containers/Index";

import Cart from "../../containers/Cart";

import CreateUpdateResource from "../forms/CreateUpdateResource";

import UserProfile from "../../containers/UserProfile";

import RegisterLoginUser from "../forms/RegisterLoginUser";

import { capitalizeWord } from "../../components/utils/StringStyleConverion";
import { ListGroupItemHeading } from "reactstrap";

function MainSwitch({ resourceName, resourceFields, userFields }) {
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    "users"
  );

  const REACT_APP_TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME;

  const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

  console.log("REACT_APP_TOKEN_NAME");
  console.log(REACT_APP_TOKEN_NAME);

  const [token, setToken] = React.useState(
    window.localStorage.getItem(REACT_APP_TOKEN_NAME)
  );

  const [userObj, setUserObj] = React.useState(
    window.localStorage.getItem(REACT_APP_USER_TOKEN_NAME)
  );

  function updateUserId() {
    setToken(window.localStorage.getItem(REACT_APP_USER_TOKEN_NAME));
  }

  function updateToken() {
    setToken(window.localStorage.getItem(REACT_APP_TOKEN_NAME));
  }

  return (
    <div>
      {
        // If token is present, show normal application
        token && (
          <Router>
            <Route
              path="/"
              render={(props) => {
                return <Header {...props} updateToken={updateToken} />;
              }}
            />

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

            <Route exact path={`${REACT_APP_USER_API_BASE_URL}/login`}>
              <Redirect push to="/" />
            </Route>

            <Route exact path={`${REACT_APP_USER_API_BASE_URL}/register`}>
              <Redirect push to="/" />
            </Route>

            <Route
              path={`${REACT_APP_USER_API_BASE_URL}/profiles/:id`}
              render={(props) => {
                return <UserProfile {...props} token={token} />;
              }}
            />

            <Route path={`${REACT_APP_USER_API_BASE_URL}/cart`}>
              <Cart />
            </Route>
          </Router>
        )
      }

      {
        // If token isn't present, show login page
        !token && (
          <Router>
            {/* Ensures that any user navigating to /users will automatically be taken the login page.*/}
            <Route exact path={REACT_APP_USER_API_BASE_URL}>
              <Redirect to={`${REACT_APP_USER_API_BASE_URL}/login`} />
            </Route>

            {/* Ensures that any user navigating to / will automatically be taken the login page.*/}
            <Route exact path="/">
              <Redirect to={`${REACT_APP_USER_API_BASE_URL}/login`} />
            </Route>

            <Route path="/" component={Header} />

            <Route
              path={`${REACT_APP_USER_API_BASE_URL}/register`}
              render={(props) => {
                return (
                  <RegisterLoginUser
                    {...props}
                    userFields={userFields}
                    register={true}
                    updateToken={updateToken}
                    updateUserId={updateUserId}
                    token={token}
                  />
                );
              }}
            />

            <Route
              path={`${REACT_APP_USER_API_BASE_URL}/login`}
              render={(props) => {
                return (
                  <RegisterLoginUser
                    {...props}
                    userFields={userFields}
                    register={false}
                    updateToken={updateToken}
                    updateUserId={updateUserId}
                    token={token}
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
