import React from "react";

import { Redirect, Link } from "react-router-dom";
import InputField from "./InputField";

import { Form, Button } from "reactstrap";

function ResourceForm({
  resourceName,
  resourceFields,
  stateFields,
  setStateFields,
  redirect,
  setRedirect,
  params,
  create,
}) {
  const [backHome, setBackHome] = React.useState(false);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  function onSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("resource-form");

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

    if (!create) {
      url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}/${params.id}`;
    } else {
      url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}`;
    }

    fetch(url, {
      method: create ? "POST" : "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObj),
    });

    setRedirect(true);
  }

  const inputFields = [];

  generateInputFields();

  function generateInputFields() {}

  return (
    <>
      <Form id="resource-form" onSubmit={onSubmit}>
        {resourceFields.map((resourceField, index) => {
          return (
            <InputField
              key={index}
              name={resourceField.name}
              stateValue={stateFields[resourceField.name]}
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

export default ResourceForm;
