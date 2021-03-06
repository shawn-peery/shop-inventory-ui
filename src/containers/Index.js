import React from "react";

import "./Index.scss";
import ResponsiveDataTable from "../components/forms/ResponsiveDataTable";

import { capitalizeWord } from "../components/utils/StringStyleConverion";

import DeleteButton from "../components/DeleteButton";

import { Link } from "react-router-dom";

function Index({ resourceName, resourceFields }) {
	const token = window.localStorage.getItem("auth");

	const [resources, setResources] = React.useState();

	const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
	const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
		"<resource>",
		// Perhaps in the future, will add functionality for resources that have differeing plural words
		resourceName.toLowerCase() + "s"
	);
	const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
		"<resource>",
		// Perhaps in the future, will add functionality for resources that have differeing plural words
		"users"
	);

	const options = [
		{
			name: "Add To Cart",
			key: "add-to-cart",
			toRender: function ({ resource, isActive }) {
				return (
					<>
						{isActive && (
							<Link
								to={`${REACT_APP_USER_API_BASE_URL}/add${capitalizeWord(
									resourceName
								)}ToCart/${encodeURI(resource._id)}`}
							>
								<button color="success">Add To Cart</button>
							</Link>
						)}
						{!isActive && <button disabled>Add To Cart</button>}
					</>
				);
			},
			button: function () {
				console.log("Hit Update Button!");
			},
		},
		{
			name: "Update",
			key: "update",
			sendTo: function (id) {
				return `${REACT_APP_RESOURCE_API_BASE_URL}/update${capitalizeWord(
					resourceName
				)}/${encodeURI(id)}`;
			},
			button: function () {
				console.log("Hit Update Button!");
			},
		},
		{
			name: "Delete",
			key: "delete",
			toRender: function ({ resource, updateDelete }) {
				return (
					<DeleteButton
						resourceProp={resource}
						updateDelete={updateDelete}
						resourceName={resourceName}
						resourceFields={resourceFields}
					/>
				);
			},
			button: function () {
				console.log("Hit Delete Button!");
			},
		},
	];

	React.useEffect(function () {
		handleFetchingData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function handleFetchingData() {
		const url = `${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}`;

		console.log(`Fetching URL: ${url}`);

		fetch(url, {
			headers: {
				auth: token,
			},
		})
			.then((response) => response.json())
			.then(handleFetchingDataResponse);
	}

	// handleFetchingData Helper Function
	function handleFetchingDataResponse(data) {
		console.log();
		if (resources === undefined && data[0]) {
			setResources(data);
		}
	}
	return (
		<main>
			<ResponsiveDataTable
				resourceName={resourceName}
				resourceFields={resourceFields}
				inputResources={resources}
				options={options}
			></ResponsiveDataTable>
		</main>
	);
}

export default Index;
