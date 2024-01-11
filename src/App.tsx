import { Route, Routes, NavLink, HashRouter } from "react-router-dom";
import {useState, useEffect, useContext, createContext} from  'react';
import { useLocalStorage } from 'usehooks-ts';
import cookies from 'js-cookie';


import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Signup from "./Signup";
import Login from  "./Login";
import User from "./User";
import CreateOrder from "./Order";
import Cart from "./Cart";
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
       setUsername(cookies.get('user_name') as string);
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
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/signup">Signup</NavLink></li>
            <li><NavLink to="/user">User</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/order">Order</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
            <p>Cart:{cartCount} items</p>
            <p>Logged in: {logstring}</p>
            <p>Logged in as: {username}</p>

            <button onClick={logout}>Log Out</button>
            <button onClick={getCookie}>Show Cookie</button>


          </ul>
          <div className="content">
            <Routes>
              <Route  path="/" element={<Home />}></Route>
              <Route  path="/about" element={<About />}></Route>
              <Route  path="/contact" element={<Contact />}></Route>
              <Route  path="/signup" element={<Signup />}></Route>
              <Route  path="/user" element={<User />}></Route>
              <Route  path="/login" element={<Login />}></Route>
              <Route  path="/user" element={<User />}></Route>
              <Route  path="/order" element={<CreateOrder />}></Route>
              <Route  path="/cart" element={<Cart />}></Route>



            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  
  }
