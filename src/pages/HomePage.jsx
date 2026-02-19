import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const HomePage = () => {
  const heroRef = useRef(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productAPI.getProducts({ featured: true, limit: 4 });
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="py-20 md:py-32 bg-gradient-to-b from-background-subtle to-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="hero-text inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Shopping
            </div>
            
            <h1 className="hero-text text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-gray-900 mb-6">
              Shop Smarter with{' '}
              <span className="text-gradient">AI Intelligence</span>
            </h1>
            
            <p className="hero-text text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of e-commerce with personalized recommendations,
              smart search, and instant AI assistance.
            </p>
            
            <div className="hero-text flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors inline-flex items-center justify-center gap-2 group"
                data-testid="shop-now-button"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="w-full sm:w-auto px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                data-testid="browse-categories-button"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: 'AI Shopping Assistant', description: 'Get personalized product recommendations instantly' },
              { icon: Zap, title: 'Smart Search', description: 'Find products using natural language queries' },
              { icon: Shield, title: 'Secure Checkout', description: 'Safe and encrypted payment processing' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
                data-testid="feature-card"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background-subtle" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our handpicked selection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              data-testid="view-all-products"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;