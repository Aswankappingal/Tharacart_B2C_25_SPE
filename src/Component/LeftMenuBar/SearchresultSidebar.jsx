import React, { useCallback, useEffect, useState } from 'react';
import './SearchresultSidebar.scss';

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdOutlineStarPurple500, MdOutlineStarOutline } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { TbArrowBarToRight } from "react-icons/tb";
import { GoChevronRight } from "react-icons/go";

import useCategories from '../../redux/hooks/HomePageHooks/useCategories';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa6';
import useGetBrand from '../../redux/hooks/topDealsHooks/useGetBrand'; // Add this import

const SearchresultSidebar = ({ onRatingChange, onPriceChange, onBrandChange, selectedBrandId, selectedAvailability }) => {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(100);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { categories, status, error } = useCategories();
  const { brands, status: brandStatus, error: brandError } = useGetBrand(); // Get brands data
  const [openCategory, setOpenCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selected, setSelected] = useState("");
  const [availability, setAvailability] = useState(selectedAvailability || "");



  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const mainCategories = categories?.filter(cat => cat.parentCategory === cat.id);

  // Toggle sidebar visibility and enable/disable scrolling
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Disable scrolling when the sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  const handleToggle = (categoryId) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId);
  };

  const handleDrag = useCallback((event, setValue) => {
    const progressBar = document.querySelector('.bar');
    const rect = progressBar.getBoundingClientRect();
    const newValue = ((event.clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(Math.max(newValue, 0), 100));
  }, []);

  // Effect to notify parent component when price range changes
  useEffect(() => {
    if (onPriceChange) {
      const minPrice = Math.round(from * 100); // Convert percentage to actual price
      const maxPrice = Math.round(to * 100);
      onPriceChange({ min: minPrice, max: maxPrice });
    }
  }, [from, to, onPriceChange]);

  const handleToggleCollapse = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle rating checkbox change
  const handleRatingChange = (rating) => {
    const updatedRatings = [...selectedRatings];

    if (updatedRatings.includes(rating)) {
      // If rating is already selected, remove it
      const index = updatedRatings.indexOf(rating);
      updatedRatings.splice(index, 1);
    } else {
      // Add rating to selected ratings
      updatedRatings.push(rating);
    }

    setSelectedRatings(updatedRatings);

    // Pass selected ratings to parent component
    if (onRatingChange) {
      onRatingChange(updatedRatings);
    }
  };

  // Handle brand selection
  const handleBrandChange = (brandId) => {
    if (onBrandChange) {
      onBrandChange(brandId);
    }
  };
  // handle availability
  const handleAvailabilityChange = (value) => {
    setAvailability(value);
    if (onAvailabilityChange) {
      onAvailabilityChange(value);
    }
  };

  const getSubcategories = (parentId) => {
    return categories?.filter(cat => cat.parentCategory === parentId && cat.id !== cat.parentCategory) || [];
  };

  return (
    <div className={`Filter-wrapper ${isSidebarOpen ? 'open' : ''}`}>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <IoIosClose /> : <GoChevronRight className='sidebar-icon' />
        }
      </button>

      <div className={`filter-body ${isSidebarOpen ? 'show' : ''}`}>
        <div className="filter-main-heading">
          <h1>Filters</h1>
          <button className="close-btn" onClick={toggleSidebar}><IoIosClose /></button>
        </div>
        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain14" aria-expanded="false" aria-controls="collapseExampleMain14">
            <div className="collapse-title">
              <h1>Categories</h1>
            </div>
            <div className="collapse-arrow">
              <IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain14">
            {/* Categories content */}
            <div className="mainCatogoryCollapse card-body">
              <div className="collapse-body-content">
                {mainCategories?.map((mainCategory) => (
                  mainCategory.products && mainCategory.products.length > 0 && (
                    <div key={mainCategory.id}>
                      <div
                        className='collapse-title-body'
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseCategory${mainCategory.id}`}
                        aria-expanded="false"
                        aria-controls={`collapseCategory${mainCategory.id}`}
                        onClick={() => handleToggleCollapse(mainCategory.id)}
                      >
                        <div className="collapse-title">
                          {mainCategory.name}
                        </div>
                        <div className="collapse-arrow">
                          <IoIosArrowUp className={expandedCategories[mainCategory.id] ? 'up-arrow' : 'down-arrow'} />
                        </div>
                      </div>

                      <div className="collapse" id={`collapseCategory${mainCategory.id}`}>
                        <div className="card card-body">
                          <div className="collapse-body-content">
                            {getSubcategories(mainCategory.id).length > 0 ? (
                              getSubcategories(mainCategory.id).map(subCategory => (
                                <div key={subCategory.id} className="subcategory">
                                  <Link to={`/categories-page/${subCategory.id}/${subCategory.name}`}>{subCategory.name}</Link>
                                </div>
                              ))
                            ) : (
                              <div style={{ fontWeight: "300", color: "red" }}>No categories</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain" aria-expanded="false" aria-controls="collapseExampleMain">
            <div className="collapse-title">
              <h1>Ratings</h1>
            </div>
            <div className="collapse-arrow">
              <IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain">
            <div className="card card-body">
              <div className="collapse-body-content">
                <div
                  className="rating-container"
                  onClick={() => handleRatingChange(5)}
                >
                  <div className="rating-check-box">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(5)}
                      onChange={() => { }} // Empty onChange to avoid React warning about controlled component
                    />
                  </div>
                  <div className="rating-number">
                    <span>5</span>
                  </div>
                  <div className="rating-icons">
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                  </div>
                </div>

                <div
                  className="rating-container"
                  onClick={() => handleRatingChange(4)}
                >
                  <div className="rating-check-box">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(4)}
                      onChange={() => { }}
                    />
                  </div>
                  <div className="rating-number">
                    <span>4</span>
                  </div>
                  <div className="rating-icons">
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarOutline />
                  </div>
                </div>

                <div
                  className="rating-container"
                  onClick={() => handleRatingChange(3)}
                >
                  <div className="rating-check-box">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(3)}
                      onChange={() => { }}
                    />
                  </div>
                  <div className="rating-number">
                    <span>3</span>
                  </div>
                  <div className="rating-icons">
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                  </div>
                </div>
                <div
                  className="rating-container"
                  onClick={() => handleRatingChange(2)}
                >
                  <div className="rating-check-box">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(2)}
                      onChange={() => { }}
                    />
                  </div>
                  <div className="rating-number">
                    <span>2</span>
                  </div>
                  <div className="rating-icons">
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                  </div>
                </div>
                <div
                  className="rating-container"
                  onClick={() => handleRatingChange(1)}
                >
                  <div className="rating-check-box">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(1)}
                      onChange={() => { }}
                    />
                  </div>
                  <div className="rating-number">
                    <span>1</span>
                  </div>
                  <div className="rating-icons">
                    <MdOutlineStarPurple500 />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                    <MdOutlineStarOutline />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing slider section */}
        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain2" aria-expanded="false" aria-controls="collapseExampleMain2">
            <div className="collapse-title">
              <h1>Pricing</h1>
            </div>
            <div className="collapse-arrow">
              <IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain2">
            <div className="card card-body">
              <div className="collapse-body-content">
                <div className="progress-bar">
                  <div className="bar">
                    <div
                      className="circle from"
                      style={{ left: `${from}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const handleMouseMove = (moveEvent) => handleDrag(moveEvent, setFrom);
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                    <div
                      className="circle to"
                      style={{ left: `${to}%` }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const handleMouseMove = (moveEvent) => handleDrag(moveEvent, setTo);
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  </div>
                </div>

                <div className="progress-count">
                  <div className="progressbar-min-couny-section">
                    <div className="min-value-container">
                      <div className="min-value-left-side">
                        <span>₹</span>
                      </div>
                      <div className="min-value-right-side">
                        <span>{Math.round(from * 100)}</span>
                      </div>
                    </div>
                    <div className="min-count">
                      <span>Min.</span>
                    </div>
                  </div>

                  <div className="progressbar-min-couny-section">
                    <div className="max-value-container">
                      <div className="min-value-left-side">
                        <span>₹</span>
                      </div>
                      <div className="min-value-right-side">
                        <span>{Math.round(to * 100)}</span>
                      </div>
                    </div>
                    <div className="max-count">
                      <span>Max.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brands section with radio buttons */}
        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain4" aria-expanded="false" aria-controls="collapseExampleMain4">
            <div className="collapse-title">
              <h1>Brands</h1>
            </div>
            <div className="collapse-arrow">
              <IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain4">
            <div className="card card-body">
              <div className="collapse-body-content">
                {brandStatus === 'loading' && <p>Loading brands...</p>}
                {brandStatus === 'failed' && <p>Error loading brands: {brandError}</p>}
                {brands && brands.length > 0 ? (
                  <div className="brand-radio-group">
                    {/* Clear selection option */}
                    {/* <div className="brand-radio-item">
                      <input
                        type="radio"
                        id="brand-all"
                        name="brand-filter"
                        checked={!selectedBrandId}
                        onChange={() => handleBrandChange(null)}
                      />
                      <label htmlFor="brand-all">All Brands</label>
                    </div> */}

                    {brands.map(brand => (
                      <div key={brand.brandId} className="brand-radio-item">
                        <input
                          type="radio"
                          id={`brand-${brand.brandId}`}
                          name="brand-filter"
                          checked={selectedBrandId === brand.brandId}
                          onChange={() => handleBrandChange(brand.brandId)}
                        />
                        <label htmlFor={`brand-${brand.brandId}`}>{brand.brandName}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No brands available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Other filters remain unchanged */}
        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain5" aria-expanded="false" aria-controls="collapseExampleMain5">
            <div className="collapse-title">
              <h1>Gender</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain5">
            <div className="card card-body">
              <div className="collapse-body-content">
                <div className="brand-radio-item">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={selected === "male"}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                  <label htmlFor="male">Male</label>
                </div>

                <div className="brand-radio-item">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={selected === "female"}
                    onChange={(e) => setSelected(e.target.value)}
                  />
                  <label htmlFor="female">Female</label>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain6" aria-expanded="false" aria-controls="collapseExampleMain6">
            <div className="collapse-title">
              <h1>Size</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain6">
            <div className="card card-body">
              <div className="collapse-body-content">
                {/* hanan */}


              </div>
            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain7" aria-expanded="false" aria-controls="collapseExampleMain7">
            <div className="collapse-title">
              <h1>Availability</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain7">
            <div className="card card-body">
              <div className="collapse-body-content">
                <div className="brand-radio-item">
                  <input
                    type="radio"
                    id="in-stock"
                    name="availability"
                    value="in-stock"
                    checked={availability === "in-stock"}
                    onChange={() => handleAvailabilityChange("in-stock")}
                  />
                  <label htmlFor="in-stock">In Stock</label>
                </div>

                <div className="brand-radio-item">
                  <input
                    type="radio"
                    id="out-of-stock"
                    name="availability"
                    value="out-of-stock"
                    checked={availability === "out-of-stock"}
                    onChange={() => handleAvailabilityChange("out-of-stock")}
                  />
                  <label htmlFor="out-of-stock">Out of Stock</label>
                </div>

                {/* Clear selection option */}
                <div className="brand-radio-item">
                  <input
                    type="radio"
                    id="all-availability"
                    name="availability"
                    value=""
                    checked={availability === ""}
                    onChange={() => handleAvailabilityChange("")}
                  />
                  <label htmlFor="all-availability">All Products</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain8" aria-expanded="false" aria-controls="collapseExampleMain8">
            <div className="collapse-title">
              <h1>Type</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain8">
            <div className="card card-body">
              <div className="collapse-body-content">


              </div>
            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain9" aria-expanded="false" aria-controls="collapseExampleMain9">
            <div className="collapse-title">
              <h1>Discount</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain9">
            <div className="card card-body">
              <div className="collapse-body-content">



              </div>
            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain10" aria-expanded="false" aria-controls="collapseExampleMain10">
            <div className="collapse-title">
              <h1>Flavor</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain10">
            <div className="card card-body">
              <div className="collapse-body-content">



              </div>
            </div>
          </div>
        </div>

        <div className="filter-collapse">
          <div className='collapse-title-body' data-bs-toggle="collapse" data-bs-target="#collapseExampleMain11" aria-expanded="false" aria-controls="collapseExampleMain11">
            <div className="collapse-title">
              <h1>Special Diet Needs</h1>
            </div>
            <div className="collapse-arrow">
              < IoIosArrowUp className='down-arrow' />
            </div>
          </div>

          <div className="collapse" id="collapseExampleMain11">
            <div className="card card-body">
              <div className="collapse-body-content">



              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchresultSidebar;