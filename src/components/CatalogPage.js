import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CatalogPage.css';

const CatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from environment variables
  useEffect(() => {
    const key = process.env.REACT_APP_SERP_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.error("SERP API key not found in environment variables");
      setError("API key configuration issue. Please contact the administrator.");
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if API key is available
    if (!apiKey) {
      setError("Search functionality is currently unavailable. Missing API key.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResults([]);
    setHasSearched(true);

    try {
      // Using SerpAPI through a proxy to avoid CORS issues
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: `${searchQuery} farm products`,
          api_key: apiKey,
          engine: 'google',
          google_domain: 'google.com',
          gl: 'us',
          hl: 'en',
          num: 10
        }
      });

      console.log('SERP API Response:', response.data);

      if (response.data && response.data.organic_results) {
        // Process the search results
        const searchResults = response.data.organic_results.map(item => ({
          title: item.title,
          snippet: item.snippet,
          link: item.link,
          image: item.thumbnail ? item.thumbnail : null
        }));
        
        setResults(searchResults);
      } else if (response.data && response.data.error) {
        // Handle API error
        setError(`Search error: ${response.data.error}`);
      } else {
        // No results found
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      
      // Handle different error scenarios
      if (error.response) {
       
        const status = error.response.status;
        if (status === 401) {
          setError("Invalid API key. Please check your configuration.");
        } else if (status === 429) {
          setError("Search limit exceeded. Please try again later.");
        } else {
          setError(`Search failed (${status}). Please try again later.`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from search service. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Failed to process search. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Create a fallback if the API doesn't return results or there's an error
  const renderFallbackResults = () => {
    // Only show fallback if we have an error and no results
    if (!error || results.length > 0) return null;
    
    return (
      <div className="fallback-results">
        <h4>You might be interested in:</h4>
        <ul className="search-results">
          <li className="result-item">
            <a href="https://example.com/tractors" className="result-title">Farm Tractors and Equipment</a>
            <p className="result-snippet">Browse our selection of tractors and farm equipment. Find the right machinery for your farming needs.</p>
            <a href="https://example.com/tractors" className="result-link">https://example.com/tractors</a>
          </li>
          <li className="result-item">
            <a href="https://example.com/seeds" className="result-title">Organic Seeds for Sustainable Farming</a>
            <p className="result-snippet">High-quality organic seeds for various crops. Perfect for sustainable and organic farming practices.</p>
            <a href="https://example.com/seeds" className="result-link">https://example.com/seeds</a>
          </li>
        </ul>
      </div>
    );
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

          {!isLoading && results.length === 0 && !error && (
            <div className="no-results">
              <p>No results found for "{searchQuery}"</p>
              <p>Try using different keywords or check your spelling</p>
            </div>
          )}
          
          {renderFallbackResults()}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
