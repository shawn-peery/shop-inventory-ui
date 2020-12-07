import React from "react";
import UserForm from "./UserForm";

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

  return (
    <main>
      <UserForm
        userFields={userFields}
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
