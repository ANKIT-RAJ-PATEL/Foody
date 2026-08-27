import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaTruck, FaShoppingBag, FaStar, FaClock, FaHeadset } from 'react-icons/fa';
import { MdDeliveryDining, MdRestaurant, MdLocalOffer } from 'react-icons/md';
import { IoSparkles } from 'react-icons/io5';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaClock size={40} />,
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes or less"
    },
    {
      icon: <FaUtensils size={40} />,
      title: "Quality Food",
      description: "Fresh ingredients, prepared with love and care"
    },
    {
      icon: <MdLocalOffer size={40} />,
      title: "Best Offers",
      description: "Exclusive deals and discounts on every order"
    },
    {
      icon: <FaHeadset size={40} />,
      title: "24/7 Support",
      description: "Always here to help you with your orders"
    }
  ];

  const categories = [
    { name: "Pizza", emoji: "🍕", color: "from-yellow-400 to-orange-500" },
    { name: "Burgers", emoji: "🍔", color: "from-red-400 to-pink-500" },
    { name: "Desserts", emoji: "🍰", color: "from-purple-400 to-pink-500" },
    { name: "Chinese", emoji: "🥡", color: "from-green-400 to-teal-500" },
    { name: "Indian", emoji: "🍛", color: "from-orange-400 to-red-500" },
    { name: "Fast Food", emoji: "🌮", color: "from-blue-400 to-indigo-500" }
  ];

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Restaurant Partners" },
    { number: "50K+", label: "Orders Delivered" },
    { number: "30 min", label: "Avg Delivery Time" }
  ];

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-white to-gray-50'>
      
      {/* Navbar */}
      <nav className='fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-md z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] rounded-full flex items-center justify-center'>
                <FaUtensils className='text-white' size={24} />
              </div>
              <h1 className='text-4xl font-extrabold bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4d] to-[#ff8c6d] bg-clip-text text-transparent'>
                Foody
              </h1>
            </div>
            <div className='flex items-center gap-4'>
              <button 
                className='hidden sm:block px-6 py-2.5 text-[#ff4d2d] font-semibold hover:bg-[#ff4d2d]/10 rounded-xl transition-all duration-300'
                onClick={() => navigate('/signin')}
              >
                Sign In
              </button>
              <button 
                className='px-6 py-2.5 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300'
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4 relative overflow-hidden'>
        {/* Animated Background Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute w-96 h-96 bg-[#ff4d2d]/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse'></div>
          <div className='absolute w-80 h-80 bg-[#ff6b4d]/10 rounded-full top-40 right-10 blur-3xl animate-pulse' style={{ animationDelay: '1s' }}></div>
          <div className='absolute w-64 h-64 bg-[#ff8c6d]/10 rounded-full bottom-20 left-1/2 blur-2xl animate-pulse' style={{ animationDelay: '2s' }}></div>
        </div>

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='text-center lg:text-left space-y-6'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-[#ff4d2d]/10 rounded-full text-[#ff4d2d] font-semibold text-sm mb-4'>
                <IoSparkles />
                <span>Fast, Fresh & Delicious</span>
              </div>
              
              <h1 className='text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight'>
                Delicious Food
                <span className='block bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4d] to-[#ff8c6d] bg-clip-text text-transparent'>
                  Delivered Fast
                </span>
              </h1>
              
              <p className='text-xl text-gray-600 max-w-xl mx-auto lg:mx-0'>
                Order your favorite meals from the best restaurants in your city. Hot, fresh, and delivered to your doorstep in minutes.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4'>
                <button 
                  className='px-8 py-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white font-bold rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
                  onClick={() => navigate('/signup')}
                >
                  <MdDeliveryDining size={24} />
                  Order Now
                </button>
                <button 
                  className='px-8 py-4 bg-white border-2 border-[#ff4d2d] text-[#ff4d2d] font-bold rounded-xl text-lg hover:bg-[#ff4d2d]/10 transition-all duration-300 flex items-center justify-center gap-2'
                  onClick={() => navigate('/signup')}
                >
                  <MdRestaurant size={24} />
                  Become a Partner
                </button>
              </div>

              {/* Stats */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8'>
                {stats.map((stat, index) => (
                  <div key={index} className='text-center lg:text-left'>
                    <div className='text-3xl font-bold text-[#ff4d2d]'>{stat.number}</div>
                    <div className='text-sm text-gray-600 font-medium'>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className='relative hidden lg:flex justify-center items-center'>
              <div className='relative w-full max-w-lg'>
                {/* Main Circle */}
                <div className='absolute inset-0 bg-gradient-to-br from-[#ff4d2d]/20 to-[#ff8c6d]/20 rounded-full blur-3xl animate-pulse'></div>
                
                {/* Food Emoji Circles */}
                <div className='relative w-full aspect-square'>
                  <div className='absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center text-5xl animate-float'>
                    🍕
                  </div>
                  <div className='absolute top-1/4 right-0 w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center text-4xl animate-float' style={{ animationDelay: '0.5s' }}>
                    🍔
                  </div>
                  <div className='absolute bottom-1/4 right-1/4 w-28 h-28 bg-white rounded-full shadow-2xl flex items-center justify-center text-6xl animate-float' style={{ animationDelay: '1s' }}>
                    🍜
                  </div>
                  <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center text-5xl animate-float' style={{ animationDelay: '1.5s' }}>
                    🍰
                  </div>
                  <div className='absolute top-1/3 left-0 w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center text-4xl animate-float' style={{ animationDelay: '2s' }}>
                    🌮
                  </div>
                  
                  {/* Center Delivery Icon */}
                  <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] rounded-full shadow-2xl flex items-center justify-center'>
                    <FaTruck className='text-white text-5xl' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className='py-20 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>
              Explore <span className='text-[#ff4d2d]'>Delicious</span> Categories
            </h2>
            <p className='text-gray-600 text-lg'>From pizza to desserts, we've got it all!</p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6'>
            {categories.map((category, index) => (
              <div 
                key={index}
                className='group cursor-pointer'
                onClick={() => navigate('/signup')}
              >
                <div className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 text-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}>
                  <div className='text-6xl mb-3'>{category.emoji}</div>
                  <div className='text-white font-bold text-sm'>{category.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 bg-gradient-to-b from-gray-50 to-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              Why Choose <span className='text-[#ff4d2d]'>Foody</span>?
            </h2>
            <p className='text-gray-600 text-lg'>We deliver more than just food</p>
          </div>

          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div 
                key={index}
                className='bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group'
              >
                <div className='w-20 h-20 bg-gradient-to-br from-[#ff4d2d]/10 to-[#ff6b4d]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#ff4d2d] group-hover:scale-110 transition-transform duration-300'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold mb-3'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className='py-20 px-4 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold mb-4'>
              How It <span className='text-[#ff4d2d]'>Works</span>
            </h2>
            <p className='text-gray-600 text-lg'>Simple steps to satisfy your cravings</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center relative'>
              <div className='w-24 h-24 bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-xl'>
                1
              </div>
              <h3 className='text-2xl font-bold mb-3'>Choose Your Meal</h3>
              <p className='text-gray-600'>Browse through hundreds of restaurants and dishes</p>
              <div className='hidden md:block absolute top-12 -right-8 text-6xl text-gray-200'>→</div>
            </div>

            <div className='text-center relative'>
              <div className='w-24 h-24 bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-xl'>
                2
              </div>
              <h3 className='text-2xl font-bold mb-3'>Place Your Order</h3>
              <p className='text-gray-600'>Quick checkout with secure payment options</p>
              <div className='hidden md:block absolute top-12 -right-8 text-6xl text-gray-200'>→</div>
            </div>

            <div className='text-center'>
              <div className='w-24 h-24 bg-gradient-to-br from-[#ff4d2d] to-[#ff6b4d] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold shadow-xl'>
                3
              </div>
              <h3 className='text-2xl font-bold mb-3'>Enjoy Your Food</h3>
              <p className='text-gray-600'>Get it delivered hot and fresh to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/10'></div>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <h2 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
            Ready to Order Your Favorite Food?
          </h2>
          <p className='text-white/90 text-xl mb-8'>
            Join thousands of happy customers enjoying delicious meals delivered to their door
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button 
              className='px-10 py-4 bg-white text-[#ff4d2d] font-bold rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2'
              onClick={() => navigate('/signup')}
            >
              <FaShoppingBag size={24} />
              Start Ordering
            </button>
            <button 
              className='px-10 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl text-lg hover:bg-white hover:text-[#ff4d2d] transition-all duration-300'
              onClick={() => navigate('/signin')}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <div className='flex items-center gap-2 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] rounded-full flex items-center justify-center'>
                  <FaUtensils className='text-white' size={20} />
                </div>
                <h3 className='text-2xl font-bold'>Foody</h3>
              </div>
              <p className='text-gray-400'>Delivering happiness, one meal at a time.</p>
            </div>

            <div>
              <h4 className='font-bold mb-4'>Company</h4>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer'>About Us</li>
                <li className='hover:text-white cursor-pointer'>Careers</li>
                <li className='hover:text-white cursor-pointer'>Contact</li>
              </ul>
            </div>

            <div>
              <h4 className='font-bold mb-4'>For Partners</h4>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer'>Partner With Us</li>
                <li className='hover:text-white cursor-pointer'>Become a Rider</li>
                <li className='hover:text-white cursor-pointer'>Restaurant Sign Up</li>
              </ul>
            </div>

            <div>
              <h4 className='font-bold mb-4'>Legal</h4>
              <ul className='space-y-2 text-gray-400'>
                <li className='hover:text-white cursor-pointer'>Terms & Conditions</li>
                <li className='hover:text-white cursor-pointer'>Privacy Policy</li>
                <li className='hover:text-white cursor-pointer'>Refund Policy</li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-800 pt-8 text-center text-gray-400'>
            <p>&copy; 2025 Foody. All rights reserved. Made with ❤️ for food lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;