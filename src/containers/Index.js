import React from "react";

import DeleteButton from "../components/DeleteButton";

import { Link } from "react-router-dom";

import {
	setStateObjectProperty,
	deleteItemFromStateArrayByMongoId,
} from "cloak-state-util";

import {
	kebabToPascalCaseWithSpaces,
	capitalizeWord,
} from "../components/utils/StringStyleConverion";

import "./Index.scss";

function Index({ resourceName, resourceFields }) {
	const token = window.localStorage.getItem("auth");

	const [showArchived, setShowArchived] = React.useState(false);

	const [resources, setResources] = React.useState();

	const [maxColumnLengths, setMaxColumnLengths] = React.useState({});

	const [sortBy, setSortBy] = React.useState("active");

	const [quantityFilter, setQuantityFilter] = React.useState(0);

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

	/* 

    Contains the maximum length of grouped categories.
    This allows us to correctly layout the table.

    {
        artists: 3
        supporters: 4
    }

  */

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
			.then((data) => {
				console.log(data);
				if (resources === undefined && data[0]) {
					setResources(data);

					Object.keys(data[0])
						.filter((field) => Array.isArray(data[0][field]))
						.forEach((field) => {
							let maxFieldLength = 0;

							data.forEach((resource) => {
								if (resource[field].length > maxFieldLength) {
									maxFieldLength = resource[field].length;
								}
							});

							setStateObjectProperty(
								maxColumnLengths,
								setMaxColumnLengths,
								field,
								maxFieldLength
							);
						});
				}
			});
	}

	function updateDelete(id) {
		deleteItemFromStateArrayByMongoId(resources, setResources, id);
	}

	// Will Review

	const fieldsObj = {};
	fieldsObj.tableData = [];

	fieldsObj.header = resourceFields.map((resourceField) => {
		return handleFieldHeaders(resourceField);
	});

	fieldsObj.header.push(<th key="addToCart-header">Add To Cart</th>);
	fieldsObj.header.push(<th key="update-header">Update</th>);
	fieldsObj.header.push(<th key="delete-header">Delete</th>);

	if (resources !== undefined) {
		let targetResources;
		if (!showArchived) {
			targetResources = resources.filter((resource) => resource["isActive"]);
		} else {
			targetResources = resources;
		}

		targetResources = targetResources.filter(
			(resource) => resource.quantity >= quantityFilter
		);

		// Sort
		targetResources = targetResources.sort((resource1, resource2) => {
			switch (sortBy) {
				case "inactive":
					const isActive1i = resource1.isActive;
					const isActive2i = resource2.isActive;

					if (!isActive1i && isActive2i) {
						return -1;
					} else if (!isActive1i && !isActive2i) {
						return 0;
					} else {
						return 1;
					}
					break;
				case "active":
					const isActive1a = resource1.isActive;
					const isActive2a = resource2.isActive;

					if (isActive1a && !isActive2a) {
						return -1;
					} else if (!isActive1a && !isActive2a) {
						return 0;
					} else {
						return 1;
					}
					break;
				case "quantity":
					const quantity1 = resource1.quantity;
					const quantity2 = resource2.quantity;

					if (quantity1 > quantity2) {
						return -1;
					} else if (quantity1 === quantity2) {
						return 0;
					} else {
						return 1;
					}
				case "price":
					const price1 = resource1.price;
					const price2 = resource2.price;

					if (price1 > price2) {
						return -1;
					} else if (price1 === price2) {
						return 0;
					} else {
						return 1;
					}
			}
		});

		targetResources.forEach((resource) => {
			const resourceTableData = [];

			resourceFields.forEach((resourceField) => {
				let count = 0;
				if (resourceField.multi) {
					const tableData = handleArrayTableData(
						resource[resourceField.name],
						resourceField.name
					);
					count += tableData.length;
					resourceTableData.push(tableData);
				} else {
					count++;
					resourceTableData.push(handleTableData(resource, resourceField));
				}
				for (; count < maxColumnLengths[resourceField.name]; count++) {
					resourceTableData.push(
						<td
							key={`${resource._id}-${resourceField.name}-${count}-spacing`}
						></td>
					);
				}
			});

			if (resource.isActive) {
				resourceTableData.push(
					<td key={`${resource._id}-add-to-cart`}>
						<Link
							to={`${REACT_APP_USER_API_BASE_URL}/add${capitalizeWord(
								resourceName
							)}ToCart/${encodeURI(resource._id)}`}
						>
							<button color="success">Add To Cart</button>
						</Link>
					</td>
				);
			} else {
				resourceTableData.push(<td key={`${resource._id}-add-to-cart`}></td>);
			}

			resourceTableData.push(
				<td key={`${resource._id}-update`}>
					<Link
						to={`${REACT_APP_RESOURCE_API_BASE_URL}/update${capitalizeWord(
							resourceName
						)}/${encodeURI(resource._id)}`}
					>
						<button color="primary">Update</button>
					</Link>
				</td>
			);

			resourceTableData.push(
				<td key={`${resource._id}-delete`}>
					<DeleteButton
						resourceProp={resource}
						updateDelete={updateDelete}
						resourceName={resourceName}
						resourceFields={resourceFields}
					/>
				</td>
			);
			const nestedTableData = (
				<tr key={`${resource._id}-row`}>{resourceTableData}</tr>
			);
			fieldsObj.tableData.push(nestedTableData);
		});
	}

	function handleFieldHeaders(resourceField) {
		return (
			<th
				key={resourceField.name}
				colSpan={maxColumnLengths[resourceField.name]}
			>
				{kebabToPascalCaseWithSpaces(resourceField.name)}
			</th>
		);
	}

	function handleTableData(resource, resourceField) {
		console.log("ResourceField");
		console.log(resourceField);
		const resourceFieldName = resourceField.name;
		return (
			<td key={`${resourceFieldName}-${resource._id}`}>
				{resourceField.currency !== undefined ? resourceField.currency : ""}
				{resource[resourceFieldName].toString()}
			</td>
		);
	}

	function handleArrayTableData(fieldDataArray, fieldName) {
		// return <td key={`${fieldName}-${index}`}>{arrayElement}</td>;

		return fieldDataArray.map((element, index) => {
			return <td key={`${fieldName}-${index}`}>{element}</td>;
		});
	}

	function onFilterButtonClick() {
		setShowArchived(!showArchived);
	}

	return (
		<main>
			<div className="filter-options">
				<div className="show-all-active-button">
					<button
						color="info"
						type="button"
						onClick={onFilterButtonClick}
						value="HELLO"
					>
						{showArchived ? "Show Active" : "Show All"}
					</button>
				</div>
				<div className="filter-by">
					<div className="sort-by">Sort By:</div>
					<select
						value={sortBy}
						onChange={(e) => {
							setSortBy(e.target.value);
						}}
						name="filer-by"
						className="filter-select"
					>
						<option value="price">Price</option>
						<option value="active">Active</option>
						{showArchived && <option value="inactive">InActive</option>}
						<option value="quantity">Quantity</option>
					</select>
				</div>
				<div className="filter-by-quantity">
					<div className="quantity">Minimum Quantity:</div>
					<input
						value={quantityFilter}
						onChange={(e) => {
							setQuantityFilter(e.target.value);
						}}
						type="number"
					/>
				</div>
			</div>
			<table>
				<thead>
					<tr>{fieldsObj.header}</tr>
				</thead>
				<tbody>{fieldsObj.tableData}</tbody>
			</table>

			<Link
				to={`${REACT_APP_RESOURCE_API_BASE_URL}/create${capitalizeWord(
					resourceName
				)}`}
			>
				<button color="success">{`Create ${kebabToPascalCaseWithSpaces(
					resourceName
				)}`}</button>
			</Link>
		</main>
	);
}

export default Index;
