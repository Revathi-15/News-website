import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HomePage.css';
import logo from '../../assets/logo16-1.png';
import srch from '../../assets/srch.png';

const NewsCard = ({ article }) => {
  const date = new Date(article.publishedAt).toLocaleString("en-GB", {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="card" onClick={() => window.open(article.url, "_blank")}>
      <div className="card-header">
        <img
          src={article.urlToImage}
          alt={article.title || "News Image"}
          id="news-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/400x230/e0e0e0/505050?text=No+Image`;
          }}
        />
      </div>
      <div className="card-content">
        <h5 id="news-title">{article.title}</h5>
        <h6 className="news-source">{`${article.source.name} ${date}`}</h6>
        <p className="news-des">{article.description}</p>
      </div>
    </div>
  );
};

const HomePage = () => {
  const Api_key = "71146ebefc69425aa26e16e6e9e066d1";
  const url = "https://newsapi.org/v2/everything?";

  const [articles, setArticles] = useState([]);
  const [currentLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [currentNav, setCurrentNav] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    fetchNews("India");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.style.background = darkMode ? 'rgb(14, 11, 11)' : 'white';
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const fetchNews = useCallback(async (query) => {
    setMessage('');
    setLoading(true);
    try {
      const fetchUrl = `${url}q=${query}&apiKey=${Api_key}&language=${currentLanguage}`;
      const res = await fetch(fetchUrl, {
        headers: { 'User-Agent': 'News-App/1.0' }
      });

      if (!res.ok) {
        if (res.status === 426) {
          setMessage('Error: Your NewsAPI key might be invalid or have exceeded its usage limits.');
        } else {
          setMessage(`Error fetching news: ${res.statusText || 'Unknown Error'}`);
        }
        throw new Error(`Network response was not ok: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        const articlesWithImages = data.articles.filter(article => article.urlToImage);
        setArticles(articlesWithImages);
        if (articlesWithImages.length === 0) {
          setMessage('No articles with images found. Try a different search term.');
        }
      } else {
        setArticles([]);
        setMessage('No articles found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      if (!message.includes("API key")) {
        setMessage(`Error fetching news: ${error.message}`);
      }
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, message]);

  const onNavItemClick = useCallback((id) => {
    fetchNews(id);
    if (searchInputRef.current) searchInputRef.current.value = '';
    setCurrentNav(id);
  }, [fetchNews]);

  const handleSearch = useCallback(() => {
    const query = searchInputRef.current?.value.trim();
    if (!query) {
      setMessage('Please enter a valid search term.');
      return;
    }
    fetchNews(query);
    setCurrentNav(null);
  }, [fetchNews]);

  const handleKeyPress = useCallback((event) => {
    if (event.key === 'Enter') handleSearch();
  }, [handleSearch]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  const toggleHamburger = () => {
    const nav = document.getElementById("nav-links");
    nav.classList.toggle("active");
  };

  return (
    <>
      <nav>
        <div className="nav_top flex">
          <a href="#" onClick={reload} className="company-logo">
            <img src={logo} alt="Logo" />
          </a>

          <div className="hamburger" id="hamburger" onClick={toggleHamburger}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="nav-links" id="nav-links">
            <ul className="flex">
              <li><a href="../Weather">Weather</a></li>
              <li><a href="../Add Note/index2.html">Add Note</a></li>
              <li
                className={`hover-link nav-item ${currentNav === 'highlights' ? 'active' : ''}`}
                id="highlights"
                onClick={() => onNavItemClick('highlights')}
              >
                Highlights
              </li>
              <li><a href="../bot/index.html">Bot</a></li>
            </ul>
          </div>

          <div className="assign">
            <div className="search-bar flex">
              <input
                id="search-text"
                type="text"
                className="news-input"
                placeholder="Enter.."
                onKeyPress={handleKeyPress}
                ref={searchInputRef}
              />
              <button className="search-button" id="search-button" onClick={handleSearch}>
                <img src={srch} alt="Search" />
              </button>
            </div>

            <div className='flex'>
              <div className="toggle-button dark-mode-button" onClick={toggleDarkMode}>
                <div className="icons">
                  <i className="fas fa-moon"></i>
                </div>
              </div>
              <div id="user-info" className="user-info" style={{ marginTop: '2px', marginLeft: '8px', fontSize: '30px' }}>
                <a href="../login and signup/logout.php" className="logout-btn">
                  <div className="icons">
                    <i className="fas fa-sign-out-alt" style={{ color: 'cadetblue' }}></i>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="cards-container" id="cards-container">
        {message && <div className="message">{message}</div>}
        {loading ? (
          <div className="loading">Loading news, please wait...</div>
        ) : articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard key={article.url || index} article={article} />
          ))
        ) : (
          !message && <div className="no-news">No news articles found. Please try a different search.</div>
        )}
      </div>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
    </>
  );
};

export default HomePage;