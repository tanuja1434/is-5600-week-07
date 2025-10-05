import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import Search from './Search';
import { BASE_URL } from '../config';
// Import local data as fallback
import localProductData from '../data/full-products.json';

function CardList() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState(''); // Track where data came from
  
  const limit = 10;
  const [offset, setOffset] = useState(0);

  // Fetch products from Node API, fallback to local data
  useEffect(() => {
    console.log('Attempting to fetch from:', `${BASE_URL}/products`);
    
    fetch(`${BASE_URL}/products`)
      .then((res) => {
        console.log('API Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Products loaded from API:', data.length);
        setAllProducts(data);
        setProducts(data.slice(0, limit));
        setDataSource('API');
        setLoading(false);
      })
      .catch((error) => {
        console.warn('⚠️ API failed, using local data:', error.message);
        console.log('📁 Loading from local JSON file...');
        // Use local data as fallback
        setAllProducts(localProductData);
        setProducts(localProductData.slice(0, limit));
        setDataSource('Local JSON');
        setLoading(false);
      });
  }, []);

  // Update products shown when offset changes
  useEffect(() => {
    setProducts(allProducts.slice(offset, offset + limit));
  }, [offset, limit, allProducts]);

  const filterTags = (tagQuery) => {
    const filtered = allProducts.filter(product => {
      if (!tagQuery) {
        return product;
      }
      return product.tags && product.tags.find(({title}) => title === tagQuery);
    });
    setOffset(0);
    setProducts(filtered.slice(0, limit));
  };

  const handlePrevious = () => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
    }
  };

  const handleNext = () => {
    if (offset + limit < allProducts.length) {
      setOffset(offset + limit);
    }
  };

  if (loading) {
    return <div className="pa4 tc f3">Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="pa4 tc">
        <p className="f3">No products found</p>
        <p className="gray">Total available: {allProducts.length}</p>
      </div>
    );
  }

  return (
    <div className="cf pa2">
      {dataSource === 'Local JSON' && (
        <div className="pa3 mb3 bg-washed-yellow ba b--gold br2">
          <p className="ma0 f6">
            ℹ️ <strong>Note:</strong> Using local data from full-products.json 
            (Backend API not available)
          </p>
        </div>
      )}
      
      <Search handleSearch={filterTags}/>
      
      <div className="mt2 mb2">
        {products.map((product) => (
          <Card key={product._id || product.id} {...product} />
        ))}
      </div>
      
      <div className="flex items-center justify-center pa4">
        <Button text="Previous" handleClick={handlePrevious} />
        <Button text="Next" handleClick={handleNext} />
      </div>
    </div>
  );
}

export default CardList;