import React from "react";

import "./UserProfile.scss";

const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

import { useParams } from "react-router-dom";

function UserProfile(props) {
  let { id: targetId } = useParams();
  const userObj = JSON.parse(
    window.localStorage.getItem(REACT_APP_USER_TOKEN_NAME)
  );

  console.log("userObj");
  console.log(userObj);

  console.log("userId");
  console.log(userObj._id);

  console.log("userId");
  console.log(userObj._id);

  console.log("targetId");
  console.log(targetId);

  if (userObj._id !== targetId) {
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
