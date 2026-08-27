import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft, FaCircleChevronRight, FaFire, FaStore, FaUtensils, FaStar, FaLocationDot } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();
  const { currentCity, shopsInMyCity, itemsInMyCity, searchItems } = useSelector(state => state.user)
  const cateScrollRef = useRef(null);
  const shopScrollRef = useRef(null);
  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);
  const [updatedItemsList, setUpdatedItemsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const scrollHandler = (ref, direction) => {
    const scrollAmount = 400;
    if (direction === "left") {
      ref.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleFilterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity)
    } else {
      const filteredList = itemsInMyCity?.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  } 

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  }, [itemsInMyCity])

  const updateButtonVisibility = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0);
      setRightButton(element.scrollWidth > element.clientWidth + element.scrollLeft);
    }
  }

  useEffect(() => {
    if (shopScrollRef.current) {
      const handleScroll = () => {
        updateButtonVisibility(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      }
      const scrollElement = shopScrollRef.current;
      scrollElement.addEventListener('scroll', handleScroll)
      updateButtonVisibility(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)

      return () => {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [shopsInMyCity])

  useEffect(() => {
    const scrollContainer = cateScrollRef.current;
    if (!scrollContainer || !categories || categories.length === 0) return;

    console.log('🎬 Starting auto-scroll animation');
    console.log('Categories count:', categories.length);
    console.log('Scroll width:', scrollContainer.scrollWidth);

    let animationFrame;
    let isScrolling = true;
    let scrollSpeed = 0.5; 

    const autoScroll = () => {
      if (!isScrolling || !scrollContainer) return;
      
      scrollContainer.scrollLeft += scrollSpeed;
      
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollContainer.scrollLeft >= maxScroll - 1) {
        scrollContainer.scrollLeft = 1;
        console.log('🔄 Loop reset');
      }
      
      animationFrame = requestAnimationFrame(autoScroll);
    };

    const stopAutoScroll = () => {
      isScrolling = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      console.log('⏸️ Auto-scroll paused');
    };

    const startAutoScroll = () => {
      isScrolling = true;
      autoScroll();
      console.log('▶️ Auto-scroll started');
    };

    const startDelay = setTimeout(() => {
      console.log('ScrollWidth after delay:', scrollContainer.scrollWidth);
      startAutoScroll();
    }, 500);

    scrollContainer.addEventListener('mouseenter', stopAutoScroll);
    scrollContainer.addEventListener('mouseleave', startAutoScroll);

    return () => {
      clearTimeout(startDelay);
      stopAutoScroll();
      scrollContainer.removeEventListener('mouseenter', stopAutoScroll);
      scrollContainer.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [categories])

  return (
    <div className='w-screen min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex flex-col items-center overflow-y-auto relative'>
      <div className='absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none'></div>
      <div className='absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-300/20 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none' style={{animationDelay: '1.5s'}}></div>
      
      <Nav />

      <div className='w-full max-w-7xl px-5 pt-8 pb-6 animate-fadeIn'>
        <div className='relative bg-gradient-to-r from-[#ff4d2d] via-[#ff6b4d] to-[#ff8c6d] rounded-[2rem] p-8 md:p-12 shadow-2xl overflow-hidden group'>
          <div className='absolute inset-0 opacity-10'>
            <div className='absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000'></div>
            <div className='absolute top-1/2 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000'></div>
            <div className='absolute bottom-0 left-1/3 w-36 h-36 bg-white rounded-full translate-y-1/2 group-hover:scale-150 transition-transform duration-1000'></div>
          </div>
          
          <div className='relative z-10'>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
              <div className='flex-1'>
                <div className='flex items-center gap-4 mb-4'>
                  <div className='bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg'>
                    <FaUtensils className='text-white text-4xl' />
                  </div>
                  <div>
                    <h1 className='text-white text-3xl sm:text-5xl font-bold leading-tight'>
                      Delicious Delights
                    </h1>
                    <div className='flex items-center gap-2 mt-2'>
                      <FaLocationDot className='text-white/80 text-lg' />
                      <p className='text-white/90 text-lg md:text-xl font-medium'>
                        {currentCity}
                      </p>
                    </div>
                  </div>
                </div>
                <p className='text-white/90 text-base md:text-lg max-w-xl'>
                  🌟 Order from the best restaurants and get fresh food delivered to your doorstep in minutes!
                </p>
              </div>
              
              <div className='grid grid-cols-3 gap-3 md:gap-4'>
                <div className='bg-white/25 backdrop-blur-lg rounded-2xl p-4 text-center transform hover:scale-105 hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-xl'>
                  <FaStore className='text-white text-2xl mx-auto mb-2' />
                  <p className='text-white text-2xl font-bold'>{shopsInMyCity?.length || 0}+</p>
                  <p className='text-white/80 text-xs font-medium'>Restaurants</p>
                </div>
                <div className='bg-white/25 backdrop-blur-lg rounded-2xl p-4 text-center transform hover:scale-105 hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-xl'>
                  <FaFire className='text-white text-2xl mx-auto mb-2' />
                  <p className='text-white text-2xl font-bold'>{itemsInMyCity?.length || 0}+</p>
                  <p className='text-white/80 text-xs font-medium'>Dishes</p>
                </div>
                <div className='bg-white/25 backdrop-blur-lg rounded-2xl p-4 text-center transform hover:scale-105 hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-xl'>
                  <FaStar className='text-white text-2xl mx-auto mb-2' />
                  <p className='text-white text-2xl font-bold'>4.5★</p>
                  <p className='text-white/80 text-xs font-medium'>Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {searchItems && searchItems?.length>0 && (
        <div className='w-full max-w-6xl flex flex-col gap-6 items-start p-5 bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl mt-6 mx-5 border border-orange-100'> 
          <div className='flex items-center gap-3'>
            <div className='w-1 h-8 bg-gradient-to-b from-[#ff4d2d] to-[#ff8c6d] rounded-full'></div>
            <h1 className='text-gray-900 text-2xl sm:text-3xl font-bold'>🔍 Search Results</h1>
          </div>
          <div className='w-full h-auto flex flex-wrap gap-6 justify-center pb-4'>
            {searchItems.map((item,index)=>(
              <div key={index} className='animate-fadeIn'>
                <FoodCard data={item} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='w-full max-w-7xl flex flex-col gap-6 items-start p-5 mt-6 animate-slideInLeft'>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff8c6d] p-4 rounded-2xl shadow-lg'>
              <FaUtensils className='text-white text-2xl' />
            </div>
            <div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                Browse by Category
              </h2>
              <p className='text-gray-500 text-sm mt-1'>Find your favorite cuisine</p>
            </div>
          </div>
        </div>
        
        <div className='w-full relative bg-gradient-to-br from-white/90 via-orange-50/40 to-pink-50/30 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl border border-orange-100 overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2'></div>
          <div className='absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-200/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/2'></div>
          
          <div
            className='w-full flex overflow-x-scroll gap-6 pb-4 scrollbar-hide relative z-10'
            ref={cateScrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {categories?.map((cate, index) => (
              <div 
                key={`first-${index}`} 
                className={`transform hover:-translate-y-3 hover:scale-105 transition-all duration-300 ${
                  activeCategory === cate.category ? 'scale-105 -translate-y-2' : ''
                }`}
              >
                <CategoryCard 
                  name={cate.category} 
                  image={cate.image} 
                  onClick={() => handleFilterByCategory(cate.category)}
                />
              </div>
            ))}
            {categories?.map((cate, index) => (
              <div 
                key={`second-${index}`} 
                className='transform hover:-translate-y-3 hover:scale-105 transition-all duration-300'
              >
                <CategoryCard 
                  name={cate.category} 
                  image={cate.image} 
                  onClick={() => handleFilterByCategory(cate.category)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-6 items-start p-5 mt-6 animate-slideInRight' style={{animationDelay: '0.2s'}}>
        <div className='flex items-center gap-4'>
          <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff8c6d] p-4 rounded-2xl shadow-lg'>
            <FaStore className='text-white text-2xl' />
          </div>
          <div>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
              Top Restaurants in {currentCity}
            </h2>
            <p className='text-gray-500 text-sm mt-1'>Highly rated & popular choices</p>
          </div>
        </div>

        {/* {shops} */}
        <div className='w-full relative bg-gradient-to-br from-white/90 via-pink-50/30 to-purple-50/20 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl border border-pink-100 overflow-hidden'>
          {/* Decorative corner */}
          <div className='absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2'></div>
          {/* LEFT BUTTON */}
          {showLeftShopButton && (
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white p-3 rounded-full shadow-2xl hover:shadow-[#ff4d2d]/50 hover:scale-110 z-10 transition-all duration-300'
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaCircleChevronLeft size={28} />
            </button>
          )}

          <div
            className='w-full flex overflow-x-auto gap-5 pb-3 scroll-smooth scrollbar-hide'
            ref={shopScrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {shopsInMyCity?.map((shop, index) => (
              <div key={index} className='transform hover:-translate-y-2 transition-all duration-300'>
                <CategoryCard name={shop.name} image={shop.image} 
                onClick={()=>navigate(`/shop/${shop._id}`)}/>
              </div>
            ))}
          </div>

          {showRightShopButton && (
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#ff4d2d] to-[#ff6b4d] text-white p-3 rounded-full shadow-2xl hover:shadow-[#ff4d2d]/50 hover:scale-110 z-10 transition-all duration-300'
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaCircleChevronRight size={28} />
            </button>
          )}
        </div>
      </div>

      <div className='w-full max-w-7xl flex flex-col gap-6 items-start p-5 mt-6 mb-12 animate-fadeIn' style={{animationDelay: '0.3s'}}>
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center gap-4'>
            <div className='bg-gradient-to-br from-[#ff4d2d] to-[#ff8c6d] p-4 rounded-2xl shadow-lg animate-pulse'>
              <FaFire className='text-white text-2xl' />
            </div>
            <div>
              <h2 className='text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent'>
                {activeCategory === "All" ? "Trending Food Items" : `${activeCategory} Items`}
              </h2>
              <p className='text-gray-500 text-sm mt-1'>Handpicked just for you</p>
            </div>
          </div>
          {updatedItemsList?.length > 0 && (
            <div className='hidden md:flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-5 py-2.5 rounded-full border border-green-200 shadow-md'>
              <FaUtensils className='text-green-600 text-sm' />
              <span className='text-green-700 font-semibold text-sm'>{updatedItemsList.length} Delicious Options</span>
            </div>
          )}
        </div>
        
        <div className='w-full min-h-[200px] relative'>
          <div className='absolute inset-0 bg-gradient-to-b from-orange-50/50 via-transparent to-pink-50/50 rounded-3xl -z-10 pointer-events-none'></div>
          
          {updatedItemsList?.length > 0 ? (
            <div className='w-full h-auto flex flex-wrap gap-6 justify-center pb-6'>
              {updatedItemsList.map((item, index) => (
                <div 
                  key={index} 
                  className='animate-fadeIn transform hover:scale-[1.02] transition-transform duration-300' 
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <FoodCard data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300'>
              <FaUtensils className='text-gray-300 text-6xl mb-4' />
              <p className='text-gray-400 text-xl font-medium'>No items found in this category</p>
              <p className='text-gray-300 text-sm mt-2'>Try selecting a different category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard
