import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Lumina</h3>
            <p className="text-gray-600 text-sm">Your AI-powered shopping destination</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-gray-600 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-600 hover:text-primary transition-colors">Categories</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/profile" className="text-gray-600 hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-primary transition-colors">Orders</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-600 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 Lumina AI Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;