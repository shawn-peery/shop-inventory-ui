import React from "react";

function Cart(props) {
	const [products, setProducts] = React.useState([]);
	const [addingResource, setAddingResource] = React.useState(false);

	const REACT_APP_CART_TOKEN_NAME = process.env.REACT_APP_CART_TOKEN_NAME;

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
			console.log("test");
		}

		if (props.match) {
			productIdsList.push(props.match.params.id);
			window.localStorage.setItem(
				REACT_APP_CART_TOKEN_NAME,
				JSON.stringify(productIdsList)
			);
		}

		alert("Updating Products");
		setProducts(productIdsList);
	}, []);

	// TODO: Read the products key from the local storage
	return (
		<>
			<h1>Match: {`${addingResource}`}</h1>
			{products.map((product) => {
				return <h2>{product}</h2>;
			})}
		</>
	);
}

export default Cart;
