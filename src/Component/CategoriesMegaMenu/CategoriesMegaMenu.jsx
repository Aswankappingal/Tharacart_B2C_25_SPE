import { useEffect, useState } from 'react';
import useCategories from '../../redux/hooks/HomePageHooks/useCategories';
import './CategoriesMegaMenu.scss';
import { Link } from 'react-router-dom';
import BottomBar from '../BottomBar/BottomBar';

const CategoriesMegaMenu = () => {
  const [mainCategory, setMainCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const { categories, status: categoriesStatus, error: categoriesError } = useCategories();

  useEffect(() => {
    const filteredCategories = categories.filter((data) => data.id === data.parentCategory);
    setMainCategory(filteredCategories);
  }, [categories]);



  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
  };

  const handleSubCategoryClick = (subcategoryId) => {
    setSelectedSubCategory(subcategoryId);
  };

  const filteredSubCategories = categories.filter(
    (sub) => sub.parentCategory === selectedCategory && sub.id !== selectedCategory
  );

  const filteredSubSubCategories = categories.filter(
    (subsub) => subsub.parentCategory === selectedSubCategory && subsub.id !== selectedSubCategory
  );

  if (categoriesStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (categoriesStatus === 'failed') {
    return <div>Error: {`Error Fetching Category Data${categoriesError}`}</div>;
  }

  return (
    <div className='MegaMenuMainWrapper'>
      <div className="overLay">
        <div className="mega-menu">
          <table>
            <tbody>
              <tr>
                {/* Main Categories Column */}
                <td>
                  <div className="column-wrapper main-categories-list">


                    {mainCategory.map((data, index) => (
                      data?.products?.length > 0 && (
                        <div
                          className={`items-wrapp ${selectedCategory === data.id ? 'activeCategory' : ''}`}
                          key={index}
                          onClick={() => handleCategoryClick(data.id)}
                        >
                          <span className='items'>{data.name}</span>
                        </div>

                      )

                    ))}


                  </div>
                </td>

                {/* Subcategories Column */}
                {selectedCategory && (
                  <td>
                    <div className="column-wrapper main-categories-list">
                      {filteredSubCategories.length > 0 ? (
                        filteredSubCategories.map((sub, index) => (
                          <Link key={index} to={`/categories-page/${sub.id}/${sub.name}`}>
                            <div
                              className={`items-wrapp ${selectedSubCategory === sub.id ? 'activeCategory' : ''}`}

                              onClick={() => handleSubCategoryClick(sub.id)}
                            >
                              <span className='items'>{sub.name}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="items-wrapp no-category">
                          <span className='items'>No Category</span>

                        </div>
                      )}
                    </div>
                  </td>
                )}

                {/* Sub-Subcategories Column */}
                {selectedSubCategory && (
                  <td>
                    <div className="column-wrapper main-categories-list">
                      {filteredSubSubCategories.length > 0 ? (
                        filteredSubSubCategories.map((subsub, index) => (
                          <Link key={index} to={`/categories-page/${subsub.id}${subsub.name}`}>
                            <div className='items-wrapp' key={index}>

                              <span className="items">{subsub.name}</span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="items-wrapp no-category">
                          <span className='items'>No Category</span>
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
        <BottomBar />
      </div>
    </div>
  );
};

export default CategoriesMegaMenu;
