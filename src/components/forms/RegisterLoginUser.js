import React from "react";
import ResourceForm from "./ResourceForm";

import "./RegisterLoginUser.scss";

function RegisterLoginUser({ match: { params }, userFields, register }) {
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

  return (
    <main>
      <ResourceForm
        stateFields={stateFields}
        setStateFields={setStateFields}
        redirect={redirect}
        setRedirect={setRedirect}
        params={params}
        register={register}
      />
    </main>
  );
}

export default RegisterLoginUser;
