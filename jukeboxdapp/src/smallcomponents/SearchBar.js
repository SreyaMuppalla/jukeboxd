import React, { useState } from "react";

const SearchBar = () => {
  const [category, setCategory] = useState("artist");

  return (
    <div style={{ display: "flex", alignItems: "center", width: "548px", height: "64px" }}>
      {/* Dropdown for selecting category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "20px 0 0 20px",
          border: "1px solid #ccc",
          background: "#f8f8f8",
          cursor: "pointer",
          outline: "none",
          height:"46px",
          fontFamily: "Inter",
          fontSize: "16px"
        }}
      >
        <option value="artists">Artists</option>
        <option value="songs">Songs</option>
        <option value="albums">Albums</option>
        <option value="profiles">Profiles</option>
      </select>

      {/* Search input */}
      <input
        type="text"
        placeholder={`Search ${category}...`}
        style={{
          padding: "8px 16px",
          borderRadius: "0 20px 20px 0",
          border: "1px solid #ccc",
          borderLeft: "none",
          width: "100%",
          height: "28px",
          fontFamily: "Inter",
          fontSize: "16px"

        }}
      />
    </div>
  );
};

export default SearchBar;
