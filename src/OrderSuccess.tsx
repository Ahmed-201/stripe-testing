
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function OrderSuccess() {

    useEffect(() => {
    localStorage.removeItem("cart");
    // dispatch(clearCart()); // Agar Redux use kar rahe hain
}, []);



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-8">
          Hooray! your order has been placed successfully. We are processing your payment and will update you once it's confirmed. Thank you for shopping with us!
        </p>

        {/* Order Info (Optional) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left border border-gray-100">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Order Status:</span>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 rounded">Confirmed</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Delivery:</span>
            <span className="text-sm font-medium text-gray-800">3-5 Working Days</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Link 
            to="/" 
            className="block w-full py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition duration-200"
          >
            Continue Shopping
          </Link>
          
          <Link 
            to="/" 
            className="block w-full py-3 px-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition duration-200"
          >
            View My Orders
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
          Thank you for choosing Coza Store
        </p>
      </div>
    </div>
  );
}

export default OrderSuccess;