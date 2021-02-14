import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import qs from "qs";

function Cart(props) {
	const [products, setProducts] = React.useState([]);
	const [productIds, setProductIds] = React.useState([]);
	const [addingResource, setAddingResource] = React.useState(false);
	const [addedResource, setAddedResource] = React.useState(false);
	const [redirect, setRedirect] = React.useState(false);

	const REACT_APP_CART_TOKEN_NAME = process.env.REACT_APP_CART_TOKEN_NAME;

	const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

	const REACT_APP_RESOURCE_API_BASE_URL = props.apiURL;

	const REACT_APP_USER_API_BASE_URL = process.env.REACT_APP_RESOURCE_API_BASE_URL.replace(
		"<resource>",
		// Perhaps in the future, will add functionality for resources that have differeing plural words
		"users"
	);

	const token = window.localStorage.getItem("auth");

	// Ensures that addingResource is updated to true if needed
	React.useEffect(() => {
		if (props.match && addingResource === false) {
			setAddingResource(true);
		}

		const stringVersion = window.localStorage.getItem(
			REACT_APP_CART_TOKEN_NAME
		);

		let productIdsList = [];

		if (stringVersion) {
			productIdsList = JSON.parse(stringVersion);
		}

		if (props.match) {
			productIdsList.push(props.match.params.id);
			window.localStorage.setItem(
				REACT_APP_CART_TOKEN_NAME,
				JSON.stringify(productIdsList)
			);
		}

		setProductIds(productIdsList);
		if (props.match) {
			setAddedResource(true);
		}
	}, []);

	React.useEffect(() => {
		// alert("CHANGED");
		if (productIds.length <= 0) {
			return;
		}

		// get all products from inside the cart and display them.
		axios
			.get(
				`${REACT_APP_API_URL}${REACT_APP_RESOURCE_API_BASE_URL}`,
				{
					params: {
						ids: productIds,
					},
					paramsSerializer: (params) => {
						return qs.stringify(params);
					},
					headers: {
						auth: token,
					},
				},
				{
					headers: {
						auth: token,
					},
				}
			)
			.then((records) => {
				console.log("Test");
				setProducts(records.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [productIds]);

	// TODO: Read the products key from the local storage
	return (
		<>
			{addingResource && addedResource && (
				<>
					<h1>Item has been added to your cart!</h1>
					<button
						onClick={() => {
							setAddingResource(false);
							setAddedResource(false);
							setRedirect(true);
						}}
					>
						Continue
					</button>
				</>
			)}

			{redirect && <Redirect to={`${REACT_APP_USER_API_BASE_URL}/cart`} />}

			{!addedResource &&
				productIds.map((product) => {
					return (
						<>
							<h1>{product.name}</h1>
							<h1>{product.price}</h1>
							<h1>{product.description}</h1>
							<h1>{product.quantity}</h1>
							<h1>{product.isActive}</h1>
						</>
					);
				})}

			{!addedResource &&
				products &&
				products.map((product) => {
					return (
						<>
							<h1>{product.name}</h1>
							<h1>{product.price}</h1>
							<h1>{product.description}</h1>
							<h1>{product.quantity}</h1>
							<h1>{product.isActive}</h1>
						</>
					);
				})}
		</>
	);
}

export default Cart;
