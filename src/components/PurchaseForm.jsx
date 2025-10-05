import React from 'react';
import { useCart } from '../state/CartProvider';
import { BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function PurchaseForm() {
  const { cartItems } = useCart();
  const [buyerEmail, setBuyerEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const products = cartItems.map((item) => item._id);

    const order = {
      buyerEmail,
      products,
      status: "PENDING",
    };
    
    // POST cart to orders API
    fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Order created:', data);
        alert('Order placed successfully!');
        setBuyerEmail('');
        setIsSubmitting(false);
        // Navigate to orders page
        navigate('/orders');
      })
      .catch((error) => {
        console.error('Error creating order:', error);
        alert('Error placing order. Please try again.');
        setIsSubmitting(false);
      });
  };

  return (
    <form className="pt4 pb4 pl2 black-80 w-50" onSubmit={handleSubmit}>
      <fieldset className="cf bn ma0 pa0">
        <div className="cf mb2">
          <input 
            className="f6 f5-l input-reset fl black-80 ba b--black-20 bg-white pa3 lh-solid w-100 w-70-l br2-ns br--left-ns" 
            placeholder='Email Address' 
            value={buyerEmail} 
            onChange={(e) => setBuyerEmail(e.target.value)} 
            type="email"
            required
            disabled={isSubmitting}
          />
          <input 
            className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-30-l br2-ns br--right-ns" 
            type="submit" 
            value={isSubmitting ? "Processing..." : "Purchase"}
            disabled={isSubmitting}
          />
        </div>
        <small id="name-desc" className="f6 black-60 db mb2">
          Enter your email address to complete purchase
        </small>
      </fieldset>
    </form>
  );
}