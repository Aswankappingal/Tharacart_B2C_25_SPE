import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './BreadCrumb.scss';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Breadcrumb = ({ basePath, replacements = {}, fetchProductName }) => {
  const location = useLocation();
  const { productId } = useParams(); // Extract productId from URL params
  const [productName, setProductName] = useState('');

  // Fetch product name if the fetchProductName function is provided
  useEffect(() => {
    if (productId && fetchProductName) {
      fetchProductName(productId).then(setProductName);
    }
  }, [productId, fetchProductName]);

  const currentPathSegments = location.pathname
    .split('/')
    .filter((segment) => segment);

  const breadcrumbPath = [
    ...basePath,
    ...currentPathSegments
      .map((segment, index) => {

        if (segment === 'discout-for-you'){
          return {
            label: 'Discount for you',
            link: `/${currentPathSegments.slice(0, index + 1).join('/')}`,
          };
        }
        // if (segment === productId && productName) {
        //   // Replace productId with the fetched product name
        //   return {
        //     label: productName,
        //     link: `/${currentPathSegments.slice(0, index + 1).join('/')}`,
        //   };
        
        // }
        

        if (replacements[segment]) {
          return {
            label: replacements[segment],
            link: `/${currentPathSegments.slice(0, index + 1).join('/')}`,
          };
        }

        if (/^(CAT\d+|[A-Za-z0-9]{10,})$/.test(segment)) {
          return null;
        }

        return {
          label: segment.replace(/-/g, ' '),
          link: `/${currentPathSegments.slice(0, index + 1).join('/')}`,
        };
      })
      .filter(Boolean),
  ];

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        {breadcrumbPath.map((item, index) => (
          <li
            key={index}
            className={`breadcrumb-item ${index === breadcrumbPath.length - 1 ? 'active' : ''}`}
            aria-current={index === breadcrumbPath.length - 1 ? 'page' : undefined}
          >
            {index === breadcrumbPath.length - 1 ? (
              item.label
            ) : (
              <Link href={item.link} className="text-decoration-none">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  basePath: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
  replacements: PropTypes.object,
  fetchProductName: PropTypes.func, // Function to fetch product name based on productId
};

export default Breadcrumb;