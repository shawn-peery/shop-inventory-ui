import React from "react";

import "./UserProfile.scss";

const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

import { useParams } from "react-router-dom";

function UserProfile(props) {
  let { id } = useParams();
  const userObj = JSON.parse(
    window.localStorage.getItem(REACT_APP_USER_TOKEN_NAME)
  );

  const currentId = userObj._id;

  console.log("currentId");
  console.log(currentId);

  console.log("id");
  console.log(id);

  if (currentId !== id) {
    return (
      <h1 className="cant-see-message">
        You don't have access to see this user's profile!
      </h1>
    );
  }

  return (
    <main>
      <h1 className="cant-see-message">You can see this site! :D</h1>
      <div className="user-items">
        <h2>Username:</h2>
        <h2 className="username-header">{userObj.username}</h2>
        <br />
        <h2>Email:</h2>
        <h2 className="email-header">{userObj.email}</h2>
      </div>
    </main>
  );
}

export default UserProfile;
