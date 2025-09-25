import './App.css';
import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import SignWithOTP from './Component/SignWithOTP/SignWithOTP';
import SignUpWithEmail from './Component/SignUpWithEmail/SignUpWithEmail';
import Otp from './Component/OTPsend/Otp';
import Signin from './Component/OTPverfication/Signin';
import HomePage from './Component/HomePage/HomePage';
import SearchresultSidebar from './Component/LeftMenuBar/SearchresultSidebar';
import ProductInnerPage from './Component/ProductInnerPage/ProductInnerPage';

import ShoppingCart from './Component/ShoppingCart/ShoppingCart';
import SearchResultPage from './Component/SearchResultPage/SearchResultPage';
import CheckOutPage from './Component/CheckoutPage/CheckOutPage';
import OrderCompletedPage from './Component/OrderCompletedPage/OrderCompletedPage';
import MyAccount from './Component/MyAccount/MyAccount';
import MyAccountSidebar from './Component/MyAcSlideBar/MyAccountSidebar';
import OrderInnerPageCancellation from './Component/OrderInnerPageCancellation/OrderInnerPageCancellation';
import OrderInnerPage from './Component/MyAccount/OrderInnerPage/OrderInnerPage';
import OrderInnerDelevered from './Component/MyAccount/MyAccountDeleverd/OrderInnerDelevered';
import CategoriesPage from './Component/CategoriesPage/CategoriesPage';
import TopDeals from './Component/TopDeals/TopDeals';
import LimitedTimeDeals from './Component/LimitedTimeDeals/LimitedTimeDeals';
import FeaturedBrands from './Component/FeaturedBrands/FeaturedBrands';
import TopStores from './Component/TopStores/TopStores';
import NewArrival from './Component/NewArivals/NewArrival';
import RecentlyViewed from './Component/RecentlyViewed/RecentlyViewed';
import BrandPage from './Component/BrandPage/BrandPage';
import SignInWithEmailPersonalAddress from './Component/SignUpWithPersonalDetails/SignInWithEmailPersonalAddress';
import ProtectedRoute from './Component/ProtectRoute';
import SellerStore from './Component/BrandStore/SellerStore';
import Discount from './Component/DiscountForYou/Discount';
import UseLoginedUser from './redux/hooks/NavbarHook/UseLoginedUser';
import useFetchAddress from './redux/hooks/checkoutPageHooks/useFetchAddress';
import Bannercategory from './Component/BannerCategory/Bannercategory';
import SucessAlert from './Component/SucessAlert/SucessAlert';
import SucessAlertHanna from './Component/SucessAlert/SucessAlert';
import Products from './Component/products/Products';
import SingleProdCheckoutPage from './Component/SingleProdCheckoutPage/SingleProdCheckoutPage';
import FeaturedProducts from './Component/FeaturedProducts/FeaturedProducts';
import TopbrandProducts from './Component/TopBrandProducts/TopBrandProd';
import RequestPasswordReset from './Component/ForgotPassword/ForgotPassword';
import About_us from './Component/About_Us/About_us';
import NewArrival_Product from './Component/NewArrival_Produ/NewArrival_Product';


function App() {

  return (
    <div className='app-wrapper'>

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/sign-with-otp' element={<SignWithOTP />} />
          <Route path='/sign-up-with-email' element={<SignUpWithEmail />} />
          <Route path='/otp-snd/:number/:otpSession' element={<Otp />} />
          <Route path='/login' element={<Signin />} />
          <Route path='/menubar' element={<SearchresultSidebar />} />
          <Route path='/search-result-page' element={<SearchResultPage />} />
          <Route
            path='/product-checkout/:prodId'
            element={<ProtectedRoute element={<SingleProdCheckoutPage />} />}
          />
          <Route path='/all-products/:type/:itemId' element={<Products />} />

          <Route path='/sign-up-with-email-personal-detail/:phone' element={<SignInWithEmailPersonalAddress />} />

          <Route path='/product-page/:prodId' element={<ProductInnerPage />} />

          <Route path='/discout-for-you/:discountId' element={<ProtectedRoute element={<Discount />} />} />
          <Route
            path='/categories-page/:categoryId/:name'
            element={<CategoriesPage />} />

          <Route
            path='/banner/:categoryId'
            element={<Bannercategory />} />


          <Route
            path='/About_us'
            element={<About_us />} />

          <Route
            path='/seller-store/:sellerId'
            element={<SellerStore />} />
          <Route
            path='/top-deals'
            element={<TopDeals />} />
          <Route
            path='/limited-time-deals'
            element={<LimitedTimeDeals />} />
          <Route
            path='/featured-brands'
            element={<FeaturedBrands />} />
          <Route
            path='/topStore-Page/:sellerId'
            element={<TopStores />} />
          <Route
            path='/new-arrival'
            element={<NewArrival />} />
          <Route
            path='/brand-page/:brandId'
            element={<BrandPage />} />
          <Route
            path='/featured-products-page/:brandId'
            element={<FeaturedProducts />} />
          <Route
            path='/topbrand-products-page/:brandId'
            element={<TopbrandProducts />} />

          <Route path='/forget-password' element={<RequestPasswordReset />} />
          {/* Protected Routes */}


          <Route
            path='/shopping-cart'
            element={<ProtectedRoute element={<ShoppingCart />} />}
          />
          <Route
            path='/checkOut-page'
            element={<ProtectedRoute element={<CheckOutPage />} />}
          />
          <Route
            path='/order-completed-page/:parentOrderId'
            element={<ProtectedRoute element={<OrderCompletedPage />} />}
          />
          <Route
            path='/my-account'
            element={<ProtectedRoute element={<MyAccount />} />}
          />
          <Route
            path='/side'
            element={<ProtectedRoute element={<MyAccountSidebar />} />}
          />
          <Route
            path='/order-inner-cancellation/:orderId'
            element={<ProtectedRoute element={<OrderInnerPageCancellation />} />}
          />
          <Route
            path='/order-inner-page/:orderId'
            element={<ProtectedRoute element={<OrderInnerPage />} />}
          />
          <Route
            path='/order-inner-page-delivered'
            element={<ProtectedRoute element={<OrderInnerDelevered />} />}
          />


          <Route
            path='/recently-viewed'
            element={<ProtectedRoute element={<RecentlyViewed />} />}
          />

          <Route
            path='/new-arrivals-product/:newArrivalId'
            element={<ProtectedRoute element={<NewArrival_Product />} />}
          />




          {/* //////////////////////////b2b routes////////////////////// */}
          {/* <Route path='/su' element={<SucessAlertHanna />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
