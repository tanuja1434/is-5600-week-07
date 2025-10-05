import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../state/CartProvider';
import { BASE_URL } from '../config';
import localProductData from '../data/full-products.json';
import '../App.css';

export default function SingleView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch single product from API, fallback to local data
  useEffect(() => {
    console.log('Fetching product with ID:', id);
    
    fetch(`${BASE_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ Product loaded from API');
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.warn('⚠️ API failed, using local data:', error.message);
        // Find product in local data - check BOTH id and _id
        const localProduct = localProductData.find(p => {
          return p.id === id || p._id === id || String(p.id) === id || String(p._id) === id;
        });
        
        if (localProduct) {
          console.log('📁 Product found in local data:', localProduct.id || localProduct._id);
          setProduct(localProduct);
        } else {
          console.error('❌ Product not found. ID:', id);
          console.log('Available IDs:', localProductData.slice(0, 5).map(p => p.id || p._id));
        }
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return <div className="pa4 tc f3">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="pa4 tc">
        <h2 className="f2">Product not found</h2>
        <p className="gray">ID: {id}</p>
        <p className="f6 gray">This might be because:</p>
        <ul className="tl mw6 center gray">
          <li>The backend server is not running</li>
          <li>The product ID doesn't exist in local data</li>
          <li>The URL is incorrect</li>
        </ul>
        <a href="/" className="link blue underline">← Back to Products</a>
      </div>
    );
  }

  const { user } = product;
  const title = product.description ?? product.alt_description;
  const style = {
    backgroundImage: `url(${product.urls?.regular || product.urls?.small || ''})`
  };

  return (
    <article className="bg-white center mw7 ba b--black-10 mv4">
      <div className="pv2 ph3">
        <div className="flex items-center">
          <img 
            src={user?.profile_image?.medium || 'https://via.placeholder.com/100'} 
            className="br-100 h3 w3 dib" 
            alt={user?.instagram_username || 'User'} 
          />
          <h1 className="ml3 f4">
            {user?.first_name} {user?.last_name}
          </h1>
        </div>
      </div>
      
      <div className="aspect-ratio aspect-ratio--4x3">
        <div className="aspect-ratio--object cover" style={style}></div>
      </div>
      
      <div className="pa3 flex justify-between">
        <div className="mw6">
          <h1 className="f6 ttu tracked">Product ID: {id}</h1>
          <a href={`/product/${id}`} className="link dim lh-title">{title}</a>
        </div>
        <div className="gray db pv2">
          &hearts;<span>{product.likes}</span>
        </div>
      </div>
      
      <div className="pa3 flex justify-end items-center">
        <span className="ma2 f4">${product.price || '29.99'}</span>
        <button 
          onClick={handleAddToCart}
          className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-gray bn pointer"
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}