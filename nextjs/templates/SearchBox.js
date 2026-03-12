// templates/SearchBox.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { searchProducts } from '../lib/api/product';
import styles from '../styles/header.module.css';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (query.trim()) {
        const result = await searchProducts(query);
        setSuggestions(result);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-kiem?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClick = (slug) => {
    router.push(`/product-detail/${slug}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className={styles['search-wrapper']}>
      <form onSubmit={handleSubmit} className={styles['search-form']}>
        <input
          type="text"
          placeholder="Tìm món ăn..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles['search-input']}
        />
        <button type="submit" className={styles['search-button']}>🔍</button>
      </form>

      {suggestions.length > 0 && (
        <ul className={styles['suggestion-box']}>
          {suggestions.map((item) => (
            <li key={item.id} className={styles['suggestion-item']} onClick={() => handleClick(item.slug)}>
              <img src={`/img/${item.image}`} className={styles['suggestion-img']} />
              <span>{item.name}</span>
              <span className={styles['suggestion-price']}>{item.gia.toLocaleString()}₫</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
