import React from "react";

import "./ResponsiveDataTable.scss";

import DeleteButton from "../DeleteButton";

import { Link } from "react-router-dom";

import {
	setStateObjectProperty,
	deleteItemFromStateArrayByMongoId,
	addItemToStateArray,
} from "cloak-state-util";

import {
	kebabToPascalCaseWithSpaces,
	capitalizeWord,
} from "../utils/StringStyleConverion";

function ResponsiveDataTable({ resourceName, inputResources, resourceFields }) {
	const [maxColumnLengths, setMaxColumnLengths] = React.useState({});
	/* 

    Contains the maximum length of grouped categories.
    This allows us to correctly layout the table.

    {
        artists: 3
        supporters: 4
    }

    */

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

	const [sortBy, setSortBy] = React.useState("active");

	const [showArchived, setShowArchived] = React.useState(false);

	const [quantityFilter, setQuantityFilter] = React.useState(0);

	const [resources, setResources] = React.useState();

	const [tableData, setTableData] = React.useState([]);
	const [headers, setHeaders] = React.useState([]);

	React.useEffect(
		function () {
			populateTableData();
			recordMaxFieldLengths();
		},
		[resources, showArchived]
	);

	React.useEffect(function () {
		// eslint-disable-next-line react-hooks/exhaustive-deps
		generateHeaders();
	}, []);

	React.useEffect(
		function () {
			setResources(inputResources);
		},
		[inputResources]
	);

	function populateTableData() {
		if (!resources) {
			return;
		}

		const targetResources = filterAndSortTargetResources();
		populateFilteredResources(targetResources);
	}

	function recordMaxFieldLengths() {
		if (!resources) {
			return;
		}
		Object.keys(resources[0])
			// This algorithm assumes that the fields for each entry are identical. This allows us to rely on the first
			// data entry for fields
			.filter((field) => Array.isArray(resources[0][field]))
			.forEach((field) => {
				updateMaxFieldLength(field, resources);
			});
	}

	function generateHeaders() {
		const tableData = [];
		// fieldsObj.tableData = [];

		const headersArray = resourceFields.map((resourceField) => {
			return handleFieldHeaders(resourceField);
		});

		headersArray.push(<th key="addToCart-header">Add To Cart</th>);
		headersArray.push(<th key="update-header">Update</th>);
		headersArray.push(<th key="delete-header">Delete</th>);

		setHeaders(headersArray);
	}

	function populateFilteredResources(targetResources) {
		const localTableData = targetResources.map((resource) => {
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
				resourceTableData.push(
					<td key={`${resource._id}-add-to-cart`}>
						<button disabled>Add To Cart</button>
					</td>
				);
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

			// fieldsObj.tableData.push(nestedTableData);
			return nestedTableData;
		});

		setTableData(localTableData);
	}

	function filterAndSortTargetResources() {
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
		targetResources = targetResources.sort(targetResourcesComparator);

		return targetResources;
	}

	// handleFetchingData Helper Function 2
	function updateMaxFieldLength(field, resources) {
		let maxFieldLength = 0;

		resources.forEach((resource) => {
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
	}

	function updateDelete(id) {
		deleteItemFromStateArrayByMongoId(resources, setResources, id);
	}

	function targetResourcesComparator(resource1, resource2) {
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
		<>
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
					<tr>{headers}</tr>
				</thead>
				<tbody>{tableData}</tbody>
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
		</>
	);
}

export default ResponsiveDataTable;
