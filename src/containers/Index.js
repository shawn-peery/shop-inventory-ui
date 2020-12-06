import React from "react";

import DeleteButton from "../components/DeleteButton";

import { Link } from "react-router-dom";

import { Button } from "reactstrap";

import {
  setStateObjectProperty,
  deleteItemFromStateArrayByMongoId,
} from "cloak-state-util";

import {
  kebabToPascalCaseWithSpaces,
  capitalizeWord,
} from "../components/utils/StringStyleConverion";

import "./Index.scss";

function Index({ resourceName, resourceFields }) {
  const [resources, setResources] = React.useState();

  const [maxColumnLengths, setMaxColumnLengths] = React.useState({});
  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  /* 

    Contains the maximum length of grouped categories.
    This allows us to correctly layout the table.

    {
        artists: 3
        supporters: 4
    }

  */

  React.useEffect(function () {
    handleFetchingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFetchingData() {
    const url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (resources === undefined && data[0]) {
          setResources(data);

          Object.keys(data[0])
            .filter((field) => Array.isArray(data[0][field]))
            .forEach((field) => {
              let maxFieldLength = 0;

              data.forEach((resource) => {
                if (resource[field].length > maxFieldLength) {
                  maxFieldLength = resource[field].length;
                }
              });

              setStateObjectProperty(
                maxColumnLengths,
                setMaxColumnLengths,
                field,
                maxFieldLength
              );
            });
        }
      });
  }

  function updateDelete(id) {
    deleteItemFromStateArrayByMongoId(resources, setResources, id);
  }

  // Will Review

  const fieldsObj = {};
  fieldsObj.tableData = [];

  fieldsObj.header = resourceFields.map((resourceField) => {
    return handleFieldHeaders(resourceField);
  });

  fieldsObj.header.push(<th key="update-header">Update</th>);
  fieldsObj.header.push(<th key="delete-header">Delete</th>);

  if (resources !== undefined) {
    resources.forEach((resource) => {
      const resourceTableData = [];

      resourceFields.forEach((resourceField) => {
        let count = 0;
        if (resourceField.multi) {
          const tableData = handleArrayTableData(
            resource[resourceField.name],
            resourceField.name
          );
          count += tableData.length;
          resourceTableData.push(tableData);
        } else {
          count++;
          resourceTableData.push(handleTableData(resource, resourceField.name));
        }
        for (; count < maxColumnLengths[resourceField.name]; count++) {
          resourceTableData.push(
            <td
              key={`${resource._id}-${resourceField.name}-${count}-spacing`}
            ></td>
          );
        }
      });

      resourceTableData.push(
        <td key={`${resource._id}-update`}>
          <Link
            to={`${REACT_APP_RESOURCE_API_BASE_URL}/update${capitalizeWord(
              resourceName
            )}/${encodeURI(resource._id)}`}
          >
            <Button color="primary">Update</Button>
          </Link>
        </td>
      );

      resourceTableData.push(
        <td key={`${resource._id}-delete`}>
          <DeleteButton
            resourceProp={resource}
            updateDelete={updateDelete}
            resourceName={resourceName}
            resourceFields={resourceFields}
          />
        </td>
      );
      const nestedTableData = (
        <tr key={`${resource._id}-row`}>{resourceTableData}</tr>
      );
      fieldsObj.tableData.push(nestedTableData);
    });
  }

  function handleFieldHeaders(resourceField) {
    return (
      <th
        key={resourceField.name}
        colSpan={maxColumnLengths[resourceField.name]}
      >
        {kebabToPascalCaseWithSpaces(resourceField.name)}
      </th>
    );
  }

  function handleTableData(resource, fieldName) {
    return <td key={`${fieldName}-${resource._id}`}>{resource[fieldName]}</td>;
  }

  function handleArrayTableData(fieldDataArray, fieldName) {
    // return <td key={`${fieldName}-${index}`}>{arrayElement}</td>;

    return fieldDataArray.map((element, index) => {
      return <td key={`${fieldName}-${index}`}>{element}</td>;
    });
  }

  return (
    <main>
      <table>
        <thead>
          <tr>{fieldsObj.header}</tr>
        </thead>
        <tbody>{fieldsObj.tableData}</tbody>
      </table>

      <Link
        to={`${REACT_APP_RESOURCE_API_BASE_URL}/create${capitalizeWord(
          resourceName
        )}`}
      >
        <Button color="success">{`Create ${kebabToPascalCaseWithSpaces(
          resourceName
        )}`}</Button>
      </Link>
    </main>
  );
}

export default Index;
