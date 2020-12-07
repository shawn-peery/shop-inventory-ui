import React from "react";

import { Redirect, Link } from "react-router-dom";
import InputField from "./InputField";

import { Form, Button } from "reactstrap";

function UserForm({
  userFields,
  stateFields,
  setStateFields,
  redirect,
  setRedirect,
  params,
  register,
}) {
  const [backHome, setBackHome] = React.useState(false);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    "users"
  );

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
      url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}/login`;
    } else {
      url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}/register`;
    }

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    }).then((result) => {
      const authToken = result.headers.get("auth");

      localStorage.setItem("auth", authToken);
      console.log("Applying token!");
    });

    setRedirect(true);
  }

  const inputFields = [];

  generateInputFields();

  function generateInputFields() {}

  return (
    <>
      <Form id="user-form" onSubmit={onSubmit}>
        {userFields.map((userField, index) => {
          return (
            <InputField
              key={index}
              name={userField.name}
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
          Submit
        </Button>
      </Form>
      <Link to="/">
        <Button
          onClick={() => {
            setBackHome(true);
          }}
        >
          Back To Home Page
        </Button>
      </Link>
      {backHome && <Redirect to="/" push />}
      {redirect && <Redirect to="/" push />}
    </>
  );
}

export default UserForm;
