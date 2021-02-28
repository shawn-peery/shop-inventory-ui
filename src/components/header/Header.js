import React from "react";

import "./Header.scss";

import { Link, Redirect } from "react-router-dom";

function Header({ updateToken }) {
	const REACT_APP_TOKEN_NAME = process.env.REACT_APP_TOKEN_NAME;
	const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
		"<resource>",
		// Perhaps in the future, will add functionality for resources that have differeing plural words
		"users"
	);

	const REACT_APP_USER_TOKEN_NAME = process.env.REACT_APP_USER_TOKEN_NAME;

	console.log("TEST");
	const [redirect, setRedirect] = React.useState(false);
	const [redirectTo, setRedirectTo] = React.useState("");

	function logout() {
		window.localStorage.removeItem(REACT_APP_TOKEN_NAME);
		updateToken();
		setRedirectTo(`${REACT_APP_USER_API_BASE_URL}/login`);
		setRedirect(true);
	}

	function login() {
		setRedirectTo("/");
		setRedirect(true);
	}

	return (
		<header id="page-header">
			<Link id="main-logo-link" to="/">
				<div className="left-side">
					<h1>Shop Inventory</h1>
				</div>
			</Link>
			{window.localStorage.getItem(REACT_APP_TOKEN_NAME) && (
				<Link
					to={`${REACT_APP_USER_API_BASE_URL}/profiles/${window.localStorage.getItem(
						REACT_APP_USER_TOKEN_NAME
					)}`}
				>
					<div>
						<h1>User Profile</h1>
					</div>
				</Link>
			)}
			{window.localStorage.getItem(REACT_APP_TOKEN_NAME) && (
				<Link to={`${REACT_APP_USER_API_BASE_URL}/cart`}>
					<div>
						<h1>Cart</h1>
					</div>
				</Link>
			)}
			{window.localStorage.getItem(REACT_APP_TOKEN_NAME) ? (
				<Link
					to={`${REACT_APP_USER_API_BASE_URL}/login`}
					id="logout-link"
					onClick={logout}
				>
					<div className="right-side">
						<h1 id="logout-header">Logout</h1>
					</div>
				</Link>
			) : (
				<Link to="/" id="login-link" onClick={login}>
					<div className="right-side">
						<h1 id="login-header">Login</h1>
					</div>
				</Link>
			)}
			{redirect && <Redirect to={redirectTo} />}
		</header>
	);
}

export default Header;
