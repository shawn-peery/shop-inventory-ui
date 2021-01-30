import React from "react";

function Cart(props, taco) {
  const [products, setProducts] = React.useState();

  React.useEffect(() => {
    alert(props.match.params.id);
  });

  // TODO: Read the products key from the local storage
  let i = 0;
  Object.getOwnPropertyNames(props).forEach((p) => {
    console.log(`Prop: ${p}`);
    i++;
  });
  console.log(`Props: ${props} ${i}`);
  console.log(props);
  return <h1>Hello</h1>;
}

export default Cart;
