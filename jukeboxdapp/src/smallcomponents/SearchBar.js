import React from "react";

const SearchBar = () => {
  return (
    <input
      type="text"
      placeholder="Search..."
      style={{
        padding: "8px 16px",
        borderRadius: "20px",
        border: "1px solid #ccc",
        width: "50%",
      }}
    />
  );
};

export default SearchBar;
