import React from "react";

import "./Header.scss";

import { Link } from "react-router-dom";

function Header() {
  return (
    <header id="page-header">
      <Link to="/">
        <div className="left-side">
          <h1>Learning Catalog</h1>
          <h1>[IMAGE PLACE-HOLDER]</h1>
        </div>
      </Link>
      <div className="right-side">
        <h1>[IMAGE PLACE-HOLDER</h1>
      </div>
    </header>
  );
}

export default Header;
