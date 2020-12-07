import React from "react";
import UserForm from "./UserForm";

import "./RegisterLoginUser.scss";

import { Redirect } from "react-router-dom";

function RegisterLoginUser({
  match: { params },
  userFields,
  register,
  updateToken,
  token,
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

  return (
    <main>
      <UserForm
        userFields={userFields}
        stateFields={stateFields}
        setStateFields={setStateFields}
        register={register}
        updateToken={updateToken}
        token={token}
      />
    </main>
  );
}

export default RegisterLoginUser;
