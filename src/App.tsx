import { Route, Routes, NavLink, HashRouter } from "react-router-dom";
import {useState, useEffect, useContext, createContext} from  'react';
import { useLocalStorage } from 'usehooks-ts';
import cookies from 'js-cookie';


import Home from "./Home";
import Signup from "./Signup";
import Login from  "./Login";
import CreateOrder from "./Order";
import Cart from "./Cart";
import User from "./User";
import cart_image from './images/cart.png';


import { CartContext } from "./cartContext";
import './App.css';

export default function App(){
    const cartContext = useContext(CartContext);
    const cartCount = cartContext?.getItemCount();
    const isloggedin = cartContext?.getIsLoggedIn() as boolean;
    const logstring:string = String(isloggedin);
    const [username, setUsername] = useLocalStorage('user_name', '');
    
    useEffect(() => {
      //let count = cartContext?.getItemCount() as number;
      //setItemcount(count);
      let token:string|undefined = cookies.get('token');
    if (typeof token ==='string' ){
       cartContext?.setIsLoggedIn(true);
       let user_name:string = cookies.get('user_name') as string;
       let displayname = username[0].toUpperCase() + username.substring(1);
       setUsername(user_name);
    }else{
      setUsername("False");
    }

      }, []);

    const logout = () => {

      cookies.remove('token');
      cookies.remove('user_name');
      cartContext?.setIsLoggedIn(false);
      setUsername('');

    }

    const getCookie = () => {

      alert(cookies.get('token'));

    };
  
    return (
      <HashRouter>
        <div className="App">
          <h1>Food Ordering App</h1>
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            
            <li><NavLink to="/signup">Signup</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/order">Order</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
            <li><NavLink to="/user">User</NavLink></li>
              <ul className='cart-bar'>
                <li><div style={{ backgroundImage:`url(${cart_image})`, backgroundPosition: 'center',
                backgroundSize: 'contain',
                width: '50px',
                height: '50px'}}><div className='circle' >{cartCount}</div></div></li>
                <li className='text-li'> Logged in: {username}</li>
                <li className='button-li'><button className='button-1' onClick={logout}>Log Out</button></li>
              </ul>
            
          </ul>

          

          <br></br>
          <br></br>

          <div className="content">
            <Routes>
              <Route  path="/" element={<Home />}></Route>
              
              <Route  path="/signup" element={<Signup />}></Route>
              <Route  path="/login" element={<Login />}></Route>
              <Route  path="/order" element={<CreateOrder />}></Route>
              <Route  path="/cart" element={<Cart />}></Route>
              <Route  path="/user" element={<User />}></Route>
            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  
  }
