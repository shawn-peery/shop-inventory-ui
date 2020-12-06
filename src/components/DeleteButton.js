import React from "react";
import "./DeleteButton.scss";

import { Button } from "reactstrap";

import { kebabToLowerCaseWithSpaces } from "../components/utils/StringStyleConverion";

function DeleteButton({
  resourceProp,
  updateDelete,
  resourceName,
  resourceFields,
}) {
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  const [resource, setResource] = React.useState();

  React.useEffect(() => {
    setResource(resourceProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleOnClick(event) {
    event.preventDefault();

    const confirmResult = window.confirm(
      `Are you sure you want to delete this ${kebabToLowerCaseWithSpaces(
        resourceName
      )}?`,
      false
    );

    if (!confirmResult) {
      return;
    }

    fetch(
      `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}/${resource._id}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => res.text())
      .then(() => {
        updateDelete(resource._id);
      });
  }

  return (
    <Button color="danger" onClick={handleOnClick}>
      Delete
    </Button>
  );
}

export default DeleteButton;
