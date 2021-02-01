import React from "react";

function Cart(props) {
  const [products, setProducts] = React.useState();
  const [addingResource, setAddingResource] = React.useState(false);

  const REACT_APP_CART_TOKEN_NAME = process.env.REACT_APP_CART_TOKEN_NAME;

  // Ensures that addingResource is updated to true if needed
  React.useEffect(() => {
    if (props.match && addingResource === false) {
      setAddingResource(true);
    }

    if (!props) {
      return;
    }

    const stringVersion = window.localStorage.getItem(
      REACT_APP_CART_TOKEN_NAME
    );

    const productIdsList = JSON.parse(stringVersion);
    setProducts(productIdsList);
  }, []);

  // TODO: Read the products key from the local storage
  return (
    <>
      <h1>Match: {`${addingResource}`}</h1>
      {products &&
        products.map((product) => {
          <h2>{product}</h2>;
        })}
    </>
  );
}

export default Cart;
