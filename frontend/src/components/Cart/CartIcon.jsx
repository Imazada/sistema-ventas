import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartSidebar from './CartSidebar';

const CartIcon = () => {
  const { items, isCartOpen, setIsCartOpen } = useCart();
  
  const totalItems = items.reduce((sum, item) => sum + parseInt(item.cantidad || 0), 0);
  
  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>
    </>
  );
};

export default CartIcon;