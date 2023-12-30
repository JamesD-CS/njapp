import { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { Item, Order } from './appTypes';

export type CartContextType = {
    cartItems:Order[] | null
    addToCart: (item: Item) => void;
    removeItem:(item_id:number)=> void;
    clearCart:() => void;
    getItemCount:() => number;
    getCartItems:() => Order[];
    getCartTotal:() => number;
    
  }
 
export const CartContext = createContext<CartContextType | null>({
  cartItems: null,
  addToCart: (item:Item) => null,
  removeItem:(item_id:number) => null,
  clearCart:() => null,
  getItemCount:() => 0,
  getCartItems:  () => [],
  getCartTotal: () => 0
});

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const[cartItems, setCartItems] = useLocalStorage('cart_items', [] as Order[]);
  
    const addToCart = (item:Item) => {
      function isItemInCart(item:Item):boolean {
        let isincart = false;
        let i:number = 0;
        while (i < cartItems.length){
          if (cartItems[i].item_id === item.item_id){
            isincart = true;
            break;
          }
          i ++;
        }
        return isincart;
      }
  
      if (isItemInCart(item)) {
        setCartItems(
          cartItems.map((cartItem) =>
            cartItem.item_id === item.item_id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        );
      } else {
        let newItem:Order = {item_id: item.item_id, item_name:item.item_name, 
          quantity:1, price:item.price};
        setCartItems([...cartItems, newItem]);
      }
      
    };

    const removeItem =(item_id:number)=>{
      let n:number = 0;
      while (n < cartItems.length){
        if(cartItems[n].item_id === item_id){
          cartItems.splice(n, 1);
          setCartItems(cartItems);
          break;
        }
        n++;
      }
    };
  
    const clearCart = () => {
      let cartItems = [] as Order[];
      setCartItems(cartItems);
    };

    const getItemCount = ():number =>{
      let count:number = 0;
      cartItems.forEach(function(item:Order){
        count = count + item.quantity;
      });
      return count;
    }

    const getCartItems = ():Order[]=>{

      return cartItems;
    }
  
    const getCartTotal = ():number => {
      let total:number = 0;
      cartItems.forEach(function(item:Order){
        total = total + item.quantity * item.price;
      });
      return total;
    };
  
    /*
    useEffect(() => {
      const cartItems = localStorage.getItem("cart_items") ;
      if (cartItems) {
        //setCartItems(cartItems);
      }
    }, []);
    */
  
    return (
      <CartContext.Provider
        value={{
          cartItems,
          addToCart,
          removeItem,
          clearCart,
          getItemCount,
          getCartItems,
          getCartTotal,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };