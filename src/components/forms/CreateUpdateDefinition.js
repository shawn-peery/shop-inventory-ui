import React from "react";
import ResourceForm from "./ResourceForm";

import "./CreateUpdateDefinition.scss";

function CreateUpdateDefinition({
  match: { params },
  resourceName,
  resourceFields,
  create,
}) {
  const [stateFields, setStateFields] = React.useState({});

  /*

  stateFields: 
  {
    fieldName1: fieldValue1,
    fieldName2: fieldValue2,
    fieldName3: fieldValue3,
    fieldName4: fieldValue4,
    fieldName5: fieldValue5
  }

  */

  const [redirect, setRedirect] = React.useState(false);

  const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
  const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
    "<resource>",
    // Perhaps in the future, will add functionality for resources that have differeing plural words
    resourceName.toLowerCase() + "s"
  );

  React.useEffect(() => {
    if (!create) {
      handleFieldPopulation();
    } else {
      handleFieldTypePopulation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDatabaseDataSingle() {
    const url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}/${params.id}`;

    const response = await fetch(url);
    return await response.json();
  }

  async function fetchDatabaseDataAll() {
    const url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function pruneDataSingle() {
    const data = await fetchDatabaseDataSingle();
    const { __v, _id, ...prunedData } = data;
    return prunedData;
  }

  async function pruneDataAll() {
    const data = await fetchDatabaseDataAll();

    const prunedData = data.map((d) => {
      const { __v, _id, ...prunedData } = d;
      return prunedData;
    });

    return prunedData;
  }

  async function handleFieldPopulation() {
    const prunedData = await pruneDataSingle();
    setStateFields(prunedData);
  }

  async function handleFieldTypePopulation() {
    const prunedData = await pruneDataAll();

    const firstData = prunedData[0];

    const typesObj = {};

    for (let prop in firstData) {
      const targetValue = firstData[prop];

      if (Array.isArray(targetValue)) {
        const stringArray = [""];
        typesObj[prop] = stringArray;
        continue;
      }

      typesObj[prop] = firstData[prop].constructor();
    }
    setStateFields(typesObj);
  }

  return (
    <main>
      <ResourceForm
        resourceName={resourceName}
        resourceFields={resourceFields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        redirect={redirect}
        setRedirect={setRedirect}
        params={params}
        create={create}
      />
    </main>
  );
}

export default CreateUpdateDefinition;
