import React, { useState } from 'react';
import axios from 'axios';
import './CatalogPage.css';

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      // Using a public CORS proxy - Note: For production, implement your own backend proxy
      const corsProxy = 'https://corsproxy.io/?';
      const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery + ' farm products')}&format=json&pretty=1`;
      
      const response = await axios.get(corsProxy + encodeURIComponent(apiUrl));

      if (response.data && response.data.RelatedTopics) {
        const searchResults = response.data.RelatedTopics
          .filter(item => item.FirstURL && item.Text) // Filter out section headers
          .map(item => ({
            title: item.Text.split(' - ')[0] || item.Text,
            snippet: item.Text,
            link: item.FirstURL,
            // Extract image if available
            image: item.Icon?.URL && item.Icon.URL !== '' ? 
                  `https://duckduckgo.com${item.Icon.URL}` : null
          }));
        
        setResults(searchResults);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to get search results. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="catalog-page">
      <div className="search-container">
        <h2>Farm Products Catalog</h2>
        <p className="search-subtitle">Find agricultural products, equipment, and resources for your farming needs</p>
        
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for farm products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search for farm products"
            />
            <button className="search-button" type="submit" disabled={isLoading}>
              {isLoading ? 
                <span className="spinner"></span> : 
                <span className="search-icon">🔍</span>
              }
            </button>
          </div>
        </form>
      </div>

      {hasSearched && (
        <div className="results-container">
          {error && <div className="error-message">{error}</div>}
          
          {isLoading && <div className="loading-message">
            <div className="spinner-large"></div>
            <p>Searching for the best farm products...</p>
          </div>}

          {!isLoading && results.length > 0 && (
            <>
              <h3 className="results-heading">Search Results for "{searchQuery}"</h3>
              <ul className="search-results">
                {results.map((result, index) => (
                  <li key={index} className="result-item">
                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-title">
                      {result.title}
                    </a>
                    <p className="result-snippet">{result.snippet}</p>
                    {result.image && (
                      <div className="result-image-container">
                        <img src={result.image} alt={result.title} className="result-image" />
                      </div>
                    )}
                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="result-link">
                      {result.link}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!isLoading && results.length === 0 && (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <p>Try using different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
