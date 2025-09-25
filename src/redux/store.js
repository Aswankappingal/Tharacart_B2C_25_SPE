import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slices/HomePageSlice/categorySlice';
import topDealsReducer from './slices/HomePageSlice/topDealsSlice';
import limitedTimeDealsReducer from './slices/HomePageSlice/limitedTimeDealsSlice';
import featuredBrandsReducer from './slices/HomePageSlice/featuredBrandSlice';
import topStoresReducer from './slices/HomePageSlice/topStoreSlice';
import newArrivalsReducer from './slices/HomePageSlice/newArrivalSlice';
import featuredProductsReducer from './slices/HomePageSlice/featuresProductSlice';
import topBrandReducer from './slices/HomePageSlice/topBrandSlice';
import fetchProductInnerDetails from './slices/productInnerSlice/productInnerSlice';
import topDealsProductsReducer from './slices/topDealsSlice/topDealsProductSlice';
import brandsReducer from './slices/topDealsSlice/getBrandSlice';
import fetchLimitedTimeProductsReducer from './slices/LimitedTimeOfferSlice/LimitedOfferProductSlice';
import fetchFeaturedBrandProductReducer from './slices/FeaturedBrandProductsSlice/featuredBrandProductSlice';
import fetchTopStoresProductReducer from './slices/topStoresProductSlice/topStoresProductSlice';
import fetchNewArrivalsProdReducer from './slices/NewArrivalsProd/NewArrivalsProdSlice';
import userReducer from './slices/NavbarSlice/LoginedUserSlice';
import fetchProductRatingsReducer from './slices/productInnerSlice/ProductRatingSlice.js';
import fetchQnaReducer from './slices/productInnerSlice/QnaSlice';
import cartProductReducer from './slices/cartSlices/cartProductSlice';
import addWishlistReducer from './slices/cartSlices/addToWishListSlice';

import fetchBrandPageReducer from './slices/BrandPageSlice/BrandPageSlice';
import fetchAllProductsReducer from './slices/AllproductsSlice/allProductsSlice';
import fetchSellerStoreProdReducer from './slices/SellerStoreSlice/SellerStoreSlice';
import fetchSellerStoreBrandReducer from './slices//SellerStoreSlice/sellersBrandSlice';
import fetchSellerStorePagenationReducer from './slices/SellerStoreSlice/SellerStorePagenation';
import fetchSellerReducer from './slices/SellerStoreSlice/sellerSlice';

import fetchSearchSuggestionsReducer from './slices/Search/SliceSuggestions';

import cartReducer from './slices/cartSlices/removeCartItemSlice';
import WishListReducer from './slices/cartSlices/removeWishlistProdSlice';
import updateCartQuantityReducer from './slices/cartSlices/updateQuantity';
import WishListProductReducer from './slices/cartSlices/wishListProdSlice';
import addressReducer from './slices/checkoutPageSlice/fetchAddressSlice';
import fetchuserReducer from './slices/myAccountSlice/fetchUserSlice';
import fetchOneSellerReducer from './slices/SellerStoreSlice/fetchOneSellerSlice';
import discountReducer from './slices/HomePageSlice/fetchDiscountSlice';
import bannerReducer from './slices/HomePageSlice/bannerSlice';
import customerNotesReducer from './slices/CustomSlice/customerNotesSlice';
import fetchProductsReducer from './slices/DiscountPageSlice/fetchDiscountProductsSlice';
import fetchBrandWiseProductsReducer from './slices/BrandWiseProducts/fetchBrandWiseProducts';
import fetchOrdersReducer from './slices/OrderProductSlice/OrdersProducSlice';
import orderCompletedProReducerd from './slices/orderCompletedPageSlice/orderCompletedSlice.js';
import fetchOrderInnerDetailsReducer from './slices/orderCompletedPageSlice/ftechOrdeInnerrSlice';
import singlecategoryReducer from './slices/FetchSingleCategorySlice/FetchSingleCategorySlice';
import sharableListReducer from './slices/cartSlices/sharableListSlice';
import newArrivalProducts from './slices/NewArrivalsSlicess/newArrivalsSlice.js';

import cancelOrderReducer from './slices/OrderCancelPagesSlice/orderCancelSlice';




export const store = configureStore({
  reducer: {
    //NAVBAR
    loginedUser: userReducer,
    //HOME PAGE
    category: categoryReducer,
    topDeals: topDealsReducer,
    limitedTimeDeals: limitedTimeDealsReducer,
    featuredBrands: featuredBrandsReducer,
    topStores: topStoresReducer,
    newArrivals: newArrivalsReducer,
    newArrivalss: newArrivalProducts,
    featuredProducts: featuredProductsReducer,
    topBrand: topBrandReducer,
    discounts: discountReducer,
    banners: bannerReducer,
    brandWiseProducts: fetchBrandWiseProductsReducer,

    //PRODUCT INNER PAGE
    productInnerDetails: fetchProductInnerDetails,
    productRatings: fetchProductRatingsReducer,
    qna: fetchQnaReducer,
    //TOP DEALS PAGE
    topDealsProducts: topDealsProductsReducer,
    brands: brandsReducer,
    // LIMITED TIME DEALS PAGE//
    limitedTimeDealProducts: fetchLimitedTimeProductsReducer,
    featuredBrandProduct: fetchFeaturedBrandProductReducer,
    topStoresProduct: fetchTopStoresProductReducer,
    newArrivalsProduct: fetchNewArrivalsProdReducer,
    //CART PAGE
    cartProduct: cartProductReducer,
    removeCartItem: cartReducer,
    removeWishListItem: WishListReducer,
    updateCartQuantity: updateCartQuantityReducer,
    wishListProduct: WishListProductReducer,
    addToWishlist: addWishlistReducer,
    //CHECKOUT PAGE
    address: addressReducer,
    //MY ACCOUNT
    user: fetchuserReducer,

    //SELLER STORE PAGE
    brandPage: fetchBrandPageReducer,
    AllProducts: fetchAllProductsReducer,
    SellerStoreProducts: fetchSellerStoreProdReducer,
    SellerStoreBrands: fetchSellerStoreBrandReducer,
    SellerStorePagenation: fetchSellerStorePagenationReducer,
    sellers: fetchSellerReducer,
    oneSeller: fetchOneSellerReducer,

    suggestions: fetchSearchSuggestionsReducer,
    customerNotes: customerNotesReducer,
    //DISCPOUNTpAGE
    discountProducts: fetchProductsReducer,
    //ORDER INNER PAGE
    orderInnerDetails: fetchOrderInnerDetailsReducer,

    ///ordercancel

    cancelOrder: cancelOrderReducer,

    ///ORDER
    orders: fetchOrdersReducer,
    //ORDER COMPLETED PAGE
    orderCompleted: orderCompletedProReducerd,
    ////Category
    singleCategory: singlecategoryReducer,
    sharableList: sharableListReducer


  },
});

export default store;
