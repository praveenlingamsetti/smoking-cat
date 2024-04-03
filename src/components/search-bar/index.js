import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import "./index.css";
function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const debouncedSearch = React.useMemo(() => {
    let timerId;
    return async (query) => {
      clearTimeout(timerId);
      timerId = setTimeout(async () => {
        if (query === "" || query.length < 3) return;

        try {
          const formattedQuery = query
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          const response = await axios.get(`/search?product_name=${formattedQuery}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error(error);
        }
      }, 1000);
    };
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const highlightMatchedText = (text, query) => {
    if (!text) return text;
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ color: "red" }}>{text.substring(index, index + query.length)}</span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div className="main-container">
      <br />
      <div className="search-container">
        <input className="search-products" type="text" placeholder="Search..." value={searchTerm} onChange={handleInputChange} />
        <FontAwesomeIcon icon={faSearch} className="fa-icon" />
      </div>
      {searchResults.length > 0 && (
        <ul className="result-container" style={{ listStyleType: "none" }}>
          {searchResults.map((product, index) => (
            <li key={index}>
              <div>{highlightMatchedText(product.name, searchTerm)}</div>
              <div>
                <p className="reference-text">Reference: {highlightMatchedText(product.internal_reference, searchTerm)}</p>
              </div>
              <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
