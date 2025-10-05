import React, { useEffect } from 'react';
import { useCart } from '../state/CartProvider';
import PurchaseForm from './PurchaseForm';

export default function Cart() {
  const { cartItems, removeFromCart, updateItemQuantity, getCartTotal } = useCart();

  // Calculate total using getCartTotal from context
  const total = getCartTotal();

  // Debug logging
  useEffect(() => {
    console.log('=== CART DEBUG ===');
    console.log('Cart Items:', cartItems);
    console.log('Number of items:', cartItems.length);

    cartItems.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item._id || item.id,
        price: item.price,
        quantity: item.quantity,
        lineTotal: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0)
      });
    });

    console.log('Cart Total:', total);
    console.log('getCartTotal function exists:', typeof getCartTotal === 'function');
  }, [cartItems, total]);

  return (
    <div className="center mw7 mv4">
      <div className="bg-white pa3 mb3">
        <h2 className="f2 mb2">Shopping Cart</h2>

        {/* Debug Info - Remove in production */}
        <div className="pa2 mb3 ba b--blue bg-light-blue">
          <p className="f6 ma0">
            <strong>Debug:</strong> {cartItems.length} items | 
            Total: ${total.toFixed(2)} | 
            getCartTotal: {typeof getCartTotal}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="pa4 tc">
            <p className="gray f3">Your cart is empty</p>
            <a href="/" className="link blue underline f5">Continue Shopping</a>
          </div>
        ) : (
          <>
            <table className="w-100 mb3 collapse">
              <thead>
                <tr className="bg-light-gray">
                  <th className="tl pv2 ph2">Product</th>
                  <th className="tl pv2 ph2">Price</th>
                  <th className="tl pv2 ph2">Quantity</th>
                  <th className="tl pv2 ph2">Total</th>
                  <th className="tl pv2 ph2">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => {
                  const itemPrice = parseFloat(item.price) || 0;
                  const itemQuantity = parseInt(item.quantity) || 0;
                  const itemTotal = itemPrice * itemQuantity;

                  return (
                    <tr key={item._id || item.id} className="bb b--light-gray">
                      <td className="tl pv2 ph2">
                        <div className="flex items-center">
                          <img 
                            src={item.urls?.thumb || item.urls?.small || 'https://via.placeholder.com/50'} 
                            alt={item.description} 
                            className="w3 h3 mr2 ba b--light-gray"
                          />
                          <div>
                            <p className="ma0 f6 b">{item.description ?? item.alt_description}</p>
                            <p className="ma0 f7 gray">ID: {item._id || item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tl pv2 ph2">
                        <span className="f5">${itemPrice.toFixed(2)}</span>
                      </td>
                      <td className="tl pv2 ph2">
                        <div className="flex items-center">
                          <button
                            onClick={() => updateItemQuantity(item._id, itemQuantity - 1)}
                            className="f6 dim br2 ph2 pv1 mr1 bn pointer bg-light-gray"
                          >
                            -
                          </button>
                          <span className="f5">{itemQuantity}</span>
                          <button
                            onClick={() => updateItemQuantity(item._id, itemQuantity + 1)}
                            className="f6 dim br2 ph2 pv1 ml1 bn pointer bg-light-gray"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="tl pv2 ph2">
                        <span className="f5 b">${itemTotal.toFixed(2)}</span>
                      </td>
                      <td className="tl pv2 ph2">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="f6 link dim br2 ph3 pv2 dib white bg-red bn pointer"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="tr pa3 bg-light-gray">
              <span className="f3 b">Cart Total: ${total.toFixed(2)}</span>
            </div>

            <PurchaseForm />
          </>
        )}
      </div>
    </div>
  );
}
