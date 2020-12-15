import React from "react";

import { Redirect, Link } from "react-router-dom";
import InputField from "./InputField";

import { Form, Button } from "reactstrap";

function UserForm({
  userFields,
  stateFields,
  setStateFields,
  register,
  updateToken,
  updateUserObj,
  token,
}) {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    "users"
  );

  const REACT_APP_TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME;
  const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

  function onSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("user-form");

    const bodyObj = {};

    const inputs = form.querySelectorAll("input");

    inputs.forEach((input) => {
      if (!input.hasAttribute("data-form-group")) {
        bodyObj[input.name] = input.value;
        return;
      }

      if (input.name in bodyObj) {
        const formGroup = bodyObj[input.name];
        formGroup.push(input.value);
        bodyObj[input.name] = formGroup;
      } else {
        const newFormGroup = [input.value];
        bodyObj[input.name] = newFormGroup;
      }
    });

    let url;

    if (!register) {
      url = `${REACT_APP_API_URL}${REACT_APP_USER_API_BASE_URL}/login`;
    } else {
      url = `${REACT_APP_API_URL}${REACT_APP_USER_API_BASE_URL}/register`;
    }

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    })
      .then((result) => {
        const authToken = result.headers.get(REACT_APP_TOKEN_NAME);
        console.log("result json");
        console.log(result);

        if (authToken === null || authToken === undefined) {
          let alertMsg = "";
          alertMsg = register ? "Invalid fields!" : "Invalid credentials!";
          alert(alertMsg);
          return;
        }

        localStorage.setItem(REACT_APP_TOKEN_NAME, authToken);
        return result.json();
      })
      .then((result) => {
        if (result === undefined) {
          return;
        }

        console.log("LOGGING RESULT!");
        console.log(result);

        localStorage.setItem(REACT_APP_USER_TOKEN_NAME, JSON.stringify(result));

        updateUserObj();
        updateToken();
      });
  }

  return (
    <>
      <Form id="user-form" onSubmit={onSubmit}>
        {userFields
          .filter((userField) => {
            return register || userField.name !== "email";
          })
          .map((userField, index) => {
            let name = userField.name;
            if (!register) {
              name =
                userField.name === "username"
                  ? "username/email"
                  : userField.name;
            }
            return (
              <InputField
                key={index}
                name={name}
                inputType={userField.inputType}
                stateValue={stateFields[userField.name]}
                stateFields={stateFields}
                setStateFields={setStateFields}
                index={index}
              />
            );
          })}
        <Button
          color="primary"
          type="submit"
          className="submit-button"
          onClick={onSubmit}
        >
          {register ? "Register" : "Login"}
        </Button>
        <Link
          to={
            register
              ? `${REACT_APP_USER_API_BASE_URL}/login`
              : `${REACT_APP_USER_API_BASE_URL}/register`
          }
        >
          <Button color="secondary" type="submit" className="alt-button">
            {register ? "Login Instead" : "Register Instead"}
          </Button>
        </Link>
      </Form>
    </>
  );
}

export default UserForm;
