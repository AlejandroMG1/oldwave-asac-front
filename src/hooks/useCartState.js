/* eslint-disable no-console */
import { useReducer, useEffect } from 'react';
import useUserState from 'hooks/useUserState';

export default function useCartState() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { userId } = useUserState();
  const { products, totalProducts, totalPrice } = state;

  const cartFromDatabase = {
    products: [
      {
        id: 1,
        thumbnail: 'https://i.imgur.com/3s7nm2v.jpg',
        name: 'T-shirt',
        brand: 'Nike',
        value: '100000',
        units: '2',
        subtotal: '200000',
      },
      {
        id: 2,
        thumbnail: 'https://i.imgur.com/3s7nm2v.jpg',
        name: 'Pant',
        brand: 'Nike',
        value: '150000',
        units: '1',
        subtotal: '150000',
      },
    ],
    totalProducts: 3,
    totalPrice: 350000,
  };

  useEffect(() => {
    dispatch({
      type: 'UPDATE_CART',
      payload: {
        products: cartFromDatabase.products,
        totalProd: cartFromDatabase.totalProducts,
        totalPrice: cartFromDatabase.totalPrice,
      },
    });
  }, [userId]);

  const addProduct = ({ product }) => {
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  };

  const removeProduct = ({ productId, isForAll }) => {
    // isForAll is a boolean that indicates if the product is going to be removed from the cart or just one unit
    if (isForAll) {
      dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
    } else {
      dispatch({ type: 'REMOVE_1PRODUCT', payload: productId });
    }
  };

  const emptyCart = () => {
    dispatch({ type: 'EMPTY_CART' });
  };

  return {
    products,
    totalProducts,
    totalPrice,
    addProduct,
    removeProduct,
    emptyCart,
  };
}

const initialState = {
  products: [],
  totalProducts: 0,
  totalPrice: 0,
};

// send to database the changes
const addProductToCart = () => {};
const removeProductFromCart = () => {};
const emptyDBCart = () => {};

const cartReducer = (state, action) => {
  console.log('cartReducer', state, action);
  switch (action.type) {
    case 'ADD_PRODUCT':
      console.log('addProductToCart', action.product);
      return { ...state, products: addProductToCart(action.product) };

    case 'REMOVE_PRODUCT':
      console.log('removeProduct', action.product);
      return { ...state, products: removeProductFromCart(action.productId) };

    case 'UPDATE_CART':
      console.log('setCart', action.cart);
      return {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.totalProd,
        totalPrice: action.payload.totalPrice,
      };

    case 'EMPTY_CART':
      console.log('emptyCart');
      emptyDBCart();
      return { ...state, products: [], totalProducts: 0, totalPrice: 0 };

    case 'SET_TOTAL_PRICE':
      return { ...state, totalPrice: action.payload };

    case 'SET_TOTAL_PRODUCTS':
      return { ...state, totalProducts: action.payload };

    default:
      console.log('def', action.product);
      return state;
  }
};
