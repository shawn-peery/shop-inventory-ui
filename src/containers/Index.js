import React from "react";

import "./Index.scss";
import ResponsiveDataTable from "../components/forms/ResponsiveDataTable";

function Index({ resourceName, resourceFields }) {
	const token = window.localStorage.getItem("auth");

	const [resources, setResources] = React.useState();

	const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
	const REACT_APP_RESOURCE_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
		"<resource>",
		// Perhaps in the future, will add functionality for resources that have differeing plural words
		resourceName.toLowerCase() + "s"
	);
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
			></ResponsiveDataTable>
		</main>
	);
}

export default Index;
