import React from "react";

import "./UserProfile.scss";

import { handleErrors } from "../util/FetchUtils";

const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
  "<resource>",
  "users"
);

import { useParams } from "react-router-dom";

function UserProfile({ token }) {
  const [user, setUser] = React.useState();
  const [canSee, setCanSee] = React.useState(false);

  let { id: targetId } = useParams();
  const userId = window.localStorage.getItem(REACT_APP_USER_TOKEN_NAME);

  React.useEffect(() => {
    console.log("userId");
    console.log(userId);

    console.log("targetId");
    console.log(targetId);

    fetch(`${REACT_APP_API_URL}${REACT_APP_USER_API_BASE_URL}/${targetId}`, {
      headers: {
        auth: token,
      },
    })
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        console.log("Logging data:");
        console.log(data);
        // TODO: Need to fix hacky code later
        if (
          data === null ||
          data === undefined ||
          data.message === "You do not have access to this profile!"
        ) {
          return;
        }
        setUser(data);
        setCanSee(true);
      })
      .catch((err) => {
        console.log("Logging error:");
        console.error(err);
        setCanSee(false);
      });
  }, []);

  if (!canSee) {
    return (
      <h1 className="cant-see-message">
        You don't have access to see this user's profile!
      </h1>
    );
  }

  if (canSee) {
    return (
      <main>
        <h1 className="cant-see-message">You can see this site! :D</h1>
        {user && (
          <div className="user-items">
            <h2>Username:</h2>
            <h2 className="username-header">{user.username}</h2>
            <br />
            <h2>Email:</h2>
            <h2 className="email-header">{user.email}</h2>
          </div>
        )}
      </main>
    );
  }
}

export default UserProfile;
